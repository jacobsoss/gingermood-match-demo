"use client";

import { useEffect, useState } from "react";
import { COPY } from "@/lib/copy";
import { LoadingDots } from "@/components/LoadingDots";

/**
 * Inter-question loading phase (adaptive/LLM step). Animates in (12px rise +
 * fade), shows the calm dot-trio with a rotating line, then the parent swaps to
 * the next question. No new colour — purple/neutral only.
 */
export function ThinkingScreen() {
  const lines = COPY.thinking.lines;
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % lines.length), 1600);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-var(--nav-h))] w-full max-w-md flex-col items-center justify-center bg-page px-6 text-center">
      <div className="gm-rise flex flex-col items-center gap-6">
        <LoadingDots />
        <p key={i} className="gm-rise text-[15px] text-muted" aria-live="polite">
          {lines[i]}
        </p>
      </div>
    </div>
  );
}
