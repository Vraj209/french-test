import Link from "next/link";
import { BookOpen, ClipboardCheck, FileText, ImageUp, MessageSquareText, Sparkles } from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { getCurrentUser } from "@/lib/auth/session";

export default async function HomePage() {
  const user = await getCurrentUser();

  const features = [
    {
      title: "Exam-style generation",
      description: "Generate original TEF Canada, TCF Canada, General TEF, General TCF, or CEFR practice from selected sections and goals.",
      icon: Sparkles
    },
    {
      title: "Grammar topic selection",
      description: "Target weak areas like subjonctif, plus-que-parfait, connectors, and agreement.",
      icon: BookOpen
    },
    {
      title: "Writing evaluation",
      description: "Practice TEF writing A/B and TCF written-expression tasks with structured feedback.",
      icon: FileText
    },
    {
      title: "Image answer upload",
      description: "Upload handwritten or printed answers, extract text, edit it, then submit.",
      icon: ImageUp
    },
    {
      title: "AI coach feedback",
      description: "See estimated marks, corrected answers, weak topics, missing vocabulary, model answers, and next-test recommendations.",
      icon: ClipboardCheck
    },
    {
      title: "Speaking preparation",
      description: "Prepare TEF/TCF oral prompts with argument structure and task-focused feedback.",
      icon: MessageSquareText
    }
  ];

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <main>
        <section className="exam-grid border-b border-exam-100 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                TEF Canada and TCF Canada preparation
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
                Generate exam-style French practice with AI scoring
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink-600">
                Build focused practice for comprehension, writing, speaking preparation,
                grammar, and vocabulary. Submit typed or image-based answers and receive
                estimated practice marks, corrections, CEFR analysis, and NCLC-oriented feedback.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={user ? "/tests/create" : "/register"}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-exam-700 px-5 text-sm font-semibold text-white hover:bg-exam-500"
                >
                  Create TEF/TCF Practice
                </Link>
                <Link
                  href="/grammar"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-exam-100 bg-white px-5 text-sm font-semibold text-ink-800 hover:bg-exam-50"
                >
                  Browse grammar
                </Link>
              </div>
            </div>
            <div className="rounded-lg border border-exam-100 bg-exam-50 p-5 shadow-panel">
              <div className="grid gap-3">
                {["TEF reading: 40 MCQ / 60 min", "TEF listening: 40 MCQ / 40 min", "TCF reading/listening: 39 progressive MCQ", "Writing, speaking, grammar, vocabulary, and full mock modes"].map((item) => (
                  <div key={item} className="rounded-md border border-exam-100 bg-white px-4 py-3 text-sm font-semibold text-ink-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-lg border border-exam-100 bg-white p-5 shadow-panel"
                >
                  <Icon className="text-exam-700" size={22} aria-hidden="true" />
                  <h2 className="mt-4 text-base font-bold text-ink-950">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
