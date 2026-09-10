import type { Metadata } from "next";
import Link from "next/link";
import { getServerCopy } from "@/lib/platform/lang-server";
import { btnPrimaryLg, btnSecondary, headingUi } from "@/lib/platform/ui-classes";
import { MarketingShell } from "@/components/platform/MarketingShell";
import { Card } from "@/components/platform/ui";
import { IconCheck, IconShield } from "@/components/platform/icons";

export const metadata: Metadata = {
  title: "For employees — Gingermood",
  description:
    "Your employer provides access to Gingermood. Find the psychologist or coach who fits your situation — and see what your employer can and can't see.",
};

export default async function EmployeesPage() {
  const t = await getServerCopy();
  const C = t.employees;
  return (
    <MarketingShell>
      {/* Hero + confidentiality near the action */}
      <section className="mx-auto max-w-[1080px] px-6 pb-14 pt-14 sm:px-8 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12">
          <div>
            <p className="eyebrow gm-rise text-purple">{C.eyebrow}</p>
            <h1 className="gm-rise mt-4 font-display" style={{ animationDelay: "60ms" }}>
              {C.title}
            </h1>
            <p className="gm-rise measure mt-5 text-[18px] leading-relaxed text-muted" style={{ animationDelay: "120ms" }}>
              {C.subtitle}
            </p>
            <div className="gm-rise mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "180ms" }}>
              <Link href="/register" className={btnPrimaryLg}>
                {C.primaryCta}
              </Link>
              <Link href="/login" className={btnSecondary}>
                {C.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Confidentiality, placed beside the main action */}
          <Card className="gm-rise p-6 sm:p-7" >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-purple">
                <IconShield size={20} />
              </span>
              <div>
                <h2 className={`${headingUi} text-[18px]`}>{C.confidentiality.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{C.confidentiality.body}</p>
                <p className="mt-3 rounded-[var(--radius-input)] bg-wash px-3.5 py-2.5 text-[13px] leading-relaxed text-muted">
                  {C.confidentiality.demoNote}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How access through your employer works */}
      <section className="border-t border-hair bg-surface">
        <div className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
          <h2 className={`${headingUi} text-[24px]`}>{C.how.title}</h2>
          <div className="mt-6 divide-y divide-hair">
            {C.how.items.map((item, i) => (
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

      {/* After activation + how to get an invitation */}
      <section className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className={`${headingUi} text-[22px]`}>{C.afterActivation.title}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {C.afterActivation.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[16px] leading-relaxed text-ink">
                  <span className="mt-1 shrink-0 text-purple">
                    <IconCheck size={16} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-card)] bg-wash p-6 sm:p-7">
            <h2 className={`${headingUi} text-[19px]`}>{C.invitation.title}</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-muted">{C.invitation.body}</p>
            <Link href="/welcome/nova-health" className={`${btnSecondary} mt-5`}>
              Preview an invitation
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
