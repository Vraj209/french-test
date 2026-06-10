import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  MessageSquareText,
  PenLine,
  Sparkles
} from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/session";
import {
  buildBreadcrumbJsonLd,
  buildLearningResourceJsonLd,
  buildMetadata
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "TEF Preparation Plan For Canada PR Learners",
  description:
    "Follow a practical TEF preparation plan for French grammar, vocabulary, writing, speaking, reading, listening, and NCLC 7 readiness.",
  path: "/tef-preparation",
  keywords: [
    "TEF preparation",
    "TEF Canada preparation",
    "TEF study plan",
    "TEF writing preparation",
    "TEF speaking preparation"
  ]
});

const plan = [
  {
    phase: "Weeks 1-2",
    focus: "Diagnostic and foundations",
    action:
      "Generate practice sets, identify weak grammar topics, review A2/B1 structures, and build a vocabulary routine."
  },
  {
    phase: "Weeks 3-5",
    focus: "Section practice",
    action:
      "Rotate reading, listening, writing, and speaking tasks. Keep a mistake log for grammar, vocabulary, and task-completion errors."
  },
  {
    phase: "Weeks 6-8",
    focus: "NCLC 7 readiness",
    action:
      "Move toward B2-level writing and speaking. Practice opinions, examples, concessions, conclusions, and faster comprehension."
  },
  {
    phase: "Weeks 9-12",
    focus: "Timed mock practice",
    action:
      "Use timed sets and full mock sessions. Review feedback, repeat weak sections, and keep answers clear under pressure."
  }
];

const strategies = [
  {
    title: "Writing strategy",
    description:
      "Use a fixed structure: answer the task, organize paragraphs, add examples, use connectors, and proofread agreement and verb forms.",
    icon: PenLine
  },
  {
    title: "Speaking strategy",
    description:
      "Prepare flexible frames for asking questions, defending an opinion, giving examples, and handling contrast.",
    icon: MessageSquareText
  },
  {
    title: "Grammar strategy",
    description:
      "Prioritize errors that repeat in feedback: verb tense, pronouns, agreement, articles, prepositions, and connector logic.",
    icon: Sparkles
  }
];

const checklist = [
  "Can I explain my opinion with two clear reasons?",
  "Can I write a structured TEF-style response without translating from English?",
  "Can I recognize main idea, detail, tone, and inference in reading/listening?",
  "Can I correct my most common grammar errors before submitting?",
  "Can I finish a practice set inside the time limit?"
];

export default async function TefPreparationPage() {
  const user = await getCurrentUser();
  const practiceHref = user ? "/tests/create/tef-canada" : "/register";

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <JsonLd
        id="tef-preparation-structured-data"
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "TEF preparation", path: "/tef-preparation" }
          ]),
          buildLearningResourceJsonLd({
            name: "TEF preparation plan for Canada PR learners",
            description:
              "A practical TEF preparation guide covering diagnostics, section practice, NCLC 7 readiness, and timed mock sessions.",
            path: "/tef-preparation",
            educationalLevel: "A1-B2",
            about: ["TEF preparation", "TEF Canada", "NCLC 7", "French practice"]
          })
        ]}
      />
      <main>
        <section className="border-b border-exam-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <Badge>TEF preparation plan</Badge>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
                TEF preparation plan for Canada PR learners
              </h1>
              <p className="mt-5 text-base leading-7 text-ink-600 sm:text-lg sm:leading-8">
                A strong TEF preparation plan is not just more practice. It is a
                feedback loop: diagnose, study the weak point, practice the exam
                task, review, and repeat with timing.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={practiceHref}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-exam-700 px-6 text-sm font-semibold text-white hover:bg-exam-500"
                >
                  Start TEF practice
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  href="/tef-canada"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-exam-100 bg-white px-6 text-sm font-semibold text-ink-800 hover:bg-exam-50"
                >
                  View TEF Canada guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
              Direct answer
            </p>
            <h2 className="mt-1 text-2xl font-bold text-ink-950">
              What is the best way to prepare for TEF?
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              The best TEF preparation method is targeted repetition. Practice one
              section at a time, review feedback, fix the language issue, then
              repeat the same skill with slightly higher timing pressure.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {plan.map((item) => (
              <article
                key={item.phase}
                className="rounded-lg border border-exam-100 bg-white p-5 shadow-panel"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-exam-50 text-exam-700 ring-1 ring-exam-100">
                    <CalendarDays size={20} aria-hidden="true" />
                  </span>
                  <Badge>{item.phase}</Badge>
                </div>
                <h3 className="mt-4 text-base font-bold text-ink-950">
                  {item.focus}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-600">{item.action}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-exam-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-6 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                Productive skills
              </p>
              <h2 className="mt-1 text-2xl font-bold text-ink-950">
                TEF writing and speaking need structure, not memorized scripts
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {strategies.map((strategy) => {
                const Icon = strategy.icon;

                return (
                  <article
                    key={strategy.title}
                    className="rounded-lg border border-exam-100 bg-white p-5 shadow-panel"
                  >
                    <Icon className="text-exam-700" size={22} aria-hidden="true" />
                    <h3 className="mt-4 text-base font-bold text-ink-950">
                      {strategy.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ink-600">
                      {strategy.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
              Readiness checklist
            </p>
            <h2 className="mt-1 text-2xl font-bold text-ink-950">
              How to know your TEF practice is improving
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              A higher estimated score matters less than stable answers. Look for
              fewer repeated errors, clearer organization, and faster decisions.
            </p>
          </div>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-lg border border-exam-100 bg-white p-4 shadow-panel"
              >
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-verdict-700"
                  aria-hidden="true"
                />
                <p className="text-sm leading-6 text-ink-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-exam-700">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-white">
                Turn the plan into one focused practice session.
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Francivo feedback is estimated practice guidance only, not an
                official TEF, TCF, CLB, or NCLC score.
              </p>
            </div>
            <Link
              href={practiceHref}
              className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-exam-700 hover:bg-exam-50"
            >
              Generate practice
              <FileText size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
