import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Headphones,
  ImageUp,
  LibraryBig,
  ListChecks,
  MessageSquareText,
  Mic,
  PenLine,
  Sparkles,
  Target,
  Timer,
  Trophy,
  type LucideIcon
} from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "French Test AI | TEF and TCF Practice",
  description:
    "Generate TEF Canada, TCF Canada, writing, speaking, grammar, and vocabulary practice with estimated scoring and AI feedback."
};

type HomeCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type PracticeMode = HomeCard & {
  href: string;
  meta: string[];
};

const proofPoints = [
  "TEF Canada and TCF Canada formats",
  "A1-B2 CEFR grammar and vocabulary",
  "Typed or uploaded written answers"
];

const stats = [
  { value: "A1-B2", label: "CEFR levels" },
  { value: "7", label: "practice modes" },
  { value: "TEF/TCF", label: "exam focus" }
];

const workflowSteps: HomeCard[] = [
  {
    title: "Choose a goal",
    description:
      "Pick TEF Canada, TCF Canada, writing, speaking, grammar, vocabulary, or a full mock exam.",
    icon: Target
  },
  {
    title: "Generate practice",
    description:
      "Set your level, section, question count, timing, target NCLC, and weak topics.",
    icon: Sparkles
  },
  {
    title: "Review feedback",
    description:
      "See estimated marks, corrections, model answers, weak areas, and what to practice next.",
    icon: ClipboardCheck
  }
];

const practiceModes: PracticeMode[] = [
  {
    title: "TEF Canada",
    description:
      "Reading, listening, writing, and speaking practice for Canadian immigration goals.",
    href: "/tests/create/tef-canada",
    meta: ["NCLC target", "Exam sections"],
    icon: GraduationCap
  },
  {
    title: "TCF Canada",
    description:
      "Progressive comprehension and productive tasks based on the TCF Canada structure.",
    href: "/tests/create/tcf-canada",
    meta: ["39-item sections", "Progressive"],
    icon: Headphones
  },
  {
    title: "Writing",
    description:
      "Build sentences, paragraphs, TEF Task 1, and TEF Task 2 responses with untimed coaching.",
    href: "/tests/create/writing",
    meta: ["Untimed", "Model answers"],
    icon: PenLine
  },
  {
    title: "Speaking",
    description:
      "Prepare roleplays, interviews, information requests, and defended opinions.",
    href: "/tests/create/speaking",
    meta: ["Oral prompts", "Strategy"],
    icon: Mic
  },
  {
    title: "Grammar",
    description:
      "Target grammar topics that affect comprehension, writing, and speaking.",
    href: "/tests/create/cefr-grammar",
    meta: ["A1-B2", "Diagnostics"],
    icon: BookOpenCheck
  },
  {
    title: "Full mock",
    description:
      "Combine sections into a timed practice run with an estimated result report.",
    href: "/tests/create/full-mock",
    meta: ["Timed", "Report"],
    icon: Timer
  }
];

const feedbackItems: HomeCard[] = [
  {
    title: "Estimated practice score",
    description:
      "Understand where your answer sits before you spend more time on the next set.",
    icon: Trophy
  },
  {
    title: "Corrections you can act on",
    description:
      "Review grammar, vocabulary, structure, and clarity issues in context.",
    icon: ListChecks
  },
  {
    title: "Model response",
    description:
      "Compare your answer with a stronger version written for the same prompt.",
    icon: FileText
  },
  {
    title: "Image upload support",
    description:
      "Upload handwritten or printed work, extract the text, edit it, then submit.",
    icon: ImageUp
  }
];

const resourceLinks: PracticeMode[] = [
  {
    title: "Grammar catalog",
    description: "Browse topics by level and review weak structures.",
    href: "/grammar",
    meta: ["A1", "A2", "B1", "B2"],
    icon: LibraryBig
  },
  {
    title: "Useful resources",
    description: "Open curated French listening, reading, grammar, and immersion sites.",
    href: "/resources",
    meta: ["Listening", "Reading"],
    icon: BookOpenCheck
  },
  {
    title: "Quizlet folders",
    description: "Review saved vocabulary, grammar, listening, writing, and speaking sets.",
    href: "/quizlet",
    meta: ["Vocabulary", "Recall"],
    icon: MessageSquareText
  }
];

const previewRows = [
  { label: "Exam", value: "TEF Canada - Writing B" },
  { label: "Level", value: "B2 / NCLC 7 target" },
  { label: "Task", value: "Defend an opinion in 200+ words" },
  { label: "Feedback", value: "Score, corrections, model answer, weak topics" }
];

