import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { assertRateLimit } from "@/lib/rate-limit";
import { answerSubmissionSchema } from "@/lib/schemas";
import { saveAnswersForUserTest } from "@/lib/tests/answers";
import { evaluateTestForUser } from "@/lib/tests/evaluate";
import { z } from "zod";

const evaluateRequestSchema = z.object({
  testId: z.string().min(1),
  answers: answerSubmissionSchema.shape.answers
});

export async function POST(request: Request) {
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

    const input = evaluateRequestSchema.parse(await request.json());

    await saveAnswersForUserTest({
      userId: user.id,
      testId: input.testId,
      submission: { answers: input.answers },
      requireComplete: true
    });

    const result = await evaluateTestForUser({
      userId: user.id,
      testId: input.testId
    });

    return jsonOk({
      resultId: result.id,
      score: result.awardedMarks,
      totalMarks: result.totalMarks,
      percentage: result.percentage,
      feedback: result.detailedEvaluation
    });
  } catch (error) {
    return toApiError(error);
  }
}
