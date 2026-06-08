import { describe, expect, it } from "vitest";
import {
  answerSubmissionSchema,
  evaluationResultSchema,
  ocrResultSchema,
  testGenerationRequestSchema
} from "@/lib/schemas";

describe("schemas", () => {
  it("accepts a valid test generation request", () => {
    const parsed = testGenerationRequestSchema.parse({
      title: "A1 translation exam",
      level: "A1",
      examType: "GENERAL_TEF",
      preparationMode: "FULL_MOCK_EXAM",
      examSections: ["TEF_READING"],
      targetScoreLevel: "CLB_NCLC_TARGET",
      targetNclc: "NCLC 5",
      skillFocus: "READING",
      grammarTopicIds: ["g1"],
      vocabularySectionIds: ["v1"],
      questionTypes: ["TRANSLATION", "MULTIPLE_SELECT"],
      questionTypeCounts: { TRANSLATION: "5", MULTIPLE_SELECT: "2" },
      questionFocuses: ["Identify the main idea"],
      totalMarks: "20",
      difficulty: "MEDIUM",
      numberOfQuestions: "8",
      timeLimitMinutes: "60",
      fullTest: true
    });

    expect(parsed.totalMarks).toBe(20);
    expect(parsed.numberOfQuestions).toBe(8);
    expect(parsed.examType).toBe("GENERAL_TEF");
    expect(parsed.preparationMode).toBe("FULL_MOCK_EXAM");
    expect(parsed.fullTest).toBe(true);
    expect(parsed.questionTypeCounts.TRANSLATION).toBe(5);
    expect(parsed.questionTypeCounts.MULTIPLE_SELECT).toBe(2);
  });

  it("rejects requests without selected question types", () => {
    expect(() =>
      testGenerationRequestSchema.parse({
        title: "A1 exam",
        level: "A1",
        examType: "TEF_CANADA",
        examSections: ["TEF_READING"],
        grammarTopicIds: ["g1"],
        vocabularySectionIds: ["v1"],
        questionTypes: [],
        totalMarks: 20,
        difficulty: "MEDIUM",
        numberOfQuestions: 8
      })
    ).toThrow();
  });

  it("treats question focuses as optional", () => {
    const parsed = testGenerationRequestSchema.parse({
      title: "A1 exam",
      level: "A1",
      examType: "TEF_CANADA",
      preparationMode: "FULL_MOCK_EXAM",
      examSections: ["TEF_READING"],
      targetScoreLevel: "CLB_NCLC_TARGET",
      skillFocus: "READING",
      grammarTopicIds: ["g1"],
      vocabularySectionIds: ["v1"],
      questionTypes: ["MULTIPLE_CHOICE"],
      questionTypeCounts: { MULTIPLE_CHOICE: 4 },
      totalMarks: 20,
      difficulty: "MEDIUM",
      numberOfQuestions: 4,
      fullTest: false
    });

    expect(parsed.questionFocuses).toEqual([]);
  });

  it("allows blank or missing answers in a submission", () => {
    expect(
      answerSubmissionSchema.parse({
        answers: [
          {
            questionId: "q1",
            answerText: "   "
          }
        ]
      }).answers[0]?.answerText
    ).toBe("");

    expect(answerSubmissionSchema.parse({ answers: [] }).answers).toEqual([]);
  });

  it("validates OCR and evaluation output shape", () => {
    expect(
      ocrResultSchema.parse({
        extractedText: "Je suis etudiant.",
        confidence: 0.92,
        warnings: []
      }).confidence
    ).toBe(0.92);

    expect(
      evaluationResultSchema.parse({
        totalScore: 1,
        maxScore: 2,
        percentage: 50,
        cefrFeedback: "Needs review.",
        nclcEstimate: { writing: "NCLC 5-6" },
        examFeedback: ["Practice TEF writing section B structure."],
        strengths: ["clear attempt"],
        weaknesses: ["agreement"],
        recommendedTopics: ["Adjectives"],
        personalizedStudyPlan: ["Revise adjective agreement."],
        questionEvaluations: [
          {
            questionId: "q1",
            isCorrect: false,
            awardedMarks: 1,
            maximumMarks: 2,
            correctAnswer: "Je suis etudiant.",
            mistakeExplanation: "Accent missing.",
            grammarExplanation: "Agreement is correct.",
            vocabularyCorrection: "No vocabulary issue.",
            improvedVersion: "Je suis etudiant.",
            simpleFeedback: "Add accents when needed.",
            frenchExplanation: "",
            suggestedTopics: ["Accents"]
          }
        ]
      }).questionEvaluations
    ).toHaveLength(1);
  });
});
