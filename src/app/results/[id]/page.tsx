import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ResultsView } from "@/features/results/results-view";
import type { SerializableResult } from "@/features/results/result-models";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

type PageProps = {
  params: Promise<{ id: string }>;
};

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function stringRecord(value: unknown): Record<string, string> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] =>
        typeof entry[0] === "string" && typeof entry[1] === "string"
    )
  );
}

export default async function ResultPage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const result = await prisma.testResult.findFirst({
    where: {
      id,
      userId: user.id
    },
    include: {
      test: {
        include: {
          questions: {
            orderBy: { position: "asc" }
          },
          answers: true
        }
      },
      questionFeedback: {
        include: { question: true },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!result) {
    notFound();
  }

  const serializable: SerializableResult = {
    id: result.id,
    totalMarks: result.totalMarks,
    awardedMarks: result.awardedMarks,
    percentage: result.percentage,
    cefrFeedback: result.cefrFeedback,
    nclcEstimate: stringRecord(result.nclcEstimate),
    examFeedback: stringArray(result.examFeedback),
    strengths: stringArray(result.strengths),
    weaknesses: stringArray(result.weaknesses),
    recommendedTopics: stringArray(result.recommendedTopics),
    personalizedStudyPlan: stringArray(result.personalizedStudyPlan),
    test: {
      id: result.test.id,
      title: result.test.title,
      level: result.test.level,
      examType: result.test.examType,
      preparationMode: result.test.preparationMode,
      examSections: result.test.examSections,
      targetScoreLevel: result.test.targetScoreLevel,
      targetNclc: result.test.targetNclc,
      skillFocus: result.test.skillFocus,
      questionFocuses: result.test.questionFocuses,
      timeLimitSeconds: result.test.timeLimitSeconds,
      fullTest: result.test.fullTest,
      totalMarks: result.test.totalMarks,
      difficulty: result.test.difficulty,
      status: result.test.status,
      result: { id: result.id },
      questions: result.test.questions.map((question) => ({
        id: question.id,
        type: question.type,
        level: question.level,
        examSection: question.examSection,
        topic: question.topic,
        question: question.question,
        instructions: question.instructions,
        options: Array.isArray(question.options)
          ? question.options.filter(
              (option): option is { label: string; text: string } =>
                typeof option === "object" &&
                option !== null &&
                "label" in option &&
                "text" in option &&
                typeof option.label === "string" &&
                typeof option.text === "string"
            )
          : [],
        marks: question.marks,
        skill: question.skill,
        vocabularyTheme: question.vocabularyTheme,
        questionTypeFocus: question.questionTypeFocus,
        timeLimitSeconds: question.timeLimitSeconds,
        minWords: question.minWords,
        hint: question.hint,
        position: question.position
      })),
      answers: result.test.answers.map((answer) => ({
        id: answer.id,
        questionId: answer.questionId,
        answerText: answer.answerText,
        extractedText: answer.extractedText,
        imageId: answer.imageId,
        awardedMarks: answer.awardedMarks
      }))
    },
    questionFeedback: result.questionFeedback.map((feedback) => ({
      id: feedback.id,
      questionId: feedback.questionId,
      isCorrect: feedback.isCorrect,
      awardedMarks: feedback.awardedMarks,
      maximumMarks: feedback.maximumMarks,
      estimatedLevel: feedback.estimatedLevel,
      correctAnswer: feedback.correctAnswer,
      mistakeExplanation: feedback.mistakeExplanation,
      grammarExplanation: feedback.grammarExplanation,
      vocabularyCorrection: feedback.vocabularyCorrection,
      improvedVersion: feedback.improvedVersion,
      modelAnswer: feedback.modelAnswer,
      simpleFeedback: feedback.simpleFeedback,
      frenchExplanation: feedback.frenchExplanation,
      strongPoints: stringArray(feedback.strongPoints),
      weakPoints: stringArray(feedback.weakPoints),
      grammarTopicsToRevise: stringArray(feedback.grammarTopicsToRevise),
      vocabularyToLearn: stringArray(feedback.vocabularyToLearn),
      examStrategyTip: feedback.examStrategyTip,
      suggestedTopics: stringArray(feedback.suggestedTopics),
      question: {
        id: feedback.question.id,
        type: feedback.question.type,
        level: feedback.question.level,
        examSection: feedback.question.examSection,
        topic: feedback.question.topic,
        question: feedback.question.question,
        instructions: feedback.question.instructions,
        options: Array.isArray(feedback.question.options)
          ? feedback.question.options.filter(
              (option): option is { label: string; text: string } =>
                typeof option === "object" &&
                option !== null &&
                "label" in option &&
                "text" in option &&
                typeof option.label === "string" &&
                typeof option.text === "string"
            )
          : [],
        marks: feedback.question.marks,
        skill: feedback.question.skill,
        vocabularyTheme: feedback.question.vocabularyTheme,
        questionTypeFocus: feedback.question.questionTypeFocus,
        timeLimitSeconds: feedback.question.timeLimitSeconds,
        minWords: feedback.question.minWords,
        hint: feedback.question.hint,
        position: feedback.question.position
      }
    }))
  };

  return (
    <AppShell user={user}>
      <ResultsView result={serializable} />
    </AppShell>
  );
}
