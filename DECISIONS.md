# DECISIONS.md — Gingermood demo platform build

## Plan (written before building)

Build order, single-authored foundation first so the platform feels like one hand:

1. **Foundation (inline):** typed demo-state store (`lib/demo/`) with seeds for the three
   demo accounts; shared platform shells (marketing nav/footer, dashboard sidebar/topbar)
   and primitives (cards, badges, charts, icons) extracted from the quiz's existing
   tokens; auth pages + client-side guards.
2. **Quiz relocation (inline, most delicate):** the existing intake state machine moves
   verbatim to `/dashboard/match`; the result persists to the demo store and renders at
   `/dashboard/match/result` with an additive "Confirm my coach" slot. Zero changes to
   quiz logic, API routes, fallback engine, or dictation.
3. **Dashboard home (inline):** State A (no match → Get matched) / State B (matched →
   My coach card, progress strip, wellbeing sparkline, personalized recommendations).
4. **Parallel fan-out (subagents, disjoint files):** marketing pages, library, sessions/
   booking, check-in, employer screen, coach page, settings — all against a strict
   style/API contract.
5. **Integrate, polish, verify:** click through every route, mobile pass, `npm run build`
   + lint clean, README demo script, BUILD_SUMMARY.md.

Commits at each milestone; push to master (auto-deploys) only after final verification.

---

## Decisions

### D1 — Language: English platform UI, quiz stays Dutch
The brief asks for an English UI "consistent with the current quiz", but the current quiz
UI is Dutch (`lib/copy.ts`). Hard constraint #1 (do not touch the quiz) wins: the quiz
remains Dutch, and all *new* platform chrome is English. This is a familiar pattern in
Dutch B2B SaaS (English product shell, Dutch content) and plays well for Monday's Dutch
audience: the platform reads international, the intake feels native. Documented here as
a deliberate tension, trivially reversible later by translating `lib/copy.ts`.

### D2 — No photos; initials avatars everywhere
The design system (DESIGN.md §4 + `Avatar`) bans stock photos — coaches are synthetic and
the brand value is honesty about demo data. The "coach photo" asked for in the brief is
rendered as the existing initials avatar. Same for testimonials and team sections.

### D3 — Auth is a client-side guard, not middleware
Session lives in `localStorage` (`gm-demo-v1`), so Next middleware can't read it. A small
`RequireRole` client guard redirects logged-out users to `/login` and wrong-role users to
their home. Acceptable for a mocked demo; documented as a known rough edge.

### D4 — One store, hydrated after mount, skeletons while loading
All demo state (users, sessions, check-ins, messages, notifications) lives in one React
Context + localStorage blob, seeded per demo account. Components render skeletons until
the store reports `ready` — this avoids SSR/localStorage hydration mismatches *and*
satisfies the "loading skeletons" polish item with one mechanism.

### D5 — Charts are hand-rolled SVG
No new dependencies. Sparkline, trend line, and stacked bars are ~40-line SVG components
using the existing tokens. Reliable on stage, consistent with the design system, and the
quiz already uses inline SVG.

### D6 — Stage mode = existing fallback behind a flag
`lib/engine.ts` gets one additive check: if `localStorage["gm-stage-mode"] === "1"`, skip
the network and use the deterministic engine directly. Toggle lives in Settings ("Stage
mode — run fully offline"). Default off (live AI with silent fallback, as today).

### D7 — Quiz welcome screen is kept (it IS the abbreviated demo path)
The quiz's internal welcome screen with persona quick-picks stays as the intro of
`/dashboard/match` — the personas are exactly the "abbreviated path" the Monday script
needs. Only the quiz's `NavBar` is dropped (the dashboard shell provides chrome; the
3px orange stripe is preserved by the shell so the brand chrome is identical).

### D8 — Result page split via an additive prop
`ResultCard` gains one optional `confirmSlot?: ReactNode` rendered after the matched-coach
section. Undefined ⇒ byte-identical behavior. The result route passes the Confirm flow
(2s simulated human review → confirmed badge animates in → State B).

### D9 — Old URL preservation
The quiz's only public URL was `/`, which becomes the marketing home — it cannot redirect
to the quiz. `/match` and `/quiz` redirect to `/dashboard/match` (covers shared links that
predate the platform). `/api/*` routes are untouched, so nothing that calls them breaks.

### D10 — Employer company is "Meridiaan Consulting B.V."
The brief's example header said "Acme B.V.", but fake data must be Dutch-plausible; Acme
is American-cartoon. Five departments, min-group-size-15 privacy line built into the UI.

### D11 — Demo accounts
- `emma@demo.gingermood.nl` — Emma de Jong, employee, fresh (State A, onboarding tour).
- `daan@demo.gingermood.nl` — Daan Bakker, employee, matched 5 weeks ago with Mara de Wit
  (stress & burn-out → "Workload & boundaries" trajectory), 3/8 sessions done, next
  session booked, 3 check-ins of history, seeded messages + notifications.
- `hr@demo.gingermood.nl` — Sanne Visser, employer → `/employer`.
Login accepts any email/password; unknown emails become a fresh employee account.

### D12 — Reset
`resetDemo()` in Settings + keyboard shortcut: hold **Shift**, press **R** then **D**
(within 1.5s). Restores all seeded state and returns to the login screen.

### D13 — Library recommendations are theme-mapped
Coach specialism → library categories (e.g. stress-burnout → Stress & workload, Sleep &
energy). Daan's recommendations therefore track his trajectory automatically, and a
fresh match personalizes State B immediately — "the product feels intelligent" without
pretending to be.

### D14 — Scope discipline
Not built (per brief): real email, payments, employer drill-downs, admin, i18n toggle,
dark mode. Also consciously skipped: drawer-style mobile sidebar (mobile uses a reliable
horizontal pill nav — fewer failure modes on stage).

### D15 — Lint purity fixes touched three quiz-adjacent files (behavior-preserving)
`npm run lint` (React hooks purity rules) flagged pre-existing patterns in
`components/CoachCard.tsx`, `components/DictationField.tsx` and
`lib/useSpeechDictation.ts`. Fixes are minimal and semantically identical: state setters
deferred one frame via `requestAnimationFrame`, a latest-value ref write moved from
render into an effect. No visual or behavioral change; documented here because of the
"don't touch the quiz" constraint — these are maintenance, not restyling.

### D16 — Demo content language
Platform chrome is English (D1); user-generated-style content (coach message thread)
is also English for on-screen consistency, while names, roles, topics and testimonial
voices are Dutch-flavoured. The quiz itself remains fully Dutch.
