import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/platform/MarketingShell";
import { Card } from "@/components/platform/ui";
import { IconShield } from "@/components/platform/icons";

export const metadata: Metadata = {
  title: "Privacy — Gingermood",
  description:
    "Coaching only works when you can be honest. Our privacy promises in plain language: your answers stay yours, employers see trends — never people.",
};

const PROMISES = [
  {
    title: "Your answers stay yours",
    body: "What you tell us in the intake, what you discuss with your coach, your check-in scores — none of it is ever visible to your employer. Not to HR, not to your manager, not in any report.",
  },
  {
    title: "Employers see trends, never people",
    body: "Employers receive anonymised, aggregated insights only — how teams are doing as a whole. If a group has fewer than 15 people, we show nothing at all, so no one can be singled out.",
  },
  {
    title: "We only ask what we need",
    body: "No tracking profiles, no data sold, no hoarding. We collect what's needed to match you well and support your trajectory — and nothing more than that.",
  },
  {
    title: "Delete your data, anytime",
    body: "You can delete your account and everything in it whenever you want, straight from your settings. Gone means gone — removed from our systems, not just hidden from view.",
  },
];

export default function PrivacyPage() {
  return (
    <MarketingShell>
      {/* ── Why this page exists ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-4 pt-14 sm:px-8 sm:pt-20">
        <p className="gm-rise text-[13px] font-semibold uppercase tracking-[0.16em] text-purple">
          Privacy
        </p>
        <h1
          className="gm-rise mt-4 max-w-[680px] font-display text-[32px] font-semibold text-ink sm:text-[40px]"
          style={{ animationDelay: "60ms" }}
        >
          Privacy, in plain language
        </h1>
        <p
          className="gm-rise mt-5 max-w-[620px] text-[18px] leading-relaxed text-muted"
          style={{ animationDelay: "120ms" }}
        >
          Coaching only works when you can be completely honest — about your work, your
          manager, yourself. So privacy isn&apos;t the fine print here; it&apos;s part of the
          product. These are our promises.
        </p>
      </section>

      {/* ── The promises ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-10 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {PROMISES.map((p, i) => (
            <div key={p.title} className="gm-rise" style={{ animationDelay: `${i * 60}ms` }}>
              <Card className="h-full p-6 sm:p-7">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-tint text-purple-700">
                  <IconShield size={18} />
                </span>
                <h2 className="mt-4 font-display text-[20px] font-semibold text-ink">
                  {p.title}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.body}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* ── In practice ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-16 sm:px-8">
        <div className="rounded-[var(--radius-card)] border border-hair bg-wash p-8 sm:p-10">
          <h2 className="max-w-lg font-display text-[24px] font-semibold text-ink sm:text-[28px]">
            What this means in practice
          </h2>
          <p className="mt-3 max-w-[620px] text-[16px] leading-relaxed text-muted">
            Say what you actually think in your intake and your sessions. Your employer pays
            for the coaching, but they never look over your shoulder — that boundary is built
            into the product, not bolted on.
          </p>
          <Link
            href="/how-it-works"
            className="gm-focus mt-5 inline-flex min-h-[44px] items-center rounded-sm text-[15px] font-semibold text-purple transition-colors hover:text-purple-700 hover:underline"
          >
            See how matching works
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
