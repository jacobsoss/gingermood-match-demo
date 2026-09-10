"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import type { DemoUser } from "@/lib/demo/types";
import { Skeleton } from "./ui";

/**
 * Client-side auth gate. The demo session lives in localStorage, so middleware
 * can't see it (DECISIONS.md D3) — this is a demo guard, NOT production security.
 *
 * - Logged out → /login?next=<the page they wanted> so login returns them there.
 * - Employer view is reachable by a real employer OR a dual-role org admin (D22).
 * - Wrong role → that role's home.
 */
function canAccess(user: DemoUser, role: "employee" | "employer"): boolean {
  if (role === "employer") return user.role === "employer" || !!user.orgAdmin;
  return user.role === "employee";
}

export function RequireRole({
  role,
  children,
}: {
  role: "employee" | "employer";
  children: React.ReactNode;
}) {
  const { ready, user } = useDemo();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const next = encodeURIComponent(`${pathname}${search}`);
      router.replace(`/login?next=${next}`);
      return;
    }
    if (!canAccess(user, role)) {
      router.replace(user.role === "employer" ? "/employer" : "/dashboard");
    }
  }, [ready, user, role, router, pathname]);

  if (!ready || !user || !canAccess(user, role)) {
    return (
      <div className="mx-auto w-full max-w-[960px] px-6 py-10">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-6 h-44 w-full" />
        <Skeleton className="mt-4 h-24 w-full" />
      </div>
    );
  }
  return <>{children}</>;
}
