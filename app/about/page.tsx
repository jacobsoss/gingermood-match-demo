import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/platform/MarketingShell";
import { Card, SectionLabel } from "@/components/platform/ui";
import { Avatar } from "@/components/Avatar";

export const metadata: Metadata = {
  title: "About — Gingermood",
  description:
    "Gingermood has matched people with coaches for over a decade. Software proposes, people confirm — that principle hasn't moved an inch.",
};

const ctaPrimary =
  "gm-focus inline-flex min-h-[48px] items-center justify-center rounded-full bg-orange px-7 text-[16px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98]";

const VALUES = [
  {
    title: "Listen properly",
    body: "Your story comes first, in your own words. We'd rather ask one more question than guess.",
  },
  {
    title: "Match carefully",
    body: "Fit beats availability. We propose the coach we believe in — and a human checks our work.",
  },
  {
    title: "Measure honestly",
    body: "We follow up on whether coaching actually helped. When a match isn't working, we say so and fix it.",
  },
];

const TEAM = [
  {
    initials: "MV",
    name: "Marieke van Dijk",
    role: "Founder & head matchmaker",
    line: "Matched our first hundred clients by phone, notebook in hand.",
  },
  {
    initials: "JB",
    name: "Jeroen Bakker",
    role: "Coach network lead",
    line: "Interviews every coach who joins us — and turns most applicants away.",
  },
  {
    initials: "FB",
    name: "Femke de Boer",
    role: "Matchmaker",
    line: "Reviews proposed matches daily. Known for overruling the software.",
  },
  {
    initials: "TV",
    name: "Tom Visser",
    role: "Product & research",
    line: "Builds the matching engine, then checks whether it actually helped.",
  },
];

export default function AboutPage() {
  return (
    <MarketingShell>
      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-4 pt-14 sm:px-8 sm:pt-20">
        <p className="gm-rise text-[13px] font-semibold uppercase tracking-[0.16em] text-purple">
          About Gingermood
        </p>
        <h1
          className="gm-rise mt-4 max-w-[680px] font-display text-[32px] font-semibold text-ink sm:text-[40px]"
          style={{ animationDelay: "60ms" }}
        >
          Matching people with coaches, for over a decade
        </h1>
        <div
          className="gm-rise mt-6 flex max-w-[680px] flex-col gap-5 text-[17px] leading-relaxed text-ink"
          style={{ animationDelay: "120ms" }}
        >
          <p>
            Gingermood started more than ten years ago in the Netherlands, out of a simple
            irritation: coaching directories were everywhere, but a directory is not a match.
            People picked a coach from a photo and a list of certificates — and too often it
            just didn&apos;t click.
          </p>
          <p>
            So we did it differently. We listened to people&apos;s stories — long phone calls,
            careful notes — and introduced them to the one coach we genuinely believed would
            fit. It worked. It still does.
          </p>
          <p>
            Today software helps us listen at scale: the intake adapts to your answers and
            proposes coaches from our network. But the principle hasn&apos;t moved an inch —
            software proposes, people confirm. A matchmaker from our team reviews every single
            match before it reaches you.
          </p>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-10 sm:px-8">
        <div className="rounded-[var(--radius-card)] border border-hair bg-wash p-8 sm:p-10">
          <SectionLabel>Our mission</SectionLabel>
          <p className="mt-3 max-w-[620px] font-display text-[24px] font-semibold leading-snug text-ink sm:text-[28px]">
            The right coach for every person. Not the available one, not the nearest one —
            the right one.
          </p>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-4 sm:px-8">
        <SectionLabel>What we hold ourselves to</SectionLabel>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {VALUES.map((v) => (
            <Card key={v.title} className="p-6">
              <h2 className="font-display text-[20px] font-semibold text-ink">{v.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{v.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-14 sm:px-8">
        <SectionLabel>The team behind your match</SectionLabel>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <Card key={member.name} className="p-6">
              <Avatar initials={member.initials} size="md" />
              <h3 className="mt-4 font-display text-[18px] font-semibold text-ink">
                {member.name}
              </h3>
              <p className="mt-0.5 text-[14px] font-semibold text-purple-700">{member.role}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{member.line}</p>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-muted">
          Team members shown are illustrative for this demo.
        </p>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-16 sm:px-8">
        <Card className="p-8 sm:p-10">
          <h2 className="max-w-lg font-display text-[26px] font-semibold text-ink sm:text-[30px]">
            Curious who we&apos;d match you with?
          </h2>
          <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-muted">
            Tell us your story — it takes about five minutes — and find out.
          </p>
          <Link href="/register" className={`${ctaPrimary} mt-6`}>
            Get started
          </Link>
        </Card>
      </section>
    </MarketingShell>
  );
}
