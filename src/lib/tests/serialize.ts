type QuestionLike = {
  id: string;
  type: string;
  level: string;
  topic: string;
  question: string;
  instructions: string | null;
  options: unknown;
  marks: number;
  examSection: string;
  skill?: string;
  vocabularyTheme?: string | null;
  questionTypeFocus?: string | null;
  timeLimitSeconds: number | null;
  minWords: number | null;
  hint: string | null;
  position: number;
};

type AnswerLike = {
  id: string;
  questionId: string;
  answerText: string;
  extractedText: string | null;
  imageId: string | null;
  awardedMarks: number | null;
};

type TestLike = {
  id: string;
  title: string;
  level: string;
  examType: string;
  preparationMode?: string;
  examSections: unknown;
  targetScoreLevel?: string;
  targetNclc: string | null;
  skillFocus?: string;
  questionFocuses?: unknown;
  timeLimitSeconds?: number | null;
  fullTest?: boolean;
  totalMarks: number;
  difficulty: string;
  status: string;
  questions: QuestionLike[];
  answers?: AnswerLike[];
  result?: { id: string } | null;
};

function questionOptions(options: unknown): Array<{ label: string; text: string }> {
  if (!Array.isArray(options)) {
    return [];
  }

  return options.filter(
    (option): option is { label: string; text: string } =>
      typeof option === "object" &&
      option !== null &&
      "label" in option &&
      "text" in option &&
      typeof option.label === "string" &&
      typeof option.text === "string"
  );
}

export function serializeTestForLearner(test: TestLike) {
  return {
    id: test.id,
    title: test.title,
    level: test.level,
    examType: test.examType,
    preparationMode: test.preparationMode ?? "TEF_CANADA_PRACTICE",
    examSections: test.examSections,
    targetScoreLevel: test.targetScoreLevel ?? "CLB_NCLC_TARGET",
    targetNclc: test.targetNclc,
    skillFocus: test.skillFocus ?? "MIXED",
    questionFocuses: test.questionFocuses ?? [],
    timeLimitSeconds: test.timeLimitSeconds ?? null,
    fullTest: test.fullTest ?? false,
    totalMarks: test.totalMarks,
    difficulty: test.difficulty,
    status: test.status,
    result: test.result ?? null,
    questions: test.questions.map((question) => ({
      id: question.id,
      type: question.type,
      level: question.level,
      topic: question.topic,
      question: question.question,
      instructions: question.instructions,
      options: questionOptions(question.options),
      marks: question.marks,
      examSection: question.examSection,
      skill: question.skill ?? "MIXED",
      vocabularyTheme: question.vocabularyTheme ?? null,
      questionTypeFocus: question.questionTypeFocus ?? null,
      timeLimitSeconds: question.timeLimitSeconds,
      minWords: question.minWords,
      hint: question.hint,
      position: question.position
    })),
    answers:
      test.answers?.map((answer) => ({
        id: answer.id,
        questionId: answer.questionId,
        answerText: answer.answerText,
        extractedText: answer.extractedText,
        imageId: answer.imageId,
        awardedMarks: answer.awardedMarks
      })) ?? []
  };
}
