export const generatedTestJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "level", "totalMarks", "questions"],
  properties: {
    title: { type: "string" },
    level: { type: "string", enum: ["A1", "A2", "B1", "B2"] },
    totalMarks: { type: "integer" },
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "type",
          "level",
          "examSection",
          "skill",
          "topic",
          "vocabularyTheme",
          "questionTypeFocus",
          "question",
          "instructions",
          "options",
          "marks",
          "timeLimitSeconds",
          "minWords",
          "expectedAnswer",
          "evaluationRule",
          "evaluationRubric",
          "hint"
        ],
        properties: {
          type: {
            type: "string",
            enum: [
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
            ]
          },
          level: { type: "string", enum: ["A1", "A2", "B1", "B2"] },
          examSection: {
            type: "string",
            enum: [
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
            ]
          },
          skill: {
            type: "string",
            enum: [
              "READING",
              "LISTENING",
              "WRITING",
              "SPEAKING",
              "GRAMMAR",
              "VOCABULARY",
              "MIXED"
            ]
          },
          topic: { type: "string" },
          vocabularyTheme: { type: "string" },
          questionTypeFocus: { type: "string" },
          question: { type: "string" },
          instructions: { type: "string" },
          options: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["label", "text"],
              properties: {
                label: { type: "string" },
                text: { type: "string" }
              }
            }
          },
          marks: { type: "integer" },
          timeLimitSeconds: { type: ["integer", "null"] },
          minWords: { type: ["integer", "null"] },
          expectedAnswer: { type: "string" },
          evaluationRule: { type: "string" },
          evaluationRubric: {
            type: "array",
            items: { type: "string" }
          },
          hint: { type: "string" }
        }
      }
    }
  }
} as const;

export const ocrJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["extractedText", "confidence", "warnings"],
  properties: {
    extractedText: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    warnings: {
      type: "array",
      items: { type: "string" }
    }
  }
} as const;

export const evaluationJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "totalScore",
    "maxScore",
    "percentage",
    "cefrFeedback",
    "nclcEstimate",
    "examFeedback",
    "strengths",
    "weaknesses",
    "recommendedTopics",
    "personalizedStudyPlan",
    "questionEvaluations"
  ],
  properties: {
    totalScore: { type: "number" },
    maxScore: { type: "integer" },
    percentage: { type: "number", minimum: 0, maximum: 100 },
    cefrFeedback: { type: "string" },
    nclcEstimate: {
      type: "object",
      additionalProperties: false,
      required: ["reading", "listening", "writing", "speaking", "overall"],
      properties: {
        reading: { type: "string" },
        listening: { type: "string" },
        writing: { type: "string" },
        speaking: { type: "string" },
        overall: { type: "string" }
      }
    },
    examFeedback: { type: "array", items: { type: "string" } },
    strengths: { type: "array", items: { type: "string" } },
    weaknesses: { type: "array", items: { type: "string" } },
    recommendedTopics: { type: "array", items: { type: "string" } },
    personalizedStudyPlan: { type: "array", items: { type: "string" } },
    questionEvaluations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "questionId",
          "isCorrect",
          "awardedMarks",
          "maximumMarks",
          "estimatedLevel",
          "correctAnswer",
          "mistakeExplanation",
          "grammarExplanation",
          "vocabularyCorrection",
          "improvedVersion",
          "modelAnswer",
          "simpleFeedback",
          "frenchExplanation",
          "strongPoints",
          "weakPoints",
          "grammarTopicsToRevise",
          "vocabularyToLearn",
          "examStrategyTip",
          "suggestedTopics"
        ],
        properties: {
          questionId: { type: "string" },
          isCorrect: { type: "boolean" },
          awardedMarks: { type: "number" },
          maximumMarks: { type: "integer" },
          estimatedLevel: { type: "string" },
          correctAnswer: { type: "string" },
          mistakeExplanation: { type: "string" },
          grammarExplanation: { type: "string" },
          vocabularyCorrection: { type: "string" },
          improvedVersion: { type: "string" },
          modelAnswer: { type: "string" },
          simpleFeedback: { type: "string" },
          frenchExplanation: { type: "string" },
          strongPoints: { type: "array", items: { type: "string" } },
          weakPoints: { type: "array", items: { type: "string" } },
          grammarTopicsToRevise: { type: "array", items: { type: "string" } },
          vocabularyToLearn: { type: "array", items: { type: "string" } },
          examStrategyTip: { type: "string" },
          suggestedTopics: { type: "array", items: { type: "string" } }
        }
      }
    }
  }
} as const;

export const writingPracticePromptJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "section",
    "level",
    "topic",
    "taskType",
    "prompt",
    "instructions",
    "writingGoal",
    "minWords",
    "suggestedStructure",
    "vocabularyHints",
    "evaluationCriteria"
  ],
  properties: {
    title: { type: "string" },
    section: {
      type: "string",
      enum: ["SENTENCE_BUILDING", "TOPIC_PARAGRAPH", "TEF_TASK_1", "TEF_TASK_2"]
    },
    level: { type: "string", enum: ["A1", "A2", "B1", "B2"] },
    topic: { type: "string" },
    taskType: { type: "string" },
    prompt: { type: "string" },
    instructions: { type: "string" },
    writingGoal: { type: "string" },
    minWords: { type: ["integer", "null"] },
    suggestedStructure: { type: "array", items: { type: "string" } },
    vocabularyHints: { type: "array", items: { type: "string" } },
    evaluationCriteria: { type: "array", items: { type: "string" } }
  }
} as const;

export const writingPracticeFeedbackJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "score",
    "estimatedLevel",
    "mainMistakes",
    "improvementAdvice",
    "structureAdvice",
    "vocabularySuggestions",
    "correctedVersion",
    "modelAnswer",
    "writingStrategy",
    "strongPoints",
    "weakPoints",
    "grammarFocus",
    "vocabularyToLearn"
  ],
  properties: {
    score: { type: "number", minimum: 0, maximum: 100 },
    estimatedLevel: { type: "string" },
    mainMistakes: { type: "array", items: { type: "string" } },
    improvementAdvice: { type: "array", items: { type: "string" } },
    structureAdvice: { type: "array", items: { type: "string" } },
    vocabularySuggestions: { type: "array", items: { type: "string" } },
    correctedVersion: { type: "string" },
    modelAnswer: { type: "string" },
    writingStrategy: { type: "string" },
    strongPoints: { type: "array", items: { type: "string" } },
    weakPoints: { type: "array", items: { type: "string" } },
    grammarFocus: { type: "array", items: { type: "string" } },
    vocabularyToLearn: { type: "array", items: { type: "string" } }
  }
} as const;
