import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Dashboard } from "@/features/dashboard/dashboard";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const tests = await prisma.test.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      level: true,
      examType: true,
      preparationMode: true,
      skillFocus: true,
      totalMarks: true,
      status: true,
      createdAt: true,
      result: {
        select: {
          id: true,
          percentage: true,
          awardedMarks: true
        }
      }
    }
  });

  return (
    <AppShell user={user}>
      <Dashboard tests={tests} />
    </AppShell>
  );
}
