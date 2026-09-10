/**
 * Tiny client-side query helpers for entry flows. Reading window.location.search
 * directly (instead of useSearchParams) keeps these pages out of a Suspense
 * boundary and off the prerender-dynamic path — they're interactive client pages.
 */

export function isSafeNext(next: string | null | undefined): next is string {
  // Internal paths only — never an absolute URL / protocol-relative (open redirect).
  return !!next && next.startsWith("/") && !next.startsWith("//");
}

export function readParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

/** The validated internal return path from ?next, or null. */
export function readNext(): string | null {
  const next = readParam("next");
  return isSafeNext(next) ? next : null;
}
