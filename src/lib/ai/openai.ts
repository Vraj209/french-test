import OpenAI from "openai";
import {
  evaluationResultSchema,
  generatedTestSchema,
  ocrResultSchema,
  type AnswerSubmission,
  type EvaluationResult,
  type GeneratedTest,
  type OcrResult,
  type TestGenerationRequest
} from "@/lib/schemas";
import { getOpenAIConfig } from "@/lib/env";
import {
  evaluationJsonSchema,
  generatedTestJsonSchema,
  ocrJsonSchema
} from "@/lib/ai/json-schemas";
import { getExamPreset, getSectionsForExam } from "@/lib/exam-presets";
import { writingSpeakingEvaluationCriteria } from "@/lib/exam-catalog";

type CatalogTopic = {
  id: string;
  name: string;
  description: string | null;
  levelCode: string;
};

type CatalogVocabulary = {
  id: string;
  name: string;
  description: string | null;
  words: unknown;
  levelCode: string;
};

type EvaluationQuestion = {
  id: string;
  type: string;
  level: string;
  examSection: string;
  skill?: string;
  topic: string;
  vocabularyTheme?: string | null;
  questionTypeFocus?: string | null;
  question: string;
  instructions: string | null;
  options: unknown;
  marks: number;
  timeLimitSeconds: number | null;
  minWords: number | null;
  expectedAnswer: string;
  evaluationRule: string | null;
  evaluationRubric?: unknown;
};

function client() {
  const config = getOpenAIConfig();

  return {
    openai: new OpenAI({ apiKey: config.apiKey }),
    testModel: config.testModel,
    visionModel: config.visionModel
  };
}

function jsonTextFromResponse(response: { output_text?: string }) {
  if (!response.output_text) {
    throw new Error("OpenAI returned no structured JSON text.");
  }

  return response.output_text;
}

function responseFormat(name: string, schema: unknown) {
  return {
    format: {
      type: "json_schema",
      name,
      strict: true,
      schema: schema as Record<string, unknown>
    }
  } as const;
}

