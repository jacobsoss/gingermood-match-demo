"use client";

import { useCallback, useEffect, useState } from "react";
import { btnPrimary } from "./ui";
import { useCopy } from "@/components/platform/LanguageProvider";

export interface TourStep {
  /** CSS selector of the element this step points at (e.g. [data-tour="match"]). */
  target: string;
  title: string;
  body: string;
}

/**
 * Lightweight 3-step coach-mark tour: highlights the target with a purple ring
 * and pins a popover beneath it. Skippable, resilient (falls back to a centered
 * card when a target isn't on screen), no dependencies.
 */
export function Tour({ steps, onDone }: { steps: TourStep[]; onDone: () => void }) {
  const t = useCopy();
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const measure = useCallback(() => {
    const el = document.querySelector(steps[i]?.target ?? "");
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      setRect(el.getBoundingClientRect());
    } else {
      setRect(null);
    }
  }, [i, steps]);

  useEffect(() => {
    // Measure via rAF (effect body stays side-effect-free for state), then
    // re-measure after the smooth scroll settles and on resize.
    const raf = requestAnimationFrame(measure);
    const t = window.setTimeout(measure, 350);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const step = steps[i];
  if (!step) return null;
  const last = i === steps.length - 1;

  // Popover position: below the target, clamped to the viewport.
  const popTop = rect ? Math.min(rect.bottom + 12, window.innerHeight - 220) : undefined;
  const popLeft = rect
    ? Math.max(16, Math.min(rect.left, window.innerWidth - 336))
    : undefined;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t.tour.a11y.dialog}>
      {/* Soft dim layer */}
      <div className="absolute inset-0 bg-ink/25" onClick={onDone} role="presentation" />

      {/* Highlight ring around the target */}
      {rect && (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-[var(--radius-card)] transition-all duration-200"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: "0 0 0 3px var(--gm-purple-500)",
          }}
        />
      )}

      <div
        className="gm-rise absolute w-[320px] rounded-[var(--radius-card)] border border-hair bg-surface p-5 shadow-[var(--shadow-coach)]"
        style={
          rect
            ? { top: popTop, left: popLeft }
            : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
        }
      >
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
          {t.tour.progress(i + 1, steps.length)}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold text-ink">{step.title}</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{step.body}</p>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onDone}
            className="gm-focus rounded-sm text-[14px] font-semibold text-muted transition-colors hover:text-ink"
          >
            {t.tour.skip}
          </button>
          <button
            type="button"
            onClick={() => (last ? onDone() : setI((n) => n + 1))}
            className={`${btnPrimary} min-h-[40px] px-5 text-[14px]`}
          >
            {t.tour.nextOrDone(last)}
          </button>
        </div>
      </div>
    </div>
  );
}
