"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, LogOut, Save, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/form";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { examSectionLabels, questionTypeLabels, type QuestionType } from "@/lib/schemas";
import type { SerializableQuestion, SerializableTest } from "@/features/tests/test-models";
import { cn } from "@/lib/utils";

type AnswerDraft = {
  answerText: string;
};

const correctIncorrectOptions = [
  { label: "A", text: "Correct" },
  { label: "B", text: "Incorrect" }
];

const sectionSummaryBadgeClassName =
  "border-exam-100 bg-white text-ink-950 shadow-panel";

export function TestTakingClient({ test }: { test: SerializableTest }) {
  const router = useRouter();
  const totalTimeLimitSeconds =
    test.timeLimitSeconds ??
    test.questions.reduce((sum, question) => sum + (question.timeLimitSeconds ?? 0), 0);
  const [remainingSeconds, setRemainingSeconds] = useState(totalTimeLimitSeconds);
  const [answers, setAnswers] = useState<Record<string, AnswerDraft>>(() =>
    Object.fromEntries(
      test.questions.map((question) => {
        const existing = test.answers.find((answer) => answer.questionId === question.id);

        return [
          question.id,
          {
            answerText: existing?.answerText ?? ""
          }
        ];
      })
    )
  );
  const [error, setError] = useState<string>();
  const [pendingAction, setPendingAction] = useState<string>();
  const [visibleHints, setVisibleHints] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!totalTimeLimitSeconds || pendingAction === "score") {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [pendingAction, totalTimeLimitSeconds]);

  const completion = useMemo(() => {
    const answered = test.questions.filter(
      (question) => answers[question.id]?.answerText.trim().length > 0
    ).length;

    return { answered, total: test.questions.length };
  }, [answers, test.questions]);
  const questionSections = useMemo(() => {
    const groups: Array<{
      section: string;
      questions: SerializableQuestion[];
      marks: number;
      categories: string[];
    }> = [];

    for (const question of test.questions) {
      let group = groups.find((item) => item.section === question.examSection);

      if (!group) {
        group = {
          section: question.examSection,
          questions: [],
          marks: 0,
          categories: []
        };
        groups.push(group);
      }

      group.questions.push(question);
      group.marks += question.marks;

      if (!group.categories.includes(question.type)) {
        group.categories.push(question.type);
      }
    }

    return groups;
  }, [test.questions]);

  function setAnswer(questionId: string, patch: Partial<AnswerDraft>) {
    setAnswers((value) => ({
      ...value,
      [questionId]: {
        ...value[questionId],
        ...patch
      }
    }));
  }

  function toggleHint(questionId: string) {
    setVisibleHints((value) => ({
      ...value,
      [questionId]: !value[questionId]
    }));
  }

  function answerPayload() {
    return test.questions.map((question) => ({
      questionId: question.id,
      answerText: answers[question.id]?.answerText.trim() ?? ""
    }));
  }

  async function save() {
    const payload = answerPayload();
    const response = await fetch(`/api/tests/${test.id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: payload })
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.error || "Unable to save answers.");
    }
  }

  async function handleSave() {
    setError(undefined);
    setPendingAction("save");

    try {
      await save();
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save answers.");
    } finally {
      setPendingAction(undefined);
    }
  }

  async function handleReview() {
    setError(undefined);
    setPendingAction("review");

    try {
      await save();
      router.push(`/tests/${test.id}/review`);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to review answers.");
    } finally {
      setPendingAction(undefined);
    }
  }

  async function handleScore() {
    setError(undefined);
    setPendingAction("score");

    try {
      await save();
      const response = await fetch(`/api/tests/${test.id}/evaluate`, { method: "POST" });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Unable to evaluate answers.");
      }

      const body = await response.json();
      router.push(`/results/${body.result.id}`);
      router.refresh();
    } catch (scoreError) {
      setError(scoreError instanceof Error ? scoreError.message : "Unable to score test.");
    } finally {
      setPendingAction(undefined);
    }
  }

  async function handleQuit() {
    setError(undefined);

    const shouldQuit = window.confirm(
      "Quit this test? Your current progress will be saved and you can return later."
    );

    if (!shouldQuit) {
      return;
    }

    setPendingAction("quit");

    try {
      await save();
      router.push("/dashboard");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to quit test.");
    } finally {
      setPendingAction(undefined);
    }
  }

  function chooseSingleOption(
    questionId: string,
    option: { label: string; text: string }
  ) {
    setAnswer(questionId, { answerText: optionAnswerText(option) });
  }

  function chooseSingleOptionByLabel(
    questionId: string,
    options: Array<{ label: string; text: string }>,
    label: string
  ) {
    const option = options.find((item) => item.label === label);

    setAnswer(questionId, { answerText: option ? optionAnswerText(option) : "" });
  }

  function toggleMultiSelectOption(
    questionId: string,
    options: Array<{ label: string; text: string }>,
    option: { label: string; text: string },
    currentAnswer: string
  ) {
    const selectedLabels = selectedOptionLabels(currentAnswer);
    const nextLabels = new Set(selectedLabels);

    if (nextLabels.has(option.label)) {
      nextLabels.delete(option.label);
    } else {
      nextLabels.add(option.label);
    }

    const nextAnswer = questionOptionsByLabels(options, Array.from(nextLabels))
      .map(optionAnswerText)
      .join("\n");

    setAnswer(questionId, { answerText: nextAnswer });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
      <section className="space-y-4">
        <Panel>
          <PanelHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                  {test.level} exam
                </p>
                <h1 className="mt-1 text-2xl font-bold text-ink-950">{test.title}</h1>
                <p className="mt-2 text-sm text-ink-600">
                  {test.examType.replace("_", " ")} · {test.targetNclc || test.level} ·{" "}
                  {test.questions.length} questions · {test.totalMarks} marks ·{" "}
                  {test.difficulty.toLowerCase()}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{test.preparationMode.replaceAll("_", " ")}</Badge>
                  <Badge>{test.skillFocus.replaceAll("_", " ")}</Badge>
                  {test.fullTest ? <Badge>full mock mode</Badge> : null}
                  {totalTimeLimitSeconds ? (
                    <Badge>{formatDuration(totalTimeLimitSeconds)} limit</Badge>
                  ) : null}
                </div>
              </div>
              <Badge>{completion.answered}/{completion.total} answered</Badge>
            </div>
          </PanelHeader>
        </Panel>

        {questionSections.map((sectionGroup) => (
          <section key={sectionGroup.section} className="space-y-3">
            <div className="rounded-md border border-exam-100 bg-exam-50 px-4 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                    Section
                  </p>
                  <h2 className="mt-1 text-base font-bold text-ink-950">
                    {examSectionLabels[
                      sectionGroup.section as keyof typeof examSectionLabels
                    ] || sectionGroup.section}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={sectionSummaryBadgeClassName}>
                    {sectionGroup.questions.length} questions
                  </Badge>
                  <Badge className={sectionSummaryBadgeClassName}>
                    {sectionGroup.marks} marks
                  </Badge>
                  {sectionGroup.categories.map((category) => (
                    <Badge key={category} className={sectionSummaryBadgeClassName}>
                      {questionTypeLabels[category as QuestionType] || category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            {sectionGroup.questions.map((question) => {
              const draft = answers[question.id];
              const isAnswered = draft?.answerText.trim().length > 0;
              const choiceOptions =
                question.type === "CORRECT_INCORRECT"
                  ? correctIncorrectOptions
                  : question.options;
              const isChoiceQuestion =
                choiceOptions.length > 0 &&
                ["MULTIPLE_CHOICE", "MULTIPLE_SELECT", "CORRECT_INCORRECT"].includes(
                  question.type
                );
              const isMultiSelect = question.type === "MULTIPLE_SELECT";
              const isVerbConjugationDropdown =
                question.type === "VERB_CONJUGATION" && choiceOptions.length > 0;
              const inlineFillBlankParts =
                question.type === "FILL_BLANK" || isVerbConjugationDropdown
                  ? splitInlineFillBlankQuestion(question.question)
                  : null;
              const usesInlineFillBlank = Boolean(inlineFillBlankParts);
              const selectedLabels = selectedOptionLabels(
                draft?.answerText ?? "",
                choiceOptions
              );
              const selectedDropdownLabel = selectedLabels[0] ?? "";
              const inlineBlankWidthCh = Math.max(
                inlineFillBlankParts?.blank.length ?? 0,
                (draft?.answerText ?? "").trim().length + 2,
                14
              );

              return (
                <Panel key={question.id} id={`question-${question.position}`}>
                  <PanelHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge>Q{question.position}</Badge>
                        </div>
                        {usesInlineFillBlank && inlineFillBlankParts ? (
                          <div className="mt-3 text-base font-bold leading-7 text-ink-950">
                            <span>{inlineFillBlankParts.before}</span>
                            {isVerbConjugationDropdown ? (
                              <>
                                <Label htmlFor={`answer-${question.id}`} className="sr-only">
                                  Select the correct verb form
                                </Label>
                                <select
                                  id={`answer-${question.id}`}
                                  value={selectedDropdownLabel}
                                  onChange={(event) =>
                                    chooseSingleOptionByLabel(
                                      question.id,
                                      choiceOptions,
                                      event.target.value
                                    )
                                  }
                                  className="mx-1 inline-block h-10 min-w-[12rem] max-w-full rounded-md border border-exam-100 bg-white px-3 align-middle text-sm font-semibold text-ink-950 shadow-none outline-none transition focus:border-exam-500 focus:ring-2 focus:ring-exam-500"
                                >
                                  <option value="">Select form</option>
                                  {choiceOptions.map((option) => (
                                    <option
                                      key={`${question.id}-${option.label}`}
                                      value={option.label}
                                    >
                                      {option.text}
                                    </option>
                                  ))}
                                </select>
                              </>
                            ) : (
                              <>
                                <Label htmlFor={`answer-${question.id}`} className="sr-only">
                                  Answer
                                </Label>
                                <input
                                  id={`answer-${question.id}`}
                                  type="text"
                                  value={draft?.answerText ?? ""}
                                  onChange={(event) =>
                                    setAnswer(question.id, { answerText: event.target.value })
                                  }
                                  placeholder="Answer"
                                  autoComplete="off"
                                  style={{ width: `${inlineBlankWidthCh}ch` }}
                                  className="mx-1 inline-block h-10 min-w-[10rem] max-w-full rounded-md border border-exam-100 bg-white px-3 align-middle text-sm font-semibold text-ink-950 shadow-none outline-none transition focus:border-exam-500 focus:ring-2 focus:ring-exam-500"
                                />
                              </>
                            )}
                            <span>{inlineFillBlankParts.after}</span>
                          </div>
                        ) : (
                          <h2 className="mt-3 text-base font-bold leading-6 text-ink-950">
                            {question.question}
                          </h2>
                        )}
                        {question.instructions ? (
                          <p className="mt-2 text-sm leading-6 text-ink-600">
                            {question.instructions}
                          </p>
                        ) : null}
                        {question.hint ? (
                          <div className="mt-3">
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-auto px-0 text-sm font-semibold text-exam-700 hover:bg-transparent hover:text-exam-500"
                              onClick={() => toggleHint(question.id)}
                            >
                              {visibleHints[question.id] ? "Hide hint" : "Show hint"}
                            </Button>
                            {visibleHints[question.id] ? (
                              <p className="mt-2 text-sm leading-6 text-ink-600">
                                {question.hint}
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                      <span className="text-sm font-bold text-ink-800">
                        {question.marks} marks
                      </span>
                    </div>
                  </PanelHeader>
                  <PanelBody className={cn(usesInlineFillBlank ? "py-3" : undefined)}>
                    {isChoiceQuestion ? (
                      <div className="mt-2 grid gap-2">
                        {choiceOptions.map((option) => (
                          <label
                            key={`${question.id}-${option.label}`}
                            className={cn(
                              "flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 text-sm text-ink-800 transition",
                              selectedLabels.includes(option.label)
                                ? "border-exam-700 bg-exam-50"
                                : "border-exam-100 bg-white hover:bg-exam-50"
                            )}
                          >
                            <input
                              type={isMultiSelect ? "checkbox" : "radio"}
                              name={`answer-${question.id}`}
                              className="mt-1 border-exam-100 text-exam-700 focus:ring-exam-500"
                              checked={selectedLabels.includes(option.label)}
                              onChange={() =>
                                isMultiSelect
                                  ? toggleMultiSelectOption(
                                      question.id,
                                      choiceOptions,
                                      option,
                                      draft?.answerText ?? ""
                                    )
                                  : chooseSingleOption(question.id, option)
                              }
                            />
                            <span>
                              <span className="font-bold">{option.label}.</span> {option.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : null}
                    {isVerbConjugationDropdown && !usesInlineFillBlank ? (
                      <>
                        <Label htmlFor={`answer-${question.id}`}>Select the correct form</Label>
                        <select
                          id={`answer-${question.id}`}
                          value={selectedDropdownLabel}
                          onChange={(event) =>
                            chooseSingleOptionByLabel(
                              question.id,
                              choiceOptions,
                              event.target.value
                            )
                          }
                          className="mt-2 h-10 w-full rounded-md border border-exam-100 bg-white px-3 text-sm text-ink-950 shadow-none outline-none transition focus:border-exam-500 focus:ring-2 focus:ring-exam-500"
                        >
                          <option value="">Select form</option>
                          {choiceOptions.map((option) => (
                            <option key={`${question.id}-${option.label}`} value={option.label}>
                              {option.text}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : null}
                    {!isChoiceQuestion && !usesInlineFillBlank && !isVerbConjugationDropdown ? (
                      <>
                        <Label htmlFor={`answer-${question.id}`}>Answer</Label>
                        <Textarea
                          id={`answer-${question.id}`}
                          value={draft?.answerText ?? ""}
                          onChange={(event) =>
                            setAnswer(question.id, { answerText: event.target.value })
                          }
                          placeholder="Type your answer here."
                        />
                      </>
                    ) : null}
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {isVerbConjugationDropdown ? (
                        <span className="text-sm text-ink-600">
                          Select the correct verb form from the list.
                        </span>
                      ) : usesInlineFillBlank ? (
                        <span className="text-sm text-ink-600">Type directly in the blank.</span>
                      ) : isChoiceQuestion ? (
                        <span className="text-sm text-ink-600">
                          Select {isMultiSelect ? "one or more options" : "one option"}.
                        </span>
                      ) : (
                        <span className="hidden sm:block" />
                      )}
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 text-sm font-semibold",
                          isAnswered ? "text-verdict-700" : "text-ink-600"
                        )}
                      >
                        {isAnswered ? <CheckCircle2 size={16} aria-hidden="true" /> : null}
                        {isAnswered ? "Answer ready" : "Waiting for answer"}
                      </span>
                    </div>
                  </PanelBody>
                </Panel>
              );
            })}
          </section>
        ))}
      </section>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <Panel>
          <PanelHeader>
            <h2 className="text-base font-bold text-ink-950">Progress</h2>
            <p className="mt-1 text-sm text-ink-600">
              {completion.answered} of {completion.total} completed
            </p>
          </PanelHeader>
          <PanelBody>
            {totalTimeLimitSeconds ? (
              <div className="mb-5 rounded-md border border-exam-100 bg-exam-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                  Section timer
                </p>
                <p className="mt-1 text-2xl font-bold text-ink-950">
                  {formatDuration(remainingSeconds)}
                </p>
                <p className="mt-1 text-xs leading-5 text-ink-600">
                  Save progress stays available. Unanswered questions receive 0 marks when
                  you submit.
                </p>
              </div>
            ) : null}
            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((question) => {
                const isAnswered =
                  answers[question.id]?.answerText.trim().length > 0;

                return (
                  <a
                    key={question.id}
                    href={`#question-${question.position}`}
                    className={cn(
                      "flex h-10 items-center justify-center rounded-md border text-sm font-bold",
                      isAnswered
                        ? "border-verdict-500 bg-green-50 text-verdict-700"
                        : "border-exam-100 bg-white text-ink-600"
                    )}
                  >
                    {question.position}
                  </a>
                );
              })}
            </div>

            {error ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleSave}
                disabled={Boolean(pendingAction)}
              >
                {pendingAction === "save" ? (
                  <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                ) : (
                  <Save size={16} aria-hidden="true" />
                )}
                Save progress
              </Button>
              <Button
                type="button"
                variant="danger"
                className="w-full"
                onClick={handleQuit}
                disabled={Boolean(pendingAction)}
              >
                {pendingAction === "quit" ? (
                  <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                ) : (
                  <LogOut size={16} aria-hidden="true" />
                )}
                Quit test
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleReview}
                disabled={Boolean(pendingAction)}
              >
                Review answers
              </Button>
              <Button
                type="button"
                className="w-full"
                onClick={handleScore}
                disabled={Boolean(pendingAction)}
              >
                {pendingAction === "score" ? (
                  <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                ) : (
                  <Send size={16} aria-hidden="true" />
                )}
                Submit and score
              </Button>
            </div>
          </PanelBody>
        </Panel>
      </aside>
    </div>
  );
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function optionAnswerText(option: { label: string; text: string }) {
  return `${option.label}. ${option.text}`;
}

function selectedOptionLabels(
  answerText: string,
  options: Array<{ label: string; text: string }> = []
) {
  const labels = answerText
    .split("\n")
    .map((line) => line.match(/^([A-Za-z0-9]+)\./)?.[1])
    .filter((label): label is string => Boolean(label));

  if (labels.length > 0) {
    return labels;
  }

  const normalizedAnswer = answerText.trim().toLowerCase();

  if (!normalizedAnswer) {
    return [];
  }

  const matchedOption = options.find(
    (option) =>
      normalizedAnswer === option.text.toLowerCase() ||
      normalizedAnswer === optionAnswerText(option).toLowerCase()
  );

  return matchedOption ? [matchedOption.label] : [];
}

function questionOptionsByLabels(
  options: Array<{ label: string; text: string }>,
  labels: string[]
) {
  const labelSet = new Set(labels);

  return options.filter((option) => labelSet.has(option.label));
}

function splitInlineFillBlankQuestion(questionText: string) {
  const match = questionText.match(/_{3,}/);

  if (!match || typeof match.index !== "number") {
    return null;
  }

  return {
    before: questionText.slice(0, match.index),
    blank: match[0],
    after: questionText.slice(match.index + match[0].length)
  };
}
