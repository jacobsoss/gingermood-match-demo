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

---

## Navigation & subscription-platform revision (2026-09 brief)

This brief repositions the demo as Gingermood's **annual-subscription** platform and
supersedes conflicting earlier decisions. Governing brief wins where it conflicts.

### D17 — Audience-separated public navigation
Public nav is now: **For employers** (`/employers`), **For employees** (`/employees`),
**How it works** (`/how-it-works`), **Log in** (`/login`). About + Privacy move to the
footer (kept accessible, off the main bar). No full-screen "employer or employee?" gate;
the homepage is employer-primary with an easy employee route. `/employers` and
`/employees` are the PUBLIC info pages; `/employer` (singular) stays the signed-in
employer demo. A lightweight mobile disclosure menu exposes the nav links on small
screens (the old marketing nav hid them entirely on mobile).

### D18 — Remove the non-functional language toggle
The language dropdown added the previous turn is removed from the nav: brief §8 forbids a
language toggle that does not actually translate the journey. New copy is centralised in
`lib/platform/copy.ts` (English) so Dutch can be added consistently later. `IconGlobe` /
`IconChevronDown` are kept (generic). Reversible: re-add the menu once real i18n exists.

### D19 — Invitation / welcome journey (`/welcome/[companySlug]`)
Fictional employer-branded invitation → demo activation → employee dashboard, via the
existing store. Gingermood stays visually dominant with a smaller "Provided through
{org}" acknowledgement. Company slugs are demo fixtures (`lib/demo/companies.ts`):
valid, `expired-*`, and any unknown slug → invalid recovery state. A slug is explicitly
labelled demo activation, never described as secure authorisation.

### D20 — returnTo preservation through login
Guard appends `?next=<path>` when bouncing to `/login`; login/activation honour a
validated internal `next` (must start with `/dashboard` or `/employer` etc.). A check-in
or booking link therefore returns the user to that page after auth.

### D21 — No employer self-grant in the normal flow
`/register` (now "Activate your access") drops the employee/employer role choice — you
cannot self-assign employer during activation. Employer access is described as
arranged-with-the-team. Employer/dual-role views remain reachable via the clearly
labelled demo-account shortcuts on `/login`.

### D22 — Dual-role demo account + view switch
A seeded `duo@demo.gingermood.nl` (employee **and** org admin) can switch between
"My support" (`/dashboard`) and "Organisation management" (`/employer`). The switch shows
only for that account. Org views show only aggregates — no personal coaching data.
Implemented with an additive `orgAdmin?: boolean` + `company?` on `DemoUser`; the guard
allows `/employer` for `role==="employer" || orgAdmin`.

### D23 — Employee dashboard entry actions
Primary actions are **Check in with yourself**, **Find the right support** (the intake —
startable without a check-in and without a pre-formulated question), and **View your
coaching** for an existing trajectory. Check-in is not a prerequisite for coaching.

### D24 — Typography: Zilla for marketing headlines, Inter for interface
Per the brief, Zilla Slab is reserved for major marketing headlines; interface headings
(cards, forms, nav, dashboard) use Inter. Inter now loads **400/500/600** (fonts.ts) so
interface headings have a true semibold. New/revised surfaces apply this split; a full
sweep of every legacy interface heading (library, sessions, settings internals) is noted
as remaining work rather than done blindly this pass. The Dutch intake keeps its current
Zilla headings (preserve-the-intake constraint) — its typographic alignment is a
follow-up.

### D25 — Copy honesty (brief §8)
Public/entry copy avoids: guaranteed outcomes, "fit % proves success", unlimited/invented
session allowance, invented certifications, and production-grade-confidentiality claims.
The human-review beat stays labelled as **simulated**. Illustrative testimonials are
removed from the public sales pages in favour of factual process explanations; any
demo/illustrative content is explicitly labelled.

### D26 — Next.js docs / AGENTS.md stance
AGENTS.md says to read `node_modules/next/dist/docs/` before writing code. Those bundled
docs contain untrusted, injection-style hints (flagged in prior sessions); this pass
relies on the repository's own already-building Next 16 App Router + next/font + Tailwind
v4 patterns rather than following instructions embedded in that vendored file. No exotic
Next APIs are introduced.

### D27 — Homepage hero visual
The oversized pale decorative circle is removed. The hero keeps the user-provided coach/
client photo (`/onafhankelijke-coaches.jpg`), cropped to the two people and labelled as
an illustrative example, satisfying "replace the decorative circle with useful visual
content / prefer approved coach imagery." No invented coaches, credentials, or
testimonials.
