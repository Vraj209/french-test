import Link from "next/link";
import { GraduationCap, ClipboardList } from "lucide-react";
import { ProfileMenu } from "@/components/layout/profile-menu";

type AppShellProps = {
  user: {
    name: string | null;
    email: string;
  };
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-exam-50">
      <header className="border-b border-exam-100 bg-white">
        <div className="mx-auto grid min-h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-6 lg:px-8">
          <Link href="/dashboard" className="col-start-1 row-start-1 flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-exam-700 text-white">
              <GraduationCap size={21} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold uppercase tracking-wide text-ink-950">
                French Test AI
              </span>
              <span className="block text-xs text-ink-600">TEF/TCF exam practice</span>
            </span>
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center justify-center gap-2 sm:col-start-2 sm:row-start-1 sm:flex"
          >
            <Link
              href="/resources"
              className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-ink-800 hover:bg-exam-50"
            >
              Resources
            </Link>
            <Link
              href="/quizlet"
              className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-ink-800 hover:bg-exam-50"
            >
              Quizlet
            </Link>
            <Link
              href="/grammar"
              className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-ink-800 hover:bg-exam-50"
            >
              Grammar
            </Link>
          </nav>
          <nav
            aria-label="Actions"
            className="col-start-2 row-start-1 flex items-center justify-self-end gap-2 sm:col-start-3"
          >
            <Link
              href="/tests/create"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-exam-700 px-3 text-sm font-semibold text-white transition hover:bg-exam-500 focus:outline-none focus:ring-2 focus:ring-exam-500 focus:ring-offset-2"
            >
              <ClipboardList size={16} aria-hidden="true" />
              New test
            </Link>
            <ProfileMenu user={user} />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
