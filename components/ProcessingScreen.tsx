"use client";

import { useEffect, useState } from "react";
import { COPY } from "@/lib/copy";
import { LoadingDots } from "@/components/LoadingDots";

/** Calm processing state (§5): a single pulsing dot-trio + one rotating line. */
export function ProcessingScreen({
  onComplete,
  durationMs = 2600,
}: {
  onComplete: () => void;
  durationMs?: number;
}) {
  const lines = COPY.processing.lines;
  const [step, setStep] = useState(0);

  useEffect(() => {
    const per = durationMs / lines.length;
    const timers = lines.map((_, i) => setTimeout(() => setStep(i), i * per));
    const done = setTimeout(onComplete, durationMs);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-var(--nav-h))] w-full max-w-md flex-col items-center justify-center bg-page px-6 text-center">
      <div className="mb-8">
        <LoadingDots />
      </div>
      <p key={step} className="gm-rise text-[15px] text-muted" aria-live="polite">
        {lines[step]}
      </p>
    </div>
  );
}
