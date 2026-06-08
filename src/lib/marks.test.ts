import { describe, expect, it } from "vitest";
import { allocateMarks, normalizeGeneratedTest } from "@/lib/marks";
import type { GeneratedTest, TestGenerationRequest } from "@/lib/schemas";

describe("mark allocation", () => {
  it("distributes remainder marks from the first question onward", () => {
    expect(allocateMarks(20, 6)).toEqual([4, 4, 3, 3, 3, 3]);
  });

  it("normalizes generated question count and totals", () => {
    const request: TestGenerationRequest = {
      title: "B2 subjunctive test",
      level: "B2",
      examType: "TEF_CANADA",
      preparationMode: "TEF_CANADA_PRACTICE",
      examSections: ["TEF_WRITING_A", "TEF_WRITING_B"],
      targetScoreLevel: "CLB_NCLC_TARGET",
      targetNclc: "NCLC 7",
      skillFocus: "WRITING",
      grammarTopicIds: ["topic-1"],
      vocabularySectionIds: ["vocab-1"],
      questionTypes: ["TRANSLATION", "FILL_BLANK"],
      questionTypeCounts: {},
      questionFocuses: ["Continue a story or article"],
      totalMarks: 10,
      difficulty: "HARD",
      numberOfQuestions: 3,
      fullTest: false
    };
    const generated: GeneratedTest = {
      title: "Generated",
      level: "B2",
      totalMarks: 99,
      questions: [
        {
          type: "MULTIPLE_CHOICE",
          level: "A1",
          examSection: "GENERAL_PRACTICE",
          skill: "MIXED",
          topic: "Subjonctif",
          vocabularyTheme: "Society",
          questionTypeFocus: "Choose the correct verb tense",
          question: "Choose the correct form.",
          instructions: "",
          options: [],
          marks: 99,
          timeLimitSeconds: null,
          minWords: null,
          expectedAnswer: "answer",
          evaluationRule: "rule",
          evaluationRubric: [],
          hint: ""
        }
      ]
    };

    const normalized = normalizeGeneratedTest(generated, request);

    expect(normalized.totalMarks).toBe(10);
    expect(normalized.questions).toHaveLength(3);
    expect(normalized.questions.map((question) => question.marks)).toEqual([4, 3, 3]);
    expect(normalized.questions.every((question) => question.level === "B2")).toBe(true);
    expect(normalized.questions.map((question) => question.type)).toEqual([
      "TRANSLATION",
      "FILL_BLANK",
      "TRANSLATION"
    ]);
    expect(normalized.questions.map((question) => question.examSection)).toEqual([
      "TEF_WRITING_A",
      "TEF_WRITING_B",
      "TEF_WRITING_A"
    ]);
  });

  it("uses exact question type counts when provided", () => {
    const request: TestGenerationRequest = {
      title: "Category count test",
      level: "B1",
      examType: "CEFR_PRACTICE",
      preparationMode: "MIXED_GRAMMAR_VOCABULARY",
      examSections: ["GENERAL_PRACTICE"],
      targetScoreLevel: "INTERMEDIATE",
      skillFocus: "MIXED",
      grammarTopicIds: ["topic-1"],
      vocabularySectionIds: ["vocab-1"],
      questionTypes: ["TRANSLATION", "MULTIPLE_CHOICE", "MULTIPLE_SELECT"],
      questionTypeCounts: {
        TRANSLATION: 5,
        MULTIPLE_CHOICE: 2,
        MULTIPLE_SELECT: 1
      },
      questionFocuses: ["Vocabulary in context"],
      totalMarks: 16,
      difficulty: "MEDIUM",
      numberOfQuestions: 8,
      fullTest: false
    };
    const generated: GeneratedTest = {
      title: "Generated",
      level: "B1",
      totalMarks: 16,
      questions: [
        {
          type: "FILL_BLANK",
          level: "B1",
          examSection: "GENERAL_PRACTICE",
          skill: "MIXED",
          topic: "Vocabulary",
          vocabularyTheme: "Work and Career",
          questionTypeFocus: "Vocabulary in context",
          question: "Choose or write the answer.",
          instructions: "",
          options: [
            { label: "A", text: "Option A" },
            { label: "B", text: "Option B" }
          ],
          marks: 1,
          timeLimitSeconds: null,
          minWords: null,
          expectedAnswer: "A",
          evaluationRule: "rule",
          evaluationRubric: [],
          hint: ""
        }
      ]
    };

    const normalized = normalizeGeneratedTest(generated, request);

    expect(normalized.questions.map((question) => question.type)).toEqual([
      "TRANSLATION",
      "TRANSLATION",
      "TRANSLATION",
      "TRANSLATION",
      "TRANSLATION",
      "MULTIPLE_CHOICE",
      "MULTIPLE_CHOICE",
      "MULTIPLE_SELECT"
    ]);
  });

  it("preserves generated CEFR levels allowed by mixed grammar topics", () => {
    const request: TestGenerationRequest = {
      title: "Mixed grammar levels",
      level: "B2",
      examType: "CEFR_PRACTICE",
      preparationMode: "CEFR_GRAMMAR",
      examSections: ["GENERAL_PRACTICE"],
      targetScoreLevel: "INTERMEDIATE",
      skillFocus: "GRAMMAR",
      grammarTopicIds: ["a2-topic", "b1-topic", "b2-topic"],
      vocabularySectionIds: ["vocab-1"],
      questionTypes: ["FILL_BLANK"],
      questionTypeCounts: { FILL_BLANK: 3 },
      questionFocuses: ["Choose the correct verb tense"],
      totalMarks: 6,
      difficulty: "MEDIUM",
      numberOfQuestions: 3,
      fullTest: false
    };
    const generated: GeneratedTest = {
      title: "Generated",
      level: "B2",
      totalMarks: 6,
      questions: ["A2", "B1", "B2"].map((level) => ({
        type: "FILL_BLANK",
        level: level as "A2" | "B1" | "B2",
        examSection: "GENERAL_PRACTICE",
        skill: "GRAMMAR",
        topic: "Future tense",
        vocabularyTheme: "Grammar",
        questionTypeFocus: "Choose the correct verb tense",
        question: "Complete the sentence.",
        instructions: "",
        options: [],
        marks: 1,
        timeLimitSeconds: null,
        minWords: null,
        expectedAnswer: "answer",
        evaluationRule: "rule",
        evaluationRubric: [],
        hint: ""
      }))
    };

    const normalized = normalizeGeneratedTest(generated, request, {
      allowedQuestionLevels: ["A2", "B1", "B2"]
    });

    expect(normalized.questions.map((question) => question.level)).toEqual(["A2", "B1", "B2"]);
  });

  it("rotates question categories through compatible exam sections", () => {
    const request: TestGenerationRequest = {
      title: "Sectioned TEF test",
      level: "B2",
      examType: "TEF_CANADA",
      preparationMode: "TEF_CANADA_PRACTICE",
      examSections: [
        "TEF_READING",
        "TEF_LISTENING",
        "TEF_WRITING_A",
        "TEF_WRITING_B",
        "TEF_SPEAKING_A",
        "TEF_SPEAKING_B"
      ],
      targetScoreLevel: "CLB_NCLC_TARGET",
      targetNclc: "NCLC 7",
      skillFocus: "MIXED",
      grammarTopicIds: ["topic-1"],
      vocabularySectionIds: ["vocab-1"],
      questionTypes: ["MULTIPLE_CHOICE", "TOPIC_WRITING", "SPEAKING_PREP"],
      questionTypeCounts: {
        MULTIPLE_CHOICE: 4,
        TOPIC_WRITING: 2,
        SPEAKING_PREP: 2
      },
      questionFocuses: ["Exam practice"],
      totalMarks: 16,
      difficulty: "MEDIUM",
      numberOfQuestions: 8,
      fullTest: false
    };
    const generated: GeneratedTest = {
      title: "Generated",
      level: "B2",
      totalMarks: 16,
      questions: [
        {
          type: "FILL_BLANK",
          level: "B2",
          examSection: "GENERAL_PRACTICE",
          skill: "MIXED",
          topic: "Practice",
          vocabularyTheme: "Work",
          questionTypeFocus: "Exam practice",
          question: "Answer the prompt.",
          instructions: "",
          options: [],
          marks: 1,
          timeLimitSeconds: null,
          minWords: null,
          expectedAnswer: "A",
          evaluationRule: "rule",
          evaluationRubric: [],
          hint: ""
        }
      ]
    };

    const normalized = normalizeGeneratedTest(generated, request);

    expect(normalized.questions.map((question) => question.examSection)).toEqual([
      "TEF_READING",
      "TEF_LISTENING",
      "TEF_READING",
      "TEF_LISTENING",
      "TEF_WRITING_A",
      "TEF_WRITING_B",
      "TEF_SPEAKING_A",
      "TEF_SPEAKING_B"
    ]);
  });
});
