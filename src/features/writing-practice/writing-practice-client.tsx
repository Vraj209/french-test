"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpenCheck,
  FilePlus2,
  Lightbulb,
  Loader2,
  RefreshCcw,
  Send,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/custom-select";
import { FieldError, Label, Textarea } from "@/components/ui/form";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import {
  writingPracticeDifficulties,
  writingPracticeLevels,
  type WritingPracticeSectionConfig
} from "@/features/writing-practice/config";
import {
  difficultyLabels,
  type CefrLevel,
  type Difficulty,
  type WritingPracticeFeedback,
  type WritingPracticePrompt
} from "@/lib/schemas";

type GeneratedPractice = {
  testId: string;
  questionId: string;
  prompt: WritingPracticePrompt;
};

type EvaluationResponse = {
  resultId: string;
  awardedMarks: number;
  maximumMarks: number;
  feedback: WritingPracticeFeedback;
};

type PendingAction = "generate" | "evaluate" | undefined;

export function WritingPracticeClient({
  section
}: {
  section: WritingPracticeSectionConfig;
}) {
  const [level, setLevel] = useState<CefrLevel>(
    section.section === "TEF_TASK_2" ? "B2" : "B1"
  );
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [topic, setTopic] = useState(section.defaultTopic);
  const [practice, setPractice] = useState<GeneratedPractice | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>();
  const [error, setError] = useState<string>();
  const wordCount = useMemo(() => countWords(answerText), [answerText]);

  async function generatePrompt() {
    setError(undefined);
    setPendingAction("generate");

    try {
      const response = await fetch("/api/writing-practice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: section.section,
          level,
          difficulty,
          topic
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Unable to generate writing practice.");
      }

      const body = (await response.json()) as GeneratedPractice;

      setPractice(body);
      setAnswerText("");
      setEvaluation(null);
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "Unable to generate writing practice."
      );
    } finally {
      setPendingAction(undefined);
    }
  }

  async function evaluateAnswer() {
    if (!practice) {
      setError("Generate a prompt before requesting feedback.");
      return;
    }

    if (!answerText.trim()) {
      setError("Write an answer before requesting feedback.");
      return;
    }

    setError(undefined);
    setPendingAction("evaluate");

    try {
      const response = await fetch("/api/writing-practice/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: practice.testId,
          questionId: practice.questionId,
          answerText
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Unable to review this answer.");
      }

      setEvaluation((await response.json()) as EvaluationResponse);
    } catch (evaluateError) {
      setError(
        evaluateError instanceof Error
          ? evaluateError.message
          : "Unable to review this answer."
      );
    } finally {
      setPendingAction(undefined);
    }
  }

  return (
    <div className="space-y-6">
      <Panel>
        <PanelHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Link
                href="/tests/create/writing"
                className="inline-flex items-center gap-2 text-sm font-semibold text-exam-700 hover:underline"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Writing preparation
              </Link>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-exam-700">
                Untimed practice
              </p>
              <h1 className="mt-1 text-2xl font-bold text-ink-950">{section.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
                {section.description}
              </p>
            </div>
            <Badge className="w-fit border-verdict-500/30 bg-green-50 text-verdict-700">
              Practice mode
            </Badge>
          </div>
        </PanelHeader>
        <PanelBody>
          <div className="grid gap-4 lg:grid-cols-[0.65fr_0.35fr]">
            <div className="rounded-md border border-exam-100 bg-exam-50 p-4">
              <div className="flex items-start gap-3">
                <BookOpenCheck
                  className="mt-0.5 shrink-0 text-exam-700"
                  size={18}
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm font-bold text-ink-950">Practice flow</h2>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    {section.instructions}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-md border border-exam-100 bg-white p-4">
              <h2 className="text-sm font-bold text-ink-950">Feedback focus</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {section.focusAreas.map((focus) => (
                  <Badge key={focus}>{focus}</Badge>
                ))}
              </div>
            </div>
          </div>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader>
          <h2 className="text-base font-bold text-ink-950">Generate practice prompt</h2>
        </PanelHeader>
        <PanelBody>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="level">Level</Label>
              <CustomSelect
                id="level"
                value={level}
                onValueChange={setLevel}
                options={writingPracticeLevels.map((item) => ({
                  value: item,
                  label: item
                }))}
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <CustomSelect
                id="difficulty"
                value={difficulty}
                onValueChange={setDifficulty}
                options={writingPracticeDifficulties.map((item) => ({
                  value: item,
                  label: difficultyLabels[item]
                }))}
              />
            </div>
            <div>
              <Label htmlFor="topic">{section.topicLabel}</Label>
              <CustomSelect
                id="topic"
                value={topic}
                onValueChange={setTopic}
                options={section.topicOptions.map((item) => ({
                  value: item,
                  label: item
                }))}
              />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={generatePrompt}
              disabled={Boolean(pendingAction)}
            >
              {pendingAction === "generate" ? (
                <Loader2 className="animate-spin" size={16} aria-hidden="true" />
              ) : practice ? (
                <RefreshCcw size={16} aria-hidden="true" />
              ) : (
                <FilePlus2 size={16} aria-hidden="true" />
              )}
              {practice ? "Generate new prompt" : "Generate prompt"}
            </Button>
          </div>
        </PanelBody>
      </Panel>

      {practice ? (
        <Panel>
          <PanelHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{practice.prompt.level}</Badge>
                  <Badge>{practice.prompt.topic}</Badge>
                  {practice.prompt.minWords ? (
                    <Badge>{practice.prompt.minWords}+ words</Badge>
                  ) : null}
                </div>
                <h2 className="mt-3 text-base font-bold leading-6 text-ink-950">
                  {practice.prompt.title}
                </h2>
              </div>
              <Badge className="w-fit">Saved practice</Badge>
            </div>
          </PanelHeader>
          <PanelBody>
            <div className="rounded-md border border-exam-100 bg-exam-50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-ink-950">
                {practice.prompt.prompt}
              </p>
              <p className="mt-3 text-sm leading-6 text-ink-600">
                {practice.prompt.instructions}
              </p>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <PracticeList
                title="Suggested structure"
                items={practice.prompt.suggestedStructure}
              />
              <PracticeList title="Useful vocabulary" items={practice.prompt.vocabularyHints} />
            </div>

            <div className="mt-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <Label htmlFor="answer">{section.textareaLabel}</Label>
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-600">
                  {wordCount} words
                </span>
              </div>
              <Textarea
                id="answer"
                value={answerText}
                onChange={(event) => {
                  setAnswerText(event.target.value);
                  if (evaluation) {
                    setEvaluation(null);
                  }
                }}
                placeholder={section.textareaPlaceholder}
                className="min-h-56"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={evaluateAnswer}
                  disabled={Boolean(pendingAction)}
                >
                  {pendingAction === "evaluate" ? (
                    <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                  ) : (
                    <Send size={16} aria-hidden="true" />
                  )}
                  Review my answer
                </Button>
              </div>
            </div>
          </PanelBody>
        </Panel>
      ) : null}

      <FieldError message={error} />

      {evaluation ? (
        <FeedbackPanel evaluation={evaluation} />
      ) : null}
    </div>
  );
}

