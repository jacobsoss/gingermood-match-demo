import { Zilla_Slab, Inter } from "next/font/google";

/**
 * Typography system — Zilla Slab (headings) + Inter (body/UI).
 *
 * Loaded via next/font/google, which self-hosts the files at build time:
 * no runtime requests to Google (GDPR). Exposed as CSS variables
 * --font-heading and --font-body on <html>, mapped to Tailwind's
 * font-heading / font-body families in globals.css.
 *
 * Hard rules: only the weights below are loaded, no faux weights
 * (font-synthesis: none, set globally). A serif never falls back to sans.
 */

// Headings only — Zilla Slab 500 (h3) and 600 (h1/h2). Never below 20px.
export const zillaSlab = Zilla_Slab({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"], // latin-ext covers Dutch diacritics
  display: "swap",
  weight: ["500", "600"],
  fallback: ["Georgia", "Times New Roman", "serif"], // serif → serif only
});

// Body & UI — Inter 400 (body), 500 (buttons, nav, emphasis, eyebrow),
// 600 (interface headings: cards, forms, dashboard — Inter replaces Zilla here).
export const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600"],
  fallback: ["-apple-system", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
});
