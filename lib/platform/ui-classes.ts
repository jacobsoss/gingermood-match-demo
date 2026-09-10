/**
 * Shared button/utility class strings as a PLAIN module (no "use client"), so
 * both server marketing pages and client pages can import them. Mirrors the
 * classes in components/platform/ui.tsx (that copy is imported by existing
 * client pages); keep the two in sync.
 */

export const btnPrimary =
  "gm-focus inline-flex min-h-[48px] items-center justify-center rounded-full bg-orange px-7 text-[16px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

export const btnPrimaryLg =
  "gm-focus inline-flex min-h-[52px] items-center justify-center rounded-full bg-orange px-8 text-[17px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

export const btnSecondary =
  "gm-focus inline-flex min-h-[44px] items-center justify-center rounded-full border-[1.5px] border-hair bg-surface px-6 text-[15px] font-semibold text-ink transition-colors hover:border-purple hover:text-purple-700 active:scale-[0.98] disabled:opacity-40";

export const btnLink =
  "gm-focus rounded-sm text-[15px] font-semibold text-purple transition-colors hover:text-purple-700 hover:underline";

/** Interface heading — Inter (font-body) semibold, ink. Marketing headlines use font-display (Zilla). */
export const headingUi = "font-body font-semibold text-ink tracking-[-0.01em]";
