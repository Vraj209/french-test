import { evaluateWritingPracticeAnswerWithAI } from "@/lib/ai/openai";
import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { assertRateLimit } from "@/lib/rate-limit";
import {
  writingPracticeEvaluationRequestSchema,
  writingPracticeSectionSchema,
  type WritingPracticeFeedback,
  type WritingPracticePrompt
} from "@/lib/schemas";
import { writingPracticeSectionByType } from "@/features/writing-practice/config";

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function joinFeedback(items: string[], fallback: string) {
  return items.length > 0 ? items.join("\n") : fallback;
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items.filter((item) => item.trim().length > 0)));
}

function buildPracticePrompt({
  test,
  question
}: {
  test: {
    title: string;
  };
  question: {
    level: "A1" | "A2" | "B1" | "B2";
    topic: string;
    questionTypeFocus: string | null;
    question: string;
    instructions: string | null;
    minWords: number | null;
    expectedAnswer: string;
    evaluationRubric: unknown;
    hint: string | null;
  };
}): WritingPracticePrompt {
  const section =
    writingPracticeSectionSchema.safeParse(question.questionTypeFocus).data ??
    "SENTENCE_BUILDING";
  const sectionConfig = writingPracticeSectionByType(section);
  const criteria = stringArray(question.evaluationRubric);

  return {
    title: test.title,
    section,
    level: question.level,
    topic: question.topic,
    taskType: sectionConfig?.shortTitle ?? section,
    prompt: question.question,
    instructions: question.instructions || sectionConfig?.instructions || "Write your answer.",
    writingGoal: question.expectedAnswer,
    minWords: question.minWords,
    suggestedStructure:
      question.hint && question.hint.trim().length > 0
        ? [question.hint]
        : sectionConfig?.focusAreas ?? ["Clear structure"],
    vocabularyHints: sectionConfig?.topicOptions.slice(0, 5) ?? [question.topic],
    evaluationCriteria:
      criteria.length > 0 ? criteria : sectionConfig?.focusAreas ?? ["Writing clarity"]
  };
}

function questionFeedbackFromWritingFeedback({
  questionId,
  maximumMarks,
  feedback
}: {
  questionId: string;
  maximumMarks: number;
  feedback: WritingPracticeFeedback;
}) {
  const awardedMarks = Math.round((feedback.score / 100) * maximumMarks * 10) / 10;

  return {
    questionId,
    isCorrect: feedback.score >= 85,
    awardedMarks,
    maximumMarks,
    estimatedLevel: feedback.estimatedLevel,
    correctAnswer: feedback.correctedVersion,
    mistakeExplanation: joinFeedback(
      feedback.mainMistakes,
      "No major mistake list was returned."
    ),
    grammarExplanation: joinFeedback(
      feedback.grammarFocus,
      "Review sentence structure, verb forms, agreement, and connector use."
    ),
    vocabularyCorrection: joinFeedback(
      feedback.vocabularySuggestions,
      "No additional vocabulary suggestions were returned."
    ),
    improvedVersion: feedback.correctedVersion,
    modelAnswer: feedback.modelAnswer,
    simpleFeedback: joinFeedback(
      feedback.improvementAdvice,
      "Revise the answer for clearer structure, stronger vocabulary, and grammar accuracy."
    ),
    frenchExplanation: "",
    strongPoints: feedback.strongPoints,
    weakPoints: feedback.weakPoints,
    grammarTopicsToRevise: feedback.grammarFocus,
    vocabularyToLearn: feedback.vocabularyToLearn,
    examStrategyTip: feedback.writingStrategy,
    suggestedTopics: uniqueStrings([...feedback.grammarFocus, ...feedback.vocabularyToLearn])
  };
}

