import { redirect } from "next/navigation";
import { AuthCard } from "@/features/auth/auth-card";
import { RegisterForm } from "@/features/auth/register-form";
import { getCurrentUser } from "@/lib/auth/session";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Save generated exams, uploaded answer text, and detailed AI feedback under your learner profile."
      switchLabel="Already registered?"
      switchHref="/login"
      switchText="Sign in"
    >
      <RegisterForm />
    </AuthCard>
  );
}
