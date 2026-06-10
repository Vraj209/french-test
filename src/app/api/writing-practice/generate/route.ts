import { generateWritingPracticePromptWithAI } from "@/lib/ai/openai";
import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { assertRateLimit } from "@/lib/rate-limit";
import {
  writingPracticeGenerationRequestSchema,
  type ExamSection,
  type QuestionType,
  type WritingPracticeSection
} from "@/lib/schemas";
import { writingPracticeSectionByType } from "@/features/writing-practice/config";

const PRACTICE_MARKS = 20;

function questionMetadata(section: WritingPracticeSection): {
  examSection: ExamSection;
  questionType: QuestionType;
} {
  if (section === "TEF_TASK_1") {
    return { examSection: "TEF_WRITING_A", questionType: "TOPIC_WRITING" };
  }

  if (section === "TEF_TASK_2") {
    return { examSection: "TEF_WRITING_B", questionType: "TOPIC_WRITING" };
  }

  if (section === "TOPIC_PARAGRAPH") {
    return { examSection: "GENERAL_PRACTICE", questionType: "TOPIC_WRITING" };
  }

  return { examSection: "GENERAL_PRACTICE", questionType: "SHORT_WRITING" };
}

export async function POST(request: Request) {
  try {
    const user = await requireUser().catch(() => null);

    if (!user) {
      return jsonError("Authentication required.", 401);
    }

    assertRateLimit({
      key: `ai:writing-practice-generate:${user.id}`,
      limit: 12,
      windowMs: 60_000
    });

    const input = writingPracticeGenerationRequestSchema.parse(await request.json());
    const generated = await generateWritingPracticePromptWithAI(input);
    const sectionConfig = writingPracticeSectionByType(input.section);
    const prompt = {
      ...generated,
      section: input.section,
      level: input.level,
      topic: generated.topic || input.topic || sectionConfig?.defaultTopic || "Writing"
    };
    const { examSection, questionType } = questionMetadata(input.section);

    const test = await prisma.test.create({
      data: {
        userId: user.id,
        title: prompt.title,
        level: input.level,
        examType: "TEF_CANADA",
        preparationMode: "WRITING_PRACTICE",
        examSections: [examSection],
        targetScoreLevel: "CLB_NCLC_TARGET",
        targetNclc: "NCLC practice",
        skillFocus: "WRITING",
        questionFocuses: [sectionConfig?.shortTitle ?? input.section],
        timeLimitSeconds: null,
        fullTest: false,
        totalMarks: PRACTICE_MARKS,
        difficulty: input.difficulty,
        questionTypes: [questionType],
        questionTypeCounts: { [questionType]: 1 },
        selectedGrammarTopics: [],
        selectedVocabularySections: [],
        numberOfQuestions: 1,
        questions: {
          create: {
            type: questionType,
            level: input.level,
            examType: "TEF_CANADA",
            examSection,
            skill: "WRITING",
            topic: prompt.topic,
            vocabularyTheme: prompt.topic,
            questionTypeFocus: input.section,
            question: prompt.prompt,
            instructions: prompt.instructions,
            options: [],
            marks: PRACTICE_MARKS,
            difficulty: input.difficulty,
            timeLimitSeconds: null,
            minWords: prompt.minWords,
            expectedAnswer: prompt.writingGoal,
            evaluationRule: prompt.evaluationCriteria.join("\n"),
            evaluationRubric: prompt.evaluationCriteria,
            hint: prompt.suggestedStructure.join(" "),
            position: 1
          }
        }
      },
      include: {
        questions: {
          orderBy: { position: "asc" }
        }
      }
    });

    const question = test.questions[0];

    return jsonOk(
      {
        testId: test.id,
        questionId: question.id,
        prompt
      },
      { status: 201 }
    );
  } catch (error) {
    return toApiError(error);
  }
}
