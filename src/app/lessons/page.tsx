import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export default async function LessonsPage() {
  const user = await getCurrentUser();
  const levels = await prisma.level.findMany({
    orderBy: { code: "asc" },
    include: {
      vocabularySections: {
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
            Vocabulary
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink-950">
            TEF/TCF vocabulary cheat sheets by level
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Review high-frequency vocabulary themes before generating a focused exam.
            Grammar cheat sheets are available from the grammar catalog.
          </p>
        </div>
        <div className="space-y-4">
          {levels.map((level) => (
            <Panel key={level.id}>
              <PanelHeader>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-ink-950">{level.name}</h2>
                  <Badge>{level.code}</Badge>
                </div>
              </PanelHeader>
              <PanelBody>
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {level.vocabularySections.map((section) => (
                    <Link
                      key={section.id}
                      href={`/lessons/vocabulary/${level.code.toLowerCase()}/${section.slug}`}
                      className="rounded-md border border-exam-100 bg-exam-50 px-3 py-2"
                    >
                      <p className="text-sm font-semibold text-ink-950">
                        {section.name}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-ink-600">
                        {section.description}
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
