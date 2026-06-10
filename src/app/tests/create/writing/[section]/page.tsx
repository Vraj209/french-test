import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { WritingPracticeClient } from "@/features/writing-practice/writing-practice-client";
import {
  writingPracticeSectionBySlug,
  writingPracticeSections
} from "@/features/writing-practice/config";
import { getCurrentUser } from "@/lib/auth/session";

type PageProps = {
  params: Promise<{ section: string }>;
};

export function generateStaticParams() {
  return writingPracticeSections.map((section) => ({
    section: section.slug
  }));
}

export default async function WritingPracticeSectionPage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { section: sectionSlug } = await params;
  const section = writingPracticeSectionBySlug(sectionSlug);

  if (!section) {
    notFound();
  }

  return (
    <AppShell user={user}>
      <WritingPracticeClient section={section} />
    </AppShell>
  );
}
