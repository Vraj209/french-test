import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function PublicHeader({ signedIn }: { signedIn: boolean }) {
  const practiceHref = signedIn ? "/tests/create" : "/register";

  return (
    <header className="border-b border-exam-100 bg-white">
      <div className="mx-auto grid min-h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-6 lg:px-8">
        <Link href="/" className="col-start-1 row-start-1 flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-exam-700 text-white">
            <GraduationCap size={21} aria-hidden="true" />
          </span>
          <span className="min-w-0 leading-none">
            <span className="brand-wordmark block text-2xl text-ink-950">Francivo</span>
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="col-span-2 row-start-2 flex flex-wrap items-center justify-center gap-1 sm:col-span-1 sm:col-start-2 sm:row-start-1"
        >
          {[
            { href: "/tef-canada", label: "TEF Canada" },
            { href: "/tcf-canada", label: "TCF Canada" },
            { href: "/nclc-7-french", label: "NCLC 7" },
            { href: "/grammar", label: "Grammar" },
            { href: "/resources", label: "Resources" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-2 text-sm font-semibold text-ink-800 hover:bg-exam-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="col-start-2 row-start-1 flex flex-wrap justify-end gap-2 justify-self-end sm:col-start-3">
          <Link
            href={signedIn ? "/dashboard" : "/login"}
            className="rounded-md border border-exam-100 bg-white px-4 py-2 text-sm font-semibold text-ink-800 hover:bg-exam-50"
          >
            {signedIn ? "Dashboard" : "Sign in"}
          </Link>
          <Link
            href={practiceHref}
            className="rounded-md bg-exam-700 px-4 py-2 text-sm font-semibold text-white hover:bg-exam-500"
          >
            Start practice
          </Link>
        </div>
      </div>
    </header>
  );
}
