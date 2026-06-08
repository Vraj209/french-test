"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  Loader2,
  Minus,
  Plus,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/form";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import {
  difficultyLabels,
  examTypeLabels,
  preparationModeShortLabels,
  questionTypeLabels,
  skillFocusShortLabels,
  targetScoreLevelShortLabels,
  type CefrLevel,
  type Difficulty,
  type ExamSection,
  type ExamType,
  type PreparationMode,
  type QuestionType,
  type SkillFocus,
  type TargetScoreLevel
} from "@/lib/schemas";
import type { CatalogResponse, TestBuilderState } from "@/features/tests/types";
import { cn } from "@/lib/utils";
import {
  defaultMarksForExam,
  defaultQuestionsForExam,
  defaultSectionsForExam,
  getExamPreset,
  officialQuestionsForExam,
  officialTimeLimitSecondsForExam,
  sectionsForPreparationMode
} from "@/lib/exam-presets";
import {
  preparationModeLabels,
  questionFocusesForSkill,
  skillFocusLabels
} from "@/lib/exam-catalog";

const levels: CefrLevel[] = ["A1", "A2", "B1", "B2"];
const difficulties: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const examTypes: ExamType[] = ["CEFR_PRACTICE", "TEF_CANADA"];
const preparationModes: PreparationMode[] = [
  "CEFR_GRAMMAR",
  "FULL_MOCK_EXAM",
  "WRITING_PRACTICE",
  "SPEAKING_PRACTICE"
];
const skillFocuses = Object.keys(skillFocusShortLabels) as SkillFocus[];
const targetScoreLevels = Object.keys(targetScoreLevelShortLabels) as TargetScoreLevel[];
const questionTypes = Object.keys(questionTypeLabels) as QuestionType[];
const questionTypeDescriptions: Record<QuestionType, string> = {
  TRANSLATION: "Student writes the translation in French or English.",
  FILL_BLANK: "Student fills the missing word or phrase.",
  CORRECT_INCORRECT: "Student decides whether the statement is correct.",
  MULTIPLE_CHOICE: "Student picks one answer from several options.",
  MULTIPLE_SELECT: "Student picks more than one correct answer.",
  VERB_CONJUGATION: "Student writes the correct verb form.",
  SENTENCE_TRANSFORMATION: "Student rewrites the sentence without changing the meaning.",
  SHORT_WRITING: "Student writes a short guided response.",
  TOPIC_WRITING: "Student writes a longer paragraph or opinion response.",
  SPEAKING_PREP: "Student prepares what they would say aloud."
};
const duplicatedFocusLabels = new Set([
  "Fill in the blank",
  "Verb conjugation",
  "Sentence transformation"
]);

const grammarPassTargets: Record<
  Difficulty,
  { description: string; passPercent: number; targetScoreLevel: TargetScoreLevel }
> = {
  EASY: {
    description: "Pass target: 80%",
    passPercent: 80,
    targetScoreLevel: "BEGINNER"
  },
  MEDIUM: {
    description: "Pass target: 70%",
    passPercent: 70,
    targetScoreLevel: "INTERMEDIATE"
  },
  HARD: {
    description: "Pass target: 60%",
    passPercent: 60,
    targetScoreLevel: "ADVANCED"
  }
};

function grammarPassTargetLabel(difficulty: Difficulty) {
  return `Pass ${grammarPassTargets[difficulty].passPercent}%`;
}

function formatQuestionFocusLabel(focus: string) {
  return duplicatedFocusLabels.has(focus) ? `${focus} task` : focus;
}

function highestCefrLevel(selectedLevels: CefrLevel[], fallback: CefrLevel) {
  const highestIndex = selectedLevels.reduce(
    (maxIndex, level) => Math.max(maxIndex, levels.indexOf(level)),
    levels.indexOf(fallback)
  );

  return levels[Math.max(0, highestIndex)] ?? fallback;
}

const preparationModeOptions: Partial<
  Record<PreparationMode, { title: string; description: string }>
> = {
  CEFR_GRAMMAR: {
    title: "CEFR",
    description: "CEFR grammar practice"
  },
  FULL_MOCK_EXAM: {
    title: "TEF full mock",
    description: "Full TEF mock test"
  },
  WRITING_PRACTICE: {
    title: "Writing",
    description: "TEF writing practice"
  },
  SPEAKING_PRACTICE: {
    title: "Speaking",
    description: "TEF speaking practice"
  }
};

const examFocusOptions: Partial<Record<ExamType, { title: string; description: string }>> = {
  CEFR_PRACTICE: {
    title: "CEFR",
    description: "A1-B2 grammar, vocabulary, and structure practice."
  },
  TEF_CANADA: {
    title: "TEF",
    description: "TEF Canada reading, listening, writing, and speaking practice."
  }
};

const wizardSteps = [
  { id: "type", label: "Test type" },
  { id: "level", label: "Level" },
  { id: "topics", label: "Topics" },
  { id: "vocabulary", label: "Vocabulary" },
  { id: "questions", label: "Questions" },
  { id: "overview", label: "Overview" }
] as const;

type WizardStepId = (typeof wizardSteps)[number]["id"];

type TestBuilderProps = {
  initialPreparationMode?: PreparationMode;
  showPreparationModePicker?: boolean;
};

async function fetchCatalog(): Promise<CatalogResponse> {
  const response = await fetch("/api/catalog");

  if (!response.ok) {
    throw new Error("Unable to load CEFR catalog. Seed the database and try again.");
  }

  return response.json();
}

async function generateTest(input: TestBuilderState): Promise<{ test: { id: string } }> {
  const response = await fetch("/api/tests/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "Unable to generate test.");
  }

  return response.json();
}

function defaultTimeLimitMinutes(examType: ExamType) {
  const officialSeconds = officialTimeLimitSecondsForExam(examType);

  return officialSeconds > 0 ? Math.round(officialSeconds / 60) : 30;
}

function sumQuestionTypeCounts(counts: Partial<Record<QuestionType, number>>) {
  return Object.values(counts).reduce((sum, count) => sum + (count ?? 0), 0);
}

function positiveQuestionTypes(counts: Partial<Record<QuestionType, number>>) {
  return questionTypes.filter((type) => (counts[type] ?? 0) > 0);
}

function distributeMarks(totalMarks: number, numberOfQuestions: number) {
  if (numberOfQuestions <= 0) {
    return [];
  }

  const base = Math.floor(totalMarks / numberOfQuestions);
  const remainder = totalMarks % numberOfQuestions;

  return Array.from({ length: numberOfQuestions }, (_, index) =>
    base + (index < remainder ? 1 : 0)
  );
}

function clampedTotalMarks(totalMarks: number, numberOfQuestions: number) {
  return Math.min(100, Math.max(5, numberOfQuestions, Math.round(totalMarks || 0)));
}

