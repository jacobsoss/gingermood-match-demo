import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/platform/MarketingShell";
import { Card, ConfirmedBadge, SectionLabel } from "@/components/platform/ui";
import { IconCheck } from "@/components/platform/icons";

export const metadata: Metadata = {
  title: "How it works — Gingermood",
  description:
    "From your story to the right coach in three steps: an intake that adapts to you, a match proposed by software and confirmed by a human, and a trajectory we actually measure.",
};

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

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-4 pt-14 sm:px-8 sm:pt-20">
        <p className="gm-rise text-[13px] font-semibold uppercase tracking-[0.16em] text-purple">
          How it works
        </p>
        <h1
          className="gm-rise mt-4 max-w-[680px] font-display text-[32px] font-semibold text-ink sm:text-[40px]"
          style={{ animationDelay: "60ms" }}
        >
          From your story to the right coach, in three steps
        </h1>
        <p
          className="gm-rise mt-5 max-w-[620px] text-[18px] leading-relaxed text-muted"
          style={{ animationDelay: "120ms" }}
        >
          No directories to scroll through, no coach assigned because they happened to have a
          free slot. Here&apos;s what actually happens.
        </p>
      </section>

      {/* ── The three steps, expanded ────────────────────────────────────── */}
      <section className="mx-auto flex max-w-[1080px] flex-col gap-4 px-6 py-10 sm:px-8">
        <Card className="gm-rise p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
            <StepNumber n={1} />
            <div className="min-w-0">
              <h2 className="font-display text-[24px] font-semibold text-ink">
                Tell us your story
              </h2>
              <p className="mt-3 max-w-[600px] text-[16px] leading-relaxed text-muted">
                It starts with a short intake — about five minutes. You tell us what&apos;s
                going on in your own words, and the next question adapts to what you just
                said. Prefer talking over typing? Just speak; the intake supports voice.
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                <Detail>Adapts to your answers — no two intakes are the same</Detail>
                <Detail>Type or talk, whatever feels natural</Detail>
                <Detail>Your own words, not a form full of checkboxes</Detail>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="gm-rise p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
            <StepNumber n={2} />
            <div className="min-w-0">
              <h2 className="font-display text-[24px] font-semibold text-ink">
                We match — a human confirms
              </h2>
              <p className="mt-3 max-w-[600px] text-[16px] leading-relaxed text-muted">
                Our software compares your story against our network of professional coaches:
                what you need help with, how you like to work, and the practical things —
                language, region, online or in person. It proposes the best fit. Then a
                Gingermood matchmaker reads that proposal and confirms it, or overrules it.
                No match reaches you unchecked.
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                <Detail>Matched on needs and working style, not on availability</Detail>
                <Detail>Practical fit included: language, region, online or in person</Detail>
                <Detail>Every match reviewed by a human before you see it</Detail>
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
                Grow with your coach
              </h2>
              <p className="mt-3 max-w-[600px] text-[16px] leading-relaxed text-muted">
                You meet, you talk, you get to work. Book sessions the way they fit your week
                — video, in person or by phone. Between sessions there&apos;s a library of
                short, practical reads, and a quarterly check-in tracks how you&apos;re
                actually doing. And if the first session tells you the fit isn&apos;t right
                after all? Say so — we&apos;ll rematch you, no questions asked.
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                <Detail>Sessions by video, in person or by phone</Detail>
                <Detail>A library of short, practical reads between sessions</Detail>
                <Detail>Quarterly check-ins, so progress is measured — not assumed</Detail>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* ── Why matching matters ─────────────────────────────────────────── */}
      <section className="border-y border-hair bg-wash">
        <div className="mx-auto max-w-[1080px] px-6 py-12 sm:px-8">
          <SectionLabel>Why matching matters</SectionLabel>
          <p className="mt-4 max-w-[680px] font-display text-[22px] font-semibold leading-snug text-ink sm:text-[26px]">
            Research shows the fit between you and your professional is one of the strongest
            predictors of success — so we treat matching as the product, not an afterthought.
          </p>
          <p className="mt-4 max-w-[620px] text-[16px] leading-relaxed text-muted">
            Stronger than the method, stronger than the technique: whether you click with the
            person across the table. It&apos;s the part we&apos;ve spent over a decade getting
            right — first by hand, now with software that a human still double-checks.
          </p>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
        <Card className="p-8 sm:p-10">
          <h2 className="max-w-lg font-display text-[26px] font-semibold text-ink sm:text-[30px]">
            See who fits you
          </h2>
          <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-muted">
            Five minutes, your own words, and a human checks the match before you meet.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Link href="/register" className={ctaPrimary}>
              Get started
            </Link>
            <Link
              href="/privacy"
              className="gm-focus inline-flex min-h-[44px] items-center rounded-sm text-[15px] font-semibold text-purple transition-colors hover:text-purple-700 hover:underline"
            >
              Read our privacy promises
            </Link>
          </div>
        </Card>
      </section>
    </MarketingShell>
  );
}
