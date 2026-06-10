import { z } from "zod";

export const cefrLevelSchema = z.enum(["A1", "A2", "B1", "B2"]);
export const difficultySchema = z.enum(["EASY", "MEDIUM", "HARD"]);
export const examTypeSchema = z.enum([
  "GENERAL",
  "CEFR_PRACTICE",
  "TEF_CANADA",
  "TCF_CANADA",
  "GENERAL_TEF",
  "GENERAL_TCF"
]);
export const preparationModeSchema = z.enum([
  "CEFR_GRAMMAR",
  "TEF_CANADA_PRACTICE",
  "TCF_CANADA_PRACTICE",
  "WRITING_PRACTICE",
  "SPEAKING_PRACTICE",
  "MIXED_GRAMMAR_VOCABULARY",
  "FULL_MOCK_EXAM"
]);
export const skillFocusSchema = z.enum([
  "READING",
  "LISTENING",
  "WRITING",
  "SPEAKING",
  "GRAMMAR",
  "VOCABULARY",
  "MIXED"
]);
export const targetScoreLevelSchema = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "CLB_NCLC_TARGET"
]);
export const examSectionSchema = z.enum([
  "GENERAL_PRACTICE",
  "TEF_READING",
  "TEF_LISTENING",
  "TEF_WRITING_A",
  "TEF_WRITING_B",
  "TEF_SPEAKING_A",
  "TEF_SPEAKING_B",
  "TCF_LISTENING",
  "TCF_READING",
  "TCF_WRITING_1",
  "TCF_WRITING_2",
  "TCF_WRITING_3",
  "TCF_SPEAKING_1",
  "TCF_SPEAKING_2",
  "TCF_SPEAKING_3",
  "TCF_LANGUAGE_STRUCTURES"
]);

export const questionTypeSchema = z.enum([
  "TRANSLATION",
  "FILL_BLANK",
  "CORRECT_INCORRECT",
  "MULTIPLE_CHOICE",
  "MULTIPLE_SELECT",
  "VERB_CONJUGATION",
  "SENTENCE_TRANSFORMATION",
  "SHORT_WRITING",
  "TOPIC_WRITING",
  "SPEAKING_PREP"
]);

export const questionTypeLabels: Record<z.infer<typeof questionTypeSchema>, string> = {
  TRANSLATION: "Translation",
  FILL_BLANK: "Fill in the blanks",
  CORRECT_INCORRECT: "Correct or incorrect",
  MULTIPLE_CHOICE: "Multiple choice",
  MULTIPLE_SELECT: "Multiple select",
  VERB_CONJUGATION: "Verb conjugation",
  SENTENCE_TRANSFORMATION: "Sentence transformation",
  SHORT_WRITING: "Short writing",
  TOPIC_WRITING: "Topic-based writing",
  SPEAKING_PREP: "Speaking preparation"
};

export const examTypeLabels: Record<z.infer<typeof examTypeSchema>, string> = {
  GENERAL: "General CEFR practice",
  CEFR_PRACTICE: "CEFR practice",
  TEF_CANADA: "TEF Canada",
  TCF_CANADA: "TCF Canada",
  GENERAL_TEF: "General TEF",
  GENERAL_TCF: "General TCF"
};

export const preparationModeShortLabels: Record<
  z.infer<typeof preparationModeSchema>,
  string
> = {
  CEFR_GRAMMAR: "CEFR grammar",
  TEF_CANADA_PRACTICE: "TEF practice",
  TCF_CANADA_PRACTICE: "TCF practice",
  WRITING_PRACTICE: "Writing",
  SPEAKING_PRACTICE: "Speaking",
  MIXED_GRAMMAR_VOCABULARY: "Grammar + vocab",
  FULL_MOCK_EXAM: "Full mock"
};

export const skillFocusShortLabels: Record<z.infer<typeof skillFocusSchema>, string> = {
  READING: "Reading",
  LISTENING: "Listening",
  WRITING: "Writing",
  SPEAKING: "Speaking",
  GRAMMAR: "Grammar",
  VOCABULARY: "Vocabulary",
  MIXED: "Mixed"
};

export const targetScoreLevelShortLabels: Record<
  z.infer<typeof targetScoreLevelSchema>,
  string
> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  CLB_NCLC_TARGET: "CLB/NCLC target"
};

