import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Mail,
  PenLine,
  Rows3,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { writingPracticeSections } from "@/features/writing-practice/config";
import type { WritingPracticeSection } from "@/lib/schemas";

const sectionIcons: Record<WritingPracticeSection, LucideIcon> = {
  SENTENCE_BUILDING: PenLine,
  TOPIC_PARAGRAPH: Rows3,
  TEF_TASK_1: Mail,
  TEF_TASK_2: FileText
};

export function WritingPreparationDashboard() {
  return (
    <div className="space-y-6">
      <Panel>
        <PanelHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                Writing preparation
              </p>
              <h1 className="mt-1 text-2xl font-bold text-ink-950">
                Guided writing practice
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
                Build writing skill step by step with untimed prompts, revision,
                corrections, vocabulary suggestions, structure coaching, and model
                answers before attempting a full mock exam.
              </p>
            </div>
            <Badge className="w-fit border-verdict-500/30 bg-green-50 text-verdict-700">
              No countdown timer
            </Badge>
          </div>
        </PanelHeader>
        <PanelBody>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Practice slowly",
              "Revise after feedback",
              "Use mock timing only in Full Mock"
            ].map((item) => (
              <div
                key={item}
                className="rounded-md border border-exam-100 bg-exam-50 p-4"
              >
                <Sparkles className="text-exam-700" size={19} aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-ink-950">{item}</p>
              </div>
            ))}
          </div>
        </PanelBody>
      </Panel>

      <section className="grid gap-3 md:grid-cols-2">
        {writingPracticeSections.map((section) => {
          const Icon = sectionIcons[section.section];

          return (
            <Link
              key={section.section}
              href={`/tests/create/writing/${section.slug}`}
              className="group flex min-h-64 flex-col justify-between rounded-md border border-exam-100 bg-white p-5 shadow-panel transition hover:border-exam-500 hover:bg-exam-50"
            >
              <span>
                <span className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-exam-50 text-exam-700 group-hover:bg-white">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="mt-1 text-ink-600 transition group-hover:translate-x-1 group-hover:text-exam-700"
                    size={18}
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-4 block text-base font-bold text-ink-950">
                  {section.title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-ink-600">
                  {section.description}
                </span>
              </span>
              <span className="mt-5 flex flex-wrap gap-2">
                {section.focusAreas.slice(0, 4).map((focus) => (
                  <Badge key={focus}>{focus}</Badge>
                ))}
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
