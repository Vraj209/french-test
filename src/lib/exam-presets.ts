import type { ExamSection, ExamType, PreparationMode, QuestionType } from "@/lib/schemas";

export type ExamSectionPreset = {
  id: ExamSection;
  name: string;
  shortName: string;
  skill: "reading" | "listening" | "writing" | "speaking" | "structures" | "practice";
  officialFormat: string;
  officialQuestions: number;
  defaultMarks: number;
  defaultQuestions: number;
  timeLimitSeconds: number | null;
  minWords: number | null;
  questionTypes: QuestionType[];
};

export type ExamPreset = {
  type: ExamType;
  name: string;
  description: string;
  officialSource: string;
  defaultLevel: "A1" | "A2" | "B1" | "B2";
  defaultTargetNclc: string;
  defaultPreparationMode: PreparationMode;
  sections: ExamSectionPreset[];
};

const generalPracticeSection: ExamSectionPreset = {
  id: "GENERAL_PRACTICE",
  name: "CEFR grammar and vocabulary practice",
  shortName: "Practice",
  skill: "practice",
  officialFormat: "Custom CEFR A1-B2 grammar, vocabulary, structure, and short-production practice.",
  officialQuestions: 20,
  defaultMarks: 20,
  defaultQuestions: 8,
  timeLimitSeconds: null,
  minWords: null,
  questionTypes: [
    "FILL_BLANK",
    "MULTIPLE_CHOICE",
    "VERB_CONJUGATION",
    "SENTENCE_TRANSFORMATION"
  ]
};

const tefSections: ExamSectionPreset[] = [
  {
    id: "TEF_READING",
    name: "Comprehension ecrite",
    shortName: "Reading",
    skill: "reading",
    officialFormat: "40 MCQ questions in 60 minutes using notices, emails, articles, reports, opinions, ads, and formal or informal messages.",
    officialQuestions: 40,
    defaultMarks: 10,
    defaultQuestions: 10,
    timeLimitSeconds: 3600,
    minWords: null,
    questionTypes: ["MULTIPLE_CHOICE"]
  },
  {
    id: "TEF_LISTENING",
    name: "Comprehension orale",
    shortName: "Listening",
    skill: "listening",
    officialFormat: "40 MCQ questions in 40 minutes using conversations, announcements, interviews, phone calls, public messages, and professional situations.",
    officialQuestions: 40,
    defaultMarks: 10,
    defaultQuestions: 10,
    timeLimitSeconds: 2400,
    minWords: null,
    questionTypes: ["MULTIPLE_CHOICE"]
  },
  {
    id: "TEF_WRITING_A",
    name: "Expression ecrite section A",
    shortName: "Writing A",
    skill: "writing",
    officialFormat: "Continue an article or story; minimum 80 words; part of a 60 minute written-expression section.",
    officialQuestions: 1,
    defaultMarks: 10,
    defaultQuestions: 1,
    timeLimitSeconds: 1500,
    minWords: 80,
    questionTypes: ["TOPIC_WRITING"]
  },
  {
    id: "TEF_WRITING_B",
    name: "Expression ecrite section B",
    shortName: "Writing B",
    skill: "writing",
    officialFormat: "Express and justify a point of view; minimum 200 words; part of a 60 minute written-expression section.",
    officialQuestions: 1,
    defaultMarks: 15,
    defaultQuestions: 1,
    timeLimitSeconds: 2100,
    minWords: 200,
    questionTypes: ["TOPIC_WRITING"]
  },
  {
    id: "TEF_SPEAKING_A",
    name: "Expression orale section A",
    shortName: "Speaking A",
    skill: "speaking",
    officialFormat: "Obtain information by asking questions; part of an approximately 15 minute oral-expression section.",
    officialQuestions: 1,
    defaultMarks: 10,
    defaultQuestions: 1,
    timeLimitSeconds: 300,
    minWords: null,
    questionTypes: ["SPEAKING_PREP"]
  },
  {
    id: "TEF_SPEAKING_B",
    name: "Expression orale section B",
    shortName: "Speaking B",
    skill: "speaking",
    officialFormat: "Convince someone or defend an opinion; part of an approximately 15 minute oral-expression section.",
    officialQuestions: 1,
    defaultMarks: 15,
    defaultQuestions: 1,
    timeLimitSeconds: 600,
    minWords: null,
    questionTypes: ["SPEAKING_PREP"]
  }
];

