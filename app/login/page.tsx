"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { DEMO_ACCOUNTS } from "@/lib/demo/seeds";
import { btnPrimary } from "@/components/platform/ui";
import { IconChevronRight } from "@/components/platform/icons";

const inputCls =
  "gm-focus w-full rounded-[var(--radius-input)] border-[1.5px] border-hair bg-surface px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-muted";

const DEMO_LIST = [
  {
    email: DEMO_ACCOUNTS.emma,
    name: "Emma de Jong",
    note: "Employee · new — hasn't been matched yet",
  },
  {
    email: DEMO_ACCOUNTS.daan,
    name: "Daan Bakker",
    note: "Employee · matched, 3 sessions in",
  },
  { email: DEMO_ACCOUNTS.hr, name: "Sanne Visser", note: "Employer · HR view" },
];

export default function LoginPage() {
  const { login } = useDemo();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showDemo, setShowDemo] = useState(false);

  function go(emailToUse: string) {
    const user = login(emailToUse);
    router.push(user.role === "employer" ? "/employer" : "/dashboard");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < 1) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length === 0) go(email);
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-page">
      <div className="h-[3px] w-full bg-orange" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 -top-48 h-[600px] w-[600px] rounded-full bg-tint opacity-40"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-6 py-12">
        <Link href="/" className="gm-focus -m-2 mb-8 w-fit rounded-md p-2" aria-label="Gingermood — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Gingermood" className="h-8 w-auto" />
        </Link>

        <h1 className="font-display text-[30px] font-semibold text-ink">Welcome back</h1>
        <p className="mt-2 text-[16px] text-muted">Sign in to continue with your coach.</p>

        <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[14px] font-semibold text-ink">
              Work email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.nl"
              className={inputCls}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1.5 text-[13px] text-error">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[14px] font-semibold text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className={inputCls}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="mt-1.5 text-[13px] text-error">{errors.password}</p>
            )}
          </div>
          <button type="submit" className={`${btnPrimary} mt-2 w-full`}>
            Sign in
          </button>
        </form>

        <p className="mt-5 text-[15px] text-muted">
          New here?{" "}
          <Link href="/register" className="gm-focus rounded-sm font-semibold text-purple hover:underline">
            Create an account
          </Link>
        </p>

        {/* Demo accounts — subtle but accessible for the presenter */}
        <div className="mt-10 border-t border-hair pt-5">
          <button
            type="button"
            onClick={() => setShowDemo((s) => !s)}
            aria-expanded={showDemo}
            className="gm-focus inline-flex items-center gap-1 rounded-sm text-[13px] font-semibold text-muted transition-colors hover:text-ink"
          >
            <span className={`transition-transform ${showDemo ? "rotate-90" : ""}`}>
              <IconChevronRight size={14} />
            </span>
            Demo accounts
          </button>
          {showDemo && (
            <ul className="gm-rise mt-3 flex flex-col gap-2">
              {DEMO_LIST.map((d) => (
                <li key={d.email}>
                  <button
                    type="button"
                    onClick={() => go(d.email)}
                    className="gm-focus flex w-full items-baseline justify-between gap-3 rounded-[var(--radius-input)] border border-hair bg-surface px-4 py-2.5 text-left transition-colors hover:border-purple"
                  >
                    <span className="text-[14px] font-semibold text-ink">{d.name}</span>
                    <span className="text-[13px] text-muted">{d.note}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