function questionTypeMarkBreakdown(
  counts: Partial<Record<QuestionType, number>>,
  totalMarks: number
) {
  const typePlan = questionTypes.flatMap((type) =>
    Array.from({ length: counts[type] ?? 0 }, () => type)
  );
  const marks = distributeMarks(totalMarks, typePlan.length);
  const byType = new Map<
    QuestionType,
    { type: QuestionType; count: number; marks: number; perQuestionMarks: number[] }
  >();

  typePlan.forEach((type, index) => {
    const item =
      byType.get(type) ?? {
        type,
        count: 0,
        marks: 0,
        perQuestionMarks: []
      };
    const mark = marks[index] ?? 0;

    item.count += 1;
    item.marks += mark;
    item.perQuestionMarks.push(mark);
    byType.set(type, item);
  });

  return Array.from(byType.values());
}

function formatMarkPattern(marks: number[]) {
  const uniqueMarks = Array.from(new Set(marks));

  if (uniqueMarks.length === 0) {
    return "0";
  }

  if (uniqueMarks.length === 1) {
    return `${uniqueMarks[0]} each`;
  }

  return marks.join("/");
}

function titleForGrammarTopics(level: CefrLevel, topicNames: string[]) {
  if (topicNames.length === 0) {
    return `${level} CEFR Grammar Practice`;
  }

  if (topicNames.length === 1) {
    return `${level} ${topicNames[0]} Practice`;
  }

  return `${level} ${topicNames[0]} + ${topicNames.length - 1} more Grammar Practice`;
}

function questionTypeCountsForSections(
  examType: ExamType,
  sectionIds: ExamSection[],
  fullTest: boolean
) {
  const selectedSections = getExamPreset(examType).sections.filter((section) =>
    sectionIds.includes(section.id)
  );
  const counts: Partial<Record<QuestionType, number>> = {};

  for (const section of selectedSections) {
    const count = fullTest ? section.officialQuestions : section.defaultQuestions;
    const perTypeCount = Math.max(1, Math.round(count / section.questionTypes.length));

    for (const questionType of section.questionTypes) {
      counts[questionType] = (counts[questionType] ?? 0) + perTypeCount;
    }
  }

  return counts;
}

function examTypeForPreparationMode(preparationMode: PreparationMode): ExamType {
  if (preparationMode === "CEFR_GRAMMAR" || preparationMode === "MIXED_GRAMMAR_VOCABULARY") {
    return "CEFR_PRACTICE";
  }

  if (preparationMode === "TCF_CANADA_PRACTICE") {
    return "TCF_CANADA";
  }

  return "TEF_CANADA";
}

function skillFocusForPreparationMode(preparationMode: PreparationMode): SkillFocus {
  if (preparationMode === "CEFR_GRAMMAR") {
    return "GRAMMAR";
  }

  if (preparationMode === "WRITING_PRACTICE") {
    return "WRITING";
  }

  if (preparationMode === "SPEAKING_PRACTICE") {
    return "SPEAKING";
  }

  if (preparationMode === "MIXED_GRAMMAR_VOCABULARY") {
    return "MIXED";
  }

  return "MIXED";
}

function titleForPreparationMode(examType: ExamType, preparationMode: PreparationMode) {
  const preset = getExamPreset(examType);

  if (preparationMode === "FULL_MOCK_EXAM") {
    return `${preset.name} Full Mock Exam`;
  }

  if (preparationMode === "CEFR_GRAMMAR") {
    return `${preset.defaultLevel} CEFR Grammar Practice`;
  }

  return `${preset.name} ${preparationModeShortLabels[preparationMode]}`;
}

function initialBuilderState(preparationMode: PreparationMode): TestBuilderState {
  const examType = examTypeForPreparationMode(preparationMode);
  const preset = getExamPreset(examType);
  const skillFocus = skillFocusForPreparationMode(preparationMode);
  const fullTest = preparationMode === "FULL_MOCK_EXAM";
  const examSections = sectionsForPreparationMode(examType, preparationMode);
  const selectedExamSections =
    examSections.length > 0 ? examSections : defaultSectionsForExam(examType);
  const questionTypeCounts = questionTypeCountsForSections(
    examType,
    selectedExamSections,
    fullTest
  );
  const numberOfQuestions = sumQuestionTypeCounts(questionTypeCounts);

  return {
    title: titleForPreparationMode(examType, preparationMode),
    level: preset.defaultLevel,
    examType,
    preparationMode,
    examSections: selectedExamSections,
    targetScoreLevel:
      preparationMode === "CEFR_GRAMMAR"
        ? grammarPassTargets.MEDIUM.targetScoreLevel
        : "CLB_NCLC_TARGET",
    targetNclc:
      preparationMode === "CEFR_GRAMMAR"
        ? grammarPassTargetLabel("MEDIUM")
        : preset.defaultTargetNclc,
    skillFocus,
    grammarTopicIds: [],
    vocabularySectionIds: [],
    questionTypes: positiveQuestionTypes(questionTypeCounts),
    questionTypeCounts,
    questionFocuses: [],
    totalMarks: fullTest ? officialQuestionsForExam(examType) : defaultMarksForExam(examType),
    difficulty: "MEDIUM",
    numberOfQuestions: numberOfQuestions || defaultQuestionsForExam(examType),
    timeLimitMinutes: defaultTimeLimitMinutes(examType),
    fullTest
  };
}

