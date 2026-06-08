import { extractAnswerTextFromImage } from "@/lib/ai/openai";
import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { assertRateLimit } from "@/lib/rate-limit";
import { ocrExtractRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const user = await requireUser().catch(() => null);

    if (!user) {
      return jsonError("Authentication required.", 401);
    }

    assertRateLimit({
      key: `ai:ocr:${user.id}`,
      limit: 20,
      windowMs: 60_000
    });

    const input = ocrExtractRequestSchema.parse(await request.json());
    const image = await prisma.uploadedImage.findFirst({
      where: {
        id: input.imageId,
        userId: user.id
      }
    });

    if (!image) {
      return jsonError("Image not found.", 404);
    }

    const ocr = await extractAnswerTextFromImage(image.url);

    await prisma.uploadedImage.update({
      where: { id: image.id },
      data: { extractedText: ocr.extractedText }
    });

    return jsonOk({ ocr });
  } catch (error) {
    return toApiError(error);
  }
}
