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
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-exam-700 text-white">
              <GraduationCap size={21} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-bold uppercase tracking-wide text-ink-950">
                French Test AI
              </span>
              <span className="block text-xs text-ink-600">TEF/TCF exam practice</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/grammar"
              className="hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-ink-800 hover:bg-exam-50 sm:inline-flex"
            >
              Grammar
            </Link>
            <Link
              href="/tests/create"
              className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-ink-800 hover:bg-exam-50"
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
