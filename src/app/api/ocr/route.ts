import { extractAnswerTextFromImage } from "@/lib/ai/openai";
import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { assertRateLimit } from "@/lib/rate-limit";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxUploadBytes = 5 * 1024 * 1024;

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

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError("Image file is required.", 422);
    }

    if (!allowedTypes.has(file.type)) {
      return jsonError("Only JPEG, PNG, and WebP images are supported.", 422);
    }

    if (file.size > maxUploadBytes) {
      return jsonError("Image must be 5 MB or smaller.", 422);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    const ocr = await extractAnswerTextFromImage(dataUrl);

    return jsonOk({
      extractedText: ocr.extractedText,
      confidence: ocr.confidence,
      warnings: ocr.warnings
    });
  } catch (error) {
    return toApiError(error);
  }
}