const tcfSections: ExamSectionPreset[] = [
  {
    id: "TCF_LISTENING",
    name: "Comprehension orale",
    shortName: "Listening",
    skill: "listening",
    officialFormat: "39 MCQ questions in 35 minutes with progressive difficulty across everyday, social, academic, and professional audio situations.",
    officialQuestions: 39,
    defaultMarks: 10,
    defaultQuestions: 10,
    timeLimitSeconds: 2100,
    minWords: null,
    questionTypes: ["MULTIPLE_CHOICE"]
  },
  {
    id: "TCF_READING",
    name: "Comprehension ecrite",
    shortName: "Reading",
    skill: "reading",
    officialFormat: "39 MCQ questions in 60 minutes with short messages, ads, notices, articles, reports, opinions, and complex documents.",
    officialQuestions: 39,
    defaultMarks: 10,
    defaultQuestions: 10,
    timeLimitSeconds: 3600,
    minWords: null,
    questionTypes: ["MULTIPLE_CHOICE"]
  },
  {
    id: "TCF_WRITING_1",
    name: "Expression ecrite task 1",
    shortName: "Writing 1",
    skill: "writing",
    officialFormat: "Write a message; 60 to 120 words; part of a 60 minute written-expression section.",
    officialQuestions: 1,
    defaultMarks: 7,
    defaultQuestions: 1,
    timeLimitSeconds: 1200,
    minWords: 60,
    questionTypes: ["TOPIC_WRITING"]
  },
  {
    id: "TCF_WRITING_2",
    name: "Expression ecrite task 2",
    shortName: "Writing 2",
    skill: "writing",
    officialFormat: "Write an article, letter, note, or story; 120 to 150 words; part of a 60 minute section.",
    officialQuestions: 1,
    defaultMarks: 8,
    defaultQuestions: 1,
    timeLimitSeconds: 1200,
    minWords: 120,
    questionTypes: ["TOPIC_WRITING"]
  },
  {
    id: "TCF_WRITING_3",
    name: "Expression ecrite task 3",
    shortName: "Writing 3",
    skill: "writing",
    officialFormat: "Compare two points of view and give an opinion; 120 to 180 words; part of a 60 minute section.",
    officialQuestions: 1,
    defaultMarks: 10,
    defaultQuestions: 1,
    timeLimitSeconds: 1200,
    minWords: 120,
    questionTypes: ["TOPIC_WRITING"]
  },
  {
    id: "TCF_SPEAKING_1",
    name: "Expression orale task 1",
    shortName: "Speaking 1",
    skill: "speaking",
    officialFormat: "Structured interview; part of an approximately 12 minute speaking section.",
    officialQuestions: 1,
    defaultMarks: 6,
    defaultQuestions: 1,
    timeLimitSeconds: 120,
    minWords: null,
    questionTypes: ["SPEAKING_PREP"]
  },
  {
    id: "TCF_SPEAKING_2",
    name: "Expression orale task 2",
    shortName: "Speaking 2",
    skill: "speaking",
    officialFormat: "Roleplay or obtain information; part of an approximately 12 minute speaking section.",
    officialQuestions: 1,
    defaultMarks: 7,
    defaultQuestions: 1,
    timeLimitSeconds: 300,
    minWords: null,
    questionTypes: ["SPEAKING_PREP"]
  },
  {
    id: "TCF_SPEAKING_3",
    name: "Expression orale task 3",
    shortName: "Speaking 3",
    skill: "speaking",
    officialFormat: "Express and defend a point of view; part of an approximately 12 minute speaking section.",
    officialQuestions: 1,
    defaultMarks: 7,
    defaultQuestions: 1,
    timeLimitSeconds: 270,
    minWords: null,
    questionTypes: ["SPEAKING_PREP"]
  }
];

