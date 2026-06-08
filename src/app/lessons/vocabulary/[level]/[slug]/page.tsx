import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/layout/public-header";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import {
  parseVocabularyWords,
  vocabularyFrames,
  vocabularyUseCases
} from "@/lib/lesson-cheatsheets";
import { cefrLevelSchema, type CefrLevel } from "@/lib/schemas";

type PageProps = {
  params: Promise<{ level: string; slug: string }>;
};

function parseLevel(value: string): CefrLevel | null {
  const parsed = cefrLevelSchema.safeParse(value.toUpperCase());

  return parsed.success ? parsed.data : null;
}

export default async function VocabularyCheatSheetPage({ params }: PageProps) {
  const user = await getCurrentUser();
  const { level: levelParam, slug } = await params;
  const level = parseLevel(levelParam);

  if (!level) {
    notFound();
  }

  const section = await prisma.vocabularySection.findUnique({
    where: {
      levelCode_slug: {
        levelCode: level,
        slug
      }
    },
    include: {
      level: true
    }
  });

  if (!section) {
    notFound();
  }

  const words = parseVocabularyWords(section.words);
  const useCases = vocabularyUseCases(section.name);
  const frames = vocabularyFrames(words);

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/lessons"
            className="text-sm font-semibold text-exam-700 hover:text-exam-500"
          >
            Back to lessons
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge>{section.levelCode}</Badge>
            <Badge>Vocabulary cheat sheet</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-ink-950">{section.name}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
            {section.description}
          </p>
        </div>

        <div className="space-y-4">
          <Panel>
            <PanelHeader>
              <h2 className="text-lg font-bold text-ink-950">What to know fast</h2>
            </PanelHeader>
            <PanelBody>
              <p className="text-base leading-7 text-ink-800">
                Learn the words as sentence tools, not as isolated translations. In TEF/TCF,
                this theme is useful when you need to describe a situation, explain a
                problem, give an opinion, or propose a solution.
              </p>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader>
              <h2 className="text-base font-bold text-ink-950">Must-know words</h2>
            </PanelHeader>
            <PanelBody>
              <div className="grid gap-2 md:grid-cols-2">
                {words.map((word) => (
                  <div
                    key={word.french}
                    className="rounded-md border border-exam-100 bg-exam-50 p-3"
                  >
                    <p className="text-base font-bold text-ink-950">{word.french}</p>
                    <p className="mt-1 text-sm text-ink-600">{word.english}</p>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <PanelHeader>
                <h2 className="text-base font-bold text-ink-950">Where to use it</h2>
              </PanelHeader>
              <PanelBody>
                <ul className="space-y-2 text-sm leading-6 text-ink-700">
                  {useCases.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader>
                <h2 className="text-base font-bold text-ink-950">Useful verbs</h2>
              </PanelHeader>
              <PanelBody>
                <div className="flex flex-wrap gap-2">
                  {[
                    "décrire",
                    "expliquer",
                    "demander",
                    "proposer",
                    "améliorer",
                    "résoudre",
                    "comparer",
                    "justifier"
                  ].map((verb) => (
                    <Badge key={verb}>{verb}</Badge>
                  ))}
                </div>
              </PanelBody>
            </Panel>
          </div>

          <Panel>
            <PanelHeader>
              <h2 className="text-base font-bold text-ink-950">Sentence frames</h2>
            </PanelHeader>
            <PanelBody>
              <div className="grid gap-2">
                {frames.map((frame) => (
                  <div
                    key={frame}
                    className="rounded-md border border-exam-100 bg-white px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-ink-950">{frame}</p>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <PanelHeader>
                <h2 className="text-base font-bold text-ink-950">Avoid</h2>
              </PanelHeader>
              <PanelBody>
                <ul className="space-y-2 text-sm leading-6 text-ink-700">
                  <li>Memorizing only English translations without examples.</li>
                  <li>Repeating the same noun instead of using synonyms or pronouns.</li>
                  <li>Using vague words like chose, problème, bon without precision.</li>
                </ul>
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader>
                <h2 className="text-base font-bold text-ink-950">Mini drill</h2>
              </PanelHeader>
              <PanelBody>
                <ul className="space-y-2 text-sm leading-6 text-ink-700">
                  <li>Choose 5 words and write one sentence for each.</li>
                  <li>Write one problem sentence and one solution sentence.</li>
                  <li>Use one connector: parce que, donc, cependant, or par conséquent.</li>
                </ul>
              </PanelBody>
            </Panel>
          </div>
        </div>
      </main>
    </div>
  );
}
