import type { Metadata } from "next";
import {
  ArrowUpRight,
  BookOpenText,
  Brain,
  Headphones,
  MessageSquareText,
  PenLine,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { JsonLd } from "@/components/seo/json-ld";
import { getCurrentUser } from "@/lib/auth/session";
import {
  buildBreadcrumbJsonLd,
  buildLearningResourceJsonLd,
  buildMetadata
} from "@/lib/seo";

type QuizletFolder = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const quizletFolders: QuizletFolder[] = [
  {
    title: "Vocabulary 1",
    description: "Core vocabulary sets for daily review and recall practice.",
    href: "https://quizlet.com/user/Vraj_0010/folders/vocabulary-1?i=74azv3&x=1xqt",
    icon: BookOpenText
  },
  {
    title: "Vocabulary 2",
    description: "Additional vocabulary sets for expanding active French range.",
    href: "https://quizlet.com/user/Vraj_0010/folders/vocabulary-2?i=74azv3&x=1xqt",
    icon: Sparkles
  },
  {
    title: "Grammar",
    description: "Grammar-focused sets for forms, structures, and sentence patterns.",
    href: "https://quizlet.com/user/Vraj_0010/folders/grammar?i=74azv3&x=1xqt",
    icon: Brain
  },
  {
    title: "Listening Vocabulary",
    description: "Vocabulary sets aimed at faster recognition during listening tasks.",
    href: "https://quizlet.com/user/Vraj_0010/folders/listening-vocabulary?i=74azv3&x=1xqt",
    icon: Headphones
  },
  {
    title: "Writing",
    description: "Writing vocabulary and phrase sets for structured exam responses.",
    href: "https://quizlet.com/user/Vraj_0010/folders/writing?i=74azv3&x=1xqt",
    icon: PenLine
  },
  {
    title: "Speaking Vocab",
    description: "Speaking vocabulary sets for oral practice and interview prompts.",
    href: "https://quizlet.com/user/Vraj_0010/folders/speaking-vocab?i=74azv3&x=1xqt",
    icon: MessageSquareText
  }
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "French Quizlet Folders For TEF and TCF Practice",
    description:
      "Quizlet folders for French vocabulary, grammar, listening, writing, and speaking practice for TEF Canada, TCF Canada, and NCLC preparation.",
    path: "/quizlet",
    keywords: [
      "French Quizlet",
      "TEF vocabulary",
      "TCF vocabulary",
      "French grammar Quizlet",
      "NCLC French vocabulary"
    ]
  })
};

export default async function QuizletPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <JsonLd
        id="quizlet-structured-data"
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "French Quizlet folders", path: "/quizlet" }
          ]),
          buildLearningResourceJsonLd({
            name: "French Quizlet folders for TEF and TCF practice",
            description:
              "External Quizlet folders for French vocabulary, grammar, listening, writing, and speaking review.",
            path: "/quizlet",
            about: ["French vocabulary", "French grammar", "TEF Canada", "TCF Canada"]
          })
        ]}
      />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
            Quizlet folders
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink-950">
            Review French vocabulary and grammar on Quizlet
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Open the saved Quizlet folders for targeted TEF/TCF vocabulary,
            grammar, listening, writing, and speaking practice.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizletFolders.map((folder) => {
            const Icon = folder.icon;

            return (
              <a
                key={folder.title}
                href={folder.href}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-40 flex-col rounded-lg border border-exam-100 bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:border-exam-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-exam-500 focus:ring-offset-2"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-exam-50 text-exam-700 ring-1 ring-exam-100">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <span className="mt-4 block text-base font-bold text-ink-950">
                  {folder.title}
                </span>
                <span className="mt-2 block flex-1 text-sm leading-6 text-ink-600">
                  {folder.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-exam-700">
                  Open on Quizlet
                  <ArrowUpRight size={13} aria-hidden="true" />
                </span>
              </a>
            );
          })}
        </div>
      </main>
    </div>
  );
}
