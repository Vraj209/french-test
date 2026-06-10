import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  Mic,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { preparationModeLabels } from "@/lib/exam-catalog";
import type { PreparationMode } from "@/lib/schemas";
import { preparationModeSlugs } from "@/features/tests/preparation-mode-routes";

const modeCards: Array<{
  mode: PreparationMode;
  title: string;
  description: string;
  meta: string[];
  icon: typeof GraduationCap;
}> = [
  {
    mode: "CEFR_GRAMMAR",
    title: "Grammar Practice",
    description: "Target A1-B2 grammar concepts that matter most for TEF/TCF success.",
    meta: ["A1-B2", "Grammar", "Diagnostics"],
    icon: BookOpenCheck
  },
  {
    mode: "WRITING_PRACTICE",
    title: "Writing Practice",
    description: "Use untimed sentence, paragraph, TEF Task 1, and TEF Task 2 practice with AI coaching.",
    meta: ["Untimed", "Corrections", "Model answers"],
    icon: FileText
  },
  {
    mode: "SPEAKING_PRACTICE",
    title: "Speaking Practice",
    description: "Practice interviews, roleplay, information requests, and defended opinions.",
    meta: ["Roleplay", "Opinion", "Strategy tips"],
    icon: Mic
  },
  {
    mode: "TEF_CANADA_PRACTICE",
    title: "TEF Canada Practice",
    description: "Build reading, listening, writing, speaking, grammar, or vocabulary practice for TEF Canada.",
    meta: ["TEF Canada", "NCLC target", "Exam sections"],
    icon: GraduationCap
  },
  {
    mode: "FULL_MOCK_EXAM",
    title: "Full Mock Exam",
    description: "Use official-style section timing, section counts, and an estimated practice report.",
    meta: ["Timed", "Full test", "Estimated report"],
    icon: ClipboardList
  }
];

export function TestModeSelection() {
  return (
    <div className="space-y-6">
      <section className="rounded-md border border-exam-100 bg-white px-5 py-5 shadow-panel">
        <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
          New practice
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink-950">
              Choose how you want to practice
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
              Start with a focused mode, then adjust exam type, level, section, topics,
              marks, question count, and timing on the next page.
            </p>
          </div>
          <Badge>Estimated practice scores only</Badge>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modeCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.mode}
              href={`/tests/create/${preparationModeSlugs[card.mode]}`}
              className="group flex min-h-48 flex-col justify-between rounded-md border border-exam-100 bg-white p-5 shadow-panel transition hover:border-exam-500 hover:bg-exam-50"
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
                  {card.title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-ink-600">
                  {card.description}
                </span>
              </span>
              <span className="mt-4 flex flex-wrap gap-2">
                <Badge>{preparationModeLabels[card.mode]}</Badge>
                {card.meta.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