export async function generateTestWithAI({
  request,
  topics,
  vocabularySections
}: {
  request: TestGenerationRequest;
  topics: CatalogTopic[];
  vocabularySections: CatalogVocabulary[];
}): Promise<GeneratedTest> {
  const { openai, testModel } = client();
  const examPreset = getExamPreset(request.examType);
  const selectedSections = getSectionsForExam(request.examType, request.examSections);
  const selectedGrammarLevels = Array.from(new Set(topics.map((topic) => topic.levelCode)));
  const prompt = [
  "You are an expert French language assessment designer, CEFR examiner, TEF/TCF preparation coach, and professional exam item writer.",
  "Your task is to create a fully original French exam practice test that helps learners self-assess, identify weaknesses, and prepare for high performance on the real exam.",

  "",
  "CRITICAL OUTPUT RULES:",
  "Return only valid JSON matching the provided schema.",
  "Do not include markdown, comments, explanations outside JSON, or extra text.",
  "Do not add fields that are not allowed by the schema.",
  "Do not omit any required schema fields.",
  "All generated test content must be original.",
  "Do not copy, paraphrase, imitate, or adapt lessons, examples, questions, articles, dialogues, or answer keys from web pages, textbooks, official exams, or copyrighted sources.",
  "Use only the supplied CEFR-aligned catalog context, selected grammar topics, vocabulary themes, exam preset, section data, and evaluation criteria.",

  "",
  "REQUEST PARAMETERS:",
  `Requested title: ${request.title}`,
  `Exam type: ${examPreset.name}`,
  `Preparation mode: ${request.preparationMode}`,
  `Exam source alignment: ${examPreset.officialSource}`,
  `CEFR level: ${request.level}`,
  `Target score level: ${request.targetScoreLevel}`,
  `Target NCLC/CLB: ${request.targetNclc || examPreset.defaultTargetNclc}`,
  `Skill focus: ${request.skillFocus}`,
  `Difficulty: ${request.difficulty}`,
  `Total marks: ${request.totalMarks}`,
  `Number of questions: ${request.numberOfQuestions}`,
  `Time limit minutes: ${request.timeLimitMinutes ?? "custom/section-based"}`,
  `Full mock exam: ${request.fullTest || request.preparationMode === "FULL_MOCK_EXAM"}`,
  `Selected sections: ${JSON.stringify(selectedSections)}`,
  `Allowed question types: ${request.questionTypes.join(", ")}`,
  `Exact question type counts: ${JSON.stringify(request.questionTypeCounts)}`,
  `Detailed question focuses: ${JSON.stringify(request.questionFocuses)}`,
  `Selected grammar topic levels: ${selectedGrammarLevels.join(", ") || request.level}`,
  `Grammar topics: ${JSON.stringify(topics)}`,
  `Vocabulary sections: ${JSON.stringify(vocabularySections)}`,
  `Writing/speaking criteria to use when relevant: ${JSON.stringify(writingSpeakingEvaluationCriteria)}`,

  "",
  "LANGUAGE RULES:",
  "Learner-facing question content must be in natural, idiomatic French.",
  "The question field, reading passages, listening transcripts, answer options, writing prompts, and speaking prompts must be in French unless the schema explicitly requires English labels.",
  "The instructions field must always be written in clear, simple English.",
  "Use instructions to explain the task briefly in English, for example what the learner should write, choose, complete, or transform.",
  "Evaluation rules, rubrics, and hints may be written in clear English if they are intended for the teacher/app interface rather than the learner.",
  "French language should match the requested CEFR level while still feeling authentic and exam-like.",
  "Avoid unnatural textbook phrasing, overly simple isolated sentences, and random grammar drills.",

  "",
  "EXAM QUALITY REQUIREMENTS:",
  "Every question must be exam-style for the selected TEF/TCF/CEFR context.",
  "Every question must test communicative competence, not only memorized grammar.",
  "Use realistic contexts such as immigration, academic life, workplace communication, public services, daily life, society, environment, media, technology, housing, transport, health, education, and administration.",
  "Questions must progressively increase in difficulty when appropriate, especially in full mock exams.",
  "The difficulty must match the requested CEFR level, target score level, target NCLC/CLB, and selected difficulty.",
  "Do not make questions too easy for the requested level.",
  "Do not make questions unfairly difficult by using obscure vocabulary, trick wording, or multiple plausible answers.",
  "Avoid ambiguity. Each closed question must have a clearly defensible answer.",
  "Distractors must be plausible, level-appropriate, and based on common learner errors or realistic misunderstandings.",
  "Do not reveal the answer through wording patterns, option length, grammar mismatch, or obvious clues.",
  "Randomize correct answer positions across multiple-choice questions. Do not always use A or B.",
  "Balance grammar, vocabulary, comprehension, pragmatic meaning, register, connectors, and discourse structure according to the selected focus.",

  "",
  "REQUIRED QUESTION FIELDS:",
  "Each generated question must include all of the following fields:",
  "examSection",
  "skill",
  "topic",
  "vocabularyTheme",
  "questionTypeFocus",
  "instructions",
  "instructions must be a short English task description",
  "options",
  "marks",
  "timeLimitSeconds",
  "minWords",
  "expectedAnswer",
  "evaluationRule",
  "evaluationRubric",
  "hint",

  "",
  "COUNT AND MARKING RULES:",
  "Generate exactly the requested total number of questions.",
  "Generate exactly the requested number of questions for each question type in Exact question type counts.",
  "Do not merge, collapse, rename, or substitute question type categories.",
  "The sum of all question marks must equal Total marks exactly.",
  "If marks need to be distributed, allocate them according to difficulty and task complexity while preserving the exact total.",
  "Each question must have a clear scoring rule.",
  "For closed questions, expectedAnswer must contain the exact correct option label or labels.",
  "For open writing/speaking questions, expectedAnswer must describe the expected performance, required content, communicative goal, and sample answer characteristics rather than a single rigid answer.",

  "",
  "QUESTION TYPE RULES:",
  "For MULTIPLE_CHOICE questions, provide exactly four options.",
  "For MULTIPLE_CHOICE questions, expectedAnswer must contain exactly one correct option label.",
  "For MULTIPLE_SELECT questions, provide four or five options.",
  "For MULTIPLE_SELECT questions, expectedAnswer must list every correct option label separated by commas.",
  "For VERB_CONJUGATION questions, provide exactly four options containing conjugated verb forms or short verb phrases.",
  "For VERB_CONJUGATION questions, the question text must include one blank written as at least three underscores where the selected verb form belongs.",
  "For VERB_CONJUGATION questions, expectedAnswer must contain exactly one correct option label.",
  "For fill-in, transformation, short answer, ordering, matching, or grammar-in-context tasks, ensure there is a precise expected answer and a fair evaluation rule.",
  "For reading and listening practice, write exam-style MCQ prompts with options in the options array.",
  "For listening practice, simulate audio by placing a concise transcript or listening script inside the question text. Do not require an external audio file.",
  "For listening transcripts, use natural spoken French with realistic hesitation, register, and context where appropriate, but keep it understandable for the requested level.",
  "For reading passages, create realistic notices, emails, articles, messages, advertisements, administrative texts, forum posts, or opinion texts depending on the selected section and level.",

  "",
  "TEF WRITING RULES:",
  "For TEF writing section A, ask the learner to continue a news/article-style text.",
  "For TEF writing section A, enforce the required minimum word count.",
  "For TEF writing section A, evaluate continuation quality, coherence with the given beginning, narrative/article style, grammar, vocabulary, structure, and relevance.",
  "For TEF writing section B, ask for a justified opinion with argumentation.",
  "For TEF writing section B, require a clear position, structured arguments, examples, connectors, appropriate register, and conclusion.",

  "",
  "TEF SPEAKING RULES:",
  "For TEF speaking section A, ask the learner to prepare questions to obtain information in a realistic situation.",
  "For TEF speaking section A, evaluate relevance of questions, politeness, register, interaction strategy, grammar accuracy, vocabulary range, and pronunciation/fluency criteria where relevant.",
  "For TEF speaking section B, ask the learner to prepare an argument to convince someone.",
  "For TEF speaking section B, evaluate persuasive structure, argument quality, examples, counterargument handling, fluency, cohesion, register, grammar, and vocabulary precision.",

  "",
  "TCF WRITING RULES:",
  "For TCF writing, generate three task-style prompts when selected:",
  "Task 1: simple practical message.",
  "Task 2: experience, narrative, or description.",
  "Task 3: argued point of view.",
  "Ensure increasing complexity across the three tasks.",
  "Evaluation must consider task completion, clarity, organization, grammar, vocabulary, connectors, register, spelling, punctuation, and CEFR appropriateness.",

  "",
  "TCF SPEAKING RULES:",
  "For TCF speaking, generate interview, interaction, and point-of-view prompts when selected.",
  "Ensure prompts require spontaneous communication, not memorized monologues.",
  "Evaluate interaction, clarity, fluency, grammar accuracy, vocabulary range, pronunciation, register, coherence, and argument development.",

  "",
  "WRITING AND SPEAKING EVALUATION RULES:",
  "For every writing or speaking-prep question, the evaluationRubric must assess:",
  "task completion",
  "relevance",
  "grammar accuracy",
  "verb tense control",
  "agreement",
  "pronouns",
  "vocabulary range",
  "vocabulary precision",
  "sentence complexity",
  "structure",
  "connectors",
  "cohesion",
  "register",
  "spelling and punctuation where relevant",
  "fluency where relevant",
  "argument quality where relevant",
  "use of examples where relevant",
  "CEFR appropriateness",
  "estimated CLB/NCLC level",
  "The rubric must be practical enough for a learner to self-score.",
  "The rubric must explain what earns full marks, partial marks, and low marks.",
  "The hint must help the learner improve without giving away a full answer.",

  "STRICT LEVEL CEILING:",
  "B2+ means strong upper-intermediate French: more challenging than standard B2, but not C1.",
  "The test level must be B2+ maximum.",
  "Do not generate C1 or C2-level texts, grammar, vocabulary, idioms, argumentation, abstraction, or rubrics.",
  "The learner should be challenged at high B2 level, but the test must remain achievable for a strong B2 learner.",
  "If any requested level, grammar topic, vocabulary theme, target score, or question focus suggests C1/C2 difficulty, cap the generated content at B2+.",
  "Use authentic exam-style French, but avoid overly literary, academic, philosophical, highly abstract, or specialized professional language.",
  "Do not use rare idioms, obscure connectors, highly nuanced rhetorical structures, dense nominalization, or advanced C1/C2 discourse patterns.",
  "Texts should contain some complexity, inference, connectors, opinion, justification, and nuance, but remain clear and accessible at B2+.",
  "Writing and speaking prompts may require argumentation, examples, comparison, advantages/disadvantages, and justified opinions, but not C1-level sophistication.",
  "Evaluation rubrics must judge performance against B2+ expectations only, not C1/C2 expectations.",
  "Estimated CEFR level in rubrics must not exceed B2+.",
  "Estimated CLB/NCLC must remain aligned with B2+ and must not imply advanced C1/C2 proficiency.",

  "",
  "SELF-ASSESSMENT QUALITY:",
  "Each question should help the learner discover a specific weakness or skill gap.",
  "Use evaluationRule and evaluationRubric to explain how the answer is judged.",
  "For grammar-focused questions, connect the task to real communication.",
  "For vocabulary-focused questions, test meaning, register, collocation, and contextual appropriateness.",
  "For comprehension questions, test main idea, detail, inference, speaker intention, tone, purpose, and implied meaning when appropriate.",
  "For higher CEFR levels, include more inference, nuance, argumentation, implicit meaning, formal register, and complex discourse markers.",
  "For lower CEFR levels, keep the situation clear, concrete, and practical while still exam-like.",

  "",
  "FULL MOCK EXAM RULES:",
  "For full mock exams, use official-style timing from the provided exam preset and selected sections.",
  "For full mock exams, organize questions by exam section.",
  "For full mock exams, use progressive difficulty within each section where appropriate.",
  "For full mock exams, make instructions realistic and exam-like.",
  "For full mock exams, avoid mixing unrelated skills inside one question unless the exam section requires it.",
  "For full mock exams, ensure the final test feels like a coherent exam, not a random question bank.",

  "",
  "VALIDATION BEFORE FINAL JSON:",
  "Before returning the JSON, silently verify all of the following:",
  "1. The output is valid JSON.",
  "2. The output matches the schema exactly.",
  "3. The total number of questions is exactly correct.",
  "4. The exact question type counts are satisfied.",
  "5. The selected sections are respected.",
  "6. The sum of marks equals Total marks exactly.",
  "7. Every required question field is present.",
  "8. Every MULTIPLE_CHOICE question has exactly four options and one correct label.",
  "9. Every MULTIPLE_SELECT question has four or five options and all correct labels listed.",
  "10. Every listening question contains a transcript or listening script.",
  "11. Every writing and speaking question has a detailed, self-assessable rubric.",
  "12. No question is a random isolated grammar drill.",
  "13. No answer is ambiguous or contradicted by the question.",
  "14. The level, difficulty, topics, vocabulary themes, and exam section alignment are consistent.",
  "15. The test is original and not copied from any external source.",

  "",
  "Now generate the exam practice test as valid JSON only."
].join("\n");

  const response = await openai.responses.create({
    model: testModel,
    input: prompt,
    text: responseFormat("generated_french_test", generatedTestJsonSchema)
  });

  return generatedTestSchema.parse(JSON.parse(jsonTextFromResponse(response)));
}