export function TestBuilder({
  initialPreparationMode = "CEFR_GRAMMAR",
  showPreparationModePicker = true
}: TestBuilderProps) {
  const router = useRouter();
  const catalogQuery = useQuery({
    queryKey: ["catalog"],
    queryFn: fetchCatalog
  });
  const [state, setState] = useState<TestBuilderState>(() =>
    initialBuilderState(initialPreparationMode)
  );
  const [currentStepId, setCurrentStepId] = useState<WizardStepId>("type");
  const [topicSearchQuery, setTopicSearchQuery] = useState("");
  const examPreset = getExamPreset(state.examType);
  const selectedSectionPresets = examPreset.sections.filter((section) =>
    state.examSections.includes(section.id)
  );
  const questionFocusOptions = questionFocusesForSkill(state.skillFocus);
  const isGrammarTopicFirstMode = state.preparationMode === "CEFR_GRAMMAR";
  const shouldAskGrammarTopics = isGrammarTopicFirstMode;
  const activeWizardSteps = useMemo(
    () =>
      shouldAskGrammarTopics
        ? wizardSteps
        : wizardSteps.filter((step) => step.id !== "topics"),
    [shouldAskGrammarTopics]
  );
  const catalogLevels = useMemo(() => catalogQuery.data?.levels ?? [], [catalogQuery.data?.levels]);
  const allGrammarTopics = useMemo(
    () => catalogLevels.flatMap((level) => level.grammarTopics),
    [catalogLevels]
  );
  const currentLevel = useMemo(
    () => catalogLevels.find((level) => level.code === state.level),
    [catalogLevels, state.level]
  );
  const selectedGrammarTopicIds = useMemo(
    () => {
      if (isGrammarTopicFirstMode) {
        return state.grammarTopicIds;
      }

      return currentLevel?.grammarTopics.slice(0, 3).map((topic) => topic.id) ?? [];
    },
    [currentLevel?.grammarTopics, isGrammarTopicFirstMode, state.grammarTopicIds]
  );
  const selectedGrammarTopics = useMemo(
    () => allGrammarTopics.filter((topic) => selectedGrammarTopicIds.includes(topic.id)),
    [allGrammarTopics, selectedGrammarTopicIds]
  );
  const selectedGrammarTopicIdSet = useMemo(
    () => new Set(selectedGrammarTopicIds),
    [selectedGrammarTopicIds]
  );
  const selectedGrammarTopicLevels = useMemo(
    () => Array.from(new Set(selectedGrammarTopics.map((topic) => topic.levelCode))),
    [selectedGrammarTopics]
  );
  const normalizedTopicSearchQuery = topicSearchQuery.trim().toLowerCase();
  const filteredCatalogLevels = useMemo(() => {
    if (!normalizedTopicSearchQuery) {
      return catalogLevels;
    }

    return catalogLevels
      .map((level) => ({
        ...level,
        grammarTopics: level.grammarTopics.filter((topic) =>
          [
            level.code,
            level.name,
            topic.name,
            topic.description ?? ""
          ].some((value) => value.toLowerCase().includes(normalizedTopicSearchQuery))
        )
      }))
      .filter((level) => level.grammarTopics.length > 0);
  }, [catalogLevels, normalizedTopicSearchQuery]);
  const filteredCurrentLevelGrammarTopics = useMemo(() => {
    if (!currentLevel) {
      return [];
    }

    if (!normalizedTopicSearchQuery) {
      return currentLevel.grammarTopics;
    }

    return currentLevel.grammarTopics.filter((topic) =>
      [
        currentLevel.code,
        currentLevel.name,
        topic.name,
        topic.description ?? ""
      ].some((value) => value.toLowerCase().includes(normalizedTopicSearchQuery))
    );
  }, [currentLevel, normalizedTopicSearchQuery]);
  const visibleGrammarTopicCount = isGrammarTopicFirstMode
    ? filteredCatalogLevels.reduce((total, level) => total + level.grammarTopics.length, 0)
    : filteredCurrentLevelGrammarTopics.length;
  const selectedVocabularySectionIds =
    state.vocabularySectionIds.length > 0
      ? state.vocabularySectionIds
      : currentLevel?.vocabularySections.slice(0, 1).map((section) => section.id) ?? [];
  const allVocabularySectionIds = useMemo(
    () => currentLevel?.vocabularySections.map((section) => section.id) ?? [],
    [currentLevel?.vocabularySections]
  );
  const allVocabularySectionsSelected =
    allVocabularySectionIds.length > 0 &&
    allVocabularySectionIds.every((id) => selectedVocabularySectionIds.includes(id));
  const builderHeading = showPreparationModePicker
    ? "Create a practice test"
    : `Build ${
        preparationModeOptions[state.preparationMode]?.title.toLowerCase() ??
        preparationModeShortLabels[state.preparationMode].toLowerCase()
      }`;
  const builderDescription = showPreparationModePicker
    ? "Move through the setup, confirm the section and answer-format breakdown, then generate an original TEF/TCF-style practice test."
    : "Adjust this focused practice setup, confirm the section and answer-format breakdown, then generate the test.";
  const questionTypeBreakdown = questionTypeMarkBreakdown(
    state.questionTypeCounts,
    state.totalMarks
  );
  const activeStepId = activeWizardSteps.some((step) => step.id === currentStepId)
    ? currentStepId
    : "vocabulary";
  const currentStepIndex = Math.max(
    0,
    activeWizardSteps.findIndex((step) => step.id === activeStepId)
  );

  const generationMutation = useMutation({
    mutationFn: generateTest,
    onSuccess: ({ test }) => {
      router.push(`/tests/${test.id}`);
      router.refresh();
    }
  });

  function changeExamType(examType: ExamType) {
    setState((value) => {
      const preset = getExamPreset(examType);
      const nextPreparationMode =
        examType === "CEFR_PRACTICE"
          ? "CEFR_GRAMMAR"
          : value.preparationMode === "WRITING_PRACTICE" ||
              value.preparationMode === "SPEAKING_PRACTICE" ||
              value.preparationMode === "FULL_MOCK_EXAM"
            ? value.preparationMode
            : "FULL_MOCK_EXAM";
      const fullTest = nextPreparationMode === "FULL_MOCK_EXAM";
      const nextSections = sectionsForPreparationMode(examType, nextPreparationMode);
      const selectedExamSections =
        nextSections.length > 0 ? nextSections : defaultSectionsForExam(examType);
      const questionTypeCounts = questionTypeCountsForSections(
        examType,
        selectedExamSections,
        fullTest
      );
      const numberOfQuestions = sumQuestionTypeCounts(questionTypeCounts);
      const totalMarks = fullTest
        ? officialQuestionsForExam(examType)
        : defaultMarksForExam(examType);
      const nextSkillFocus = skillFocusForPreparationMode(nextPreparationMode);

      return {
        ...value,
        examType,
        level: preset.defaultLevel,
        title: titleForPreparationMode(examType, nextPreparationMode),
        preparationMode: nextPreparationMode,
        examSections: selectedExamSections,
        targetScoreLevel:
          nextPreparationMode === "CEFR_GRAMMAR"
            ? grammarPassTargets[value.difficulty].targetScoreLevel
            : "CLB_NCLC_TARGET",
        targetNclc:
          nextPreparationMode === "CEFR_GRAMMAR"
            ? grammarPassTargetLabel(value.difficulty)
            : preset.defaultTargetNclc,
        skillFocus: nextSkillFocus,
        questionTypes: positiveQuestionTypes(questionTypeCounts),
        questionTypeCounts,
        questionFocuses: [],
        totalMarks: clampedTotalMarks(totalMarks, numberOfQuestions),
        numberOfQuestions: numberOfQuestions || defaultQuestionsForExam(examType),
        timeLimitMinutes: defaultTimeLimitMinutes(examType),
        fullTest,
        grammarTopicIds: [],
        vocabularySectionIds: []
      };
    });
  }

  function changePreparationMode(preparationMode: PreparationMode) {
    setState((value) => {
      const nextExamType =
        preparationMode === "CEFR_GRAMMAR" ? "CEFR_PRACTICE" : "TEF_CANADA";
      const preset = getExamPreset(nextExamType);
      const nextSections = sectionsForPreparationMode(nextExamType, preparationMode);
      const fullTest = preparationMode === "FULL_MOCK_EXAM";
      const selectedExamSections =
        nextSections.length > 0 ? nextSections : defaultSectionsForExam(nextExamType);
      const questionTypeCounts = questionTypeCountsForSections(
        nextExamType,
        selectedExamSections,
        fullTest
      );
      const numberOfQuestions = sumQuestionTypeCounts(questionTypeCounts);
      const nextSkillFocus =
        preparationMode === "WRITING_PRACTICE"
          ? "WRITING"
          : preparationMode === "SPEAKING_PRACTICE"
            ? "SPEAKING"
            : preparationMode === "CEFR_GRAMMAR"
              ? "GRAMMAR"
              : value.skillFocus;
      const totalMarks = fullTest
        ? officialQuestionsForExam(nextExamType)
        : defaultMarksForExam(nextExamType);
      const resetForGrammarTopicMode = preparationMode === "CEFR_GRAMMAR";

      return {
        ...value,
        examType: nextExamType,
        preparationMode,
        level:
          resetForGrammarTopicMode || value.examType === "CEFR_PRACTICE"
            ? preset.defaultLevel
            : value.level,
        targetScoreLevel: resetForGrammarTopicMode
          ? grammarPassTargets[value.difficulty].targetScoreLevel
          : value.examType === "CEFR_PRACTICE"
            ? "CLB_NCLC_TARGET"
            : value.targetScoreLevel,
        targetNclc:
          resetForGrammarTopicMode
            ? grammarPassTargetLabel(value.difficulty)
            : value.examType === "CEFR_PRACTICE"
              ? preset.defaultTargetNclc
            : value.targetNclc,
        skillFocus: nextSkillFocus,
        title: fullTest
          ? `${preset.name} Full Mock Exam`
          : preparationMode === "CEFR_GRAMMAR"
            ? titleForGrammarTopics(preset.defaultLevel, [])
            : `${preset.name} ${preparationModeShortLabels[preparationMode]}`,
        examSections: selectedExamSections,
        questionTypes: positiveQuestionTypes(questionTypeCounts),
        questionTypeCounts,
        questionFocuses: [],
        grammarTopicIds: [],
        vocabularySectionIds: [],
        totalMarks: clampedTotalMarks(totalMarks, numberOfQuestions),
        numberOfQuestions: numberOfQuestions || defaultQuestionsForExam(nextExamType),
        timeLimitMinutes: defaultTimeLimitMinutes(nextExamType),
        fullTest
      };
    });
  }

  function changeDifficulty(difficulty: Difficulty) {
    setState((value) => ({
      ...value,
      difficulty,
      targetScoreLevel:
        value.preparationMode === "CEFR_GRAMMAR"
          ? grammarPassTargets[difficulty].targetScoreLevel
          : value.targetScoreLevel,
      targetNclc:
        value.preparationMode === "CEFR_GRAMMAR"
          ? grammarPassTargetLabel(difficulty)
          : value.targetNclc
    }));
  }

  function changeSkillFocus(skillFocus: SkillFocus) {
    setState((value) => ({
      ...value,
      skillFocus,
      questionFocuses: []
    }));
  }

  function changeLevel(level: CefrLevel) {
    const levelCatalog = catalogQuery.data?.levels.find((item) => item.code === level);

    setState((value) => ({
      ...value,
      level,
      title:
        value.examType === "GENERAL"
          ? `${level} Grammar Exam`
          : `${examTypeLabels[value.examType]} ${value.targetNclc || ""} Practice`.trim(),
      grammarTopicIds: levelCatalog?.grammarTopics.slice(0, 3).map((topic) => topic.id) ?? [],
      vocabularySectionIds:
        levelCatalog?.vocabularySections.slice(0, 1).map((section) => section.id) ?? []
    }));
  }

  function toggleGrammarTopic(topicId: string) {
    const topic = allGrammarTopics.find((item) => item.id === topicId);

    setState((value) => {
      if (!topic) {
        return value;
      }

      const selected = new Set(value.grammarTopicIds);

      if (selected.has(topicId)) {
        selected.delete(topicId);
      } else {
        selected.add(topicId);
      }

      return nextStateForGrammarTopicSelection(value, Array.from(selected));
    });
  }

  function nextStateForGrammarTopicSelection(
    value: TestBuilderState,
    nextTopicIds: string[]
  ) {
    if (!isGrammarTopicFirstMode) {
      return { ...value, grammarTopicIds: nextTopicIds };
    }

    const nextTopics = allGrammarTopics.filter((item) => nextTopicIds.includes(item.id));
    const nextLevel = highestCefrLevel(
      nextTopics.map((item) => item.levelCode),
      value.level
    );
    const nextLevelCatalog = catalogLevels.find((level) => level.code === nextLevel);
    const nextTopicNames = nextTopics.map((item) => item.name);

    return {
      ...value,
      level: nextLevel,
      title: titleForGrammarTopics(nextLevel, nextTopicNames),
      grammarTopicIds: nextTopicIds,
      vocabularySectionIds:
        nextLevel === value.level
          ? value.vocabularySectionIds
          : nextLevelCatalog?.vocabularySections.slice(0, 1).map((section) => section.id) ?? []
    };
  }

  function toggleGrammarLevelTopics(levelCode: CefrLevel) {
    const levelCatalog = catalogLevels.find((level) => level.code === levelCode);

    setState((value) => {
      if (!levelCatalog) {
        return value;
      }

      const selected = new Set(value.grammarTopicIds);
      const levelTopicIds = levelCatalog.grammarTopics.map((topic) => topic.id);
      const areAllLevelTopicsSelected =
        levelTopicIds.length > 0 && levelTopicIds.every((topicId) => selected.has(topicId));

      if (areAllLevelTopicsSelected) {
        for (const topicId of levelTopicIds) {
          selected.delete(topicId);
        }
      } else {
        for (const topicId of levelTopicIds) {
          selected.add(topicId);
        }
      }

      return nextStateForGrammarTopicSelection(value, Array.from(selected));
    });
  }

  function toggleExamSection(section: ExamSection) {
    setState((value) => {
      const selected = new Set(value.examSections);

      if (selected.has(section)) {
        selected.delete(section);
      } else {
        selected.add(section);
      }

      const examSections = Array.from(selected) as ExamSection[];
      const selectedPresets = getExamPreset(value.examType).sections.filter((item) =>
        examSections.includes(item.id)
      );
      const questionTypesFromSections = new Set<QuestionType>();

      for (const preset of selectedPresets) {
        for (const questionType of preset.questionTypes) {
          questionTypesFromSections.add(questionType);
        }
      }
      const questionTypeCounts = questionTypeCountsForSections(
        value.examType,
        examSections,
        value.fullTest
      );
      const numberOfQuestions = sumQuestionTypeCounts(questionTypeCounts);
      const totalMarks =
        selectedPresets.length > 0
          ? selectedPresets.reduce((total, item) => total + item.defaultMarks, 0)
          : value.totalMarks;

      return {
        ...value,
        examSections,
        questionTypes:
          questionTypesFromSections.size > 0
            ? Array.from(questionTypesFromSections)
            : value.questionTypes,
        questionTypeCounts,
        totalMarks: clampedTotalMarks(totalMarks, numberOfQuestions),
        numberOfQuestions: numberOfQuestions || value.numberOfQuestions
      };
    });
  }

  function toggleValue(key: "grammarTopicIds" | "vocabularySectionIds", id: string) {
    setState((value) => {
      const selected = new Set(value[key]);

      if (selected.has(id)) {
        selected.delete(id);
      } else {
        selected.add(id);
      }

      return { ...value, [key]: Array.from(selected) };
    });
  }

  function toggleQuestionType(type: QuestionType) {
    setState((value) => {
      const selected = new Set(value.questionTypes);
      const questionTypeCounts = { ...value.questionTypeCounts };

      if (selected.has(type)) {
        selected.delete(type);
        questionTypeCounts[type] = 0;
      } else {
        selected.add(type);
        questionTypeCounts[type] = questionTypeCounts[type] && questionTypeCounts[type] > 0
          ? questionTypeCounts[type]
          : 1;
      }
      const numberOfQuestions = sumQuestionTypeCounts(questionTypeCounts);

      return {
        ...value,
        questionTypes: Array.from(selected) as QuestionType[],
        questionTypeCounts,
        totalMarks: clampedTotalMarks(value.totalMarks, numberOfQuestions),
        numberOfQuestions
      };
    });
  }

  function changeQuestionTypeCount(type: QuestionType, count: number) {
    const normalizedCount = Math.max(0, Math.min(100, Number.isFinite(count) ? count : 0));

    setState((value) => {
      const questionTypeCounts = {
        ...value.questionTypeCounts,
        [type]: normalizedCount
      };
      const nextQuestionTypes = positiveQuestionTypes(questionTypeCounts);
      const numberOfQuestions = sumQuestionTypeCounts(questionTypeCounts);

      return {
        ...value,
        questionTypeCounts,
        questionTypes: nextQuestionTypes,
        totalMarks: clampedTotalMarks(value.totalMarks, numberOfQuestions),
        numberOfQuestions
      };
    });
  }

  function toggleQuestionFocus(focus: string) {
    setState((value) => {
      const selected = new Set(value.questionFocuses);

      if (selected.has(focus)) {
        selected.delete(focus);
      } else {
        selected.add(focus);
      }

      return { ...value, questionFocuses: Array.from(selected) };
    });
  }

  function isStepComplete(stepId: WizardStepId) {
    if (stepId === "type") {
      return state.title.trim().length >= 3 && state.examSections.length > 0;
    }

    if (stepId === "level") {
      return Boolean(state.level && state.skillFocus && state.targetScoreLevel);
    }

    if (stepId === "topics") {
      return selectedGrammarTopicIds.length > 0;
    }

    if (stepId === "vocabulary") {
      return selectedVocabularySectionIds.length > 0;
    }

    if (stepId === "questions") {
      return (
        state.questionTypes.length > 0 &&
        state.totalMarks >= state.numberOfQuestions &&
        state.totalMarks <= 100 &&
        state.numberOfQuestions >= 1 &&
        state.numberOfQuestions <= 100 &&
        (state.timeLimitMinutes ?? 0) >= 1
      );
    }

    return true;
  }

  function canEnterStep(index: number) {
    return activeWizardSteps.slice(0, index).every((step) => isStepComplete(step.id));
  }

  function goToStep(stepId: WizardStepId) {
    const nextIndex = activeWizardSteps.findIndex((step) => step.id === stepId);

    if (nextIndex >= 0 && canEnterStep(nextIndex)) {
      setCurrentStepId(stepId);
    }
  }

  function goToNextStep() {
    const nextStep = activeWizardSteps[currentStepIndex + 1];

    if (nextStep && isStepComplete(activeStepId)) {
      setCurrentStepId(nextStep.id);
    }
  }

  function goToPreviousStep() {
    const previousStep = activeWizardSteps[currentStepIndex - 1];

    if (previousStep) {
      setCurrentStepId(previousStep.id);
    }
  }

  const canSubmit =
    selectedGrammarTopicIds.length > 0 &&
    selectedVocabularySectionIds.length > 0 &&
    state.examSections.length > 0 &&
    state.questionTypes.length > 0 &&
    state.numberOfQuestions <= 100 &&
    state.totalMarks >= state.numberOfQuestions &&
    activeWizardSteps.every((step) => isStepComplete(step.id));

  return (
    <div className="space-y-6">
      <Panel>
        <PanelHeader>
          <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
            TEF/TCF test generator
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink-950">
            {builderHeading}
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            {builderDescription}
          </p>
        </PanelHeader>
        <PanelBody>
          {catalogQuery.isLoading ? (
            <div className="flex min-h-96 items-center justify-center text-sm text-ink-600">
              <Loader2 className="mr-2 animate-spin" size={18} aria-hidden="true" />
              Loading CEFR catalog...
            </div>
          ) : catalogQuery.isError ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {catalogQuery.error.message}
            </div>
          ) : (
            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                generationMutation.mutate({
                  ...state,
                  grammarTopicIds: selectedGrammarTopicIds,
                  vocabularySectionIds: selectedVocabularySectionIds,
                  questionFocuses: state.questionFocuses
                });
              }}
            >
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                {activeWizardSteps.map((step, index) => {
                  const isActive = activeStepId === step.id;
                  const isComplete = isStepComplete(step.id);
                  const isAvailable = canEnterStep(index);
                  const stepLabel =
                    step.id === "level" && isGrammarTopicFirstMode
                      ? "Target"
                      : step.id === "topics" && isGrammarTopicFirstMode
                        ? "Grammar"
                        : step.label;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => goToStep(step.id)}
                      disabled={!isAvailable}
                      className={cn(
                        "flex min-h-14 items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50",
                        isActive
                          ? "border-exam-700 bg-exam-700 text-white"
                          : "border-exam-100 bg-white text-ink-800 hover:bg-exam-50"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                          isActive ? "bg-white text-exam-700" : "bg-exam-50 text-exam-700"
                        )}
                      >
                        {isComplete && !isActive ? (
                          <CheckCircle2 size={15} aria-hidden="true" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="font-semibold">{stepLabel}</span>
                    </button>
                  );
                })}
              </div>

              {activeStepId === "type" ? (
                <div className="space-y-6">
              {showPreparationModePicker ? (
                <fieldset>
                  <legend className="text-sm font-semibold text-ink-800">
                    Preparation mode
                  </legend>
                  <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                    {preparationModes.map((mode) => (
                      (() => {
                        const option = preparationModeOptions[mode] ?? {
                          title: preparationModeShortLabels[mode],
                          description: preparationModeLabels[mode]
                        };

                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => changePreparationMode(mode)}
                            className={cn(
                              "rounded-md border p-3 text-left text-sm transition",
                              state.preparationMode === mode
                                ? "border-exam-700 bg-exam-700 text-white"
                                : "border-exam-100 bg-white text-ink-800 hover:bg-exam-50"
                            )}
                          >
                            <span className="block font-bold">{option.title}</span>
                            <span
                              className={cn(
                                "mt-1 block text-xs leading-5",
                                state.preparationMode === mode ? "text-white/80" : "text-ink-600"
                              )}
                            >
                              {option.description}
                            </span>
                          </button>
                        );
                      })()
                    ))}
                  </div>
                </fieldset>
              ) : (
                <div className="flex flex-col gap-3 rounded-md border border-exam-100 bg-exam-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                      Selected mode
                    </p>
                    <p className="mt-1 text-sm font-bold text-ink-950">
                      {preparationModeOptions[state.preparationMode]?.description ??
                        preparationModeLabels[state.preparationMode]}
                    </p>
                  </div>
                  <Link
                    href="/tests/create"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-exam-100 bg-white px-4 text-sm font-semibold text-ink-800 hover:bg-white/70"
                  >
                    Change mode
                  </Link>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>Exam focus</Label>
                  <div className="mt-2 grid gap-2 md:grid-cols-3">
                    {examTypes.map((examType) => (
                      (() => {
                        const option = examFocusOptions[examType] ?? {
                          title: examTypeLabels[examType],
                          description: getExamPreset(examType).description
                        };

                        return (
                          <button
                            key={examType}
                            type="button"
                            onClick={() => changeExamType(examType)}
                            className={cn(
                              "rounded-md border p-3 text-left text-sm transition",
                              state.examType === examType
                                ? "border-exam-700 bg-exam-700 text-white"
                                : "border-exam-100 bg-white text-ink-800 hover:bg-exam-50"
                            )}
                          >
                            <span className="block font-bold">{option.title}</span>
                            <span
                              className={cn(
                                "mt-1 block text-xs leading-5",
                                state.examType === examType ? "text-white/80" : "text-ink-600"
                              )}
                            >
                              {option.description}
                            </span>
                          </button>
                        );
                      })()
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="title">Test title</Label>
                  <Input
                    id="title"
                    value={state.title}
                    onChange={(event) =>
                      setState((value) => ({ ...value, title: event.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <fieldset>
                <legend className="text-sm font-semibold text-ink-800">
                  Exam sections
                </legend>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {examPreset.sections.map((section) => (
                    <label
                      key={section.id}
                      className="flex cursor-pointer gap-3 rounded-md border border-exam-100 bg-white p-3 text-sm hover:bg-exam-50"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-exam-100 text-exam-700 focus:ring-exam-500"
                        checked={state.examSections.includes(section.id)}
                        onChange={() => toggleExamSection(section.id)}
                      />
                      <span>
                        <span className="font-semibold text-ink-950">
                          {section.shortName} - {section.name}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-ink-600">
                          {section.officialFormat}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
                </div>
              ) : null}

              {activeStepId === "level" ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {isGrammarTopicFirstMode ? (
                      <div className="rounded-md border border-exam-100 bg-exam-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                          Grammar topics decide level range
                        </p>
                        <p className="mt-1 text-sm font-bold text-ink-950">
                          {selectedGrammarTopicIds.length > 0
                            ? `Selected levels: ${selectedGrammarTopicLevels.join(", ")}`
                            : "Selected levels: choose topics next"}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-ink-600">
                          Pick topics from one or more CEFR levels. The main test level follows
                          the highest selected topic level.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Label>CEFR level</Label>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {levels.map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => changeLevel(level)}
                              className={cn(
                                "h-10 rounded-md border text-sm font-bold transition",
                                state.level === level
                                  ? "border-exam-700 bg-exam-700 text-white"
                                  : "border-exam-100 bg-white text-ink-800 hover:bg-exam-50"
                              )}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {isGrammarTopicFirstMode ? (
                      <div>
                        <Label>Pass target</Label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {difficulties.map((difficulty) => (
                            <button
                              key={difficulty}
                              type="button"
                              onClick={() => changeDifficulty(difficulty)}
                              className={cn(
                                "min-h-14 rounded-md border px-2 text-sm font-semibold transition",
                                state.difficulty === difficulty
                                  ? "border-exam-700 bg-exam-700 text-white"
                                  : "border-exam-100 bg-white text-ink-800 hover:bg-exam-50"
                              )}
                            >
                              <span className="block">{difficultyLabels[difficulty]}</span>
                              <span
                                className={cn(
                                  "mt-1 block text-xs",
                                  state.difficulty === difficulty ? "text-white/80" : "text-ink-600"
                                )}
                              >
                                {grammarPassTargets[difficulty].passPercent}% pass
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label>Target score level</Label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {targetScoreLevels.map((targetScoreLevel) => (
                            <button
                              key={targetScoreLevel}
                              type="button"
                              onClick={() =>
                                setState((value) => ({ ...value, targetScoreLevel }))
                              }
                              className={cn(
                                "min-h-10 rounded-md border px-2 text-sm font-semibold transition",
                                state.targetScoreLevel === targetScoreLevel
                                  ? "border-exam-700 bg-exam-700 text-white"
                                  : "border-exam-100 bg-white text-ink-800 hover:bg-exam-50"
                              )}
                            >
                              {targetScoreLevelShortLabels[targetScoreLevel]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {!isGrammarTopicFirstMode ? (
                      <div>
                        <Label htmlFor="targetNclc">Target NCLC/CLB</Label>
                        <Input
                          id="targetNclc"
                          value={state.targetNclc || ""}
                          onChange={(event) =>
                            setState((value) => ({ ...value, targetNclc: event.target.value }))
                          }
                          placeholder="NCLC 7"
                        />
                      </div>
                    ) : null}
                    <div>
                      <Label>Skill focus</Label>
                      {isGrammarTopicFirstMode ? (
                        <div className="mt-2 rounded-md border border-ink-950 bg-ink-950 px-3 py-2 text-sm font-semibold text-white">
                          Grammar
                        </div>
                      ) : (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {skillFocuses.map((skillFocus) => (
                            <button
                              key={skillFocus}
                              type="button"
                              onClick={() => changeSkillFocus(skillFocus)}
                              className={cn(
                                "min-h-10 rounded-md border px-2 text-sm font-semibold transition",
                                state.skillFocus === skillFocus
                                  ? "border-ink-950 bg-ink-950 text-white"
                                  : "border-exam-100 bg-white text-ink-800 hover:bg-exam-50"
                              )}
                              title={skillFocusLabels[skillFocus]}
                            >
                              {skillFocusShortLabels[skillFocus]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeStepId === "topics" ? (
              <fieldset>
                <legend className="text-sm font-semibold text-ink-800">
                  Grammar topics
                </legend>
                <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <div>
                    <Label htmlFor="topicSearch">Search grammar topics</Label>
                    <div className="relative">
                      <Search
                        className="pointer-events-none absolute left-3 top-[1.15rem] text-ink-400"
                        size={16}
                        aria-hidden="true"
                      />
                      <Input
                        id="topicSearch"
                        value={topicSearchQuery}
                        onChange={(event) => setTopicSearchQuery(event.target.value)}
                        placeholder="Search tense, pronoun, connector..."
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>
                      {visibleGrammarTopicCount}{" "}
                      {visibleGrammarTopicCount === 1 ? "match" : "matches"}
                    </Badge>
                    {topicSearchQuery ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setTopicSearchQuery("")}
                      >
                        Clear
                      </Button>
                    ) : null}
                  </div>
                </div>
                {isGrammarTopicFirstMode ? (
                  <div className="mt-3 space-y-4">
                    {filteredCatalogLevels.map((level) => {
                      const allLevelTopics =
                        catalogLevels.find((item) => item.code === level.code)?.grammarTopics ??
                        level.grammarTopics;
                      const levelTopicIds = allLevelTopics.map((topic) => topic.id);
                      const selectedLevelTopicCount = levelTopicIds.filter((topicId) =>
                        selectedGrammarTopicIdSet.has(topicId)
                      ).length;
                      const areAllLevelTopicsSelected =
                        levelTopicIds.length > 0 &&
                        selectedLevelTopicCount === levelTopicIds.length;

                      return (
                        <div
                          key={level.id}
                          className="rounded-md border border-exam-100 bg-exam-50 p-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-bold text-ink-950">{level.name}</p>
                              <p className="text-xs text-ink-600">
                                Select one or more grammar topics from this level.
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge>
                                {selectedLevelTopicCount}/{levelTopicIds.length} selected
                              </Badge>
                              <Badge>{level.code}</Badge>
                              <Button
                                type="button"
                                variant="secondary"
                                className="h-8 px-3 text-xs"
                                disabled={levelTopicIds.length === 0}
                                onClick={() => toggleGrammarLevelTopics(level.code)}
                              >
                                {areAllLevelTopicsSelected
                                  ? `Clear ${level.code}`
                                  : `Select all ${level.code}`}
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 grid gap-2 md:grid-cols-2">
                            {level.grammarTopics.map((topic) => (
                              <label
                                key={topic.id}
                                className="flex cursor-pointer gap-3 rounded-md border border-exam-100 bg-white p-3 text-sm hover:bg-white/70"
                              >
                                <input
                                  type="checkbox"
                                  className="mt-1 rounded border-exam-100 text-exam-700 focus:ring-exam-500"
                                  checked={selectedGrammarTopicIdSet.has(topic.id)}
                                  onChange={() => toggleGrammarTopic(topic.id)}
                                />
                                <span>
                                  <span className="font-semibold text-ink-950">{topic.name}</span>
                                  <span className="mt-1 block text-xs leading-5 text-ink-600">
                                    {topic.description}
                                  </span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {filteredCatalogLevels.length === 0 ? (
                      <div className="rounded-md border border-exam-100 bg-exam-50 p-4 text-sm font-medium text-ink-700">
                        No grammar topics match this search.
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {filteredCurrentLevelGrammarTopics.map((topic) => (
                      <label
                        key={topic.id}
                        className="flex cursor-pointer gap-3 rounded-md border border-exam-100 bg-white p-3 text-sm hover:bg-exam-50"
                      >
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-exam-100 text-exam-700 focus:ring-exam-500"
                          checked={selectedGrammarTopicIdSet.has(topic.id)}
                          onChange={() => toggleGrammarTopic(topic.id)}
                        />
                        <span>
                          <span className="font-semibold text-ink-950">{topic.name}</span>
                          <span className="mt-1 block text-xs leading-5 text-ink-600">
                            {topic.description}
                          </span>
                        </span>
                      </label>
                    ))}
                    {filteredCurrentLevelGrammarTopics.length === 0 ? (
                      <div className="rounded-md border border-exam-100 bg-exam-50 p-4 text-sm font-medium text-ink-700 md:col-span-2">
                        No grammar topics match this search.
                      </div>
                    ) : null}
                  </div>
                )}
              </fieldset>
              ) : null}

              {activeStepId === "vocabulary" ? (
                <div className="space-y-6">
              <fieldset>
                <legend className="text-sm font-semibold text-ink-800">
                  Vocabulary themes
                </legend>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Badge>
                    {selectedVocabularySectionIds.length} of {allVocabularySectionIds.length}{" "}
                    selected
                  </Badge>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={allVocabularySectionsSelected || allVocabularySectionIds.length === 0}
                    onClick={() =>
                      setState((value) => ({
                        ...value,
                        vocabularySectionIds: allVocabularySectionIds
                      }))
                    }
                  >
                    {allVocabularySectionsSelected ? "All selected" : "Select all"}
                  </Button>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {currentLevel?.vocabularySections.map((section) => (
                    <label
                      key={section.id}
                      className="flex cursor-pointer gap-3 rounded-md border border-exam-100 bg-white p-3 text-sm hover:bg-exam-50"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-exam-100 text-exam-700 focus:ring-exam-500"
                        checked={selectedVocabularySectionIds.includes(section.id)}
                        onChange={() => toggleValue("vocabularySectionIds", section.id)}
                      />
                      <span>
                        <span className="font-semibold text-ink-950">{section.name}</span>
                        <span className="mt-1 block text-xs leading-5 text-ink-600">
                          {section.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
                </div>
              ) : null}

              {activeStepId === "questions" ? (
                <div className="space-y-6">
              <div className="space-y-5">
                <div
                  className={cn(
                    "grid gap-4",
                    isGrammarTopicFirstMode ? "md:grid-cols-3" : "md:grid-cols-4"
                  )}
                >
                  <div>
                    <Label htmlFor="marks">Total marks</Label>
                    <Input
                      id="marks"
                      type="number"
                      min={Math.max(5, state.numberOfQuestions)}
                      max={100}
                      value={state.totalMarks}
                      onChange={(event) =>
                        setState((value) => ({
                          ...value,
                          totalMarks: clampedTotalMarks(
                            Number(event.target.value),
                            value.numberOfQuestions
                          )
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="questions">Total questions</Label>
                    <Input
                      id="questions"
                      type="number"
                      min={1}
                      max={100}
                      value={state.numberOfQuestions}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeLimit">Time limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min={1}
                      max={240}
                      value={state.timeLimitMinutes ?? ""}
                      onChange={(event) =>
                        setState((value) => ({
                          ...value,
                          timeLimitMinutes: Number(event.target.value)
                        }))
                      }
                    />
                  </div>
                  {!isGrammarTopicFirstMode ? (
                    <div>
                      <Label>Difficulty</Label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {difficulties.map((difficulty) => (
                          <button
                            key={difficulty}
                            type="button"
                            onClick={() => changeDifficulty(difficulty)}
                            className={cn(
                              "h-10 rounded-md border text-sm font-semibold transition",
                              state.difficulty === difficulty
                                ? "border-ink-950 bg-ink-950 text-white"
                                : "border-exam-100 bg-white text-ink-800 hover:bg-exam-50"
                            )}
                          >
                            {difficultyLabels[difficulty]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {questionTypeBreakdown.map((item) => (
                    <div
                      key={item.type}
                      className="rounded-md border border-exam-100 bg-exam-50 p-3 text-sm"
                    >
                      <p className="font-bold text-ink-950">
                        {questionTypeLabels[item.type]}
                      </p>
                      <p className="mt-1 text-ink-600">
                        {item.count} questions · {item.marks} marks ·{" "}
                        {formatMarkPattern(item.perQuestionMarks)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <fieldset>
                <legend className="text-sm font-semibold text-ink-800">
                  1. Choose answer formats and counts
                </legend>
                <p className="mt-1 text-xs leading-5 text-ink-600">
                  This decides how the learner answers. Example: Translation means
                  writing the translation, and Multiple choice means picking one option.
                </p>
                <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {questionTypes.map((type) => (
                    <div
                      key={type}
                      className={cn(
                        "grid grid-cols-[1fr_auto] gap-3 rounded-md border bg-white p-3 text-sm",
                        state.questionTypes.includes(type)
                          ? "border-exam-700"
                          : "border-exam-100"
                      )}
                    >
                      <label className="flex cursor-pointer items-start gap-3 text-ink-950">
                        <input
                          type="checkbox"
                          className="mt-0.5 rounded border-exam-100 text-exam-700 focus:ring-exam-500"
                          checked={state.questionTypes.includes(type)}
                          onChange={() => toggleQuestionType(type)}
                        />
                        <span>
                          <span className="block font-semibold">
                            {questionTypeLabels[type]}
                          </span>
                          <span className="mt-1 block text-xs font-normal leading-5 text-ink-600">
                            {questionTypeDescriptions[type]}
                          </span>
                        </span>
                      </label>
                      <div className="grid grid-cols-[2.25rem_4rem_2.25rem] items-center overflow-hidden rounded-md border border-exam-100 bg-white">
                        <button
                          type="button"
                          aria-label={`Decrease ${questionTypeLabels[type]} question count`}
                          disabled={(state.questionTypeCounts[type] ?? 0) <= 0}
                          onClick={() =>
                            changeQuestionTypeCount(
                              type,
                              (state.questionTypeCounts[type] ?? 0) - 1
                            )
                          }
                          className="flex h-11 items-center justify-center border-r border-exam-100 text-ink-700 transition hover:bg-exam-50 disabled:cursor-not-allowed disabled:text-ink-300"
                        >
                          <Minus size={16} aria-hidden="true" />
                        </button>
                        <Input
                          aria-label={`${questionTypeLabels[type]} question count`}
                          type="number"
                          min={0}
                          max={100}
                          value={state.questionTypeCounts[type] ?? 0}
                          onChange={(event) =>
                            changeQuestionTypeCount(type, Number(event.target.value))
                          }
                          className="h-11 rounded-none border-0 text-center shadow-none focus:ring-0"
                        />
                        <button
                          type="button"
                          aria-label={`Increase ${questionTypeLabels[type]} question count`}
                          disabled={(state.questionTypeCounts[type] ?? 0) >= 100}
                          onClick={() =>
                            changeQuestionTypeCount(
                              type,
                              (state.questionTypeCounts[type] ?? 0) + 1
                            )
                          }
                          className="flex h-11 items-center justify-center border-l border-exam-100 text-ink-700 transition hover:bg-exam-50 disabled:cursor-not-allowed disabled:text-ink-300"
                        >
                          <Plus size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold text-ink-800">
                  2. Exam-style question focus (optional)
                </legend>
                <p className="mt-1 text-xs leading-5 text-ink-600">
                  This sets the grammar or task focus inside the formats above. It does
                  not create a new format. Leave it empty to let the generator choose
                  suitable exam-style focuses. Example: Multiple choice + Choose the
                  correct preposition.
                </p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {questionFocusOptions.map((focus) => (
                    <label
                      key={focus}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm text-ink-950",
                        state.questionFocuses.includes(focus)
                          ? "border-exam-700 bg-exam-50"
                          : "border-exam-100 bg-white hover:bg-exam-50"
                      )}
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 rounded border-exam-100 text-exam-700 focus:ring-exam-500"
                        checked={state.questionFocuses.includes(focus)}
                        onChange={() => toggleQuestionFocus(focus)}
                      />
                      <span>
                        <span className="block text-[11px] font-bold uppercase tracking-wide text-exam-700">
                          Tests
                        </span>
                        <span className="mt-1 block font-semibold">
                          {formatQuestionFocusLabel(focus)}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
                </div>
              ) : null}

              {activeStepId === "overview" ? (
                <div className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-md border border-exam-100 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                        Test
                      </p>
                      <h2 className="mt-1 text-base font-bold text-ink-950">{state.title}</h2>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge>{examFocusOptions[state.examType]?.title ?? examTypeLabels[state.examType]}</Badge>
                        <Badge>
                          {preparationModeOptions[state.preparationMode]?.title ??
                            preparationModeShortLabels[state.preparationMode]}
                        </Badge>
                        <Badge>{state.level}</Badge>
                        <Badge>{skillFocusShortLabels[state.skillFocus]}</Badge>
                        <Badge>{difficultyLabels[state.difficulty]}</Badge>
                      </div>
                    </div>
                    <div className="rounded-md border border-exam-100 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                        Totals
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="font-bold text-ink-950">{state.numberOfQuestions}</p>
                          <p className="text-ink-600">questions</p>
                        </div>
                        <div>
                          <p className="font-bold text-ink-950">{state.totalMarks}</p>
                          <p className="text-ink-600">marks</p>
                        </div>
                        <div>
                          <p className="font-bold text-ink-950">
                            {state.timeLimitMinutes ?? 0}
                          </p>
                          <p className="text-ink-600">minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-exam-100 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                      Sections
                    </p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {selectedSectionPresets.map((section) => (
                        <div
                          key={section.id}
                          className="rounded-md border border-exam-100 bg-exam-50 p-3 text-sm"
                        >
                          <p className="font-bold text-ink-950">
                            {section.shortName} - {section.name}
                          </p>
                          <p className="mt-1 text-ink-600">
                            {section.defaultQuestions} default questions ·{" "}
                            {section.defaultMarks} marks
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-md border border-exam-100 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                        Topics
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedGrammarTopics.map((topic) => (
                          <Badge key={topic.id}>{topic.name}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md border border-exam-100 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                        Vocabulary
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {currentLevel?.vocabularySections
                          .filter((section) =>
                            selectedVocabularySectionIds.includes(section.id)
                          )
                          .map((section) => <Badge key={section.id}>{section.name}</Badge>)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-exam-100 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                      Answer formats
                    </p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                      {questionTypeBreakdown.map((item) => (
                        <div
                          key={item.type}
                          className="rounded-md border border-exam-100 bg-exam-50 p-3 text-sm"
                        >
                          <p className="font-bold text-ink-950">
                            {questionTypeLabels[item.type]}
                          </p>
                          <p className="mt-1 text-ink-600">
                            {item.count} questions · {item.marks} marks ·{" "}
                            {formatMarkPattern(item.perQuestionMarks)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-exam-100 pt-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                        Question focus
                      </p>
                      {state.questionFocuses.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {state.questionFocuses.map((focus) => (
                            <Badge key={focus}>{formatQuestionFocusLabel(focus)}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-ink-600">
                          No specific exam-style focus selected.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              <FieldError
                message={
                  state.numberOfQuestions > state.totalMarks
                    ? "Total marks must be at least the total question count."
                    : state.numberOfQuestions > 100
                      ? "Total questions cannot be greater than 100."
                    : generationMutation.error?.message
                }
              />

              <div className="flex flex-col gap-3 border-t border-exam-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={goToPreviousStep}
                  disabled={currentStepIndex === 0 || generationMutation.isPending}
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  Previous
                </Button>

                <div className="flex flex-wrap justify-center gap-2">
                  <Badge>
                    {isGrammarTopicFirstMode && selectedGrammarTopicIds.length === 0
                      ? "Topic levels pending"
                      : state.level}
                  </Badge>
                  <Badge>{examFocusOptions[state.examType]?.title ?? examTypeLabels[state.examType]}</Badge>
                  {isGrammarTopicFirstMode && state.targetNclc ? (
                    <Badge>{state.targetNclc}</Badge>
                  ) : null}
                  <Badge>{state.numberOfQuestions} questions</Badge>
                  <Badge>{state.totalMarks} marks</Badge>
                  {state.timeLimitMinutes ? <Badge>{state.timeLimitMinutes} min</Badge> : null}
                </div>

                {activeStepId === "overview" ? (
                  <Button
                    type="submit"
                    disabled={!canSubmit || generationMutation.isPending}
                    className="sm:min-w-44"
                  >
                    {generationMutation.isPending ? (
                      <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                    ) : (
                      <FilePlus2 size={16} aria-hidden="true" />
                    )}
                    {generationMutation.isPending ? "Generating..." : "Generate test"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!isStepComplete(activeStepId) || generationMutation.isPending}
                    className="sm:min-w-36"
                  >
                    Next
                    <ChevronRight size={16} aria-hidden="true" />
                  </Button>
                )}
              </div>
            </form>
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}