export const examSectionLabels: Record<z.infer<typeof examSectionSchema>, string> = {
  GENERAL_PRACTICE: "General practice",
  TEF_READING: "TEF comprehension ecrite",
  TEF_LISTENING: "TEF comprehension orale",
  TEF_WRITING_A: "TEF expression ecrite A",
  TEF_WRITING_B: "TEF expression ecrite B",
  TEF_SPEAKING_A: "TEF expression orale A",
  TEF_SPEAKING_B: "TEF expression orale B",
  TCF_LISTENING: "TCF comprehension orale",
  TCF_READING: "TCF comprehension ecrite",
  TCF_WRITING_1: "TCF expression ecrite task 1",
  TCF_WRITING_2: "TCF expression ecrite task 2",
  TCF_WRITING_3: "TCF expression ecrite task 3",
  TCF_SPEAKING_1: "TCF expression orale task 1",
  TCF_SPEAKING_2: "TCF expression orale task 2",
  TCF_SPEAKING_3: "TCF expression orale task 3",
  TCF_LANGUAGE_STRUCTURES: "TCF language structures"
};

export const difficultyLabels: Record<z.infer<typeof difficultySchema>, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard"
};

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).max(128)
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().max(80).optional()
});

export const testGenerationRequestSchema = z.object({
  title: z.string().trim().min(3).max(120),
  level: cefrLevelSchema,
  examType: examTypeSchema.default("TEF_CANADA"),
  preparationMode: preparationModeSchema.default("TEF_CANADA_PRACTICE"),
  examSections: z
    .array(examSectionSchema)
    .min(1)
    .default([
      "TEF_READING",
      "TEF_LISTENING",
      "TEF_WRITING_A",
      "TEF_WRITING_B",
      "TEF_SPEAKING_A",
      "TEF_SPEAKING_B"
    ]),
  targetScoreLevel: targetScoreLevelSchema.default("CLB_NCLC_TARGET"),
  targetNclc: z.string().trim().max(12).optional(),
  skillFocus: skillFocusSchema.default("MIXED"),
  grammarTopicIds: z.array(z.string().min(1)).min(1),
  vocabularySectionIds: z.array(z.string().min(1)).min(1),
  questionTypes: z.array(questionTypeSchema).min(1),
  questionTypeCounts: z.partialRecord(
    questionTypeSchema,
    z.coerce.number().int().min(0).max(100)
  ).default({}),
  questionFocuses: z.array(z.string().trim().min(2).max(120)).default([]),
  totalMarks: z.coerce.number().int().min(5).max(100),
  difficulty: difficultySchema,
  numberOfQuestions: z.coerce.number().int().min(1).max(100),
  timeLimitMinutes: z.coerce.number().int().min(1).max(240).optional(),
  fullTest: z.boolean().default(false)
});

export const generatedQuestionSchema = z.object({
  type: questionTypeSchema,
  level: cefrLevelSchema,
  examSection: examSectionSchema.default("GENERAL_PRACTICE"),
  skill: skillFocusSchema.default("MIXED"),
  topic: z.string().min(2),
  vocabularyTheme: z.string().default(""),
  questionTypeFocus: z.string().default(""),
  question: z.string().min(5),
  instructions: z.string().default(""),
  options: z.array(z.object({ label: z.string(), text: z.string() })).default([]),
  marks: z.number().int().min(1).max(30),
  timeLimitSeconds: z.number().int().positive().nullable().optional(),
  minWords: z.number().int().positive().nullable().optional(),
  expectedAnswer: z.string().min(1),
  evaluationRule: z.string().min(1),
  evaluationRubric: z.array(z.string()).default([]),
  hint: z.string().optional()
});

export const generatedTestSchema = z.object({
  title: z.string().min(3),
  level: cefrLevelSchema,
  totalMarks: z.number().int().min(1),
  questions: z.array(generatedQuestionSchema).min(1)
});

export const answerInputSchema = z.object({
  questionId: z.string().min(1),
  answerText: z.string().trim(),
  extractedText: z.string().trim().optional(),
  imageId: z.string().min(1).optional()
});

export const answerSubmissionSchema = z.object({
  answers: z.array(answerInputSchema)
});

export const uploadRequestSchema = z.object({
  testId: z.string().min(1)
});

export const ocrExtractRequestSchema = z.object({
  imageId: z.string().min(1)
});

export const ocrResultSchema = z.object({
  extractedText: z.string(),
  confidence: z.number().min(0).max(1),
  warnings: z.array(z.string())
});

