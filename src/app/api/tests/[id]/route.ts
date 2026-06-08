import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { serializeTestForLearner } from "@/lib/tests/serialize";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await requireUser().catch(() => null);

    if (!user) {
      return jsonError("Authentication required.", 401);
    }

    const { id } = await context.params;
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
        result: true
      }
    });

    if (!test) {
      return jsonError("Test not found.", 404);
    }

    return jsonOk({ test: serializeTestForLearner(test) });
  } catch (error) {
    return toApiError(error);
  }
}