export async function POST(request: Request) {
  try {
    const user = await requireUser().catch(() => null);

    if (!user) {
      return jsonError("Authentication required.", 401);
    }

    assertRateLimit({
      key: `ai:writing-practice-evaluate:${user.id}`,
      limit: 20,
      windowMs: 60_000
    });

    const input = writingPracticeEvaluationRequestSchema.parse(await request.json());
    const test = await prisma.test.findFirst({
      where: {
        id: input.testId,
        userId: user.id,
        preparationMode: "WRITING_PRACTICE",
        fullTest: false
      },
      include: {
        questions: {
          where: { id: input.questionId },
          take: 1
        },
        result: {
          select: { id: true }
        }
      }
    });

    const question = test?.questions[0];

    if (!test || !question) {
      return jsonError("Writing practice prompt not found.", 404);
    }

    const prompt = buildPracticePrompt({ test, question });
    const feedback = await evaluateWritingPracticeAnswerWithAI({
      prompt,
      answerText: input.answerText
    });
    const questionFeedback = questionFeedbackFromWritingFeedback({
      questionId: question.id,
      maximumMarks: question.marks,
      feedback
    });
    const recommendedTopics = uniqueStrings([
      ...feedback.grammarFocus,
      ...feedback.vocabularyToLearn
    ]);
    const studyPlan = uniqueStrings([
      ...feedback.improvementAdvice,
      ...feedback.structureAdvice,
      feedback.writingStrategy
    ]);

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.testResult.findUnique({
        where: { testId: test.id }
      });

      if (existing) {
        await tx.studyPlan.deleteMany({
          where: { testResultId: existing.id }
        });
        await tx.mistakeLog.deleteMany({
          where: { userId: user.id, testId: test.id }
        });
        await tx.testResult.delete({
          where: { id: existing.id }
        });
      }

      await tx.userAnswer.upsert({
        where: {
          testId_questionId: {
            testId: test.id,
            questionId: question.id
          }
        },
        update: {
          answerText: input.answerText,
          awardedMarks: questionFeedback.awardedMarks,
          feedback
        },
        create: {
          userId: user.id,
          testId: test.id,
          questionId: question.id,
          answerText: input.answerText,
          awardedMarks: questionFeedback.awardedMarks,
          feedback
        }
      });

      const created = await tx.testResult.create({
        data: {
          testId: test.id,
          userId: user.id,
          totalMarks: question.marks,
          awardedMarks: questionFeedback.awardedMarks,
          percentage: feedback.score,
          cefrFeedback: `Estimated writing level: ${feedback.estimatedLevel}`,
          overallFeedback: joinFeedback(feedback.improvementAdvice, feedback.writingStrategy),
          strengths: feedback.strongPoints,
          weaknesses: feedback.weakPoints,
          recommendedTopics,
          personalizedStudyPlan: studyPlan,
          nclcEstimate: {
            reading: "not assessed",
            listening: "not assessed",
            writing: feedback.estimatedLevel,
            speaking: "not assessed",
            overall: feedback.estimatedLevel
          },
          examFeedback: uniqueStrings([...feedback.structureAdvice, feedback.writingStrategy]),
          detailedEvaluation: feedback,
          questionFeedback: {
            create: {
              questionId: question.id,
              isCorrect: questionFeedback.isCorrect,
              awardedMarks: questionFeedback.awardedMarks,
              maximumMarks: questionFeedback.maximumMarks,
              estimatedLevel: questionFeedback.estimatedLevel,
              correctAnswer: questionFeedback.correctAnswer,
              mistakeExplanation: questionFeedback.mistakeExplanation,
              grammarExplanation: questionFeedback.grammarExplanation,
              vocabularyCorrection: questionFeedback.vocabularyCorrection,
              improvedVersion: questionFeedback.improvedVersion,
              modelAnswer: questionFeedback.modelAnswer,
              simpleFeedback: questionFeedback.simpleFeedback,
              frenchExplanation: questionFeedback.frenchExplanation,
              strongPoints: questionFeedback.strongPoints,
              weakPoints: questionFeedback.weakPoints,
              grammarTopicsToRevise: questionFeedback.grammarTopicsToRevise,
              vocabularyToLearn: questionFeedback.vocabularyToLearn,
              examStrategyTip: questionFeedback.examStrategyTip,
              suggestedTopics: questionFeedback.suggestedTopics
            }
          }
        }
      });

      if (feedback.weakPoints.length > 0 || feedback.mainMistakes.length > 0) {
        await tx.mistakeLog.create({
          data: {
            userId: user.id,
            testId: test.id,
            questionId: question.id,
            skillFocus: "WRITING",
            grammarTopic: feedback.grammarFocus[0] ?? question.topic,
            vocabularyTheme: feedback.vocabularyToLearn[0] ?? question.vocabularyTheme,
            mistakeType:
              feedback.weakPoints[0] ?? feedback.mainMistakes[0] ?? "Writing practice issue",
            originalAnswer: input.answerText,
            correction: feedback.correctedVersion,
            strategyTip: feedback.writingStrategy
          }
        });
      }

      await tx.test.update({
        where: { id: test.id },
        data: { status: "EVALUATED" }
      });

      return created;
    });

    return jsonOk({
      resultId: result.id,
      awardedMarks: questionFeedback.awardedMarks,
      maximumMarks: questionFeedback.maximumMarks,
      feedback
    });
  } catch (error) {
    return toApiError(error);
  }
}
