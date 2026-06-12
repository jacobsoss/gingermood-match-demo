import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/platform/MarketingShell";
import { Card, IllustrativeTag, SectionLabel, Stat } from "@/components/platform/ui";
import { IconChevronRight } from "@/components/platform/icons";
import { Avatar } from "@/components/Avatar";

export const metadata: Metadata = {
  title: "Gingermood — The right coach for every person",
  description:
    "Tell us your story, we match you with the coach who actually fits — and a human confirms every match before you meet.",
};

/* Server pages can't read class strings from the "use client" ui module, so the
   button classes are inlined verbatim (same pattern as MarketingShell). */
const heroCta =
  "gm-focus inline-flex min-h-[52px] items-center justify-center rounded-full bg-orange px-8 text-[17px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98]";
const ctaPrimary =
  "gm-focus inline-flex min-h-[48px] items-center justify-center rounded-full bg-orange px-7 text-[16px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98]";

const STEPS = [
  {
    n: 1,
    title: "Tell us your story",
    body: "A short intake that adapts to what you say — type it or just talk. No checkbox forms; your own words.",
  },
  {
    n: 2,
    title: "We match — a human confirms",
    body: "Our software proposes coaches who fit your needs and working style. A Gingermood matchmaker reviews every match before it reaches you.",
  },
  {
    n: 3,
    title: "Grow with your coach",
    body: "Book sessions that fit your week — video, in person or by phone. Quick check-ins show whether it's actually helping.",
  },
];

const TESTIMONIALS = [
  {
    initials: "L",
    name: "Lotte",
    role: "projectmanager",
    quote:
      "I expected to be assigned whoever was available. Instead I got someone who understood deadline pressure from the inside. The difference was obvious in one session.",
  },
  {
    initials: "B",
    name: "Bram",
    role: "teamlead klantenservice",
    quote:
      "The intake felt like talking, not filling in a form. My coach helps me lead the team without taking every problem home with me.",
  },
  {
    initials: "S",
    name: "Sanne",
    role: "HR-adviseur",
    quote:
      "I rolled this out for our organisation and then used it myself. As HR I only ever see anonymous trends — my own sessions stay mine.",
  },
];

export default function HomePage() {
  return (
    <MarketingShell>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-44 -top-48 h-[700px] w-[700px] rounded-full bg-tint opacity-40"
        />
        <div className="relative z-10 mx-auto max-w-[1080px] px-6 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
          <p className="gm-rise text-[13px] font-semibold uppercase tracking-[0.16em] text-purple">
            Coaching, properly matched
          </p>
          <h1
            className="gm-rise mt-4 max-w-[680px] font-display text-[36px] font-semibold text-ink sm:text-[46px]"
            style={{ animationDelay: "60ms" }}
          >
            A good coach helps — the right coach changes things.
          </h1>
          <p
            className="gm-rise mt-5 max-w-xl text-[18px] leading-relaxed text-muted"
            style={{ animationDelay: "120ms" }}
          >
            Tell us your story in your own words, typed or spoken. We match you with a coach
            who fits what you need and how you work — and a human confirms every match before
            you meet.
          </p>
          <div
            className="gm-rise mt-8 flex flex-wrap items-center gap-5"
            style={{ animationDelay: "180ms" }}
          >
            <Link href="/register" className={heroCta}>
              Get started
            </Link>
            <Link
              href="/how-it-works"
              className="gm-focus inline-flex min-h-[44px] items-center gap-1 rounded-sm text-[16px] font-semibold text-purple transition-colors hover:text-purple-700 hover:underline"
            >
              How it works
              <IconChevronRight size={16} />
            </Link>
          </div>
          <p
            className="gm-rise mt-5 text-[14px] text-muted"
            style={{ animationDelay: "240ms" }}
          >
            About five minutes · in your own words · reviewed by a human
          </p>
        </div>
      </section>

      {/* ── Three steps ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
        <SectionLabel>How it works</SectionLabel>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <Card key={step.n} className="p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-tint font-display text-[18px] font-semibold text-purple-700">
                {step.n}
              </span>
              <h2 className="mt-4 font-display text-[20px] font-semibold text-ink">
                {step.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Track record ─────────────────────────────────────────────────── */}
      <section className="border-y border-hair bg-wash">
        <div className="mx-auto max-w-[1080px] px-6 py-12 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionLabel>The track record</SectionLabel>
            <IllustrativeTag />
          </div>
          <div className="mt-7 grid gap-8 sm:grid-cols-3">
            <Stat
              label="Experience"
              value="10+ years"
              sub="Matching people with coaches — by hand long before software helped."
            />
            <Stat
              label="Coach network"
              value="120+ coaches"
              sub="Certified professionals, every one interviewed by our team."
            />
            <Stat
              label="Trusted by"
              value="Dutch employers"
              sub="Leading organisations across the Netherlands bring us in for their teams."
            />
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
        <SectionLabel>What people say</SectionLabel>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="flex flex-col p-6">
              <p className="flex-1 text-[15px] leading-relaxed text-ink">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-hair pt-4">
                <Avatar initials={t.initials} size="sm" />
                <div>
                  <p className="text-[15px] font-semibold text-ink">{t.name}</p>
                  <p className="text-[13px] text-muted">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-muted">Quotes are illustrative.</p>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-16 sm:px-8">
        <Card className="p-8 sm:p-10">
          <h2 className="max-w-lg font-display text-[26px] font-semibold text-ink sm:text-[30px]">
            Ready to meet a coach who actually fits?
          </h2>
          <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-muted">
            The intake takes about five minutes, and a human reviews your match before you
            commit to anything.
          </p>
          <Link href="/register" className={`${ctaPrimary} mt-6`}>
            Get started
          </Link>
        </Card>
      </section>
    </MarketingShell>
  );
}
