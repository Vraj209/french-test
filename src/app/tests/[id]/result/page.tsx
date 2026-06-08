import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestResultAliasPage({ params }: PageProps) {
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
    select: {
      result: {
        select: { id: true }
      }
    }
  });

  if (!test) {
    notFound();
  }

  if (!test.result) {
    redirect(`/tests/${id}`);
  }

  redirect(`/results/${test.result.id}`);
}
