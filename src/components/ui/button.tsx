import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-exam-700 text-white hover:bg-exam-500 focus-visible:outline-exam-500",
    secondary:
      "border border-exam-100 bg-white text-ink-950 hover:bg-exam-50 focus-visible:outline-exam-500",
    ghost:
      "text-ink-800 hover:bg-exam-50 focus-visible:outline-exam-500",
    danger:
      "bg-red-700 text-white hover:bg-red-600 focus-visible:outline-red-500"
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
