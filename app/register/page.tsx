"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import type { Role } from "@/lib/demo/types";
import { btnPrimary } from "@/components/platform/ui";
import { IconUser, IconShield } from "@/components/platform/icons";

const inputCls =
  "gm-focus w-full rounded-[var(--radius-input)] border-[1.5px] border-hair bg-surface px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-muted";

export default function RegisterPage() {
  const { register } = useDemo();
  const router = useRouter();
  const [step, setStep] = useState<"details" | "role">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid work email.";
    if (password.length < 6) next.password = "Use at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) setStep("role");
  }

  function choose(role: Role) {
    register(name, email, role);
    router.push(role === "employer" ? "/employer" : "/dashboard");
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-page">
      <div className="h-[3px] w-full bg-orange" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-44 -top-48 h-[600px] w-[600px] rounded-full bg-tint opacity-40"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center px-6 py-12">
        <Link href="/" className="gm-focus -m-2 mb-8 w-fit rounded-md p-2" aria-label="Gingermood — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Gingermood" className="h-8 w-auto" />
        </Link>

        {step === "details" ? (
          <>
            <h1 className="font-display text-[30px] font-semibold text-ink">Create your account</h1>
            <p className="mt-2 text-[16px] text-muted">
              A few details, then we&apos;ll point you the right way.
            </p>

            <form onSubmit={submitDetails} noValidate className="mt-8 flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-[14px] font-semibold text-ink">
                  Full name
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
                <label htmlFor="email" className="mb-1.5 block text-[14px] font-semibold text-ink">
                  Work email
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
                <label htmlFor="password" className="mb-1.5 block text-[14px] font-semibold text-ink">
                  Password
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
                {errors.password && (
                  <p className="mt-1.5 text-[13px] text-error">{errors.password}</p>
                )}
              </div>
              <button type="submit" className={`${btnPrimary} mt-2 w-full`}>
                Continue
              </button>
            </form>

            <p className="mt-5 text-[15px] text-muted">
              Already have an account?{" "}
              <Link href="/login" className="gm-focus rounded-sm font-semibold text-purple hover:underline">
                Log in
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-[30px] font-semibold text-ink">
              How will you use Gingermood?
            </h1>
            <p className="mt-2 text-[16px] text-muted">
              This decides what you see — you can&apos;t pick wrong.
            </p>

            <div className="mt-8 grid gap-4">
              <button
                type="button"
                onClick={() => choose("employee")}
                className="gm-focus gm-rise flex items-start gap-4 rounded-[var(--radius-card)] border-[1.5px] border-hair bg-surface p-6 text-left transition-all hover:-translate-y-0.5 hover:border-purple"
              >
                <span className="mt-0.5 text-purple">
                  <IconUser size={22} />
                </span>
                <span>
                  <span className="block font-display text-xl font-semibold text-ink">
                    I&apos;m an employee
                  </span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-muted">
                    Find the coach who actually fits you, book sessions, and track how
                    you&apos;re doing.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => choose("employer")}
                className="gm-focus gm-rise flex items-start gap-4 rounded-[var(--radius-card)] border-[1.5px] border-hair bg-surface p-6 text-left transition-all hover:-translate-y-0.5 hover:border-purple"
                style={{ animationDelay: "60ms" }}
              >
                <span className="mt-0.5 text-purple">
                  <IconShield size={22} />
                </span>
                <span>
                  <span className="block font-display text-xl font-semibold text-ink">
                    I&apos;m an employer / HR
                  </span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-muted">
                    See anonymous, team-level wellbeing insights. Never individual answers —
                    that&apos;s a promise.
                  </span>
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep("details")}
              className="gm-focus mt-6 w-fit rounded-sm text-[15px] font-semibold text-purple hover:underline"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