export const examPresets: Record<ExamType, ExamPreset> = {
  GENERAL: {
    type: "GENERAL",
    name: "General CEFR practice",
    description: "Legacy flexible CEFR grammar and vocabulary practice.",
    officialSource: "Project CEFR catalog",
    defaultLevel: "B1",
    defaultTargetNclc: "N/A",
    defaultPreparationMode: "CEFR_GRAMMAR",
    sections: [generalPracticeSection]
  },
  CEFR_PRACTICE: {
    type: "CEFR_PRACTICE",
    name: "CEFR practice",
    description: "A1-B2 grammar, vocabulary, and structure practice for TEF/TCF foundations.",
    officialSource: "Project CEFR catalog",
    defaultLevel: "B1",
    defaultTargetNclc: "N/A",
    defaultPreparationMode: "CEFR_GRAMMAR",
    sections: [generalPracticeSection]
  },
  TEF_CANADA: {
    type: "TEF_CANADA",
    name: "TEF Canada",
    description: "Canadian immigration-focused TEF practice for reading, listening, writing, and speaking.",
    officialSource: "Le francais des affaires, CCI Paris Ile-de-France",
    defaultLevel: "B2",
    defaultTargetNclc: "NCLC 7",
    defaultPreparationMode: "TEF_CANADA_PRACTICE",
    sections: tefSections
  },
  TCF_CANADA: {
    type: "TCF_CANADA",
    name: "TCF Canada",
    description: "Canadian immigration-focused TCF practice with progressive reading/listening and productive tasks.",
    officialSource: "France Education international",
    defaultLevel: "B2",
    defaultTargetNclc: "NCLC 7",
    defaultPreparationMode: "TCF_CANADA_PRACTICE",
    sections: tcfSections
  },
  GENERAL_TEF: {
    type: "GENERAL_TEF",
    name: "General TEF",
    description: "General TEF-style practice using TEF reading, listening, writing, and oral-expression formats.",
    officialSource: "TEF-style open practice metadata",
    defaultLevel: "B1",
    defaultTargetNclc: "N/A",
    defaultPreparationMode: "TEF_CANADA_PRACTICE",
    sections: tefSections
  },
  GENERAL_TCF: {
    type: "GENERAL_TCF",
    name: "General TCF",
    description: "General TCF-style practice using progressive comprehension, written-expression, and speaking tasks.",
    officialSource: "TCF-style open practice metadata",
    defaultLevel: "B1",
    defaultTargetNclc: "N/A",
    defaultPreparationMode: "TCF_CANADA_PRACTICE",
    sections: tcfSections
  }
};

export function getExamPreset(type: ExamType) {
  return examPresets[type] ?? examPresets.TEF_CANADA;
}

export function getSectionsForExam(type: ExamType, sectionIds: ExamSection[]) {
  const selected = new Set(sectionIds);

  return getExamPreset(type).sections.filter((section) => selected.has(section.id));
}

export function defaultSectionsForExam(type: ExamType): ExamSection[] {
  return getExamPreset(type).sections.map((section) => section.id);
}

export function defaultQuestionTypesForExam(type: ExamType): QuestionType[] {
  const selected = new Set<QuestionType>();

  for (const section of getExamPreset(type).sections) {
    for (const questionType of section.questionTypes) {
      selected.add(questionType);
    }
  }

  return Array.from(selected);
}

export function defaultQuestionsForExam(type: ExamType) {
  return getExamPreset(type).sections.reduce(
    (sum, section) => sum + section.defaultQuestions,
    0
  );
}

export function defaultMarksForExam(type: ExamType) {
  return getExamPreset(type).sections.reduce((sum, section) => sum + section.defaultMarks, 0);
}

export function officialQuestionsForExam(type: ExamType) {
  return getExamPreset(type).sections.reduce(
    (sum, section) => sum + section.officialQuestions,
    0
  );
}

export function officialTimeLimitSecondsForExam(type: ExamType) {
  return getExamPreset(type).sections.reduce(
    (sum, section) => sum + (section.timeLimitSeconds ?? 0),
    0
  );
}

export function sectionsForPreparationMode(
  type: ExamType,
  mode: PreparationMode
): ExamSection[] {
  const sections = getExamPreset(type).sections;

  if (mode === "WRITING_PRACTICE") {
    return sections.filter((section) => section.skill === "writing").map((section) => section.id);
  }

  if (mode === "SPEAKING_PRACTICE") {
    return sections.filter((section) => section.skill === "speaking").map((section) => section.id);
  }

  if (mode === "CEFR_GRAMMAR" || mode === "MIXED_GRAMMAR_VOCABULARY") {
    return type === "CEFR_PRACTICE" || type === "GENERAL"
      ? (["GENERAL_PRACTICE"] satisfies ExamSection[])
      : sections
          .filter((section) => section.skill === "practice" || section.skill === "structures")
          .map((section) => section.id);
  }

  return defaultSectionsForExam(type);
}