export async function extractAnswerTextFromImage(imageUrl: string): Promise<OcrResult> {
  const { openai, visionModel } = client();

  const response = await openai.responses.create({
    model: visionModel,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Extract all readable French or English answer text from this handwritten or printed exam answer image. Preserve line breaks when useful. Return JSON only."
          },
          {
            type: "input_image",
            image_url: imageUrl,
            detail: "auto"
          }
        ]
      }
    ],
    text: responseFormat("answer_ocr", ocrJsonSchema)
  });

  return ocrResultSchema.parse(JSON.parse(jsonTextFromResponse(response)));
}

export async function evaluateAnswersWithAI({
  test,
  questions,
  submission
}: {
  test: {
    title: string;
    level: string;
    examType?: string;
    preparationMode?: string;
    examSections?: unknown;
    targetScoreLevel?: string;
    targetNclc?: string | null;
    skillFocus?: string;
    questionFocuses?: unknown;
    timeLimitSeconds?: number | null;
    fullTest?: boolean;
    totalMarks: number;
    difficulty: string;
  };
  questions: EvaluationQuestion[];
  submission: AnswerSubmission;
}): Promise<EvaluationResult> {
  const { openai, testModel } = client();
  const examName =
    test.examType === "TEF_CANADA"
      ? "TEF Canada"
      : test.examType === "GENERAL_TEF"
        ? "General TEF"
        : test.examType === "TCF_CANADA"
          ? "TCF Canada"
          : test.examType === "GENERAL_TCF"
            ? "General TCF"
            : "CEFR practice";
  const prompt = [
    `Evaluate this ${examName} French exam practice fairly and strictly according to the mark values.`,
    "Return only JSON matching the schema.",
    "Give simple English feedback. Include French explanation when it helps, otherwise use an empty string.",
    "For writing answers, evaluate grammar accuracy, vocabulary usage, sentence structure, tense usage, agreement, spelling, relevance, fluency, and CEFR appropriateness.",
    "For TEF/TCF writing and speaking-prep answers, also comment on task fulfillment, organization, register, argument quality, and likely NCLC/CLB readiness.",
    "For every answer, return score, maximum score, estimated level, corrected/model answer, explanation of mistakes, strong points, weak points, grammar topics to revise, vocabulary to learn, improved version, and one exam strategy tip.",
    "For reading/listening MCQ answers, keep the answer key hidden until this evaluation and explain why the chosen answer is right or wrong.",
    "If a learner leaves an answer blank or unanswered, award 0 marks and explain briefly what was missing.",
    "Report all scores as estimated practice scores only. Never claim they are official TEF, TCF, CLB, or NCLC scores.",
    "Identify the user's weakest grammar topics, missing vocabulary themes, common mistakes, recommended lessons, personalized next-test focus, and improvement strategy.",
    "Set nclcEstimate with fixed keys reading, listening, writing, speaking, and overall. Use \"not assessed\" for skills not present.",
    "Set examFeedback to concrete TEF/TCF exam-prep suggestions, not generic praise.",
    "Never award more than the maximum marks for a question.",
    `Test: ${JSON.stringify(test)}`,
    `Questions: ${JSON.stringify(questions)}`,
    `Learner answers: ${JSON.stringify(submission.answers)}`
  ].join("\n");

  const response = await openai.responses.create({
    model: testModel,
    input: prompt,
    text: responseFormat("french_exam_evaluation", evaluationJsonSchema)
  });

  return evaluationResultSchema.parse(JSON.parse(jsonTextFromResponse(response)));
}
