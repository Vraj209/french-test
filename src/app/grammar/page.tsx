import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildMetadata
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "French Grammar For TEF, TCF, and NCLC 7",
  description:
    "Browse A1 to B2 French grammar topics for TEF Canada, TCF Canada, NCLC 7 preparation, writing, speaking, and comprehension practice.",
  path: "/grammar",
  keywords: [
    "French grammar",
    "TEF grammar",
    "TCF grammar",
    "NCLC 7 French grammar",
    "French grammar practice"
  ]
});

export default async function GrammarPage() {
  const user = await getCurrentUser();

  const levels = await prisma.level.findMany({
    orderBy: { code: "asc" },
    include: {
      grammarTopics: {
        orderBy: { name: "asc" }
      }
    }
  });
  const topicItems = levels.flatMap((level) =>
    level.grammarTopics.map((topic) => ({
      name: `${topic.name} (${level.code})`,
      description: topic.description,
      path: `/lessons/grammar/${level.code.toLowerCase()}/${topic.slug}`
    }))
  );

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <JsonLd
        id="grammar-structured-data"
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "French grammar", path: "/grammar" }
          ]),
          buildItemListJsonLd(topicItems)
        ]}
      />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
            Grammar catalog
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink-950">
            French grammar topics by CEFR level
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Use these topics to target TEF Canada, TCF Canada, writing,
            speaking, comprehension, and NCLC 7 readiness gaps.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {levels.map((level) => (
            <Panel key={level.id}>
              <PanelHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-ink-950">{level.name}</h2>
                    <p className="mt-1 text-sm text-ink-600">{level.cefrSummary}</p>
                  </div>
                  <Badge>{level.code}</Badge>
                </div>
              </PanelHeader>
              <PanelBody>
                <div className="grid gap-2">
                  {level.grammarTopics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/lessons/grammar/${level.code.toLowerCase()}/${topic.slug}`}
                      className="rounded-md border border-exam-100 bg-exam-50 px-3 py-2"
                    >
                      <h3 className="text-sm font-bold text-ink-950">{topic.name}</h3>
                      <p className="mt-1 text-xs leading-5 text-ink-600">
                        {topic.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </PanelBody>
            </Panel>
          ))}
        </div>
      </main>
    </div>
  );
}
