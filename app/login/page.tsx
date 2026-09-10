"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import type { DemoUser } from "@/lib/demo/types";
import { DEMO_ACCOUNTS } from "@/lib/demo/seeds";
import { readNext } from "@/lib/platform/params";
import { btnPrimary } from "@/lib/platform/ui-classes";
import { useCopy } from "@/components/platform/LanguageProvider";
import { IconChevronRight } from "@/components/platform/icons";

const inputCls =
  "gm-focus w-full rounded-[var(--radius-input)] border-[1.5px] border-hair bg-surface px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-muted";

const DEMO_LIST = [
  { email: DEMO_ACCOUNTS.emma, name: "Emma de Jong", note: "Employee · not yet matched" },
  { email: DEMO_ACCOUNTS.daan, name: "Daan Bakker", note: "Employee · matched, mid-trajectory" },
  { email: DEMO_ACCOUNTS.duo, name: "Iris Molenaar", note: "Employee + org admin · dual role" },
  { email: DEMO_ACCOUNTS.hr, name: "Sanne Visser", note: "Employer · organisation view" },
];

function homeFor(user: DemoUser): string {
  return user.role === "employer" ? "/employer" : "/dashboard";
}

export default function LoginPage() {
  const { login } = useDemo();
  const t = useCopy();
  const C = t.login;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showDemo, setShowDemo] = useState(false);

  function go(emailToUse: string, honorNext: boolean) {
    const user = login(emailToUse);
    const next = honorNext ? readNext() : null;
    router.push(next ?? homeFor(user));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < 1) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length === 0) go(email, true);
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-page">
      <div className="h-[3px] w-full bg-orange" />
      <div className="relative z-10 mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-6 py-12">
        <Link href="/" className="gm-focus -m-2 mb-8 w-fit rounded-md p-2" aria-label={t.a11y.logoHome}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Gingermood" className="h-8 w-auto" />
        </Link>

        <h1 className="font-display">{C.title}</h1>
        <p className="mt-2 text-[16px] text-muted">{C.subtitle}</p>

        <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[14px] font-medium text-ink">
              {C.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.forms.emailPlaceholder}
              className={inputCls}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1.5 text-[13px] text-error">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[14px] font-medium text-ink">
              {C.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.forms.passwordPlaceholder}
              className={inputCls}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="mt-1.5 text-[13px] text-error">{errors.password}</p>}
          </div>
          <button type="submit" className={`${btnPrimary} mt-2 w-full`}>
            {C.submit}
          </button>
        </form>

        <p className="mt-5 text-[15px] text-muted">
          {C.activatePrompt}{" "}
          <Link href="/register" className="gm-focus rounded-sm font-medium text-purple hover:underline">
            {C.activateCta}
          </Link>
        </p>

        {/* Presenter shortcuts — clearly separated from the normal flow */}
        <div className="mt-10 border-t border-hair pt-5">
          <button
            type="button"
            onClick={() => setShowDemo((s) => !s)}
            aria-expanded={showDemo}
            className="gm-focus inline-flex items-center gap-1 rounded-sm text-[13px] font-medium text-muted transition-colors hover:text-ink"
          >
            <span className={`transition-transform ${showDemo ? "rotate-90" : ""}`}>
              <IconChevronRight size={14} />
            </span>
            {C.demoAccounts}
          </button>
          {showDemo && (
            <>
              <p className="gm-rise mt-2 text-[13px] leading-relaxed text-muted">{C.demoNote}</p>
              <ul className="gm-rise mt-3 flex flex-col gap-2">
                {DEMO_LIST.map((d) => (
                  <li key={d.email}>
                    <button
                      type="button"
                      onClick={() => go(d.email, false)}
                      className="gm-focus flex w-full items-baseline justify-between gap-3 rounded-[var(--radius-input)] border border-hair bg-surface px-4 py-2.5 text-left transition-colors hover:border-purple"
                    >
                      <span className="text-[14px] font-medium text-ink">{d.name}</span>
                      <span className="text-[13px] text-muted">{d.note}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
