"use client";

import { useEffect, useState } from "react";
import type { Coach } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { Bar } from "@/components/Bar";
import { METHOD_LABEL, SPECIALISM_LABEL, STYLE_LABEL } from "@/lib/labels";
import { useCopy } from "@/components/platform/LanguageProvider";

/** Small lavender supply tag (§4). */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-wash px-3 py-1 text-[13px] font-semibold text-purple-700">
      {children}
    </span>
  );
}

/** Score counts up once over ~400ms (§6), respects reduced-motion. */
function useCountUp(target: number, ms = 400): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Set via rAF so the effect body stays side-effect-free (lint: no sync setState).
      const id = requestAnimationFrame(() => setV(target));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / ms);
      setV(Math.round(target * t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function Score({ score }: { score: number }) {
  const t = useCopy();
  const shown = useCountUp(score);
  return (
    <div className="w-28 shrink-0 text-right">
      <div className="font-display text-4xl font-semibold leading-none text-ink tabular-nums">
        {shown}
      </div>
      <div className="mt-1 text-[13px] text-muted">{t.coachCard.matchLabel}</div>
      <div className="mt-2">
        <Bar value={score} />
      </div>
    </div>
  );
}

/** Matched coach — the ONLY shadowed card on the page (§3, §5). */
export function CoachCardHero({ coach, fitScore }: { coach: Coach; fitScore: number }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-hair bg-surface p-6 shadow-[var(--shadow-coach)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar initials={coach.initials} size="lg" />
          <div>
            <h3 className="font-display text-2xl font-semibold text-ink">{coach.name}</h3>
            <p className="mt-1 text-[15px] text-muted">
              {coach.region} · {coach.yearsExperience} jaar ervaring
            </p>
          </div>
        </div>
        <Score score={fitScore} />
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-muted">{coach.bio}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {coach.specialisms.map((s) => (
          <Tag key={s}>{SPECIALISM_LABEL[s]}</Tag>
        ))}
        {coach.workingStyle.map((w) => (
          <Tag key={w}>{STYLE_LABEL[w]}</Tag>
        ))}
      </div>

      <div className="mt-5 border-t border-hair pt-4">
        <p className="text-[13px] text-muted">Werkwijze</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {coach.methods.map((m) => (
            <Tag key={m}>{METHOD_LABEL[m]}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Runner-up — same card at reduced visual weight: no shadow, smaller (§4). */
export function CoachCardCompact({
  coach,
  fitScore,
  reason,
}: {
  coach: Coach;
  fitScore: number;
  reason: string;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-hair bg-surface p-5">
      <div className="flex items-center gap-3">
        <Avatar initials={coach.initials} size="sm" />
        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="font-display text-lg font-semibold text-ink">{coach.name}</h4>
            <span className="shrink-0 text-[15px] font-semibold tabular-nums text-muted">
              {fitScore}%
            </span>
          </div>
          <p className="text-[15px] text-muted">{SPECIALISM_LABEL[coach.specialisms[0]]}</p>
        </div>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{reason}</p>
    </div>
  );
}
