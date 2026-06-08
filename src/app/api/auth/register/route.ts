import { Prisma } from "@prisma/client";
import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { hashPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordCredential: {
          create: { passwordHash }
        }
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    await setSessionCookie({ userId: user.id, email: user.email });

    return jsonOk({ user }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return jsonError("An account already exists for this email.", 409);
    }

    return toApiError(error);
  }
}
