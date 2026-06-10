import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function PublicHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="border-b border-exam-100 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
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
            href="/resources"
            className="rounded-md px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-exam-50"
          >
            Resources
          </Link>
          <Link
            href="/quizlet"
            className="rounded-md px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-exam-50"
          >
            Quizlet
          </Link>
          <Link
            href="/grammar"
            className="rounded-md px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-exam-50"
          >
            Grammar
          </Link>
          <Link
            href={signedIn ? "/dashboard" : "/login"}
            className="rounded-md bg-exam-700 px-4 py-2 text-sm font-semibold text-white hover:bg-exam-500"
          >
            {signedIn ? "Dashboard" : "Sign in"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
