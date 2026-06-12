"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { Skeleton } from "./ui";

/**
 * Client-side auth gate (the demo session lives in localStorage, so middleware
 * can't see it — documented in DECISIONS.md D3). Logged-out → /login; wrong
 * role → that role's home. Shows a quiet skeleton while hydrating.
 */
export function RequireRole({
  role,
  children,
}: {
  role: "employee" | "employer";
  children: React.ReactNode;
}) {
  const { ready, user } = useDemo();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (user.role !== role) router.replace(user.role === "employer" ? "/employer" : "/dashboard");
  }, [ready, user, role, router]);

  if (!ready || !user || user.role !== role) {
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
