import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  FileText,
  GraduationCap,
  Headphones,
  Mic,
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
  title: "How To Get NCLC 7 In French",
  description:
    "Learn how to prepare for NCLC 7 in French with TEF Canada or TCF Canada practice, B2-level grammar, writing, speaking, listening, and reading strategy.",
  path: "/nclc-7-french",
  keywords: [
    "how to get NCLC 7 in French",
    "NCLC 7 French",
    "TEF NCLC 7",
    "TCF NCLC 7",
    "French B2 NCLC 7"
  ]
});

const skillTargets = [
  {
    title: "Reading",
    description:
      "Find main ideas, details, opinions, logic, and vocabulary meaning without translating every word.",
    icon: BookOpenCheck
  },
  {
    title: "Listening",
    description:
      "Recognize speaker intent, tone, key details, and implied meaning at natural speed.",
    icon: Headphones
  },
  {
    title: "Writing",
    description:
      "Write organized answers with a clear position, examples, connectors, and accurate grammar.",
    icon: PenLine
  },
  {
    title: "Speaking",
    description:
      "Answer directly, ask relevant questions, defend opinions, and keep speech organized.",
    icon: Mic
  }
];

const roadmap = [
  "Confirm whether TEF Canada or TCF Canada is the test you plan to take.",
  "Run a diagnostic practice set and identify the weakest skill first.",
  "Repair high-frequency grammar: verb tense, agreement, pronouns, articles, and prepositions.",
  "Build B2-style connectors for cause, consequence, contrast, purpose, and concession.",
  "Practice writing and speaking tasks with feedback until your structure is automatic.",
  "Add timed practice and full mock sessions only after your accuracy improves."
];

const faq = [
  {
    question: "What is NCLC 7?",
    answer:
      "NCLC 7 is a Canadian French benchmark level used to describe functional language ability across listening, speaking, reading, and writing. For test preparation, many learners treat it as a strong intermediate to upper-intermediate target."
  },
  {
    question: "What French level is needed for NCLC 7?",
    answer:
      "A practical study target is strong B1 moving into B2. Learners usually need B2-style control for argumentation, comprehension, and precise grammar, while still fixing B1 errors."
  },
  {
    question: "Can I get NCLC 7 by memorizing templates?",
    answer:
      "Templates can help with structure, but they are not enough. You need flexible grammar, vocabulary range, task completion, comprehension strategy, and consistent practice under time."
  }
];

export default async function NclcSevenFrenchPage() {
  const user = await getCurrentUser();
  const practiceHref = user ? "/tests/create/tef-canada" : "/register";

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <JsonLd
        id="nclc-7-structured-data"
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "NCLC 7 French", path: "/nclc-7-french" }
          ]),
          buildLearningResourceJsonLd({
            name: "How to get NCLC 7 in French",
            description:
              "A direct guide to NCLC 7 French preparation with TEF Canada, TCF Canada, grammar, writing, speaking, reading, and listening practice.",
            path: "/nclc-7-french",
            educationalLevel: "B1-B2",
            about: ["NCLC 7", "TEF Canada", "TCF Canada", "French learning"]
          })
        ]}
      />
      <main>
        <section className="border-b border-exam-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <Badge>NCLC 7 French guide</Badge>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
                How to get NCLC 7 in French
              </h1>
              <p className="mt-5 text-base leading-7 text-ink-600 sm:text-lg sm:leading-8">
                To work toward NCLC 7 in French, train all four skills with
                exam-style tasks, repair repeated grammar errors, build B2-level
                vocabulary and connectors, and use feedback after every practice
                session. Francivo helps turn that into a repeatable routine.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={practiceHref}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-exam-700 px-6 text-sm font-semibold text-white hover:bg-exam-500"
                >
                  Start NCLC-focused practice
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  href="/grammar"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-exam-100 bg-white px-6 text-sm font-semibold text-ink-800 hover:bg-exam-50"
                >
                  Review French grammar
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                Direct answer
              </p>
              <h2 className="mt-1 text-2xl font-bold text-ink-950">
                What French level is needed for NCLC 7?
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-600">
                For practical preparation, aim for strong B1 moving into B2. That
                means you can understand common written and spoken situations,
                organize ideas clearly, explain opinions, and control common
                grammar without constant breakdowns.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {skillTargets.map((skill) => {
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
                      {skill.description}
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
                Roadmap
              </p>
              <h2 className="mt-1 text-2xl font-bold text-ink-950">
                How can I get NCLC 7 in French?
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-600">
                Use this order. It prevents the common mistake of jumping into
                full mock exams before grammar, vocabulary, and answer structure
                are stable enough.
              </p>
            </div>
            <div className="space-y-3">
              {roadmap.map((step) => (
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
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-exam-700 shadow-panel ring-1 ring-exam-100">
              <GraduationCap size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                TEF or TCF
              </p>
              <h2 className="text-2xl font-bold text-ink-950">
                Choose the test, then train the skills
              </h2>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Link
              href="/tef-canada"
              className="group rounded-lg border border-exam-100 bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:border-exam-500 hover:shadow-md"
            >
              <FileText className="text-exam-700" size={22} aria-hidden="true" />
              <h3 className="mt-4 text-base font-bold text-ink-950">
                TEF Canada for NCLC 7
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Use TEF-focused practice for reading, listening, writing, and
                speaking tasks connected to Canada immigration goals.
              </p>
            </Link>
            <Link
              href="/tcf-canada"
              className="group rounded-lg border border-exam-100 bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:border-exam-500 hover:shadow-md"
            >
              <Headphones className="text-exam-700" size={22} aria-hidden="true" />
              <h3 className="mt-4 text-base font-bold text-ink-950">
                TCF Canada for NCLC 7
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Use TCF-focused practice for progressive comprehension, written
                expression, oral expression, and task completion.
              </p>
            </Link>
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
            <p className="mt-6 text-xs leading-5 text-ink-600">
              Francivo provides estimated practice feedback only. It does not issue
              official TEF, TCF, CLB, or NCLC results.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
