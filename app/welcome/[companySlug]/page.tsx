"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { lookupInvitation, SAMPLE_COMPANY_SLUG } from "@/lib/demo/companies";
import { btnPrimaryLg, btnSecondary, headingUi } from "@/lib/platform/ui-classes";
import { useCopy } from "@/components/platform/LanguageProvider";
import { IconCheck, IconShield } from "@/components/platform/icons";

function Chrome({ providedThrough, children }: { providedThrough?: string; children: React.ReactNode }) {
  const C = useCopy().welcome;
  return (
    <div className="relative flex min-h-dvh flex-col bg-page">
      <div className="h-[3px] w-full bg-orange" />
      <header className="border-b border-hair bg-surface/85 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[720px] items-center justify-between gap-4 px-6">
          <Link href="/" className="gm-focus -m-2 rounded-md p-2" aria-label="Gingermood — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Gingermood" className="h-8 w-auto" />
          </Link>
          {providedThrough && (
            <span className="text-[13px] text-muted">{C.providedThrough(providedThrough)}</span>
          )}
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col px-6 py-12 sm:py-16">{children}</main>
    </div>
  );
}

function Recovery({ kind }: { kind: "expired" | "invalid" }) {
  const C = useCopy().welcome;
  const r = kind === "expired" ? C.expired : C.invalid;
  return (
    <Chrome>
      <div className="gm-rise">
        <h1 className="font-display">{r.title}</h1>
        <p className="measure mt-4 text-[17px] leading-relaxed text-muted">{r.body}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/employees" className={btnPrimaryLg}>
            {r.primaryCta}
          </Link>
          <Link href={`/welcome/${SAMPLE_COMPANY_SLUG}`} className={btnSecondary}>
            {r.secondaryCta}
          </Link>
        </div>
      </div>
    </Chrome>
  );
}

export default function WelcomePage() {
  const C = useCopy().welcome;
  const params = useParams<{ companySlug: string }>();
  const slug = Array.isArray(params.companySlug) ? params.companySlug[0] : params.companySlug;
  const { state, company } = lookupInvitation(slug);

  if (state !== "valid" || !company) {
    return <Recovery kind={state === "expired" ? "expired" : "invalid"} />;
  }

  const activateHref = `/register?company=${encodeURIComponent(company.name)}`;

  return (
    <Chrome providedThrough={company.name}>
      <div className="gm-rise">
        <p className="eyebrow text-purple">{C.eyebrow}</p>
        <h1 className="mt-3 font-display">{C.title}</h1>
        <p className="measure mt-4 text-[18px] leading-relaxed text-muted">{C.subtitle}</p>
      </div>

      <div className="gm-rise mt-8 rounded-[var(--radius-card)] border border-hair bg-surface p-6 sm:p-7" style={{ animationDelay: "80ms" }}>
        <h2 className={`${headingUi} text-[18px]`}>{C.support.title}</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {C.support.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[16px] leading-relaxed text-ink">
              <span className="mt-1 shrink-0 text-purple">
                <IconCheck size={16} />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[14px] text-muted">{C.support.note}</p>
      </div>

      <p className="gm-rise mt-6 flex items-start gap-2.5 text-[15px] leading-relaxed text-muted" style={{ animationDelay: "120ms" }}>
        <span className="mt-0.5 shrink-0 text-purple">
          <IconShield size={17} />
        </span>
        {C.confidentiality}
      </p>

      <div className="gm-rise mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "160ms" }}>
        <Link href={activateHref} className={btnPrimaryLg}>
          {C.activateCta}
        </Link>
        <span className="text-[15px] text-muted">
          {C.loginPrompt}{" "}
          <Link href="/login" className="gm-focus rounded-sm font-medium text-purple hover:underline">
            {C.loginCta}
          </Link>
        </span>
      </div>
      <p className="mt-4 inline-flex rounded-full bg-wash px-3 py-1 text-[12px] font-medium text-muted">
        {C.demoLabel}
      </p>
    </Chrome>
  );
}
