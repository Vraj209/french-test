import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/layout/public-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { buildGrammarCheatSheet } from "@/lib/lesson-cheatsheets";
import { cefrLevelSchema, type CefrLevel } from "@/lib/schemas";
import {
  buildBreadcrumbJsonLd,
  buildLearningResourceJsonLd,
  buildMetadata
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ level: string; slug: string }>;
};

function parseLevel(value: string): CefrLevel | null {
  const parsed = cefrLevelSchema.safeParse(value.toUpperCase());

  return parsed.success ? parsed.data : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { level: levelParam, slug } = await params;
  const level = parseLevel(levelParam);

  if (!level) {
    return buildMetadata({
      title: "French Grammar Cheat Sheet",
      description:
        "French grammar cheat sheets for TEF Canada, TCF Canada, and NCLC preparation.",
      path: `/lessons/grammar/${levelParam}/${slug}`
    });
  }

  const topic = await prisma.grammarTopic.findUnique({
    where: {
      levelCode_slug: {
        levelCode: level,
        slug
      }
    },
    select: {
      name: true,
      description: true
    }
  });

  return buildMetadata({
    title: topic ? `${topic.name} French Grammar Cheat Sheet` : "French Grammar Cheat Sheet",
    description:
      topic?.description ||
      "French grammar cheat sheets for TEF Canada, TCF Canada, and NCLC preparation.",
    path: `/lessons/grammar/${level.toLowerCase()}/${slug}`,
    keywords: [
      `${topic?.name || "French grammar"} practice`,
      "French grammar",
      "TEF grammar",
      "TCF grammar",
      "NCLC French"
    ]
  });
}

export default async function GrammarCheatSheetPage({ params }: PageProps) {
  const user = await getCurrentUser();
  const { level: levelParam, slug } = await params;
  const level = parseLevel(levelParam);

  if (!level) {
    notFound();
  }

  const topic = await prisma.grammarTopic.findUnique({
    where: {
      levelCode_slug: {
        levelCode: level,
        slug
      }
    },
    include: {
      level: true,
      lessons: {
        orderBy: { title: "asc" },
        take: 1
      }
    }
  });

  if (!topic) {
    notFound();
  }

  const lesson = topic.lessons[0];
  const sheet = buildGrammarCheatSheet(topic.name, level);
  const canDo = stringArray(lesson?.cefrCanDo);

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <JsonLd
        id="grammar-lesson-structured-data"
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "French grammar", path: "/grammar" },
            {
              name: topic.name,
              path: `/lessons/grammar/${level.toLowerCase()}/${topic.slug}`
            }
          ]),
          buildLearningResourceJsonLd({
            name: `${topic.name} French grammar cheat sheet`,
            description:
              topic.description ||
              `${topic.name} grammar practice for TEF Canada, TCF Canada, and NCLC preparation.`,
            path: `/lessons/grammar/${level.toLowerCase()}/${topic.slug}`,
            educationalLevel: topic.levelCode,
            about: ["French grammar", "TEF Canada", "TCF Canada", "NCLC preparation"],
            learningResourceType: "Cheat sheet"
          })
        ]}
      />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/lessons"
            className="text-sm font-semibold text-exam-700 hover:text-exam-500"
          >
            Back to lessons
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge>{topic.levelCode}</Badge>
            <Badge>Grammar cheat sheet</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-ink-950">{topic.name}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
            {topic.description}
          </p>
        </div>

        <div className="space-y-4">
          <Panel>
            <PanelHeader>
              <h2 className="text-lg font-bold text-ink-950">Quick rule</h2>
            </PanelHeader>
            <PanelBody>
              <p className="text-base leading-7 text-ink-800">{sheet.rule}</p>
            </PanelBody>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <PanelHeader>
                <h2 className="text-base font-bold text-ink-950">Patterns to memorize</h2>
              </PanelHeader>
              <PanelBody>
                <ul className="space-y-2 text-sm leading-6 text-ink-700">
                  {sheet.patterns.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader>
                <h2 className="text-base font-bold text-ink-950">Where to use it</h2>
              </PanelHeader>
              <PanelBody>
                <ul className="space-y-2 text-sm leading-6 text-ink-700">
                  {sheet.useWhen.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </PanelBody>
            </Panel>
          </div>

          <Panel>
            <PanelHeader>
              <h2 className="text-base font-bold text-ink-950">High-value examples</h2>
            </PanelHeader>
            <PanelBody>
              <div className="grid gap-3">
                {sheet.examples.map((example) => (
                  <div
                    key={example.french}
                    className="rounded-md border border-exam-100 bg-exam-50 p-3"
                  >
                    <p className="text-base font-semibold text-ink-950">{example.french}</p>
                    <p className="mt-1 text-sm text-ink-600">{example.english}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-exam-700">
                      {example.note}
                    </p>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <PanelHeader>
                <h2 className="text-base font-bold text-ink-950">Common mistakes</h2>
              </PanelHeader>
              <PanelBody>
                <ul className="space-y-2 text-sm leading-6 text-ink-700">
                  {sheet.avoid.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader>
                <h2 className="text-base font-bold text-ink-950">Mini drill</h2>
              </PanelHeader>
              <PanelBody>
                <ul className="space-y-2 text-sm leading-6 text-ink-700">
                  {sheet.drill.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </PanelBody>
            </Panel>
          </div>

          {canDo.length > 0 ? (
            <Panel>
              <PanelHeader>
                <h2 className="text-base font-bold text-ink-950">Exam target</h2>
              </PanelHeader>
              <PanelBody>
                <div className="flex flex-wrap gap-2">
                  {canDo.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </PanelBody>
            </Panel>
          ) : null}
        </div>
      </main>
    </div>
  );
}
