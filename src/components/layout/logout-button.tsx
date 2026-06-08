"use client";

import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function LogoutButton({
  className,
  children,
  variant = "ghost"
}: LogoutButtonProps) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant={variant}
      onClick={logout}
      className={cn("px-3", className)}
      title="Log out"
    >
      {children ?? (
        <>
          <LogOut size={16} aria-hidden="true" />
          <span>Log out</span>
        </>
      )}
    </Button>
  );
}
