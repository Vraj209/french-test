import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { TestReviewClient } from "@/features/tests/test-review-client";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { serializeTestForLearner } from "@/lib/tests/serialize";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestReviewPage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const test = await prisma.test.findFirst({
    where: {
      id,
      userId: user.id
    },
    include: {
      questions: {
        orderBy: { position: "asc" }
      },
      answers: true,
      result: {
        select: { id: true }
      }
    }
  });

  if (!test) {
    notFound();
  }

  if (test.result) {
    redirect(`/results/${test.result.id}`);
  }

  return (
    <AppShell user={user}>
      <TestReviewClient
        test={serializeTestForLearner({ ...test, result: null })}
      />
    </AppShell>
  );
}
