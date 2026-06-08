import { redirect } from "next/navigation";
import { AuthCard } from "@/features/auth/auth-card";
import { LoginForm } from "@/features/auth/login-form";
import { getCurrentUser } from "@/lib/auth/session";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthCard
      title="Sign in"
      subtitle="Enter the exam workspace to generate French grammar and vocabulary tests."
      switchLabel="New learner?"
      switchHref="/register"
      switchText="Create an account"
    >
      <LoginForm />
    </AuthCard>
  );
}
