import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileText, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { formatDate, formatPercent } from "@/lib/utils";

type DashboardProps = {
  tests: Array<{
    id: string;
    title: string;
    level: string;
    examType: string;
    preparationMode: string;
    skillFocus: string;
    totalMarks: number;
    status: string;
    createdAt: Date;
    result: {
      id: string;
      percentage: number;
      awardedMarks: number;
    } | null;
  }>;
};

export function Dashboard({ tests }: DashboardProps) {
  const completed = tests.filter((test) => test.result).length;
  const average =
    completed > 0
      ? tests.reduce((sum, test) => sum + (test.result?.percentage ?? 0), 0) / completed
      : 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <Panel>
          <PanelHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                  Exam workspace
                </p>
                <h1 className="mt-1 text-2xl font-bold text-ink-950">
                  Generate TEF/TCF practice
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600">
                  Select TEF Canada or TCF Canada sections, target NCLC, grammar topics,
                  vocabulary sections, marks, and difficulty. Then type or select answers
                  for scoring. Scores are estimated practice results only.
                </p>
              </div>
              <Link
                href="/tests/create"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-exam-700 px-4 text-sm font-semibold text-white transition hover:bg-exam-500"
              >
                New test
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </PanelHeader>
          <PanelBody>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-exam-100 bg-exam-50 p-4">
                <ClipboardCheck className="text-exam-700" size={20} aria-hidden="true" />
                <p className="mt-3 text-2xl font-bold text-ink-950">{tests.length}</p>
                <p className="text-sm text-ink-600">Generated tests</p>
              </div>
              <div className="rounded-md border border-exam-100 bg-exam-50 p-4">
                <ListChecks className="text-verdict-700" size={20} aria-hidden="true" />
                <p className="mt-3 text-2xl font-bold text-ink-950">{completed}</p>
                <p className="text-sm text-ink-600">Evaluated results</p>
              </div>
              <div className="rounded-md border border-exam-100 bg-exam-50 p-4">
                <FileText className="text-caution-700" size={20} aria-hidden="true" />
                <p className="mt-3 text-2xl font-bold text-ink-950">
                  {completed ? formatPercent(average) : "N/A"}
                </p>
                <p className="text-sm text-ink-600">Estimated average</p>
              </div>
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <h2 className="text-base font-bold text-ink-950">Supported levels</h2>
          </PanelHeader>
          <PanelBody>
            <div className="grid grid-cols-2 gap-2">
              {["A1", "A2", "B1", "B2"].map((level) => (
                <div
                  key={level}
                  className="rounded-md border border-exam-100 bg-white px-3 py-4 text-center"
                >
                  <p className="text-xl font-bold text-exam-700">{level}</p>
                  <p className="text-xs text-ink-600">CEFR</p>
                </div>
              ))}
            </div>
          </PanelBody>
        </Panel>
      </section>

      <Panel>
        <PanelHeader>
          <h2 className="text-base font-bold text-ink-950">Recent exams</h2>
        </PanelHeader>
        <PanelBody className="p-0">
          {tests.length === 0 ? (
            <div className="px-5 py-8 text-sm text-ink-600">
              No exams yet. Create your first TEF/TCF-aligned French practice test.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-exam-100 text-sm">
                <thead className="bg-exam-50 text-left text-xs font-bold uppercase tracking-wide text-ink-600">
                  <tr>
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Focus</th>
                    <th className="px-5 py-3">Level</th>
                    <th className="px-5 py-3">Marks</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Created</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-exam-100 bg-white">
                  {tests.map((test) => (
                    <tr key={test.id}>
                      <td className="px-5 py-4 font-semibold text-ink-950">{test.title}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge>{test.examType.replaceAll("_", " ")}</Badge>
                          <Badge>{test.preparationMode.replaceAll("_", " ")}</Badge>
                          <Badge>{test.skillFocus.replaceAll("_", " ")}</Badge>
                        </div>
                      </td>
                      <td className="px-5 py-4">{test.level}</td>
                      <td className="px-5 py-4">
                        {test.result
                          ? `${test.result.awardedMarks}/${test.totalMarks}`
                          : test.totalMarks}
                      </td>
                      <td className="px-5 py-4">
                        <Badge>{test.status.replace("_", " ")}</Badge>
                      </td>
                      <td className="px-5 py-4 text-ink-600">{formatDate(test.createdAt)}</td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={test.result ? `/results/${test.result.id}` : `/tests/${test.id}`}
                          className="font-semibold text-exam-700 hover:underline"
                        >
                          {test.result ? "View result" : "Continue"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}
