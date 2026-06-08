import type { SerializableAnswer, SerializableQuestion, SerializableTest } from "@/features/tests/test-models";

export type SerializableQuestionFeedback = {
  id: string;
  questionId: string;
  isCorrect: boolean;
  awardedMarks: number;
  maximumMarks: number;
  estimatedLevel: string | null;
  correctAnswer: string;
  mistakeExplanation: string;
  grammarExplanation: string;
  vocabularyCorrection: string;
  improvedVersion: string;
  modelAnswer: string;
  simpleFeedback: string;
  frenchExplanation: string | null;
  strongPoints: string[];
  weakPoints: string[];
  grammarTopicsToRevise: string[];
  vocabularyToLearn: string[];
  examStrategyTip: string;
  suggestedTopics: string[];
  question: SerializableQuestion;
};

export type SerializableResult = {
  id: string;
  totalMarks: number;
  awardedMarks: number;
  percentage: number;
  cefrFeedback: string;
  nclcEstimate: Record<string, string>;
  examFeedback: string[];
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: string[];
  personalizedStudyPlan: string[];
  test: SerializableTest & {
    answers: SerializableAnswer[];
  };
  questionFeedback: SerializableQuestionFeedback[];
};
