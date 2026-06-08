import { jsonError, jsonOk, toApiError } from "@/lib/api";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { passwordCredential: true }
    });

    if (!user?.passwordCredential) {
      return jsonError("Invalid email or password.", 401);
    }

    const isValid = await verifyPassword(
      input.password,
      user.passwordCredential.passwordHash
    );

    if (!isValid) {
      return jsonError("Invalid email or password.", 401);
    }

    await setSessionCookie({ userId: user.id, email: user.email });

    return jsonOk({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    return toApiError(error);
  }
}
