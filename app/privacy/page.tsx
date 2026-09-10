import type { Metadata } from "next";
import Link from "next/link";
import { getServerCopy } from "@/lib/platform/lang-server";
import { MarketingShell } from "@/components/platform/MarketingShell";
import { Card } from "@/components/platform/ui";
import { IconShield } from "@/components/platform/icons";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerCopy();
  return { title: t.meta.privacy.title, description: t.meta.privacy.description };
}

export default async function PrivacyPage() {
  const t = await getServerCopy();
  const C = t.privacy;

  const PROMISES = [C.promise1, C.promise2, C.promise3, C.promise4];

  return (
    <MarketingShell>
      {/* ── Why this page exists ─────────────────────────────────────────── */}
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
            {C.practice.title}
          </h2>
          <p className="mt-3 max-w-[620px] text-[16px] leading-relaxed text-muted">
            {C.practice.body}
          </p>
          <Link
            href="/how-it-works"
            className="gm-focus mt-5 inline-flex min-h-[44px] items-center rounded-sm text-[15px] font-semibold text-purple transition-colors hover:text-purple-700 hover:underline"
          >
            {C.practice.link}
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
