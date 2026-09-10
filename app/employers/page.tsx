import type { Metadata } from "next";
import Link from "next/link";
import { getServerCopy } from "@/lib/platform/lang-server";
import { btnPrimaryLg, btnSecondary, headingUi } from "@/lib/platform/ui-classes";
import { MarketingShell } from "@/components/platform/MarketingShell";
import { Card, IllustrativeTag } from "@/components/platform/ui";
import { EnquiryForm } from "@/components/platform/EnquiryForm";
import { IconShield } from "@/components/platform/icons";

export const metadata: Metadata = {
  title: "For employers — Gingermood",
  description:
    "Ongoing access to psychologists and coaches for the people you cover: individual matching on real needs, a person involved, and anonymous aggregate reporting.",
};

export default async function EmployersPage() {
  const t = await getServerCopy();
  const C = t.employers;
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="mx-auto max-w-[1080px] px-6 pb-14 pt-14 sm:px-8 sm:pt-20">
        <p className="eyebrow gm-rise text-purple">{C.eyebrow}</p>
        <h1 className="gm-rise mt-4 max-w-[760px] font-display" style={{ animationDelay: "60ms" }}>
          {C.title}
        </h1>
        <p className="gm-rise measure mt-5 text-[18px] leading-relaxed text-muted" style={{ animationDelay: "120ms" }}>
          {C.subtitle}
        </p>
        <div className="gm-rise mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "180ms" }}>
          <Link href="#enquiry" className={btnPrimaryLg}>
            {C.primaryCta}
          </Link>
          <Link href="/employees" className={btnSecondary}>
            {C.secondaryCta}
          </Link>
        </div>
      </section>

      {/* What annual access includes — spaced rows with dividers, not a card grid */}
      <section className="border-t border-hair bg-surface">
        <div className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
          <h2 className={`${headingUi} text-[24px]`}>{C.value.title}</h2>
          <div className="mt-6 divide-y divide-hair">
            {C.value.items.map((item, i) => (
              <div key={item.title} className="grid gap-2 py-5 sm:grid-cols-[1.6rem_1fr] sm:gap-5">
                <span className="font-display text-[18px] text-purple sm:pt-0.5">{i + 1}</span>
                <div>
                  <h3 className={`${headingUi} text-[18px]`}>{item.title}</h3>
                  <p className="measure mt-1.5 text-[16px] leading-relaxed text-muted">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two commercial routes — two meaningful objects → two cards */}
      <section className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
        <h2 className={`${headingUi} text-[24px]`}>{C.routes.title}</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {[C.routes.selected, C.routes.subscription].map((r, i) => (
            <Card key={r.label} className={`p-6 sm:p-7 ${i === 1 ? "border-purple/40" : ""}`}>
              <h3 className={`${headingUi} text-[19px]`}>{r.label}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-muted">{r.body}</p>
              <p className="mt-4 text-[13px] font-medium text-purple">{r.note}</p>
            </Card>
          ))}
        </div>

        {/* How access is arranged — no invented session allowance */}
        <div className="mt-10 rounded-[var(--radius-card)] bg-wash p-6 sm:p-7">
          <h3 className={`${headingUi} text-[19px]`}>{C.commercial.title}</h3>
          <p className="measure mt-2 text-[16px] leading-relaxed text-ink">{C.commercial.body}</p>
          <p className="mt-3 text-[14px] text-muted">{C.commercial.note}</p>
        </div>

        {/* Aggregate reporting privacy line */}
        <div className="mt-6 flex items-start gap-3">
          <span className="mt-0.5 text-purple">
            <IconShield size={18} />
          </span>
          <p className="measure text-[15px] leading-relaxed text-muted">
            {t.trust.privacyShort} <IllustrativeTag className="ml-1 align-middle" />
          </p>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquiry" className="border-t border-hair bg-surface scroll-mt-24">
        <div className="mx-auto max-w-[720px] px-6 py-14 sm:px-8">
          <h2 className={`${headingUi} text-[26px]`}>{t.enquiry.title}</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-muted">{t.enquiry.subtitle}</p>
          <div className="mt-6">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
