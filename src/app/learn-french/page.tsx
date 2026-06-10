import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  FileText,
  GraduationCap,
  Headphones,
  LibraryBig,
  MessageSquareText,
  PenLine
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
  title: "Learn French For TEF, TCF, and Canadian Immigration",
  description:
    "Learn French with grammar, vocabulary, reading, listening, writing, speaking, TEF Canada, TCF Canada, and NCLC 7 preparation resources.",
  path: "/learn-french",
  keywords: [
    "learn French",
    "French learning",
    "learn French for TEF",
    "learn French for TCF",
    "French grammar practice"
  ]
});

const learningTracks = [
  {
    title: "Start with grammar",
    description:
      "Build sentence control with A1 to B2 grammar topics that support writing, speaking, and comprehension.",
    href: "/grammar",
    icon: LibraryBig
  },
  {
    title: "Add vocabulary themes",
    description:
      "Use vocabulary cheat sheets for daily life, work, immigration, health, technology, and public life.",
    href: "/lessons",
    icon: BookOpenCheck
  },
  {
    title: "Practice TEF Canada",
    description:
      "Move from French foundations into TEF Canada section practice and estimated feedback.",
    href: "/tef-canada",
    icon: GraduationCap
  },
  {
    title: "Practice TCF Canada",
    description:
      "Train TCF-style comprehension and expression tasks for Canada immigration goals.",
    href: "/tcf-canada",
    icon: Headphones
  }
];

const weeklyPlan = [
  "Grammar: fix one topic and write five original sentences.",
  "Vocabulary: learn one theme and use each word in a complete sentence.",
  "Listening: practice short audio and summarize the main idea.",
  "Reading: identify main idea, detail, opinion, and connector logic.",
  "Writing or speaking: produce one answer and review feedback."
];

const faq = [
  {
    question: "What is the best way to learn French for TEF or TCF?",
    answer:
      "Build foundations first, then connect them to exam tasks. Grammar and vocabulary matter because they support clearer writing, speaking, reading, and listening answers."
  },
  {
    question: "Should I study French grammar before exam practice?",
    answer:
      "Yes, but not forever. Study one grammar topic, use it in real sentences, then test it inside TEF or TCF-style tasks."
  },
  {
    question: "How does Francivo help French learners?",
    answer:
      "Francivo combines public study pages with generated practice, estimated scoring, corrections, model answers, and weak-topic feedback after sign-up."
  }
];

export default async function LearnFrenchPage() {
  const user = await getCurrentUser();
  const practiceHref = user ? "/tests/create" : "/register";

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <JsonLd
        id="learn-french-structured-data"
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Learn French", path: "/learn-french" }
          ]),
          buildLearningResourceJsonLd({
            name: "Learn French for TEF, TCF, and Canadian immigration",
            description:
              "A French learning hub connecting grammar, vocabulary, reading, listening, writing, speaking, TEF Canada, TCF Canada, and NCLC preparation.",
            path: "/learn-french",
            educationalLevel: "A1-B2",
            about: ["French learning", "French grammar", "TEF Canada", "TCF Canada"]
          })
        ]}
      />
      <main>
        <section className="border-b border-exam-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <Badge>French learning hub</Badge>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
                Learn French for TEF, TCF, and Canadian immigration
              </h1>
              <p className="mt-5 text-base leading-7 text-ink-600 sm:text-lg sm:leading-8">
                Learn French with a practical path: grammar for accuracy,
                vocabulary for range, listening and reading for comprehension,
                and writing and speaking practice for exam performance.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={practiceHref}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-exam-700 px-6 text-sm font-semibold text-white hover:bg-exam-500"
                >
                  Start free practice
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  href="/grammar"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-exam-100 bg-white px-6 text-sm font-semibold text-ink-800 hover:bg-exam-50"
                >
                  Browse grammar
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
              How should I learn French for TEF or TCF?
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Learn French by connecting every study session to output. A grammar
              rule should become a sentence, a vocabulary list should become an
              answer, and a reading or listening exercise should become a summary
              or opinion.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {learningTracks.map((track) => {
              const Icon = track.icon;

              return (
                <Link
                  key={track.title}
                  href={track.href}
                  className="group rounded-lg border border-exam-100 bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:border-exam-500 hover:shadow-md"
                >
                  <Icon className="text-exam-700" size={22} aria-hidden="true" />
                  <h3 className="mt-4 text-base font-bold text-ink-950">
                    {track.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-600">
                    {track.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-y border-exam-100 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                Weekly routine
              </p>
              <h2 className="mt-1 text-2xl font-bold text-ink-950">
                A simple French learning week
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-600">
                This routine keeps learning active. It avoids passive review by
                making every grammar, vocabulary, reading, or listening session
                produce a sentence, summary, or exam-style answer.
              </p>
            </div>
            <div className="space-y-3">
              {weeklyPlan.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-verdict-700"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-ink-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-exam-700 shadow-panel ring-1 ring-exam-100">
              <FileText size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                Skills
              </p>
              <h2 className="text-2xl font-bold text-ink-950">
                Build all four French skills
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Reading", icon: BookOpenCheck },
              { title: "Listening", icon: Headphones },
              { title: "Writing", icon: PenLine },
              { title: "Speaking", icon: MessageSquareText }
            ].map((skill) => {
              const Icon = skill.icon;

              return (
                <article
                  key={skill.title}
                  className="rounded-lg border border-exam-100 bg-white p-5 shadow-panel"
                >
                  <Icon className="text-exam-700" size={22} aria-hidden="true" />
                  <h3 className="mt-4 text-base font-bold text-ink-950">
                    {skill.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-600">
                    Use this skill in real answers, then review feedback and repeat
                    the weakest pattern.
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-t border-exam-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-4 lg:grid-cols-3">
              {faq.map((item) => (
                <article
                  key={item.question}
                  className="rounded-lg border border-exam-100 bg-white p-5 shadow-panel"
                >
                  <h2 className="text-base font-bold text-ink-950">
                    {item.question}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink-600">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
