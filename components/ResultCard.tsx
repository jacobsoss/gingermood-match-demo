"use client";

import { useEffect, useState } from "react";
import type { MatchResponse, NeedsProfile } from "@/lib/types";
import { COPY } from "@/lib/copy";
import { PERSONAS } from "@/data/personas";
import { CoachCardHero, CoachCardCompact } from "@/components/CoachCard";
import { DataReveal } from "@/components/DataReveal";
import { Avatar } from "@/components/Avatar";
import { Bar } from "@/components/Bar";

function Section({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <section className="gm-rise" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </section>
  );
}

/** Compose the "what we heard" pull-quote from the person's own needs (display
 *  only — no data is changed). Falls back to presenting themes. */
function recognitionText(profile: NeedsProfile): string {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const low = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
  const needs = profile.specificNeeds.map((n) => n.text.trim()).filter(Boolean);
  const src = (needs.length ? needs : profile.presentingThemes).slice(0, 4);
  if (!src.length) return "";
  const norm = src.map((p, i) => (i === 0 ? cap(p) : low(p)));
  let s = norm.length <= 1 ? norm[0] : `${norm.slice(0, -1).join(", ")} en ${norm[norm.length - 1]}`;
  if (!/[.!?]$/.test(s)) s += ".";
  return s;
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"
      aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"
      aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Quiet escape hatch — a human matchmaker, for the rare person who isn't happy.
 *  Deliberately small/understated so it doesn't divert people from the AI match. */
function HumanHandoff() {
  const [requested, setRequested] = useState(false);
  return (
    <div className="border-t border-hair pt-5">
      {requested ? (
        <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
          <span className="text-purple">
            <CheckIcon />
          </span>
          {COPY.result.humanConfirm}
        </p>
      ) : (
        <p className="text-[13px] leading-relaxed text-muted">
          {COPY.result.humanPrompt}{" "}
          <button
            type="button"
            onClick={() => setRequested(true)}
            className="gm-focus rounded-sm font-semibold text-purple hover:underline"
          >
            {COPY.result.humanCta}
          </button>
          .
        </p>
      )}
    </div>
  );
}

function ArrowLR() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 7 4 11l4 4M16 7l4 4-4 4M4 11h16" />
    </svg>
  );
}

export function ResultCard({
  result,
  onRestart,
  onPickPersona,
}: {
  result: MatchResponse;
  onRestart: () => void;
  onPickPersona: (id: string) => void;
}) {
  const { profile, match, coach, runnerUp, source, rangeInfo } = result;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [coach.id, source]);

  return (
    <div className="mx-auto w-full max-w-[640px] px-6 py-8 sm:px-8">
      <div className="flex flex-col gap-6">
        {/* 1 · Recognition block — the emotional moment (§4, leads the screen) */}
        <Section delay={0}>
          <div className="rounded-[var(--radius-card)] bg-wash p-7">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
              {COPY.result.recognitionLabel}
            </p>
            <p className="mt-3 font-display text-[23px] font-medium leading-snug text-ink">
              {recognitionText(profile)}
            </p>
          </div>
        </Section>

        {/* Range auto-widened notice (only when nobody was within the chosen radius) */}
        {rangeInfo?.relaxed && (
          <Section delay={60}>
            <p className="flex items-start gap-2.5 rounded-[var(--radius-input)] bg-wash px-4 py-3 text-[14px] leading-relaxed text-muted">
              <span className="text-purple">
                <InfoIcon />
              </span>
              {COPY.result.rangeRelaxed(rangeInfo.city, rangeInfo.requestedKm, rangeInfo.nearestKm)}
            </p>
          </Section>
        )}

        {/* 2 · Matched coach — the only shadow on the page */}
        <Section delay={80}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-muted">
              {COPY.result.eyebrow}
            </p>
            <span className="rounded-full border border-hair bg-surface px-3 py-1 text-[13px] text-muted">
              {source === "ai" ? COPY.result.sourceAi : COPY.result.sourceFallback}
            </span>
          </div>
          <CoachCardHero coach={coach} fitScore={match.fitScore} />

          {/* Why this coach — idiosyncratic-fit explanation */}
          <div className="mt-5 px-1">
            <h3 className="font-display text-xl font-semibold text-ink">{COPY.result.matchTitle}</h3>
            <p className="mt-3 text-[17px] leading-relaxed text-ink">{match.reasoning}</p>

            {match.evidence.length > 0 && (
              <ul className="mt-5 flex flex-col gap-2.5">
                {match.evidence.map((e, i) => (
                  <li
                    key={i}
                    className="flex flex-col gap-1.5 rounded-[var(--radius-input)] bg-wash px-4 py-3 sm:flex-row sm:items-center sm:gap-3"
                  >
                    <span className="flex-1 text-[15px] text-ink">
                      <span className="text-muted">Jij: </span>
                      {e.need}
                    </span>
                    <span className="hidden text-purple sm:inline">
                      <ArrowLR />
                    </span>
                    <span className="flex-1 text-[15px] text-ink">
                      <span className="text-muted">Coach: </span>
                      {e.coachStrength}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        {/* 3 · Fit breakdown — thin purple bars */}
        <Section delay={160}>
          <div className="rounded-[var(--radius-card)] border border-hair bg-surface p-6 sm:p-7">
            <h3 className="font-display text-xl font-semibold text-ink">{COPY.result.fitBreakdown}</h3>
            <div className="mt-4 flex flex-col gap-4">
              {match.fitBreakdown.map((d) => (
                <div key={d.dimension}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-[15px] font-semibold text-ink">{d.dimension}</span>
                    <span className="text-[13px] tabular-nums text-muted">{d.score}</span>
                  </div>
                  <Bar value={d.score} />
                  <p className="mt-1.5 text-[15px] leading-snug text-muted">{d.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 4 · Runner-up — reduced weight. Absent when only one coach is eligible. */}
        {runnerUp && (
          <Section delay={240}>
            <p className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
              {COPY.result.runnerUp}
            </p>
            <CoachCardCompact
              coach={runnerUp}
              fitScore={Math.max(40, match.fitScore - 14)}
              reason={match.runnerUpReason}
            />
          </Section>
        )}

        {/* 5 · Behind the scenes */}
        <Section delay={320}>
          <DataReveal profile={profile} match={match} />
        </Section>

        {/* 6 · Reset link + try-another (secondary) */}
        <Section delay={400}>
          <div className="flex flex-col items-start gap-5 pt-1">
            <button
              type="button"
              onClick={onRestart}
              className="gm-focus rounded-sm text-[17px] font-semibold text-purple transition-colors hover:text-purple-700 hover:underline"
            >
              {COPY.result.restart}
            </button>
            <div className="w-full">
              <p className="mb-3 text-[15px] text-muted">{COPY.result.tryAnother}</p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onPickPersona(p.id)}
                    className={`gm-focus flex items-center gap-3 rounded-[var(--radius-input)] border bg-surface p-3 text-left transition-colors hover:bg-wash ${
                      p.intendedCoachId === coach.id ? "border-purple" : "border-hair"
                    }`}
                  >
                    <Avatar initials={p.initials} size="sm" />
                    <span className="text-[15px] font-semibold leading-tight text-ink">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Quiet human-matchmaker escape hatch */}
        <Section delay={480}>
          <HumanHandoff />
        </Section>
      </div>
    </div>
  );
}
