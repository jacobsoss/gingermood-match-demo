"use client";

import { COPY } from "@/lib/copy";
import { SampleBadge } from "@/components/SampleBadge";

/**
 * Persistent chrome (all screens): a single full-width 3px orange brand stripe —
 * the one full-width accent in the app — above a 68px frosted nav. The logo is a
 * button that returns to the start. Right: the sample-data pill.
 */
export function NavBar({ onHome }: { onHome: () => void }) {
  return (
    <div className="sticky top-0 z-40">
      <div className="h-[3px] w-full bg-orange" />
      <header className="h-[68px] border-b border-hair bg-surface/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[680px] items-center justify-between gap-4 px-6 sm:px-8">
          <button
            type="button"
            onClick={onHome}
            aria-label={`${COPY.brand} — terug naar start`}
            className="gm-focus -m-2 rounded-md p-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Gingermood" className="h-7 w-auto" />
          </button>
          <SampleBadge />
        </div>
      </header>
    </div>
  );
}
