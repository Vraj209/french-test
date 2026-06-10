"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { LogoutButton } from "@/components/layout/logout-button";
import { cn } from "@/lib/utils";

type ProfileMenuProps = {
  user: {
    name: string | null;
    email: string;
  };
};

function getProfileLabel(user: ProfileMenuProps["user"]) {
  const trimmedName = user.name?.trim();
  return trimmedName && trimmedName.length > 0 ? trimmedName : user.email.split("@")[0];
}

function getInitials(label: string) {
  const letters = label
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return letters || label.slice(0, 1).toUpperCase();
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileLabel = getProfileLabel(user);
  const initials = getInitials(profileLabel);

  const closeOnOutsidePress = useEffectEvent((event: PointerEvent) => {
    if (!open || !menuRef.current) {
      return;
    }

    if (menuRef.current.contains(event.target as Node)) {
      return;
    }

    setOpen(false);
  });

  const closeOnEscape = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  useEffect(() => {
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Open profile menu"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          open
            ? "border-red-700 bg-red-700 text-white focus-visible:outline-red-500"
            : "border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700 focus-visible:outline-red-500"
        )}
      >
        {initials}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Profile menu"
          className="absolute right-0 top-full z-20 mt-3 w-72 rounded-2xl border border-exam-100 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.14)]"
        >
          <div className="rounded-xl bg-exam-50/80 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-sm font-semibold uppercase tracking-wide text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-950">{profileLabel}</p>
                <p className="truncate text-xs text-ink-600">{user.email}</p>
              </div>
            </div>
          </div>
          <LogoutButton className="mt-2 w-full justify-start rounded-xl px-3">
            <LogOut size={16} aria-hidden="true" />
            <span>Log out</span>
          </LogoutButton>
        </div>
      ) : null}
    </div>
  );
}
