import { normalizeGeneratedTest } from "@/lib/marks";
import { generateTestWithAI } from "@/lib/ai/openai";
import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import {
  cefrLevelSchema,
  questionTypeSchema,
  testGenerationRequestSchema,
  type QuestionType
} from "@/lib/schemas";
import { assertRateLimit } from "@/lib/rate-limit";
import { serializeTestForLearner } from "@/lib/tests/serialize";
import { getSectionsForExam } from "@/lib/exam-presets";

const legacyQuestionTypeMap: Record<string, QuestionType> = {
  translation: "TRANSLATION",
  fill_blank: "FILL_BLANK",
  fill_in_the_blanks: "FILL_BLANK",
  correct_incorrect: "CORRECT_INCORRECT",
  multiple_choice: "MULTIPLE_CHOICE",
  multiple_select: "MULTIPLE_SELECT",
  conjugation: "VERB_CONJUGATION",
  verb_conjugation: "VERB_CONJUGATION",
  transformation: "SENTENCE_TRANSFORMATION",
  sentence_transformation: "SENTENCE_TRANSFORMATION",
  writing: "TOPIC_WRITING",
  short_writing: "SHORT_WRITING",
  topic_writing: "TOPIC_WRITING",
  speaking: "SPEAKING_PREP",
  speaking_prep: "SPEAKING_PREP"
};

function textArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

async function normalizeGenerationPayload(raw: unknown) {
  if (typeof raw !== "object" || raw === null) {
    return raw;
  }

  const payload = raw as Record<string, unknown>;
  const level = cefrLevelSchema.parse(payload.level);
  const questionTypes = textArray(payload.questionTypes).map((type) => {
    const mapped = legacyQuestionTypeMap[type] ?? legacyQuestionTypeMap[type.toLowerCase()];
    return mapped ?? questionTypeSchema.parse(type);
  });
  const difficulty =
    typeof payload.difficulty === "string"
      ? payload.difficulty.toUpperCase()
      : payload.difficulty;
  let grammarTopicIds = textArray(payload.grammarTopicIds);
  let vocabularySectionIds = textArray(payload.vocabularySectionIds);

  if (grammarTopicIds.length === 0 && Array.isArray(payload.topics)) {
    const names = textArray(payload.topics).map((name) => name.toLowerCase());
    const topics = await prisma.grammarTopic.findMany({
      where: { levelCode: level }
    });
    grammarTopicIds = topics
      .filter((topic) => names.includes(topic.name.toLowerCase()))
      .map((topic) => topic.id);
  }

  if (vocabularySectionIds.length === 0 && Array.isArray(payload.vocabularySections)) {
    const names = textArray(payload.vocabularySections).map((name) => name.toLowerCase());
    const sections = await prisma.vocabularySection.findMany({
      where: { levelCode: level }
    });
    vocabularySectionIds = sections
      .filter(
        (section) =>
          names.includes(section.name.toLowerCase()) ||
          names.some((name) => section.name.toLowerCase().includes(name))
      )
      .map((section) => section.id);
  }

  return {
    ...payload,
    level,
    difficulty,
    questionTypes,
    grammarTopicIds,
    vocabularySectionIds
  };
}

