"use client";

import { COPY } from "@/lib/copy";
import { PERSONAS } from "@/data/personas";
import { Avatar } from "@/components/Avatar";

const FLOURISH = "bij jou past"; // the words that get the hand-drawn underline

/** Single hand-drawn orange underline — the only decorative orange besides the
 *  CTA and the top stripe. */
function Underline() {
  return (
    <svg
      className="pointer-events-none absolute -bottom-2 left-0 h-[13px] w-full"
      viewBox="0 0 300 13"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M3 8 C 68 2, 150 13, 297 5" stroke="var(--gm-orange-500)" strokeWidth="5"
        strokeLinecap="round" />
    </svg>
  );
}

export function WelcomeScreen({
  onStart,
  onPickPersona,
  busy = false,
}: {
  onStart: () => void;
  onPickPersona: (personaId: string) => void;
  busy?: boolean;
}) {
  const title = COPY.welcome.title;
  const idx = title.lastIndexOf(FLOURISH);
  const head = idx >= 0 ? title.slice(0, idx) : title;
  const tail = idx >= 0 ? title.slice(idx) : "";

  return (
    <div className="relative min-h-[calc(100dvh-var(--nav-h))] overflow-hidden">
      {/* One oversized brand shape, top-right, clipped offscreen, behind content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 -top-48 h-[700px] w-[700px] rounded-full bg-tint opacity-40"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-var(--nav-h))] w-full max-w-[680px] flex-col px-6 pb-8 pt-10 sm:px-8 sm:pt-14">
        <div>
          <p className="gm-rise mb-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-purple">
            {COPY.welcome.eyebrow}
          </p>
          <h1
            className="gm-rise font-display text-[36px] font-semibold text-ink sm:text-[40px]"
            style={{ animationDelay: "60ms" }}
          >
            {head}
            <span className="relative inline-block whitespace-nowrap">
              {tail}
              <Underline />
            </span>
          </h1>
          <p
            className="gm-rise mt-5 max-w-xl text-[18px] leading-relaxed text-muted"
            style={{ animationDelay: "120ms" }}
          >
            {COPY.welcome.subtitle}
          </p>

          <div className="gm-rise mt-9" style={{ animationDelay: "180ms" }}>
            <button
              type="button"
              onClick={onStart}
              disabled={busy}
              className="gm-focus inline-flex min-h-[52px] items-center justify-center rounded-full bg-orange px-8 text-[17px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? COPY.question.thinking : COPY.welcome.start}
            </button>
          </div>

          {/* Persona quick-picks — equal-height secondary cards */}
          <div className="gm-rise mt-12" style={{ animationDelay: "240ms" }}>
            <p className="mb-3 text-[15px] text-muted">{COPY.welcome.personasIntro}</p>
            <div className="grid items-stretch gap-3 sm:grid-cols-3">
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPickPersona(p.id)}
                  className="gm-focus flex h-full flex-col items-start gap-3 rounded-[var(--radius-card)] border-[1.5px] border-hair bg-surface p-5 text-left transition-all hover:-translate-y-0.5 hover:border-purple"
                >
                  <Avatar initials={p.initials} size="sm" />
                  <span className="text-[17px] font-semibold leading-tight text-ink">{p.label}</span>
                  <span className="text-[15px] leading-snug text-muted">{p.blurb}</span>
                  <span className="mt-auto whitespace-nowrap pt-2 text-[14px] font-semibold text-purple">
                    {COPY.welcome.personaCta}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <footer className="pt-8">
          <p className="max-w-md text-[13px] leading-relaxed text-muted">{COPY.welcome.privacy}</p>
        </footer>
      </div>
    </div>
  );
}
