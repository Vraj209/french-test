import { evaluateAnswersWithAI } from "@/lib/ai/openai";
import { prisma } from "@/lib/db";
import { normalizeEvaluationResult } from "@/lib/evaluation";

export async function evaluateTestForUser({
  userId,
  testId
}: {
  userId: string;
  testId: string;
}) {
  const test = await prisma.test.findFirst({
    where: {
      id: testId,
      userId
    },
    include: {
      questions: {
        orderBy: { position: "asc" }
      },
      answers: true
    }
  });

  if (!test) {
    throw new Error("Test not found.");
  }

  const answerByQuestionId = new Map(test.answers.map((answer) => [answer.questionId, answer]));
  const submissionAnswers = test.questions.map((question) => {
    const answer = answerByQuestionId.get(question.id);

    return {
      questionId: question.id,
      answerText: answer?.answerText ?? "",
      extractedText: answer?.extractedText ?? undefined,
      imageId: answer?.imageId ?? undefined
    };
  });

  const evaluation = await evaluateAnswersWithAI({
    test: {
      title: test.title,
      level: test.level,
      examType: test.examType,
      preparationMode: test.preparationMode,
      examSections: test.examSections,
      targetScoreLevel: test.targetScoreLevel,
      targetNclc: test.targetNclc,
      skillFocus: test.skillFocus,
      questionFocuses: test.questionFocuses,
      timeLimitSeconds: test.timeLimitSeconds,
      fullTest: test.fullTest,
      totalMarks: test.totalMarks,
      difficulty: test.difficulty
    },
    questions: test.questions.map((question) => ({
      id: question.id,
      type: question.type,
      level: question.level,
      examSection: question.examSection,
      skill: question.skill,
      topic: question.topic,
      vocabularyTheme: question.vocabularyTheme,
      questionTypeFocus: question.questionTypeFocus,
      question: question.question,
      instructions: question.instructions,
      options: question.options,
      marks: question.marks,
      timeLimitSeconds: question.timeLimitSeconds,
      minWords: question.minWords,
      expectedAnswer: question.expectedAnswer,
      evaluationRule: question.evaluationRule,
      evaluationRubric: question.evaluationRubric
    })),
    submission: {
      answers: submissionAnswers
    }
  });
  const normalized = normalizeEvaluationResult(evaluation, test.questions);
  const questionFocuses = Array.isArray(test.questionFocuses) ? test.questionFocuses : [];
  const questionTypeCounts =
    typeof test.questionTypeCounts === "object" &&
    test.questionTypeCounts !== null &&
    !Array.isArray(test.questionTypeCounts)
      ? test.questionTypeCounts
      : {};

  return prisma.$transaction(async (tx) => {
    const existing = await tx.testResult.findUnique({
      where: { testId: test.id }
    });

    if (existing) {
      await tx.evaluationFeedback.deleteMany({
        where: { testResultId: existing.id }
      });
      await tx.studyPlan.deleteMany({
        where: { testResultId: existing.id }
      });
      await tx.mistakeLog.deleteMany({
        where: { userId, testId: test.id }
      });
      await tx.testResult.delete({
        where: { id: existing.id }
      });
    }

    for (const questionEvaluation of normalized.questionEvaluations) {
      const savedAnswer = answerByQuestionId.get(questionEvaluation.questionId);

      await tx.userAnswer.upsert({
        where: {
          testId_questionId: {
            testId: test.id,
            questionId: questionEvaluation.questionId
          }
        },
        update: {
          awardedMarks: questionEvaluation.awardedMarks,
          feedback: questionEvaluation
        },
        create: {
          userId,
          testId: test.id,
          questionId: questionEvaluation.questionId,
          answerText: savedAnswer?.answerText ?? "",
          extractedText: savedAnswer?.extractedText ?? undefined,
          imageId: savedAnswer?.imageId ?? undefined,
          awardedMarks: questionEvaluation.awardedMarks,
          feedback: questionEvaluation
        }
      });
    }

    const created = await tx.testResult.create({
      data: {
        testId: test.id,
        userId,
        totalMarks: normalized.maxScore,
        awardedMarks: normalized.totalScore,
        percentage: normalized.percentage,
        cefrFeedback: normalized.cefrFeedback,
        overallFeedback: normalized.cefrFeedback,
        strengths: normalized.strengths,
        weaknesses: normalized.weaknesses,
        recommendedTopics: normalized.recommendedTopics,
        personalizedStudyPlan: normalized.personalizedStudyPlan,
        nclcEstimate: normalized.nclcEstimate,
        examFeedback: normalized.examFeedback,
        detailedEvaluation: normalized,
        questionFeedback: {
          create: normalized.questionEvaluations.map((item) => ({
            questionId: item.questionId,
            isCorrect: item.isCorrect,
            awardedMarks: item.awardedMarks,
            maximumMarks: item.maximumMarks,
            estimatedLevel: item.estimatedLevel,
            correctAnswer: item.correctAnswer,
            mistakeExplanation: item.mistakeExplanation,
            grammarExplanation: item.grammarExplanation,
            vocabularyCorrection: item.vocabularyCorrection,
            improvedVersion: item.improvedVersion,
            modelAnswer: item.modelAnswer,
            simpleFeedback: item.simpleFeedback,
            frenchExplanation: item.frenchExplanation,
            strongPoints: item.strongPoints,
            weakPoints: item.weakPoints,
            grammarTopicsToRevise: item.grammarTopicsToRevise,
            vocabularyToLearn: item.vocabularyToLearn,
            examStrategyTip: item.examStrategyTip,
            suggestedTopics: item.suggestedTopics
          }))
        }
      },
      include: {
        questionFeedback: {
          include: { question: true },
          orderBy: { createdAt: "asc" }
        }
      }
    });

    const feedbackByQuestion = new Map(
      normalized.questionEvaluations.map((item) => [item.questionId, item])
    );
    const sectionScores = test.questions.reduce<
      Record<string, { score: number; maxScore: number }>
    >((sections, question) => {
      const feedback = feedbackByQuestion.get(question.id);
      const section = sections[question.examSection] ?? { score: 0, maxScore: 0 };

      section.score += feedback?.awardedMarks ?? 0;
      section.maxScore += question.marks;
      sections[question.examSection] = section;

      return sections;
    }, {});
    const grammarWeaknesses = Array.from(
      new Set(
        normalized.questionEvaluations.flatMap((item) => [
          ...item.grammarTopicsToRevise,
          ...item.suggestedTopics
        ])
      )
    );
    const vocabularyWeaknesses = Array.from(
      new Set(normalized.questionEvaluations.flatMap((item) => item.vocabularyToLearn))
    );
    const writingWeaknesses = normalized.questionEvaluations.flatMap((item) =>
      item.weakPoints.filter((point) => point.toLowerCase().includes("writing"))
    );
    const speakingWeaknesses = normalized.questionEvaluations.flatMap((item) =>
      item.weakPoints.filter((point) => point.toLowerCase().includes("speaking"))
    );
    const strategyTips = normalized.questionEvaluations
      .map((item) => item.examStrategyTip)
      .filter((tip) => tip.length > 0);
    const nextPracticeSet = await tx.practiceSet.create({
      data: {
        userId,
        title: `Next practice after ${test.title}`,
        examType: test.examType,
        preparationMode: test.preparationMode,
        skillFocus: test.skillFocus,
        level: test.level,
        targetScoreLevel: test.targetScoreLevel,
        targetNclc: test.targetNclc,
        grammarTopics: grammarWeaknesses,
        vocabularyThemes: vocabularyWeaknesses,
        questionFocuses,
        questionTypeCounts,
        totalMarks: test.totalMarks,
        numberOfQuestions: Math.max(1, Math.min(test.numberOfQuestions, 20)),
        timeLimitSeconds: test.timeLimitSeconds,
        difficulty: test.difficulty,
        source: "Generated from evaluation weaknesses"
      }
    });

    await tx.scoreReport.create({
      data: {
        userId,
        testResultId: created.id,
        totalScore: normalized.totalScore,
        maxScore: normalized.maxScore,
        sectionScores,
        estimatedCEFR: normalized.cefrFeedback,
        estimatedCLB: normalized.nclcEstimate?.overall,
        grammarWeaknesses,
        vocabularyWeaknesses,
        writingWeaknesses,
        speakingWeaknesses,
        recommendedLessons: normalized.recommendedTopics,
        nextPracticeSet: {
          id: nextPracticeSet.id,
          title: nextPracticeSet.title,
          grammarTopics: grammarWeaknesses,
          vocabularyThemes: vocabularyWeaknesses
        }
      }
    });

    await tx.studyPlan.create({
      data: {
        userId,
        testResultId: created.id,
        nextPracticeSetId: nextPracticeSet.id,
        title: `Study plan for ${test.title}`,
        grammarWeaknesses,
        vocabularyWeaknesses,
        writingWeaknesses,
        speakingWeaknesses,
        recommendedLessons: normalized.recommendedTopics,
        strategyTips
      }
    });

    const existingProgress = await tx.userProgress.findUnique({
      where: {
        userId_level_examType_skillFocus: {
          userId,
          level: test.level,
          examType: test.examType,
          skillFocus: test.skillFocus
        }
      }
    });
    const nextAttempts = (existingProgress?.attempts ?? 0) + 1;
    const nextAverage = existingProgress
      ? (existingProgress.averagePercentage * existingProgress.attempts +
          normalized.percentage) /
        nextAttempts
      : normalized.percentage;

    await tx.userProgress.upsert({
      where: {
        userId_level_examType_skillFocus: {
          userId,
          level: test.level,
          examType: test.examType,
          skillFocus: test.skillFocus
        }
      },
      create: {
        userId,
        level: test.level,
        examType: test.examType,
        skillFocus: test.skillFocus,
        attempts: 1,
        averagePercentage: normalized.percentage,
        strongestTopics: normalized.strengths,
        weakestTopics: grammarWeaknesses,
        vocabularyGaps: vocabularyWeaknesses,
        lastPracticedAt: new Date()
      },
      update: {
        attempts: nextAttempts,
        averagePercentage: nextAverage,
        strongestTopics: normalized.strengths,
        weakestTopics: grammarWeaknesses,
        vocabularyGaps: vocabularyWeaknesses,
        lastPracticedAt: new Date()
      }
    });

    const mistakeRows = normalized.questionEvaluations
      .filter((item) => !item.isCorrect)
      .map((item) => {
        const question = test.questions.find((candidate) => candidate.id === item.questionId);

        return {
          userId,
          testId: test.id,
          questionId: item.questionId,
          skillFocus: question?.skill ?? test.skillFocus,
          grammarTopic:
            item.grammarTopicsToRevise[0] ?? item.suggestedTopics[0] ?? question?.topic ?? null,
          vocabularyTheme: item.vocabularyToLearn[0] ?? question?.vocabularyTheme ?? null,
          mistakeType: item.weakPoints[0] ?? "Practice error",
          originalAnswer: answerByQuestionId.get(item.questionId)?.answerText ?? "",
          correction: item.improvedVersion || item.correctAnswer,
          strategyTip: item.examStrategyTip
        };
      });

    if (mistakeRows.length > 0) {
      await tx.mistakeLog.createMany({ data: mistakeRows });
    }

    await tx.test.update({
      where: { id: test.id },
      data: { status: "EVALUATED" }
    });

    return created;
  });
}
