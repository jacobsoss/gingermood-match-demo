"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MatchResponse } from "@/lib/types";
import { getMatch } from "@/lib/engine";
import { PERSONAS_BY_ID } from "@/data/personas";
import { COPY } from "@/lib/copy";
import { useDemo } from "@/lib/demo/store";
import { firstName } from "@/lib/demo/format";
import { ResultCard } from "@/components/ResultCard";
import { ProcessingScreen } from "@/components/ProcessingScreen";
import { LoadingDots } from "@/components/LoadingDots";
import { Card, ConfirmedBadge, Skeleton, btnPrimary, btnLink } from "@/components/platform/ui";
import { useCopy } from "@/components/platform/LanguageProvider";

/**
 * The existing match-reveal, inside the dashboard shell, plus the one addition
 * the platform needs: "Confirm my coach" — a 2s simulated human review that
 * dramatizes the human-in-the-loop promise, then State B on the dashboard.
 *
 * Hardened for the live demo (principle: "never break in front of the room").
 * The persona re-run is the interaction most likely to be tapped on stage, so
 * it is race-safe (only the latest tap wins), bounded (can never spin forever),
 * leak-free (all timers cleared on unmount), and self-recovering (on any
 * failure the current match stays on screen behind a calm notice).
 */

// Hard ceiling for a persona re-run. getMatch() self-heals to the deterministic
// engine and resolves within ~2×28s (=56s) worst case; the 65s ceiling sits just
// above that so it only ever fires on a genuine hang, never on a slow-but-valid
// live request, and guarantees the processing screen can never spin forever.
const RERUN_CEILING_MS = 65_000;
// How long the graceful "couldn't load that profile" notice lingers before it
// auto-dismisses. The current match is untouched, so this is purely informative.
const RERUN_NOTICE_MS = 6_000;

function ConfirmCoach({ result }: { result: MatchResponse }) {
  const t = useCopy();
  const { confirmMatch } = useDemo();
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "reviewing" | "confirmed">("idle");
  const reviewTimer = useRef<number | null>(null);

  // Clear the simulated-review timer if the user navigates away mid-review, so
  // it can't fire setState/confirmMatch after unmount.
  useEffect(
    () => () => {
      if (reviewTimer.current) window.clearTimeout(reviewTimer.current);
    },
    [],
  );

  function start() {
    if (phase !== "idle") return; // guard against a double-tap starting two reviews
    setPhase("reviewing");
    reviewTimer.current = window.setTimeout(() => {
      confirmMatch();
      setPhase("confirmed");
    }, 2000);
  }

  return (
    <Card className="p-6 sm:p-7">
      {phase === "idle" && (
        <div className="flex flex-col items-start gap-3">
          <h3 className="font-display text-xl font-semibold text-ink">
            {t.matchResult.confirm.heading}
          </h3>
          <p className="text-[15px] leading-relaxed text-muted">
            {t.matchResult.confirm.body}
          </p>
          <button type="button" onClick={start} className={`${btnPrimary} mt-1`}>
            {t.matchResult.confirm.cta}
          </button>
        </div>
      )}

      {phase === "reviewing" && (
        <div className="flex flex-col items-start gap-3 py-2" aria-live="polite">
          <LoadingDots />
          <p className="text-[15px] leading-relaxed text-muted">
            {t.matchResult.confirm.reviewing}
          </p>
        </div>
      )}

      {phase === "confirmed" && (
        <div className="gm-rise flex flex-col items-start gap-3" aria-live="polite">
          <ConfirmedBadge />
          <p className="text-[15px] leading-relaxed text-ink">
            {t.matchResult.confirm.confirmed(firstName(result.coach.name))}
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className={`${btnPrimary} mt-1`}
          >
            {t.matchResult.confirm.goToDashboard}
          </button>
        </div>
      )}
    </Card>
  );
}

/** Transient, dismissible recovery notice — the current match stays on screen. */
function RerunNotice({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="gm-rise fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[min(92%,460px)] items-start gap-4 rounded-[var(--radius-input)] border border-hair bg-surface p-4 shadow-[0_6px_20px_rgba(43,33,64,0.12)]"
    >
      <p className="flex-1 text-[15px] leading-relaxed text-ink">{COPY.result.rerunError}</p>
      <button type="button" onClick={onDismiss} className={`${btnLink} shrink-0`}>
        {COPY.result.rerunErrorDismiss}
      </button>
    </div>
  );
}

