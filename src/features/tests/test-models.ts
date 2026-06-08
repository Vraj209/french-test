export type SerializableQuestion = {
  id: string;
  type: string;
  level: string;
  topic: string;
  question: string;
  instructions: string | null;
  options: Array<{ label: string; text: string }>;
  marks: number;
  examSection: string;
  skill: string;
  vocabularyTheme: string | null;
  questionTypeFocus: string | null;
  timeLimitSeconds: number | null;
  minWords: number | null;
  hint: string | null;
  position: number;
};

export type SerializableAnswer = {
  id: string;
  questionId: string;
  answerText: string;
  extractedText: string | null;
  imageId: string | null;
  awardedMarks: number | null;
};

export type SerializableTest = {
  id: string;
  title: string;
  level: string;
  examType: string;
  preparationMode: string;
  examSections: unknown;
  targetScoreLevel: string;
  targetNclc: string | null;
  skillFocus: string;
  questionFocuses: unknown;
  timeLimitSeconds: number | null;
  fullTest: boolean;
  totalMarks: number;
  difficulty: string;
  status: string;
  questions: SerializableQuestion[];
  answers: SerializableAnswer[];
  result: { id: string } | null;
};
