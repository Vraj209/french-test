import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

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
    const result = await prisma.testResult.findFirst({
      where: {
        id,
        userId: user.id
      },
      include: {
        test: {
          include: {
            questions: {
              orderBy: { position: "asc" }
            },
            answers: true
          }
        },
        questionFeedback: {
          include: { question: true },
          orderBy: { createdAt: "asc" }
        }
      }
    });

    if (!result) {
      return jsonError("Result not found.", 404);
    }

    return jsonOk({ result });
  } catch (error) {
    return toApiError(error);
  }
}
