import { describe, expect, it } from "vitest";
import {
  defaultMarksForExam,
  defaultQuestionTypesForExam,
  defaultQuestionsForExam,
  defaultSectionsForExam,
  getExamPreset
} from "@/lib/exam-presets";

describe("exam presets", () => {
  it("defaults to all TEF Canada exam modules", () => {
    expect(defaultSectionsForExam("TEF_CANADA")).toEqual([
      "TEF_READING",
      "TEF_LISTENING",
      "TEF_WRITING_A",
      "TEF_WRITING_B",
      "TEF_SPEAKING_A",
      "TEF_SPEAKING_B"
    ]);
    expect(defaultQuestionTypesForExam("TEF_CANADA")).toEqual([
      "MULTIPLE_CHOICE",
      "TOPIC_WRITING",
      "SPEAKING_PREP"
    ]);
  });

  it("stores TCF Canada task counts for the default practice set", () => {
    expect(getExamPreset("TCF_CANADA").sections).toHaveLength(8);
    expect(defaultQuestionsForExam("TCF_CANADA")).toBe(26);
    expect(defaultMarksForExam("TCF_CANADA")).toBe(65);
  });

  it("supports the requested exam type choices", () => {
    expect(getExamPreset("GENERAL_TEF").name).toBe("General TEF");
    expect(getExamPreset("GENERAL_TCF").name).toBe("General TCF");
    expect(getExamPreset("CEFR_PRACTICE").name).toBe("CEFR practice");
  });
});
