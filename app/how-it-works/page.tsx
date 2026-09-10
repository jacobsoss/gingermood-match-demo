import type { Metadata } from "next";
import Link from "next/link";
import { getServerCopy } from "@/lib/platform/lang-server";
import { MarketingShell } from "@/components/platform/MarketingShell";
import { Card, ConfirmedBadge, SectionLabel } from "@/components/platform/ui";
import { IconCheck } from "@/components/platform/icons";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerCopy();
  return { title: t.meta.howItWorks.title, description: t.meta.howItWorks.description };
}

const ctaPrimary =
  "gm-focus inline-flex min-h-[48px] items-center justify-center rounded-full bg-orange px-7 text-[16px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98]";

function StepNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tint font-display text-[19px] font-semibold text-purple-700">
      {n}
    </span>
  );
}

function Detail({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[15px] leading-relaxed text-muted">
      <span className="mt-1 shrink-0 text-purple">
        <IconCheck size={15} />
      </span>
      {children}
    </li>
  );
}

export default async function HowItWorksPage() {
  const t = await getServerCopy();
  const C = t.howItWorks;
  return (
    <MarketingShell>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-4 pt-14 sm:px-8 sm:pt-20">
        <p className="gm-rise text-[13px] font-semibold uppercase tracking-[0.16em] text-purple">
          {C.eyebrow}
        </p>
        <h1
          className="gm-rise mt-4 max-w-[680px] font-display text-[32px] font-semibold text-ink sm:text-[40px]"
          style={{ animationDelay: "60ms" }}
        >
          {C.h1}
        </h1>
        <p
          className="gm-rise mt-5 max-w-[620px] text-[18px] leading-relaxed text-muted"
          style={{ animationDelay: "120ms" }}
        >
          {C.subtitle}
        </p>
      </section>

      {/* ── The three steps, expanded ────────────────────────────────────── */}
      <section className="mx-auto flex max-w-[1080px] flex-col gap-4 px-6 py-10 sm:px-8">
        <Card className="gm-rise p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
            <StepNumber n={1} />
            <div className="min-w-0">
              <h2 className="font-display text-[24px] font-semibold text-ink">
                {C.step1.title}
              </h2>
              <p className="mt-3 max-w-[600px] text-[16px] leading-relaxed text-muted">
                {C.step1.body}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                <Detail>{C.step1.b1}</Detail>
                <Detail>{C.step1.b2}</Detail>
                <Detail>{C.step1.b3}</Detail>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="gm-rise p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
            <StepNumber n={2} />
            <div className="min-w-0">
              <h2 className="font-display text-[24px] font-semibold text-ink">
                {C.step2.title}
              </h2>
              <p className="mt-3 max-w-[600px] text-[16px] leading-relaxed text-muted">
                {C.step2.body}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                <Detail>{C.step2.b1}</Detail>
                <Detail>{C.step2.b2}</Detail>
                <Detail>{C.step2.b3}</Detail>
              </ul>
              <div className="mt-5">
                <ConfirmedBadge />
              </div>
            </div>
          </div>
        </Card>

        <Card className="gm-rise p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
            <StepNumber n={3} />
            <div className="min-w-0">
              <h2 className="font-display text-[24px] font-semibold text-ink">
                {C.step3.title}
              </h2>
              <p className="mt-3 max-w-[600px] text-[16px] leading-relaxed text-muted">
                {C.step3.body}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                <Detail>{C.step3.b1}</Detail>
                <Detail>{C.step3.b2}</Detail>
                <Detail>{C.step3.b3}</Detail>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* ── Why matching matters ─────────────────────────────────────────── */}
      <section className="border-y border-hair bg-wash">
        <div className="mx-auto max-w-[1080px] px-6 py-12 sm:px-8">
          <SectionLabel>{C.why.label}</SectionLabel>
          <p className="mt-4 max-w-[680px] font-display text-[22px] font-semibold leading-snug text-ink sm:text-[26px]">
            {C.why.p1}
          </p>
          <p className="mt-4 max-w-[620px] text-[16px] leading-relaxed text-muted">
            {C.why.p2}
          </p>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
        <Card className="p-8 sm:p-10">
          <h2 className="max-w-lg font-display text-[26px] font-semibold text-ink sm:text-[30px]">
            {C.cta.title}
          </h2>
          <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-muted">
            {C.cta.body}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Link href="/register" className={ctaPrimary}>
              {C.cta.getStartedLink}
            </Link>
            <Link
              href="/privacy"
              className="gm-focus inline-flex min-h-[44px] items-center rounded-sm text-[15px] font-semibold text-purple transition-colors hover:text-purple-700 hover:underline"
            >
              {C.cta.privacyLink}
            </Link>
          </div>
        </Card>
      </section>
    </MarketingShell>
  );
}
