import type { EvaluationResult, QuestionEvaluation } from "@/lib/schemas";

type QuestionMark = {
  id: string;
  marks: number;
};

export function normalizeEvaluationResult(
  evaluation: EvaluationResult,
  questions: QuestionMark[]
): EvaluationResult {
  const normalizedQuestionEvaluations: QuestionEvaluation[] = questions.map((question) => {
    const modelEvaluation = evaluation.questionEvaluations.find(
      (item) => item.questionId === question.id
    );
    const awardedMarks = Math.min(
      Math.max(modelEvaluation?.awardedMarks ?? 0, 0),
      question.marks
    );

    return {
      questionId: question.id,
      isCorrect: awardedMarks === question.marks,
      awardedMarks,
      maximumMarks: question.marks,
      estimatedLevel: modelEvaluation?.estimatedLevel || "not assessed",
      correctAnswer: modelEvaluation?.correctAnswer || "See expected answer.",
      mistakeExplanation:
        modelEvaluation?.mistakeExplanation ||
        "No detailed mistake explanation was returned.",
      grammarExplanation:
        modelEvaluation?.grammarExplanation ||
        "Review the grammar rule linked to this question.",
      vocabularyCorrection:
        modelEvaluation?.vocabularyCorrection || "No vocabulary correction needed.",
      improvedVersion:
        modelEvaluation?.improvedVersion || modelEvaluation?.correctAnswer || "",
      modelAnswer:
        modelEvaluation?.modelAnswer ||
        modelEvaluation?.improvedVersion ||
        modelEvaluation?.correctAnswer ||
        "",
      simpleFeedback:
        modelEvaluation?.simpleFeedback ||
        "Compare your answer with the expected answer and revise this topic.",
      frenchExplanation: modelEvaluation?.frenchExplanation || "",
      strongPoints: modelEvaluation?.strongPoints || [],
      weakPoints: modelEvaluation?.weakPoints || [],
      grammarTopicsToRevise: modelEvaluation?.grammarTopicsToRevise || [],
      vocabularyToLearn: modelEvaluation?.vocabularyToLearn || [],
      examStrategyTip:
        modelEvaluation?.examStrategyTip ||
        "Review the prompt requirements before answering and check the grammar target before submitting.",
      suggestedTopics: modelEvaluation?.suggestedTopics || []
    };
  });

  const totalScore = normalizedQuestionEvaluations.reduce(
    (sum, item) => sum + item.awardedMarks,
    0
  );
  const maxScore = questions.reduce((sum, question) => sum + question.marks, 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 1000) / 10 : 0;

  return {
    ...evaluation,
    nclcEstimate: evaluation.nclcEstimate ?? {},
    examFeedback: evaluation.examFeedback ?? [],
    totalScore,
    maxScore,
    percentage,
    questionEvaluations: normalizedQuestionEvaluations
  };
}
