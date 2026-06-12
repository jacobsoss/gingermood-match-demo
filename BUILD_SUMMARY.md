# BUILD_SUMMARY — Gingermood demo platform

## What was built

A complete demo platform wrapped around the existing adaptive-intake quiz, in one
session, for the Monday company meeting. 19 routes, all verified by clicking through
every screen; `npm run build`, `tsc --noEmit` and `eslint` all pass clean.

- **Public site** — home, about, privacy (designed promise page), how-it-works. One
  brand voice, honest stats ("Illustrative data" tags, no invented outcome numbers).
- **Demo auth** — login (any credentials; quick-login buttons for the 3 seeded
  accounts), register with employee/employer role choice, client-side route guards.
- **Employee dashboard** — State A (Get matched as the conversion center, 3-step
  onboarding tour) and State B (My coach card with confirmed badge, trajectory strip,
  wellbeing sparkline, habit nudge, theme-tuned library recommendations).
- **The quiz, relocated not rewritten** — lives at `/dashboard/match` inside the shell;
  result page adds "Confirm my coach" (2s simulated human review → badge animates in →
  State B with the actual quiz-derived coach). Quiz logic, API routes, fallback engine
  and voice dictation untouched. Old `/match`/`/quiz` links redirect.
- **Sessions** — seeded availability (Dutch working hours, some slots taken), booking
  modal (video/in-person/phone + note), reschedule/cancel with confirm dialogs, .ics
  download, history with topics and a 1–5 rating control (the outcome-data flywheel).
- **Library** — 12 seeded items across 6 categories; 3 fully written 300–500-word
  articles; working search + category filter; designed placeholders for the rest.
- **Check-in** — 6-question pulse, one per screen with auto-advance, warm personalized
  result + 2 tailored library links, trend chart + per-dimension sparklines, the
  privacy promise framed where it matters most.
- **Employer preview** — one polished screen: KPI row, green/orange/red department
  bars with the min-group-size-15 line built into the UI, 4-quarter trend, matching-
  quality panel, "pilot programme" footer.
- **Extras that landed** — notification bell with seeded deep-linking notifications,
  working coach message thread, between-session habit nudge, skeleton loading states,
  designed empty states, Stage mode (offline deterministic intake), Reset demo
  (Settings + Shift+R,D), page-entrance motion within the existing animation system.

## How it was built

Foundation (store/seeds/shells/auth/quiz-relocation/dashboard) single-authored first;
then the 7 independent workstreams (marketing, library, sessions, check-in, employer,
coach, settings) built in parallel by subagents against a strict style/API contract;
then integrated, lint-fixed, and verified end-to-end. Three commits, each rollbackable.
All judgment calls are in `DECISIONS.md`.

## Known rough edges

- **Screenshots/visual QA** were done via DOM inspection plus structural screenshots —
  the preview tool's capture pipeline degraded mid-session (tool issue, not app; pages
  report correct dimensions and zero console errors). Worth one human pass on
  laptop + phone before Monday.
- **Client-side auth only** — a direct visit to a gated URL flashes a skeleton before
  redirecting. Fine for a demo; a real build moves the session to a cookie + middleware.
- **Tour positioning** is anchored to the three home cards; on very short viewports the
  popover clamps rather than repositions elegantly.
- **The quiz remains Dutch** inside the English platform (deliberate — DECISIONS.md D1).
- **Reset returns to /login** (by design); presenter should expect that after Shift+R,D.
- Booking allows any free seeded slot; no timezone handling beyond the browser's.
- Three quiz-adjacent files received minimal, behavior-preserving lint fixes (rAF-
  deferred state setters, ref write moved to an effect) — visually and functionally
  identical, documented for transparency given the "don't touch the quiz" constraint.

## Highest-value next steps

1. **Real persistence** — swap the localStorage store for a tiny DB (or Vercel KV) with
   the same `lib/demo` interface, so multiple devices share state and the flywheel
   claim ("every match becomes data") becomes literally true.
2. **Coach onboarding** — a self-serve flow where coaches declare competencies in the
   existing tag vocabulary; turns the 7 hardcoded coaches into a real pool and is the
   first question any pilot partner asks.
3. **Need-vs-personality split screen** — the same intake scored by a personality-style
   matcher next to the Gingermood matcher, with the synthetic-data bake-off number as
   the caption. Makes the core thesis visible and falsifiable in 30 seconds.
4. **Outcome capture** — wire the session ratings + check-ins into a real event log
   that mirrors the synthetic dataset's schema, so the offline validation tooling runs
   on live data the day a pilot starts.
5. **Employer drill-down v2** — the one screen → a real (still aggregate-only)
   analytics surface once a pilot defines what HR actually needs to see.
