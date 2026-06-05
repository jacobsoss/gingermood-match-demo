"use client";

import { useState } from "react";
import type { Match, NeedsProfile } from "@/lib/types";
import { COPY } from "@/lib/copy";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * "Behind the scenes" — the same intake as structured data (the flywheel point).
 * Collapsed by default; an engineer's drawer that deliberately contrasts the
 * warm front: monospace, subdued, syntax-free (§4).
 */
export function DataReveal({ profile, match }: { profile: NeedsProfile; match: Match }) {
  const [open, setOpen] = useState(false);

  const payload = {
    needsProfile: profile,
    match: {
      coach_id: match.coachId,
      fit_score: match.fitScore,
      fit_breakdown: match.fitBreakdown,
      runner_up_id: match.runnerUpId,
    },
    outcome: "→ wordt later aangevuld met tevredenheid & doelrealisatie",
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-hair bg-surface p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-ink">{COPY.result.behindTitle}</h3>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
            {COPY.result.behindLead}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="gm-focus inline-flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-hair bg-surface px-4 py-2 text-[15px] font-semibold text-ink transition-colors hover:bg-wash"
        >
          {open ? COPY.result.behindToggleClose : COPY.result.behindToggleOpen}
          <Chevron open={open} />
        </button>
      </div>

      {open && (
        <pre className="gm-rise mt-5 overflow-x-auto rounded-[var(--radius-input)] border border-hair bg-page p-5 font-mono text-[13px] leading-relaxed text-muted">
          <code>{JSON.stringify(payload, null, 2)}</code>
        </pre>
      )}
    </div>
  );
}
