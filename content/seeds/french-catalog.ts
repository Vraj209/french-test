import type { CefrLevel } from "@prisma/client";
import {
  grammarConceptsByLevel,
  vocabularyThemes
} from "../../src/lib/exam-catalog";

export type SeedLevel = {
  code: CefrLevel;
  name: string;
  description: string;
  cefrSummary: string;
};

export type SeedTopic = {
  levelCode: CefrLevel;
  name: string;
  slug: string;
  description: string;
};

export type SeedVocabularySection = {
  levelCode: CefrLevel;
  name: string;
  slug: string;
  description: string;
  words: Array<{ french: string; english: string; note?: string }>;
};

export type SeedLesson = {
  levelCode: CefrLevel;
  title: string;
  slug: string;
  topicSlug: string;
  content: string;
  cefrCanDo: string[];
};

export const seedSources = [
  {
    kind: "CEFR_OFFICIAL" as const,
    title: "Council of Europe CEFR Descriptors",
    url: "https://www.coe.int/fr/web/common-european-framework-reference-languages/cefr-descriptors-search",
    citation: "Used as public CEFR alignment context for original topic and assessment metadata."
  },
  {
    kind: "CEFR_OFFICIAL" as const,
    title: "CEFR Companion Volume With New Descriptors",
    url: "https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2018/1680787989.pdf",
    citation: "Used for broad proficiency alignment only; generated lessons and tests remain original."
  },
  {
    kind: "USER_SEED" as const,
    title: "French Grammar Test AI Product Brief",
    url: null,
    citation: "Topic list and product requirements supplied by the project owner."
  },
  {
    kind: "USER_SEED" as const,
    title: "The Complete French Self-Study Guide topic outline",
    url: null,
    citation: "User-provided PDF used only to compare topic coverage and add original grammar/vocabulary catalog categories."
  },
  {
    kind: "OPEN_REFERENCE" as const,
    title: "Le francais des affaires TEF Canada presentation",
    url: "https://www.lefrancaisdesaffaires.fr/candidat/test-evaluation-francais/tef-canada/presentation/",
    citation: "Used to align TEF Canada practice sections, timing, and task format."
  },
  {
    kind: "OPEN_REFERENCE" as const,
    title: "France Education international TCF Canada presentation",
    url: "https://www.france-education-international.fr/article/test-de-connaissance-du-francais-pour-le-canada?langue=fr",
    citation: "Used to align TCF Canada practice sections, timing, and task format."
  }
];

export const levels: SeedLevel[] = [
  {
    code: "A1",
    name: "A1 Beginner",
    description: "Basic survival French for introductions, routine situations, and simple descriptions.",
    cefrSummary: "Learners can understand and produce simple phrases about immediate needs when support is available."
  },
  {
    code: "A2",
    name: "A2 Elementary",
    description: "Everyday communication about personal history, routine tasks, and familiar topics.",
    cefrSummary: "Learners can exchange simple information and describe past, present, and near-future experiences."
  },
  {
    code: "B1",
    name: "B1 Intermediate",
    description: "Connected writing and speaking about experiences, opinions, plans, and common narratives.",
    cefrSummary: "Learners can produce connected text and explain views on familiar subjects."
  },
  {
    code: "B2",
    name: "B2 Upper Intermediate",
    description: "Clear argumentation, nuanced grammar, formal writing, and complex sentence control.",
    cefrSummary: "Learners can produce detailed, well-structured language and support opinions with appropriate nuance."
  }
];

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const grammarTopics: SeedTopic[] = Object.entries(grammarConceptsByLevel).flatMap(
  ([levelCode, topics]) =>
    topics.map((name) => ({
      levelCode: levelCode as CefrLevel,
      name,
      slug: slugify(name),
      description: `High-priority ${levelCode} grammar concept for TEF/TCF preparation: ${name}.`
    }))
);

export const vocabularySections: SeedVocabularySection[] = levels.flatMap((level) =>
  vocabularyThemes.map((theme) => ({
    levelCode: level.code,
    name: theme.name,
    slug: theme.slug,
    description: `${theme.description} ${level.code} prompts should use level-appropriate complexity and TEF/TCF situations.`,
    words: theme.terms.map((term) => ({
      french: term,
      english: theme.name,
      note: `High-frequency ${theme.name} vocabulary for ${level.code} TEF/TCF practice.`
    }))
  }))
);

export const lessons: SeedLesson[] = grammarTopics.map((topic) => ({
  levelCode: topic.levelCode,
  title: `${topic.name} Essentials`,
  slug: `${topic.slug}-essentials`,
  topicSlug: topic.slug,
  content: [
    `This original ${topic.levelCode} lesson introduces ${topic.name} with exam-oriented examples.`,
    "Learners should identify the grammar target, produce controlled sentences, and explain common mistakes in simple English.",
    "Assessment prompts should include a mix of recognition, correction, transformation, and short production where appropriate."
  ].join("\n\n"),
  cefrCanDo: [
    `Use ${topic.name} in level-appropriate sentences.`,
    "Recognize common errors and produce a corrected version.",
    "Apply the form in short exam-style writing."
  ]
}));
