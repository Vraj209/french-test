import type { Difficulty, WritingPracticeSection } from "@/lib/schemas";

export type WritingPracticeSectionConfig = {
  slug: string;
  section: WritingPracticeSection;
  title: string;
  shortTitle: string;
  description: string;
  instructions: string;
  focusAreas: string[];
  topicLabel: string;
  topicOptions: string[];
  defaultTopic: string;
  textareaLabel: string;
  textareaPlaceholder: string;
};

export const writingPracticeLevels = ["A1", "A2", "B1", "B2"] as const;
export const writingPracticeDifficulties: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

const writingTopics = [
  "Education",
  "Work and career",
  "Technology",
  "Environment",
  "Transportation",
  "Health",
  "Immigration",
  "Social media",
  "Family",
  "Daily life"
];

export const writingPracticeSections: WritingPracticeSectionConfig[] = [
  {
    slug: "sentence-building",
    section: "SENTENCE_BUILDING",
    title: "Practice Sentence Building",
    shortTitle: "Sentence Building",
    description:
      "Build accurate French sentences with better structure, conjugation, connectors, and vocabulary.",
    instructions:
      "Write one to three French sentences. Focus on accuracy first, then revise for clarity and natural phrasing.",
    focusAreas: [
      "Sentence order",
      "Verb conjugation",
      "Agreement",
      "Connectors",
      "Vocabulary choice"
    ],
    topicLabel: "Practice focus",
    topicOptions: [
      "Daily routine",
      "Past experience",
      "Future plan",
      "Giving an opinion",
      "Cause and consequence",
      "Comparison"
    ],
    defaultTopic: "Giving an opinion",
    textareaLabel: "Your sentences",
    textareaPlaceholder: "Write your French sentences here."
  },
  {
    slug: "topic-paragraph",
    section: "TOPIC_PARAGRAPH",
    title: "Paragraph Building by Specific Topic",
    shortTitle: "Topic Paragraph",
    description:
      "Develop one clear body paragraph with an argument, example, connectors, and a closing idea.",
    instructions:
      "Write one body paragraph. Include a topic sentence, one argument, one example, connectors, and a short closing sentence.",
    focusAreas: [
      "Topic sentence",
      "Argument development",
      "Examples",
      "Connectors",
      "Paragraph unity"
    ],
    topicLabel: "Topic",
    topicOptions: writingTopics,
    defaultTopic: "Education",
    textareaLabel: "Your paragraph",
    textareaPlaceholder: "Write one developed French body paragraph here."
  },
  {
    slug: "tef-task-1",
    section: "TEF_TASK_1",
    title: "TEF Writing Task 1 Practice",
    shortTitle: "TEF Task 1",
    description:
      "Practice short practical writing: messages, emails, invitations, requests, complaints, and responses.",
    instructions:
      "Write a clear practical message. Complete the task, use the right tone, organize the information, and check grammar.",
    focusAreas: [
      "Task completion",
      "Tone",
      "Message structure",
      "Clarity",
      "Practical vocabulary"
    ],
    topicLabel: "Task type",
    topicOptions: [
      "Email",
      "Invitation",
      "Request",
      "Complaint",
      "Response",
      "Short message"
    ],
    defaultTopic: "Email",
    textareaLabel: "Your Task 1 answer",
    textareaPlaceholder: "Write your TEF Task 1 response here."
  },
  {
    slug: "tef-task-2",
    section: "TEF_TASK_2",
    title: "TEF Writing Task 2 Practice",
    shortTitle: "TEF Task 2",
    description:
      "Practice opinion writing with arguments, examples, concessions, connectors, and a stronger conclusion.",
    instructions:
      "Write an opinion response. State your position, develop arguments, add examples, use connectors, and finish with a conclusion.",
    focusAreas: [
      "Introduction",
      "Arguments",
      "Examples",
      "Concession",
      "Conclusion",
      "Connectors"
    ],
    topicLabel: "Opinion topic",
    topicOptions: writingTopics,
    defaultTopic: "Technology",
    textareaLabel: "Your Task 2 answer",
    textareaPlaceholder: "Write your TEF Task 2 opinion response here."
  }
];

export function writingPracticeSectionBySlug(slug: string) {
  return writingPracticeSections.find((section) => section.slug === slug) ?? null;
}

export function writingPracticeSectionByType(section: WritingPracticeSection) {
  return writingPracticeSections.find((item) => item.section === section) ?? null;
}