export default async function HomePage() {
  const user = await getCurrentUser();
  const primaryHref = user ? "/tests/create" : "/register";
  const dashboardHref = user ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen overflow-x-hidden bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <main className="min-w-0">
        <section className="hero-ribbon-stage relative flex min-h-[calc(100svh-4rem)] overflow-hidden border-b border-exam-100 bg-white">
          <div className="hero-ribbon-field" aria-hidden="true">
            <span className="hero-ribbon hero-ribbon-blue" />
            <span className="hero-ribbon hero-ribbon-red" />
            <span className="hero-ribbon hero-ribbon-green" />
            <span className="hero-ribbon hero-ribbon-light" />
          </div>
          <div className="relative z-10 mx-auto flex w-full min-w-0 flex-col justify-center px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
            <div className="min-w-0 max-w-7xl">
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700 sm:text-sm">
                TEF Canada and TCF Canada preparation
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-ink-950 sm:text-5xl lg:text-6xl">
                TEF/TCF French exam practice
              </h1>
              <p className="mt-6 min-w-0 max-w-[21rem] text-base leading-7 text-ink-600 sm:max-w-4xl sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                Generate focused French practice, answer like the real exam, and get
                estimated scores with clear feedback for what to improve next.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={primaryHref}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-exam-700 px-6 text-sm font-semibold text-white transition hover:bg-exam-500 focus:outline-none focus:ring-2 focus:ring-exam-500 focus:ring-offset-2 sm:h-14 sm:px-8 sm:text-base"
                >
                  Start practice
                  <ArrowRight size={20} aria-hidden="true" />
                </Link>
                <Link
                  href={dashboardHref}
                  className="inline-flex h-12 items-center justify-center rounded-md border border-exam-100 bg-white px-6 text-sm font-semibold text-ink-800 transition hover:bg-exam-50 focus:outline-none focus:ring-2 focus:ring-exam-500 focus:ring-offset-2 sm:h-14 sm:px-8 sm:text-base"
                >
                  {user ? "View dashboard" : "Sign in"}
                </Link>
              </div>
              <div className="mt-10 grid gap-4 text-sm font-semibold text-ink-800 sm:text-base lg:grid-cols-3 lg:text-lg">
                {proofPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-verdict-700 lg:h-6 lg:w-6"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 break-words">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-exam-100 bg-white/95 shadow-panel backdrop-blur-sm">
            <div className="grid min-w-0 gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="min-w-0 border-b border-exam-100 bg-exam-50 px-5 py-5 lg:border-b-0 lg:border-r">
                <div className="flex min-w-0 items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                      Practice builder
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-ink-950">
                      Build the exact session you need
                    </h2>
                  </div>
                  <span className="rounded-md bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-exam-700 ring-1 ring-exam-100">
                    Ready
                  </span>
                </div>
                <div className="mt-5 min-w-0 divide-y divide-exam-100 rounded-md border border-exam-100 bg-white">
                  {previewRows.map((row) => (
                    <div
                      key={row.label}
                      className="grid min-w-0 gap-1 px-4 py-3 sm:grid-cols-[8rem_1fr]"
                    >
                      <span className="text-xs font-bold uppercase tracking-wide text-ink-600">
                        {row.label}
                      </span>
                      <span className="min-w-0 break-words text-sm font-semibold text-ink-950">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0 px-5 py-5">
                <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                  Result preview
                </p>
                <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-[9rem_1fr]">
                  <div className="min-w-0 rounded-md border border-exam-100 bg-exam-50 p-4 text-center">
                    <p className="text-3xl font-bold text-ink-950">82%</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-600">
                      Estimated
                    </p>
                    <p className="mt-3 text-sm font-semibold text-verdict-700">
                      Strong B2 range
                    </p>
                  </div>
                  <div className="min-w-0 space-y-3">
                    {[
                      "Add more connectors to show contrast and consequence.",
                      "Tighten verb agreement in complex sentences.",
                      "Use a clearer final recommendation in the conclusion."
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex min-w-0 gap-3 rounded-md border border-exam-100 px-3 py-3"
                      >
                        <CheckCircle2
                          className="mt-0.5 shrink-0 text-verdict-700"
                          size={17}
                          aria-hidden="true"
                        />
                        <p className="min-w-0 break-words text-sm leading-6 text-ink-600">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="min-w-0 rounded-md border border-exam-100 bg-white/95 px-4 py-4 shadow-panel backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-exam-700">{stat.value}</p>
                <p className="mt-1 text-sm text-ink-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
              Simple workflow
            </p>
            <h2 className="mt-1 text-2xl font-bold text-ink-950">
              Know what to study before the next practice set
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Move through each practice session in the same order a learner thinks:
              choose a target, answer questions, review feedback, then repeat with a
              better plan.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="rounded-lg border border-exam-100 bg-white p-5 shadow-panel"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-md bg-exam-50 text-exam-700 ring-1 ring-exam-100">
                      <Icon size={21} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-bold text-ink-600">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-ink-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-600">{step.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-exam-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                  Practice modes
                </p>
                <h2 className="mt-1 text-2xl font-bold text-ink-950">
                  Start from the exam section that matters today
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-600">
                  Pick a mode first, then customize the level, timing, section, topics,
                  marks, and question count inside the test builder.
                </p>
              </div>
              <Link
                href="/tests/create"
                className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md border border-exam-100 bg-white px-4 text-sm font-semibold text-ink-800 transition hover:bg-exam-50 focus:outline-none focus:ring-2 focus:ring-exam-500 focus:ring-offset-2"
              >
                View all modes
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {practiceModes.map((mode) => {
                const Icon = mode.icon;

                return (
                  <Link
                    key={mode.title}
                    href={mode.href}
                    className="group flex min-h-52 flex-col justify-between rounded-lg border border-exam-100 bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:border-exam-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-exam-500 focus:ring-offset-2"
                  >
                    <span>
                      <span className="flex items-start justify-between gap-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-exam-50 text-exam-700 ring-1 ring-exam-100 group-hover:bg-white">
                          <Icon size={21} aria-hidden="true" />
                        </span>
                        <ArrowRight
                          className="mt-1 text-ink-600 transition group-hover:translate-x-1 group-hover:text-exam-700"
                          size={18}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-4 block text-base font-bold text-ink-950">
                        {mode.title}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-ink-600">
                        {mode.description}
                      </span>
                    </span>
                    <span className="mt-5 flex flex-wrap gap-2">
                      {mode.meta.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-exam-100 bg-exam-50 px-2.5 py-1 text-xs font-semibold text-ink-800"
                        >
                          {item}
                        </span>
                      ))}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                Feedback
              </p>
              <h2 className="mt-1 text-2xl font-bold text-ink-950">
                Practice reports that make the next step obvious
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-600">
                Scores are estimated practice results, but the feedback is designed to
                reduce guesswork: what was strong, what cost marks, and how to improve
                the next answer.
              </p>
              <Link
                href={primaryHref}
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-exam-700 px-4 text-sm font-semibold text-white transition hover:bg-exam-500 focus:outline-none focus:ring-2 focus:ring-exam-500 focus:ring-offset-2"
              >
                Generate a practice test
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {feedbackItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-lg border border-exam-100 bg-white p-5 shadow-panel"
                  >
                    <Icon className="text-exam-700" size={22} aria-hidden="true" />
                    <h3 className="mt-4 text-base font-bold text-ink-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink-600">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {user ? (
          <section className="border-y border-exam-100 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
              <div className="mb-6 max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                  Study support
                </p>
                <h2 className="mt-1 text-2xl font-bold text-ink-950">
                  Keep learning between generated tests
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-600">
                  Use the built-in study pages and curated outside resources when a result
                  points to grammar, vocabulary, listening, or reading gaps.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {resourceLinks.map((resource) => {
                  const Icon = resource.icon;

                  return (
                    <Link
                      key={resource.title}
                      href={resource.href}
                      className="group rounded-lg border border-exam-100 bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:border-exam-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-exam-500 focus:ring-offset-2"
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-exam-50 text-exam-700 ring-1 ring-exam-100 group-hover:bg-white">
                          <Icon size={21} aria-hidden="true" />
                        </span>
                        <ArrowRight
                          className="mt-1 text-ink-600 transition group-hover:translate-x-1 group-hover:text-exam-700"
                          size={18}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-4 block text-base font-bold text-ink-950">
                        {resource.title}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-ink-600">
                        {resource.description}
                      </span>
                      <span className="mt-5 flex flex-wrap gap-2">
                        {resource.meta.map((item) => (
                          <span
                            key={item}
                            className="rounded-md border border-exam-100 bg-exam-50 px-2.5 py-1 text-xs font-semibold text-ink-800"
                          >
                            {item}
                          </span>
                        ))}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-exam-700">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-wide text-white/75">
                Ready for the next session
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                Generate one focused TEF/TCF practice set and review the feedback.
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Start small with one section, then build toward timed full mock practice
                when your weak areas are clearer.
              </p>
            </div>
            <Link
              href={primaryHref}
              className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-exam-700 transition hover:bg-exam-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-exam-700"
            >
              Start practice
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
