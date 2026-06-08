import { put } from "@vercel/blob";
import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { getBlobToken } from "@/lib/env";
import { uploadRequestSchema } from "@/lib/schemas";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxUploadBytes = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const user = await requireUser().catch(() => null);

    if (!user) {
      return jsonError("Authentication required.", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const parsed = uploadRequestSchema.parse({
      testId: formData.get("testId")
    });

    if (!(file instanceof File)) {
      return jsonError("Image file is required.", 422);
    }

    if (!allowedTypes.has(file.type)) {
      return jsonError("Only JPEG, PNG, and WebP answer images are supported.", 422);
    }

    if (file.size > maxUploadBytes) {
      return jsonError("Answer image must be 5 MB or smaller.", 422);
    }

    const test = await prisma.test.findFirst({
      where: {
        id: parsed.testId,
        userId: user.id
      },
      select: { id: true }
    });

    if (!test) {
      return jsonError("Test not found.", 404);
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const pathname = `answers/${user.id}/${test.id}/${Date.now()}-${safeName}`;
    const blob = await put(pathname, file, {
      access: "public",
      token: getBlobToken()
    });

    const image = await prisma.uploadedImage.create({
      data: {
        userId: user.id,
        testId: test.id,
        url: blob.url,
        pathname: blob.pathname,
        contentType: file.type,
        size: file.size
      }
    });

    return jsonOk({ image }, { status: 201 });
  } catch (error) {
    return toApiError(error);
  }
}
