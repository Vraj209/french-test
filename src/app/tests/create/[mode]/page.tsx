import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { TestBuilder } from "@/features/tests/test-builder";
import { preparationModeFromSlug } from "@/features/tests/preparation-mode-routes";
import { getCurrentUser } from "@/lib/auth/session";

type PageProps = {
  params: Promise<{ mode: string }>;
};

export default async function CreateTestModePage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { mode: modeSlug } = await params;
  const preparationMode = preparationModeFromSlug(modeSlug);

  if (!preparationMode) {
    notFound();
  }

  return (
    <AppShell user={user}>
      <TestBuilder
        initialPreparationMode={preparationMode}
        showPreparationModePicker={false}
        skipTestTypeStep={preparationMode === "CEFR_GRAMMAR"}
      />
    </AppShell>
  );
}
