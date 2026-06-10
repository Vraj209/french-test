import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicHeader } from "@/components/layout/public-header";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export default async function GrammarPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const levels = await prisma.level.findMany({
    orderBy: { code: "asc" },
    include: {
      grammarTopics: {
        orderBy: { name: "asc" }
      }
    }
  });

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
            Grammar catalog
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink-950">
            Grammar topics by CEFR level
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Use these topics to target TEF/TCF writing, speaking, and comprehension gaps.
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
