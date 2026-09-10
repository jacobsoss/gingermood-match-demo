import type { Metadata } from "next";
import Link from "next/link";
import { getServerCopy } from "@/lib/platform/lang-server";
import { MarketingShell } from "@/components/platform/MarketingShell";
import { Card, SectionLabel } from "@/components/platform/ui";
import { Avatar } from "@/components/Avatar";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerCopy();
  return { title: t.meta.about.title, description: t.meta.about.description };
}

const ctaPrimary =
  "gm-focus inline-flex min-h-[48px] items-center justify-center rounded-full bg-orange px-7 text-[16px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98]";

export default async function AboutPage() {
  const t = await getServerCopy();
  const C = t.about;

  const VALUES = [
    { title: C.values.listen.title, body: C.values.listen.body },
    { title: C.values.match.title, body: C.values.match.body },
    { title: C.values.measure.title, body: C.values.measure.body },
  ];

  const TEAM = [
    {
      initials: "MV",
      name: "Marieke van Dijk",
      role: C.team.role1,
      line: C.team.line1,
    },
    {
      initials: "JB",
      name: "Jeroen Bakker",
      role: C.team.role2,
      line: C.team.line2,
    },
    {
      initials: "FB",
      name: "Femke de Boer",
      role: C.team.role3,
      line: C.team.line3,
    },
    {
      initials: "TV",
      name: "Tom Visser",
      role: C.team.role4,
      line: C.team.line4,
    },
  ];

  return (
    <MarketingShell>
      {/* ── Story ────────────────────────────────────────────────────────── */}
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
        <div
          className="gm-rise mt-6 flex max-w-[680px] flex-col gap-5 text-[17px] leading-relaxed text-ink"
          style={{ animationDelay: "120ms" }}
        >
          <p>{C.story.p1}</p>
          <p>{C.story.p2}</p>
          <p>{C.story.p3}</p>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-10 sm:px-8">
        <div className="rounded-[var(--radius-card)] border border-hair bg-wash p-8 sm:p-10">
          <SectionLabel>{C.mission.label}</SectionLabel>
          <p className="mt-3 max-w-[620px] font-display text-[24px] font-semibold leading-snug text-ink sm:text-[28px]">
            {C.mission.body}
          </p>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 py-4 sm:px-8">
        <SectionLabel>{C.values.label}</SectionLabel>
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
        <SectionLabel>{C.team.label}</SectionLabel>
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
          {C.team.disclaimer}
        </p>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-16 sm:px-8">
        <Card className="p-8 sm:p-10">
          <h2 className="max-w-lg font-display text-[26px] font-semibold text-ink sm:text-[30px]">
            {C.cta.title}
          </h2>
          <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-muted">
            {C.cta.body}
          </p>
          <Link href="/register" className={`${ctaPrimary} mt-6`}>
            {C.cta.button}
          </Link>
        </Card>
      </section>
    </MarketingShell>
  );
}
