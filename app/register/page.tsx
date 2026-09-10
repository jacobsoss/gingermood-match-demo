"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { readNext, readParam } from "@/lib/platform/params";
import { btnPrimary } from "@/lib/platform/ui-classes";
import { useCopy } from "@/components/platform/LanguageProvider";

const inputCls =
  "gm-focus w-full rounded-[var(--radius-input)] border-[1.5px] border-hair bg-surface px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-muted";

export default function RegisterPage() {
  const { register } = useDemo();
  const t = useCopy();
  const C = t.register;
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [company, setCompany] = useState<string | null>(null);

  // Read the inviting company from ?company (set by the welcome flow). Deferred a
  // frame so the effect body has no synchronous setState (repo lint rule).
  useEffect(() => {
    const id = requestAnimationFrame(() => setCompany(readParam("company")));
    return () => cancelAnimationFrame(id);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid work email.";
    if (password.length < 6) next.password = "Use at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    register(name, email, company ?? undefined);
    router.push(readNext() ?? "/dashboard");
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-page">
      <div className="h-[3px] w-full bg-orange" />
      <div className="relative z-10 mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-6 py-12">
        <Link href="/" className="gm-focus -m-2 mb-8 w-fit rounded-md p-2" aria-label="Gingermood — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Gingermood" className="h-8 w-auto" />
        </Link>

        <h1 className="font-display">{C.title}</h1>
        <p className="mt-2 text-[16px] text-muted">{C.subtitle}</p>
        {company && (
          <p className="mt-3 inline-flex w-fit rounded-full bg-wash px-3 py-1 text-[13px] font-medium text-purple">
            {t.welcome.providedThrough(company)}
          </p>
        )}

        <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-[14px] font-medium text-ink">
              {C.nameLabel}
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sanne de Vries"
              autoComplete="name"
              className={inputCls}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1.5 text-[13px] text-error">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[14px] font-medium text-ink">
              {C.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.nl"
              autoComplete="email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
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
          {C.loginPrompt}{" "}
          <Link href="/login" className="gm-focus rounded-sm font-medium text-purple hover:underline">
            {C.loginCta}
          </Link>
        </p>

        <div className="mt-8 rounded-[var(--radius-input)] bg-wash px-4 py-3">
          <p className="text-[14px] leading-relaxed text-muted">
            {C.employerNote}{" "}
            <Link href="/employers" className="gm-focus rounded-sm font-medium text-purple hover:underline">
              {C.employerCta}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