function PracticeList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-exam-100 bg-white p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-ink-950">
        <Lightbulb size={16} aria-hidden="true" />
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-600">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}

function FeedbackPanel({ evaluation }: { evaluation: EvaluationResponse }) {
  const feedback = evaluation.feedback;

  return (
    <Panel>
      <PanelHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
              AI writing coaching
            </p>
            <h2 className="mt-1 text-xl font-bold text-ink-950">
              Latest feedback
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Estimated practice level: {feedback.estimatedLevel}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{Math.round(feedback.score)}%</Badge>
            <Badge>
              {evaluation.awardedMarks}/{evaluation.maximumMarks} marks
            </Badge>
          </div>
        </div>
      </PanelHeader>
      <PanelBody>
        <div className="grid gap-4 lg:grid-cols-2">
          <FeedbackList title="Main mistakes" items={feedback.mainMistakes} />
          <FeedbackList title="How to improve" items={feedback.improvementAdvice} />
          <FeedbackList title="Better structure" items={feedback.structureAdvice} />
          <FeedbackList title="Vocabulary to use" items={feedback.vocabularySuggestions} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <FeedbackText title="Corrected version" text={feedback.correctedVersion} />
          <FeedbackText title="Stronger sample answer" text={feedback.modelAnswer} />
        </div>

        <div className="mt-4 rounded-md border border-exam-100 bg-exam-50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink-950">
            <Sparkles size={16} aria-hidden="true" />
            Writing strategy
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            {feedback.writingStrategy}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/results/${evaluation.resultId}`}
            className="inline-flex h-10 items-center justify-center rounded-md border border-exam-100 bg-white px-4 text-sm font-semibold text-ink-950 transition hover:bg-exam-50 focus:outline-none focus:ring-2 focus:ring-exam-500 focus:ring-offset-2"
          >
            View saved result
          </Link>
        </div>
      </PanelBody>
    </Panel>
  );
}

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-exam-100 bg-white p-4">
      <h3 className="text-sm font-bold text-ink-950">{title}</h3>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-600">
          {items.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-ink-600">No items returned.</p>
      )}
    </div>
  );
}

function FeedbackText({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md border border-exam-100 bg-exam-50 p-4">
      <h3 className="text-sm font-bold text-ink-950">{title}</h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink-950">{text}</p>
    </div>
  );
}

function countWords(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
