import type {
  CefrLevel,
  Difficulty,
  ExamSection,
  ExamType,
  PreparationMode,
  QuestionType,
  SkillFocus,
  TargetScoreLevel
} from "@/lib/schemas";

export type CatalogTopic = {
  id: string;
  levelCode: CefrLevel;
  name: string;
  slug: string;
  description: string | null;
};

export type CatalogVocabularySection = {
  id: string;
  levelCode: CefrLevel;
  name: string;
  slug: string;
  description: string | null;
  words: unknown;
};

export type CatalogLevel = {
  id: string;
  code: CefrLevel;
  name: string;
  description: string;
  cefrSummary: string;
  grammarTopics: CatalogTopic[];
  vocabularySections: CatalogVocabularySection[];
};

export type CatalogResponse = {
  levels: CatalogLevel[];
};

export type TestBuilderState = {
  title: string;
  level: CefrLevel;
  examType: ExamType;
  preparationMode: PreparationMode;
  examSections: ExamSection[];
  targetScoreLevel: TargetScoreLevel;
  targetNclc?: string;
  skillFocus: SkillFocus;
  grammarTopicIds: string[];
  vocabularySectionIds: string[];
  questionTypes: QuestionType[];
  questionTypeCounts: Partial<Record<QuestionType, number>>;
  questionFocuses: string[];
  totalMarks: number;
  difficulty: Difficulty;
  numberOfQuestions: number;
  timeLimitMinutes?: number;
  fullTest: boolean;
};
