import type {
  CefrLevel,
  ExamSection,
  GeneratedQuestion,
  GeneratedTest,
  QuestionType,
  TestGenerationRequest
} from "@/lib/schemas";
import { getSectionsForExam } from "@/lib/exam-presets";

export function allocateMarks(totalMarks: number, numberOfQuestions: number): number[] {
  const base = Math.floor(totalMarks / numberOfQuestions);
  const remainder = totalMarks % numberOfQuestions;

  return Array.from({ length: numberOfQuestions }, (_, index) =>
    base + (index < remainder ? 1 : 0)
  );
}

function questionTypePlan(request: TestGenerationRequest): QuestionType[] {
  const countedTypes = request.questionTypes.flatMap((type) =>
    Array.from({ length: request.questionTypeCounts[type] ?? 0 }, () => type)
  );

  if (countedTypes.length > 0) {
    return countedTypes;
  }

  return Array.from({ length: request.numberOfQuestions }, (_, index) =>
    request.questionTypes[index % request.questionTypes.length]
  );
}

export function normalizeGeneratedTest(
  generated: GeneratedTest,
  request: TestGenerationRequest,
  options: { allowedQuestionLevels?: CefrLevel[] } = {}
): GeneratedTest {
  const typePlan = questionTypePlan(request);
  const requestedMarks = allocateMarks(request.totalMarks, typePlan.length);
  const fallbackQuestion = generated.questions[0];
  const sectionCycle =
    request.examSections.length > 0
      ? request.examSections
      : (["GENERAL_PRACTICE"] satisfies ExamSection[]);
  const selectedSectionPresets = getSectionsForExam(request.examType, request.examSections);
  const sectionOffsets: Partial<Record<QuestionType, number>> = {};
  const vocabularyThemeCycle =
    request.questionFocuses.length > 0 ? request.questionFocuses : ["Exam-style practice"];
  const allowedQuestionLevels = options.allowedQuestionLevels?.length
    ? options.allowedQuestionLevels
    : [request.level];
  const questions: GeneratedQuestion[] = requestedMarks.map((marks, index) => {
    const question = generated.questions[index] ?? fallbackQuestion;
    const questionType = typePlan[index];
    const compatibleSections = selectedSectionPresets
      .filter((section) => section.questionTypes.includes(questionType))
      .map((section) => section.id);
    const hasCompatibleSections = compatibleSections.length > 0;
    const sectionOptions = hasCompatibleSections ? compatibleSections : sectionCycle;
    const sectionOffset = hasCompatibleSections
      ? sectionOffsets[questionType] ?? 0
      : index;
    const fallbackSection = sectionOptions[sectionOffset % sectionOptions.length];
    const fallbackQuestionFocus =
      request.questionFocuses[index % Math.max(request.questionFocuses.length, 1)] ?? "";

    if (hasCompatibleSections) {
      sectionOffsets[questionType] = sectionOffset + 1;
    }

    return {
      ...question,
      type: questionType,
      level: allowedQuestionLevels.includes(question.level) ? question.level : request.level,
      examSection: sectionOptions.includes(question.examSection)
        ? question.examSection
        : fallbackSection,
      skill: question.skill || request.skillFocus,
      vocabularyTheme:
        question.vocabularyTheme || vocabularyThemeCycle[index % vocabularyThemeCycle.length],
      questionTypeFocus: question.questionTypeFocus || fallbackQuestionFocus,
      instructions: question.instructions || "",
      options: question.options || [],
      timeLimitSeconds: question.timeLimitSeconds ?? null,
      minWords: question.minWords ?? null,
      marks,
      evaluationRubric:
        question.evaluationRubric.length > 0
          ? question.evaluationRubric
          : [
              "Task completion",
              "Grammar accuracy",
              "Vocabulary precision",
              "CEFR appropriateness",
              "Exam strategy"
            ]
    };
  });

  return {
    title: generated.title || request.title,
    level: request.level,
    totalMarks: request.totalMarks,
    questions
  };
}
