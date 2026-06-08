import Link from "next/link";
import { GraduationCap } from "lucide-react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  switchLabel: string;
  switchHref: string;
  switchText: string;
  children: React.ReactNode;
};

export function AuthCard({
  title,
  subtitle,
  switchLabel,
  switchHref,
  switchText,
  children
}: AuthCardProps) {
  return (
    <main className="exam-grid flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-exam-100 bg-white shadow-panel">
        <div className="border-b border-exam-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-exam-700 text-white">
              <GraduationCap size={21} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                French Test AI
              </p>
              <h1 className="text-xl font-bold text-ink-950">{title}</h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink-600">{subtitle}</p>
        </div>
        <div className="px-6 py-5">{children}</div>
        <div className="border-t border-exam-100 px-6 py-4 text-sm text-ink-600">
          {switchLabel}{" "}
          <Link href={switchHref} className="font-semibold text-exam-700 hover:underline">
            {switchText}
          </Link>
        </div>
      </section>
    </main>
  );
}