export const questionEvaluationSchema = z.object({
  questionId: z.string().min(1),
  isCorrect: z.boolean(),
  awardedMarks: z.number().min(0),
  maximumMarks: z.number().int().min(1),
  estimatedLevel: z.string().default("not assessed"),
  correctAnswer: z.string().min(1),
  mistakeExplanation: z.string(),
  grammarExplanation: z.string(),
  vocabularyCorrection: z.string(),
  improvedVersion: z.string(),
  modelAnswer: z.string().default(""),
  simpleFeedback: z.string(),
  frenchExplanation: z.string().optional(),
  strongPoints: z.array(z.string()).default([]),
  weakPoints: z.array(z.string()).default([]),
  grammarTopicsToRevise: z.array(z.string()).default([]),
  vocabularyToLearn: z.array(z.string()).default([]),
  examStrategyTip: z.string().default(""),
  suggestedTopics: z.array(z.string())
});

export const evaluationResultSchema = z.object({
  totalScore: z.number().min(0),
  maxScore: z.number().int().min(1),
  percentage: z.number().min(0).max(100),
  cefrFeedback: z.string().min(1),
  nclcEstimate: z.record(z.string(), z.string()).optional(),
  examFeedback: z.array(z.string()).optional(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendedTopics: z.array(z.string()),
  personalizedStudyPlan: z.array(z.string()),
  questionEvaluations: z.array(questionEvaluationSchema)
});

export const writingPracticeSectionSchema = z.enum([
  "SENTENCE_BUILDING",
  "TOPIC_PARAGRAPH",
  "TEF_TASK_1",
  "TEF_TASK_2"
]);

export const writingPracticeGenerationRequestSchema = z.object({
  section: writingPracticeSectionSchema,
  level: cefrLevelSchema.default("B1"),
  difficulty: difficultySchema.default("MEDIUM"),
  topic: z.string().trim().min(2).max(80).optional()
});

export const writingPracticePromptSchema = z.object({
  title: z.string().trim().min(3).max(120),
  section: writingPracticeSectionSchema,
  level: cefrLevelSchema,
  topic: z.string().trim().min(2).max(80),
  taskType: z.string().trim().min(2).max(80),
  prompt: z.string().trim().min(10),
  instructions: z.string().trim().min(10),
  writingGoal: z.string().trim().min(10),
  minWords: z.number().int().positive().nullable(),
  suggestedStructure: z.array(z.string().trim().min(2)).min(1),
  vocabularyHints: z.array(z.string().trim().min(1)).min(1),
  evaluationCriteria: z.array(z.string().trim().min(2)).min(1)
});

export const writingPracticeEvaluationRequestSchema = z.object({
  testId: z.string().min(1),
  questionId: z.string().min(1),
  answerText: z.string().trim().min(1)
});

export const writingPracticeFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  estimatedLevel: z.string().trim().min(2),
  mainMistakes: z.array(z.string().trim().min(2)).default([]),
  improvementAdvice: z.array(z.string().trim().min(2)).default([]),
  structureAdvice: z.array(z.string().trim().min(2)).default([]),
  vocabularySuggestions: z.array(z.string().trim().min(1)).default([]),
  correctedVersion: z.string().trim().min(1),
  modelAnswer: z.string().trim().min(1),
  writingStrategy: z.string().trim().min(1),
  strongPoints: z.array(z.string().trim().min(2)).default([]),
  weakPoints: z.array(z.string().trim().min(2)).default([]),
  grammarFocus: z.array(z.string().trim().min(2)).default([]),
  vocabularyToLearn: z.array(z.string().trim().min(1)).default([])
});

export type CefrLevel = z.infer<typeof cefrLevelSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type ExamType = z.infer<typeof examTypeSchema>;
export type PreparationMode = z.infer<typeof preparationModeSchema>;
export type SkillFocus = z.infer<typeof skillFocusSchema>;
export type TargetScoreLevel = z.infer<typeof targetScoreLevelSchema>;
export type ExamSection = z.infer<typeof examSectionSchema>;
export type QuestionType = z.infer<typeof questionTypeSchema>;
export type TestGenerationRequest = z.infer<typeof testGenerationRequestSchema>;
export type GeneratedTest = z.infer<typeof generatedTestSchema>;
export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
export type AnswerSubmission = z.infer<typeof answerSubmissionSchema>;
export type OcrResult = z.infer<typeof ocrResultSchema>;
export type EvaluationResult = z.infer<typeof evaluationResultSchema>;
export type QuestionEvaluation = z.infer<typeof questionEvaluationSchema>;
export type WritingPracticeSection = z.infer<typeof writingPracticeSectionSchema>;
export type WritingPracticeGenerationRequest = z.infer<
  typeof writingPracticeGenerationRequestSchema
>;
export type WritingPracticePrompt = z.infer<typeof writingPracticePromptSchema>;
export type WritingPracticeEvaluationRequest = z.infer<
  typeof writingPracticeEvaluationRequestSchema
>;
export type WritingPracticeFeedback = z.infer<typeof writingPracticeFeedbackSchema>;
