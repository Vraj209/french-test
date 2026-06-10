import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  FileText,
  Headphones,
  MessageSquareText,
  Mic,
  Timer
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
  title: "TCF Canada Practice For French Immigration Goals",
  description:
    "Prepare for TCF Canada with French listening, reading, writing, speaking, grammar, vocabulary, and NCLC-focused practice for Canada immigration learners.",
  path: "/tcf-canada",
  keywords: [
    "TCF Canada practice",
    "TCF preparation",
    "TCF Canada NCLC",
    "TCF French test",
    "TCF Canada speaking practice"
  ]
});

const sections = [
  {
    title: "Listening comprehension",
    description:
      "Train short audio, everyday situations, speaker intention, tone, and progressive difficulty.",
    icon: Headphones
  },
  {
    title: "Reading comprehension",
    description:
      "Practice notices, messages, articles, detail questions, inference, and vocabulary in context.",
    icon: BookOpenCheck
  },
  {
    title: "Written expression",
    description:
      "Prepare task-based writing with clear structure, relevant content, connectors, and accurate forms.",
    icon: FileText
  },
  {
    title: "Oral expression",
    description:
      "Build interview answers, interaction strategy, opinion development, and spoken organization.",
    icon: Mic
  }
];

const comparison = [
  {
    label: "Best first step",
    tef: "Practice TEF sections and productive tasks by skill.",
    tcf: "Practice progressive comprehension and task-based expression."
  },
  {
    label: "NCLC focus",
    tef: "Use feedback to close grammar, writing, and speaking gaps.",
    tcf: "Use feedback to improve comprehension speed and task completion."
  },
  {
    label: "Francivo workflow",
    tef: "Generate section practice, review marks, then repeat weak areas.",
    tcf: "Generate TCF-focused prompts, review feedback, then increase timing pressure."
  }
];

const faq = [
  {
    question: "How is TCF Canada preparation different from general French study?",
    answer:
      "TCF Canada preparation should connect French grammar and vocabulary to test tasks. General study builds language range, but TCF practice trains timing, comprehension strategy, written tasks, and oral response structure."
  },
  {
    question: "What French level should I target for TCF Canada and NCLC 7?",
    answer:
      "Many learners use B2-oriented practice as a practical target for NCLC 7 readiness, while still repairing B1 grammar and vocabulary gaps that cost marks."
  },
  {
    question: "Does Francivo replace official TCF Canada testing?",
    answer:
      "No. Francivo provides practice prompts and estimated feedback. Official results come only from official TCF Canada testing."
  }
];

export default async function TcfCanadaPage() {
  const user = await getCurrentUser();
  const practiceHref = user ? "/tests/create/tcf-canada" : "/register";

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <JsonLd
        id="tcf-canada-structured-data"
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "TCF Canada", path: "/tcf-canada" }
          ]),
          buildLearningResourceJsonLd({
            name: "TCF Canada practice for French immigration goals",
            description:
              "A TCF Canada preparation guide with section overview, Canada immigration context, and practice workflow.",
            path: "/tcf-canada",
            educationalLevel: "A1-B2",
            about: ["TCF Canada", "NCLC", "French test preparation"]
          })
        ]}
      />
      <main>
        <section className="border-b border-exam-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <Badge>TCF Canada preparation</Badge>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
                TCF Canada practice for French immigration goals
              </h1>
              <p className="mt-5 text-base leading-7 text-ink-600 sm:text-lg sm:leading-8">
                Francivo helps learners prepare for TCF Canada with focused
                listening, reading, writing, speaking, grammar, and vocabulary
                practice. The goal is practical readiness: understand the task,
                answer clearly, then use feedback to fix the next weakness.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={practiceHref}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-exam-700 px-6 text-sm font-semibold text-white hover:bg-exam-500"
                >
                  Start TCF practice
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  href="/learn-french"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-exam-100 bg-white px-6 text-sm font-semibold text-ink-800 hover:bg-exam-50"
                >
                  Build French foundations
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
              How do you prepare for TCF Canada?
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Prepare by combining French foundations with TCF-style tasks:
              comprehension practice for speed and accuracy, written tasks for
              structure, and oral tasks for clear interaction and opinion
              development. Review repeated mistakes after every set.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        </section>

        <section className="border-y border-exam-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-exam-50 text-exam-700 ring-1 ring-exam-100">
                <Timer size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                  TEF vs TCF Canada
                </p>
                <h2 className="text-2xl font-bold text-ink-950">
                  Which practice path should you choose?
                </h2>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-exam-100">
              <div className="grid bg-exam-50 text-xs font-bold uppercase tracking-wide text-ink-600 md:grid-cols-[0.7fr_1fr_1fr]">
                <div className="px-4 py-3">Decision point</div>
                <div className="px-4 py-3">TEF Canada</div>
                <div className="px-4 py-3">TCF Canada</div>
              </div>
              {comparison.map((row) => (
                <div
                  key={row.label}
                  className="grid border-t border-exam-100 bg-white text-sm leading-6 text-ink-700 md:grid-cols-[0.7fr_1fr_1fr]"
                >
                  <div className="px-4 py-3 font-semibold text-ink-950">{row.label}</div>
                  <div className="px-4 py-3">{row.tef}</div>
                  <div className="px-4 py-3">{row.tcf}</div>
                </div>
              ))}
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
          <div className="mt-6 flex gap-3 rounded-lg border border-exam-100 bg-white p-4">
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-verdict-700"
              aria-hidden="true"
            />
            <p className="text-xs leading-5 text-ink-600">
              Official reference: confirm current TCF Canada format and registration
              details with{" "}
              <a
                href="https://www.france-education-international.fr/article/test-de-connaissance-du-francais-pour-le-canada?langue=fr"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-exam-700 hover:text-exam-500"
              >
                France Education international
              </a>
              .
            </p>
          </div>
          <Link
            href={practiceHref}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-exam-700 px-5 text-sm font-semibold text-white hover:bg-exam-500"
          >
            Generate TCF Canada practice
            <MessageSquareText size={16} aria-hidden="true" />
          </Link>
        </section>
      </main>
    </div>
  );
}
