"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MatchResponse } from "@/lib/types";
import { getMatch } from "@/lib/engine";
import { PERSONAS_BY_ID } from "@/data/personas";
import { useDemo } from "@/lib/demo/store";
import { firstName } from "@/lib/demo/format";
import { ResultCard } from "@/components/ResultCard";
import { ProcessingScreen } from "@/components/ProcessingScreen";
import { LoadingDots } from "@/components/LoadingDots";
import { Card, ConfirmedBadge, Skeleton, btnPrimary } from "@/components/platform/ui";

/**
 * The existing match-reveal, inside the dashboard shell, plus the one addition
 * the platform needs: "Confirm my coach" — a 2s simulated human review that
 * dramatizes the human-in-the-loop promise, then State B on the dashboard.
 */

function ConfirmCoach({ result }: { result: MatchResponse }) {
  const { confirmMatch } = useDemo();
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "reviewing" | "confirmed">("idle");

  function start() {
    setPhase("reviewing");
    window.setTimeout(() => {
      confirmMatch();
      setPhase("confirmed");
    }, 2000);
  }

  return (
    <Card className="p-6 sm:p-7">
      {phase === "idle" && (
        <div className="flex flex-col items-start gap-3">
          <h3 className="font-display text-xl font-semibold text-ink">
            Happy with this match?
          </h3>
          <p className="text-[15px] leading-relaxed text-muted">
            Every match is reviewed by a Gingermood matcher before it&apos;s final — software
            proposes, a human confirms.
          </p>
          <button type="button" onClick={start} className={`${btnPrimary} mt-1`}>
            Confirm my coach
          </button>
        </div>
      )}

      {phase === "reviewing" && (
        <div className="flex flex-col items-start gap-3 py-2" aria-live="polite">
          <LoadingDots />
          <p className="text-[15px] leading-relaxed text-muted">
            Your match has been sent to the Gingermood team for review — normally you&apos;re
            confirmed within one working day.
          </p>
        </div>
      )}

      {phase === "confirmed" && (
        <div className="gm-rise flex flex-col items-start gap-3" aria-live="polite">
          <ConfirmedBadge />
          <p className="text-[15px] leading-relaxed text-ink">
            {firstName(result.coach.name)} is confirmed as your coach. You&apos;ll find your
            next steps on your dashboard.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className={`${btnPrimary} mt-1`}
          >
            Go to your dashboard
          </button>
        </div>
      )}
    </Card>
  );
}

export default function MatchResultPage() {
  const { ready, employee, setLastResult, clearLastResult } = useDemo();
  const router = useRouter();
  const [rerunning, setRerunning] = useState(false);
  const pendingResult = useRef<MatchResponse | null>(null);

  const result = employee?.lastResult ?? null;

  // Direct visits without a result go back to the intake.
  useEffect(() => {
    if (ready && !result && !rerunning) router.replace("/dashboard/match");
  }, [ready, result, rerunning, router]);

  const handlePickPersona = useCallback(
    (id: string) => {
      const persona = PERSONAS_BY_ID[id];
      if (!persona) return;
      pendingResult.current = null;
      setRerunning(true);
      void getMatch(persona.answers).then((res) => {
        pendingResult.current = res;
      });
    },
    [],
  );

  const handleRerunComplete = useCallback(() => {
    const settle = () => {
      if (pendingResult.current) {
        setLastResult(pendingResult.current);
        setRerunning(false);
      } else {
        setTimeout(settle, 120);
      }
    };
    settle();
  }, [setLastResult]);

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
    <ResultCard
      result={result}
      onRestart={() => {
        clearLastResult();
        router.push("/dashboard/match");
      }}
      onPickPersona={handlePickPersona}
      confirmSlot={<ConfirmCoach result={result} />}
    />
  );
}
