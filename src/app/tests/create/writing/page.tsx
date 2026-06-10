import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { WritingPreparationDashboard } from "@/features/writing-practice/writing-preparation-dashboard";
import { getCurrentUser } from "@/lib/auth/session";

export default async function WritingPreparationPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell user={user}>
      <WritingPreparationDashboard />
    </AppShell>
  );
}