export default function MatchResultPage() {
  const { ready, employee, setLastResult, clearLastResult } = useDemo();
  const router = useRouter();
  const [rerunning, setRerunning] = useState(false);
  const [rerunError, setRerunError] = useState(false);

  // Re-run coordination. The commit happens only when BOTH the min-duration
  // processing animation has elapsed AND the match has arrived — event-driven,
  // no polling. `requestToken` invalidates superseded / unmounted requests.
  const pendingResult = useRef<MatchResponse | null>(null);
  const minElapsed = useRef(false);
  const requestToken = useRef(0);
  const ceilingTimer = useRef<number | null>(null);
  const noticeTimer = useRef<number | null>(null);

  const result = employee?.lastResult ?? null;

  const clearCeiling = useCallback(() => {
    if (ceilingTimer.current) {
      window.clearTimeout(ceilingTimer.current);
      ceilingTimer.current = null;
    }
  }, []);

  // On unmount: invalidate any in-flight re-run so a late result can't
  // repopulate the store after the user has navigated away, and clear timers.
  useEffect(
    () => () => {
      requestToken.current++;
      if (ceilingTimer.current) window.clearTimeout(ceilingTimer.current);
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    },
    [],
  );

  // Direct visits without a result go back to the intake.
  useEffect(() => {
    if (ready && !result && !rerunning) router.replace("/dashboard/match");
  }, [ready, result, rerunning, router]);

  // Commit the re-run once both gates are open. Safe to call from either gate.
  const finalize = useCallback(() => {
    if (!minElapsed.current || !pendingResult.current) return;
    clearCeiling();
    const next = pendingResult.current;
    pendingResult.current = null;
    minElapsed.current = false;
    setRerunning(false);
    setLastResult(next);
  }, [clearCeiling, setLastResult]);

  // Graceful give-up: keep the existing match on screen, surface a calm notice.
  const abortRerun = useCallback(() => {
    requestToken.current++; // ignore any late-arriving result
    clearCeiling();
    pendingResult.current = null;
    minElapsed.current = false;
    setRerunning(false);
    setRerunError(true);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setRerunError(false), RERUN_NOTICE_MS);
  }, [clearCeiling]);

  const handlePickPersona = useCallback(
    (id: string) => {
      const persona = PERSONAS_BY_ID[id];
      if (!persona) return;

      const token = ++requestToken.current; // supersede any in-flight request
      pendingResult.current = null;
      minElapsed.current = false;
      setRerunError(false);
      setRerunning(true);

      clearCeiling();
      ceilingTimer.current = window.setTimeout(() => {
        if (requestToken.current === token) abortRerun();
      }, RERUN_CEILING_MS);

      void getMatch(persona.answers)
        .then((res) => {
          if (requestToken.current !== token) return; // superseded or unmounted
          pendingResult.current = res;
          finalize();
        })
        .catch(() => {
          // getMatch() self-heals to the deterministic engine internally; this
          // covers only the last-ditch case where even that fallback throws.
          if (requestToken.current === token) abortRerun();
        });
    },
    [abortRerun, clearCeiling, finalize],
  );

  // ProcessingScreen has shown for its minimum satisfying duration.
  const handleRerunComplete = useCallback(() => {
    minElapsed.current = true;
    finalize();
  }, [finalize]);

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-6 py-8">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="mt-4 h-56 w-full" />
      </div>
    );
  }

  if (rerunning) {
    return <ProcessingScreen onComplete={handleRerunComplete} />;
  }

  if (!result) return null;

  return (
    <>
      <ResultCard
        result={result}
        onRestart={() => {
          requestToken.current++; // cancel any pending re-run before leaving
          clearCeiling();
          clearLastResult();
          router.push("/dashboard/match");
        }}
        onPickPersona={handlePickPersona}
        confirmSlot={<ConfirmCoach result={result} />}
      />
      {rerunError && <RerunNotice onDismiss={() => setRerunError(false)} />}
    </>
  );
}
