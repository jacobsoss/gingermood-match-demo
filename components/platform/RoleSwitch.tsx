"use client";

import Link from "next/link";
import { useDemo } from "@/lib/demo/store";
import { useCopy } from "./LanguageProvider";

/**
 * View switch for a dual-role demo user (employee + org admin, D22). Shown only
 * when the current user has orgAdmin. Switching is plain navigation between the
 * personal (/dashboard) and organisation (/employer) views — the org view never
 * reads personal coaching data.
 */
export function RoleSwitch({ current }: { current: "personal" | "org" }) {
  const { user } = useDemo();
  const t = useCopy();
  if (!user?.orgAdmin) return null;

  const to = current === "personal" ? "/employer" : "/dashboard";
  const label = current === "personal" ? t.org.switchToOrg : t.org.switchToPersonal;

  return (
    <Link
      href={to}
      className="gm-focus inline-flex min-h-[38px] items-center gap-1.5 rounded-full border-[1.5px] border-hair bg-surface px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-purple hover:text-purple-700"
    >
      <span className="hidden text-muted sm:inline">{t.org.switchLabel}:</span>
      {label}
    </Link>
  );
}
