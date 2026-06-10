import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Headphones,
  Mic,
  PenLine,
  Target
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
  title: "TEF Canada Practice For NCLC 7 French",
  description:
    "Prepare for TEF Canada with section-by-section French practice, NCLC 7 study guidance, grammar support, writing tasks, speaking prompts, and estimated feedback.",
  path: "/tef-canada",
  keywords: [
    "TEF Canada practice",
    "TEF preparation",
    "TEF Canada NCLC 7",
    "TEF French test",
    "TEF Canada writing practice"
  ]
});

const sections = [
  {
    title: "Reading",
    description:
      "Practice main idea, detail, inference, vocabulary in context, and text logic questions.",
    icon: FileText
  },
  {
    title: "Listening",
    description:
      "Build speed for announcements, conversations, opinions, tone, and professional situations.",
    icon: Headphones
  },
  {
    title: "Writing",
    description:
      "Train TEF writing task structure, argument development, connectors, register, and grammar accuracy.",
    icon: PenLine
  },
  {
    title: "Speaking",
    description:
      "Prepare information requests, roleplay, defended opinions, examples, and interaction strategy.",
    icon: Mic
  }
];

const preparationSteps = [
  "Set your target as NCLC 7 and work mostly around strong B1 to B2 French.",
  "Build grammar accuracy before adding harder writing and speaking tasks.",
  "Practice each TEF Canada section separately before attempting full mock sessions.",
  "Review feedback for repeated weak topics, not just the estimated score.",
  "Use timed practice after your answer structure is reliable."
];

const faq = [
  {
    question: "How should I prepare for TEF Canada?",
    answer:
      "Start with a diagnostic practice set, fix grammar and vocabulary weaknesses, then rotate reading, listening, writing, and speaking practice. Add timed mock practice only after your answer structure is consistent."
  },
  {
    question: "Can Francivo give an official TEF score?",
    answer:
      "No. Francivo gives estimated practice feedback only. Official scores come from the official TEF Canada testing provider."
  },
  {
    question: "Is TEF Canada useful for Canadian immigration?",
    answer:
      "TEF Canada is commonly used as a French language test option for Canadian immigration pathways. Always confirm current requirements with official immigration and test-provider pages."
  }
];

export default async function TefCanadaPage() {
  const user = await getCurrentUser();
  const practiceHref = user ? "/tests/create/tef-canada" : "/register";

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <JsonLd
        id="tef-canada-structured-data"
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "TEF Canada", path: "/tef-canada" }
          ]),
          buildLearningResourceJsonLd({
            name: "TEF Canada practice for NCLC 7 French",
            description:
              "A TEF Canada preparation guide with section overview, NCLC 7 study guidance, and practice workflow.",
            path: "/tef-canada",
            educationalLevel: "A1-B2",
            about: ["TEF Canada", "NCLC 7", "French test preparation"]
          })
        ]}
      />
      <main>
        <section className="border-b border-exam-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <Badge>TEF Canada preparation</Badge>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
                TEF Canada practice for NCLC 7 French
              </h1>
              <p className="mt-5 text-base leading-7 text-ink-600 sm:text-lg sm:leading-8">
                Francivo helps Canada PR learners practice TEF Canada reading,
                listening, writing, speaking, grammar, and vocabulary with
                estimated practice feedback. It is designed for learners who need a
                clearer path toward NCLC 7 without guessing what to study next.
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
                  href="/nclc-7-french"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-exam-100 bg-white px-6 text-sm font-semibold text-ink-800 hover:bg-exam-50"
                >
                  Read NCLC 7 guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                Direct answer
              </p>
              <h2 className="mt-1 text-2xl font-bold text-ink-950">
                How do you prepare for TEF Canada?
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-600">
                Prepare by targeting the four tested skills, then connecting your
                practice results to a weekly study plan. For NCLC 7, the practical
                focus is strong B1 to B2 control: accurate grammar, clear argument
                structure, precise vocabulary, and steady comprehension under time.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <article
                    key={section.title}
                    className="rounded-lg border border-exam-100 bg-white p-5 shadow-panel"
                  >
                    <Icon className="text-exam-700" size={22} aria-hidden="true" />
                    <h3 className="mt-4 text-base font-bold text-ink-950">
                      {section.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ink-600">
                      {section.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-exam-100 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                NCLC-focused workflow
              </p>
              <h2 className="mt-1 text-2xl font-bold text-ink-950">
                What to practice first for NCLC 7
              </h2>
              <div className="mt-5 space-y-3">
                {preparationSteps.map((step) => (
                  <div key={step} className="flex gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-verdict-700"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-6 text-ink-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-exam-100 bg-exam-50 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-exam-700 ring-1 ring-exam-100">
                  <Target size={22} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-ink-950">
                    Estimated feedback, not official scoring
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    Francivo practice reports can help you spot weak grammar,
                    vocabulary, structure, and task-completion issues. They do not
                    replace official TEF Canada results.
                  </p>
                </div>
              </div>
              <Link
                href="/tef-preparation"
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-exam-700 px-4 text-sm font-semibold text-white hover:bg-exam-500"
              >
                View TEF preparation plan
                <ClipboardCheck size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {faq.map((item) => (
              <article
                key={item.question}
                className="rounded-lg border border-exam-100 bg-white p-5 shadow-panel"
              >
                <h2 className="text-base font-bold text-ink-950">{item.question}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-600">{item.answer}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs leading-5 text-ink-600">
            Official reference: confirm current format and registration details with{" "}
            <a
              href="https://www.lefrancaisdesaffaires.fr/candidat/test-evaluation-francais/tef-canada/presentation/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-exam-700 hover:text-exam-500"
            >
              Le francais des affaires
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
