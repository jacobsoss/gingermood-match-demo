import type { Metadata } from "next";
import Link from "next/link";
import { PLATFORM, SESSION_RANGE } from "@/lib/platform/copy";
import { btnPrimaryLg, headingUi } from "@/lib/platform/ui-classes";
import { MarketingShell } from "@/components/platform/MarketingShell";
import { IconChevronRight, IconShield, IconUser, IconCheck } from "@/components/platform/icons";

const H = PLATFORM.home;

export const metadata: Metadata = {
  title: "Gingermood — the right psychologist or coach",
  description: `Gingermood matches employees to the right psychologist or coach for ${SESSION_RANGE} in-depth conversations. Carefully matched on what they need, and checked by a person.`,
};

const AUDIENCE_ICONS = { employer: IconShield, employee: IconUser } as const;

export default function HomePage() {
  return (
    <MarketingShell>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="eyebrow gm-rise text-purple">{H.eyebrow}</p>
            <h1 className="gm-rise mt-4 font-display" style={{ animationDelay: "60ms" }}>
              {H.h1a}
              <br />
              {H.h1b}
            </h1>
            <p className="gm-rise measure mt-5 text-[18px] leading-relaxed text-muted" style={{ animationDelay: "120ms" }}>
              {H.subtitle}
            </p>
            <div className="gm-rise mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "180ms" }}>
              <Link href="/employers" className={btnPrimaryLg}>
                {H.primaryCta}
              </Link>
              <Link
                href="/employees"
                className="gm-focus inline-flex min-h-[44px] items-center gap-1 rounded-sm text-[16px] font-medium text-purple transition-colors hover:text-purple-700 hover:underline"
              >
                {H.secondaryCta}
                <IconChevronRight size={16} />
              </Link>
            </div>
            <p className="gm-rise mt-4 text-[13px] text-muted" style={{ animationDelay: "200ms" }}>
              {H.proofLine}
            </p>
          </div>

          {/* Photo — cropped to the two people; labelled as an illustrative example */}
          <div className="gm-rise" style={{ animationDelay: "150ms" }}>
            <div className="aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] border border-hair bg-wash">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/onafhankelijke-coaches.jpg"
                alt="A psychologist or coach in conversation with a client at a table"
                className="h-full w-full object-cover"
                style={{ objectPosition: "57% 50%" }}
              />
            </div>
            <p className="mt-2 text-[12px] text-muted">Illustrative photo — not a real client, psychologist or coach.</p>
          </div>
        </div>
      </section>

      {/* ── Audience split ───────────────────────────────────────────────── */}
      <section className="border-t border-hair bg-surface">
        <div className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
          <h2 className={`${headingUi} text-[24px]`}>{H.audience.title}</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {([H.audience.employer, H.audience.employee] as const).map((a, i) => {
              const Icon = i === 0 ? AUDIENCE_ICONS.employer : AUDIENCE_ICONS.employee;
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  className="gm-focus group flex flex-col rounded-[var(--radius-card)] border border-hair bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-purple sm:p-7"
                >
                  <span className="text-purple">
                    <Icon size={22} />
                  </span>
                  <h3 className={`${headingUi} mt-3 text-[19px]`}>{a.label}</h3>
                  <p className="mt-2 flex-1 text-[16px] leading-relaxed text-muted">{a.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[15px] font-medium text-purple">
                    {a.cta}
                    <IconChevronRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How the matching works — spaced process, not a card grid ─────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
        <h2 className={`${headingUi} text-[24px]`}>{H.steps.title}</h2>
        <div className="mt-6 divide-y divide-hair">
          {H.steps.items.map((step, i) => (
            <div key={step.title} className="grid gap-2 py-5 sm:grid-cols-[1.75rem_1fr] sm:gap-5">
              <span className="font-display text-[18px] text-purple sm:pt-0.5">{i + 1}</span>
              <div>
                <h3 className={`${headingUi} text-[18px]`}>{step.title}</h3>
                <p className="measure mt-1.5 text-[16px] leading-relaxed text-muted">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Principles — factual, no testimonials or invented statistics ─── */}
      <section className="border-t border-hair bg-surface">
        <div className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
          <h2 className={`${headingUi} text-[24px]`}>{H.principles.title}</h2>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-3">
            {H.principles.items.map((p) => (
              <div key={p.title}>
                <span className="text-purple">
                  <IconCheck size={18} />
                </span>
                <h3 className={`${headingUi} mt-2 text-[17px]`}>{p.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
        <div className="rounded-[var(--radius-card)] bg-wash p-8 sm:p-10">
          <h2 className={`${headingUi} text-[26px]`}>{H.closing.title}</h2>
          <p className="measure mt-3 text-[16px] leading-relaxed text-muted">{H.closing.body}</p>
          <Link href="/employers#enquiry" className={`${btnPrimaryLg} mt-6`}>
            {H.closing.cta}
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
