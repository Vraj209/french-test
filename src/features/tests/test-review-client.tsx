"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import type { SerializableTest } from "@/features/tests/test-models";
import { examSectionLabels } from "@/lib/schemas";

export function TestReviewClient({ test }: { test: SerializableTest }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isScoring, setScoring] = useState(false);
  const answeredCount = test.answers.filter(
    (answer) => answer.answerText.trim().length > 0
  ).length;

  async function score() {
    setError(undefined);
    setScoring(true);

    try {
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
      setScoring(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
      <section className="space-y-4">
        <Panel>
          <PanelHeader>
            <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
              Final review
            </p>
            <h1 className="mt-1 text-2xl font-bold text-ink-950">{test.title}</h1>
            <p className="mt-2 text-sm text-ink-600">
              Review your answers before scoring. Any unanswered question will receive 0
              marks.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{test.examType.replaceAll("_", " ")}</Badge>
              <Badge>{test.preparationMode.replaceAll("_", " ")}</Badge>
              <Badge>not an official TEF/TCF score</Badge>
            </div>
          </PanelHeader>
        </Panel>

        {test.questions.map((question) => {
          const answer = test.answers.find((item) => item.questionId === question.id);

          return (
            <Panel key={question.id}>
              <PanelHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Q{question.position}</Badge>
                  <Badge>
                    {examSectionLabels[
                      question.examSection as keyof typeof examSectionLabels
                    ] || question.examSection}
                  </Badge>
                  <Badge>{question.topic}</Badge>
                  <Badge>{question.marks} marks</Badge>
                </div>
                <h2 className="mt-3 text-base font-bold leading-6 text-ink-950">
                  {question.question}
                </h2>
              </PanelHeader>
              <PanelBody>
                <p className="whitespace-pre-wrap rounded-md border border-exam-100 bg-exam-50 p-3 text-sm leading-6 text-ink-950">
                  {answer?.answerText || "No answer saved."}
                </p>
              </PanelBody>
            </Panel>
          );
        })}
      </section>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <Panel>
          <PanelHeader>
            <h2 className="text-base font-bold text-ink-950">Submit</h2>
            <p className="mt-1 text-sm text-ink-600">
              {answeredCount} of {test.questions.length} answers completed
            </p>
          </PanelHeader>
          <PanelBody>
            {error ? (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}
            <div className="space-y-3">
              <Link
                href={`/tests/${test.id}`}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-exam-100 bg-white px-4 text-sm font-semibold text-ink-800 hover:bg-exam-50"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Edit answers
              </Link>
              <Button className="w-full" onClick={score} disabled={isScoring}>
                {isScoring ? (
                  <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                ) : (
                  <Send size={16} aria-hidden="true" />
                )}
                {isScoring ? "Scoring..." : "Submit and score"}
              </Button>
            </div>
          </PanelBody>
        </Panel>
      </aside>
    </div>
  );
}
