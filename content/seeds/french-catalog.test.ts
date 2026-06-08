import { describe, expect, it } from "vitest";
import {
  grammarTopics,
  lessons,
  levels,
  seedSources,
  vocabularySections
} from "./french-catalog";
import { grammarConceptsByLevel, vocabularyThemes } from "../../src/lib/exam-catalog";

describe("French catalog seed data", () => {
  it("includes all requested CEFR levels", () => {
    expect(levels.map((level) => level.code)).toEqual(["A1", "A2", "B1", "B2"]);
  });

  it("includes grammar and vocabulary content for every level", () => {
    for (const level of levels) {
      expect(grammarTopics.some((topic) => topic.levelCode === level.code)).toBe(true);
      expect(
        vocabularySections.some((section) => section.levelCode === level.code)
      ).toBe(true);
    }
  });

  it("includes the requested high-priority TEF/TCF grammar concepts", () => {
    expect(grammarTopics.map((topic) => topic.name)).toContain("Subjonctif présent");
    expect(grammarTopics.map((topic) => topic.name)).toContain(
      "Basic questions: est-ce que, inversion, intonation"
    );
    expect(grammarTopics.map((topic) => topic.name)).toContain(
      "C'est, ce sont, and il est"
    );
    expect(grammarTopics.map((topic) => topic.name)).toContain("Futur antérieur");
    expect(grammarTopics.map((topic) => topic.name)).toContain(
      "Adverbs and adverb placement"
    );
    expect(grammarTopics).toHaveLength(
      Object.values(grammarConceptsByLevel).reduce((sum, topics) => sum + topics.length, 0)
    );
  });

  it("creates every requested vocabulary theme for every CEFR level", () => {
    expect(vocabularyThemes.length).toBeGreaterThanOrEqual(18);
    expect(vocabularySections).toHaveLength(levels.length * vocabularyThemes.length);
    expect(vocabularySections.map((section) => section.name)).toContain(
      "Immigration and Administration"
    );
    expect(vocabularySections.map((section) => section.name)).toContain(
      "Word Building: Prefixes and Suffixes"
    );
    expect(vocabularySections.map((section) => section.name)).toContain(
      "Everyday Expressions and Idioms"
    );
  });

  it("keeps lessons linked to known topic slugs", () => {
    const topicKeys = new Set(
      grammarTopics.map((topic) => `${topic.levelCode}:${topic.slug}`)
    );

    for (const lesson of lessons) {
      expect(topicKeys.has(`${lesson.levelCode}:${lesson.topicSlug}`)).toBe(true);
    }
  });

  it("stores source references for CEFR grounding", () => {
    expect(seedSources.map((source) => source.kind)).toContain("CEFR_OFFICIAL");
    expect(seedSources.map((source) => source.title)).toContain(
      "Le francais des affaires TEF Canada presentation"
    );
    expect(seedSources.map((source) => source.title)).toContain(
      "France Education international TCF Canada presentation"
    );
  });
});
