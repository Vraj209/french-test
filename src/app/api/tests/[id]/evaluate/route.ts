import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { assertRateLimit } from "@/lib/rate-limit";
import { evaluateTestForUser } from "@/lib/tests/evaluate";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = await requireUser().catch(() => null);

    if (!user) {
      return jsonError("Authentication required.", 401);
    }

    assertRateLimit({
      key: `ai:evaluate:${user.id}`,
      limit: 20,
      windowMs: 60_000
    });

    const { id } = await context.params;
    const result = await evaluateTestForUser({
      userId: user.id,
      testId: id
    });

    return jsonOk({ result });
  } catch (error) {
    return toApiError(error);
  }
}
