import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { answerSubmissionSchema } from "@/lib/schemas";
import { saveAnswersForUserTest } from "@/lib/tests/answers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await requireUser().catch(() => null);

    if (!user) {
      return jsonError("Authentication required.", 401);
    }

    const { id } = await context.params;
    const input = answerSubmissionSchema.parse(await request.json());
    await saveAnswersForUserTest({
      userId: user.id,
      testId: id,
      submission: input
    });

    return jsonOk({ ok: true });
  } catch (error) {
    return toApiError(error);
  }
}
