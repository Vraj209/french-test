import { describe, expect, it } from "vitest";
import { normalizeEvaluationResult } from "@/lib/evaluation";

describe("evaluation normalization", () => {
  it("clamps awarded marks and recomputes totals", () => {
    const normalized = normalizeEvaluationResult(
      {
        totalScore: 100,
        maxScore: 100,
        percentage: 100,
        cefrFeedback: "feedback",
        strengths: [],
        weaknesses: [],
        recommendedTopics: [],
        personalizedStudyPlan: [],
        questionEvaluations: [
          {
            questionId: "q1",
            isCorrect: true,
            awardedMarks: 99,
            maximumMarks: 99,
            estimatedLevel: "B1",
            correctAnswer: "answer",
            mistakeExplanation: "none",
            grammarExplanation: "rule",
            vocabularyCorrection: "none",
            improvedVersion: "answer",
            modelAnswer: "answer",
            simpleFeedback: "good",
            frenchExplanation: "",
            strongPoints: [],
            weakPoints: [],
            grammarTopicsToRevise: [],
            vocabularyToLearn: [],
            examStrategyTip: "",
            suggestedTopics: []
          }
        ]
      },
      [
        { id: "q1", marks: 3 },
        { id: "q2", marks: 2 }
      ]
    );

    expect(normalized.totalScore).toBe(3);
    expect(normalized.maxScore).toBe(5);
    expect(normalized.percentage).toBe(60);
    expect(normalized.questionEvaluations).toHaveLength(2);
    expect(normalized.questionEvaluations[1]?.awardedMarks).toBe(0);
    expect(normalized.questionEvaluations[1]?.maximumMarks).toBe(2);
  });
});
