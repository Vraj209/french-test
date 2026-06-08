import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { TestBuilder } from "@/features/tests/test-builder";
import { getCurrentUser } from "@/lib/auth/session";

export default async function CreateTestPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell user={user}>
      <TestBuilder />
    </AppShell>
  );
}
