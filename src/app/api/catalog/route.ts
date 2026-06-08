import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireUser().catch(() => null);

    if (!user) {
      return jsonError("Authentication required.", 401);
    }

    const levels = await prisma.level.findMany({
      orderBy: { code: "asc" },
      include: {
        grammarTopics: {
          orderBy: { name: "asc" }
        },
        vocabularySections: {
          orderBy: { name: "asc" }
        },
        sourceReferences: true
      }
    });

    return jsonOk({ levels });
  } catch (error) {
    return toApiError(error);
  }
}