export async function POST(request: Request) {
  try {
    const user = await requireUser().catch(() => null);

    if (!user) {
      return jsonError("Authentication required.", 401);
    }

    assertRateLimit({
      key: `ai:generate:${user.id}`,
      limit: 12,
      windowMs: 60_000
    });

    const input = testGenerationRequestSchema.parse(
      await normalizeGenerationPayload(await request.json())
    );

    const [topics, vocabularySections] = await Promise.all([
      prisma.grammarTopic.findMany({
        where:
          input.preparationMode === "CEFR_GRAMMAR"
            ? { id: { in: input.grammarTopicIds } }
            : {
                id: { in: input.grammarTopicIds },
                levelCode: input.level
              }
      }),
      prisma.vocabularySection.findMany({
        where: {
          id: { in: input.vocabularySectionIds },
          levelCode: input.level
        }
      })
    ]);

    if (topics.length !== input.grammarTopicIds.length) {
      return jsonError("One or more grammar topics are invalid for this test.", 422);
    }

    if (vocabularySections.length !== input.vocabularySectionIds.length) {
      return jsonError("One or more vocabulary sections are invalid for the selected level.", 422);
    }

    const generated = await generateTestWithAI({
      request: input,
      topics,
      vocabularySections
    });
    const topicLevels = Array.from(new Set(topics.map((topic) => topic.levelCode)));
    const normalized = normalizeGeneratedTest(generated, input, {
      allowedQuestionLevels:
        input.preparationMode === "CEFR_GRAMMAR" && topicLevels.length > 0
          ? topicLevels
          : [input.level]
    });

    const test = await prisma.test.create({
      data: {
        userId: user.id,
        title: normalized.title,
        level: input.level,
        examType: input.examType,
        preparationMode: input.preparationMode,
        examSections: input.examSections,
        targetScoreLevel: input.targetScoreLevel,
        targetNclc: input.targetNclc,
        skillFocus: input.skillFocus,
        questionFocuses: input.questionFocuses,
        timeLimitSeconds: input.timeLimitMinutes ? input.timeLimitMinutes * 60 : null,
        fullTest: input.fullTest || input.preparationMode === "FULL_MOCK_EXAM",
        totalMarks: input.totalMarks,
        difficulty: input.difficulty,
        questionTypes: input.questionTypes,
        questionTypeCounts: input.questionTypeCounts,
        selectedGrammarTopics: topics.map((topic) => ({
          id: topic.id,
          name: topic.name,
          levelCode: topic.levelCode
        })),
        selectedVocabularySections: vocabularySections.map((section) => ({
          id: section.id,
          name: section.name
        })),
        numberOfQuestions: normalized.questions.length,
        questions: {
          create: normalized.questions.map((question, index) => {
            const matchedTopic = topics.find(
              (topic) =>
                topic.name.toLowerCase() === question.topic.toLowerCase() ||
                question.topic.toLowerCase().includes(topic.name.toLowerCase())
            );

            return {
              type: question.type,
              level: question.level,
              examType: input.examType,
              examSection: question.examSection,
              skill: question.skill,
              topic: question.topic,
              vocabularyTheme: question.vocabularyTheme,
              questionTypeFocus: question.questionTypeFocus,
              question: question.question,
              instructions: question.instructions,
              options: question.options,
              marks: question.marks,
              difficulty: input.difficulty,
              timeLimitSeconds: question.timeLimitSeconds,
              minWords: question.minWords,
              expectedAnswer: question.expectedAnswer,
              evaluationRule: question.evaluationRule,
              evaluationRubric: question.evaluationRubric,
              hint: question.hint,
              position: index + 1,
              grammarTopicId: matchedTopic?.id
            };
          })
        }
      },
      include: {
        questions: {
          orderBy: { position: "asc" }
        }
      }
    });

    if (input.fullTest || input.preparationMode === "FULL_MOCK_EXAM") {
      const selectedSections = getSectionsForExam(input.examType, input.examSections);

      await prisma.mockExam.create({
        data: {
          userId: user.id,
          testId: test.id,
          title: `${normalized.title} mock exam`,
          examType: input.examType,
          level: input.level,
          targetNclc: input.targetNclc,
          totalMarks: input.totalMarks,
          timeLimitSeconds:
            input.timeLimitMinutes != null
              ? input.timeLimitMinutes * 60
              : selectedSections.reduce(
                  (sum, section) => sum + (section.timeLimitSeconds ?? 0),
                  0
                ),
          sections: {
            create: selectedSections.map((section) => ({
              examSection: section.id,
              skillFocus:
                section.skill === "reading"
                  ? "READING"
                  : section.skill === "listening"
                    ? "LISTENING"
                    : section.skill === "writing"
                      ? "WRITING"
                      : section.skill === "speaking"
                        ? "SPEAKING"
                        : "MIXED",
              questionCount: section.officialQuestions,
              marks: section.defaultMarks,
              timeLimitSeconds: section.timeLimitSeconds ?? 0
            }))
          }
        }
      });
    }

    return jsonOk({ test: serializeTestForLearner(test), testId: test.id }, { status: 201 });
  } catch (error) {
    return toApiError(error);
  }
}
