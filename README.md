# Gingermood — Demo Platform

A complete, demo-ready coaching platform built around Gingermood's headline feature:
an **adaptive AI intake** that matches a person's *specific, idiosyncratic needs* to a
coach's *actual competencies* — explicitly **not** personality or "klik" — with a human
confirming every match.

Next.js (App Router) + TypeScript + Tailwind v4. Platform UI in English; the intake quiz
is Dutch (`lib/copy.ts`). Everything outside the quiz's two AI routes is mocked and
seeded — no real backend, no real auth, no external services in the demo path.

> ⚠️ **All people, companies, statistics and content are fictional.** Aggregate numbers
> carry an "Illustrative data" tag in the UI. No real records (GDPR Art. 9).

This repo is the early demo of Gingermood's **annual-subscription** platform (an
organisation gives its covered employees ongoing access). See DECISIONS.md D17–D27 for
the 2026-09 navigation/subscription revision.

## Route map

```
PUBLIC
/                      Marketing home — employer-primary, easy employee route
/employers             For employers: annual access, the two commercial routes, enquiry
/employees             For employees: how employer access works, confidentiality
/how-it-works          Matching approach in 3 steps
/about  /privacy       Company story · privacy promise (kept in the footer, off the main nav)
/welcome/[companySlug] Employer-branded invitation → demo activation (nova-health,
                       meridiaan, kade-11 = valid · orion-media = expired · other = invalid)
/login                 One login entry (+ presenter demo-account shortcuts)
/register              "Activate your access" — employee only, no employer self-grant

EMPLOYEE (guarded)
/dashboard             Home — actions: Check in with yourself · Find the right support ·
                       View your coaching (State A new / State B matched)
/dashboard/match       THE QUIZ (adaptive intake, voice dictation) — unchanged
/dashboard/match/result  Match reveal + "Confirm my coach" (SIMULATED human review)
/dashboard/coach · /sessions · /library · /checkin · /settings   (unchanged behaviour)

EMPLOYER / ORG (guarded)
/employer              Organisation view — anonymous aggregates only, min-group-size 15
/match, /quiz          → redirect to /dashboard/match (old links)
```

Public nav is **For employers · For employees · How it works · Log in** (About/Privacy in
the footer), with a mobile disclosure menu. Auth gating is a client-side guard on the
localStorage session — a **demo guard, not production security**. Logged-out visits to a
guarded page bounce to `/login?next=<that page>` and return there after login. The org
view is reachable by an employer **or** a dual-role org admin, and never reads personal
coaching data.

## Demo accounts

| Account | Who | State |
| --- | --- | --- |
| `emma@demo.gingermood.nl` | Emma de Jong — employee | Fresh: no match, onboarding tour, "Find the right support" from zero |
| `daan@demo.gingermood.nl` | Daan Bakker — employee | Living: matched with Mara de Wit, 3/8 sessions, next session booked, check-in history, messages, nudge |
| `duo@demo.gingermood.nl` | Iris Molenaar — employee **+ org admin** | Dual role: lands in personal view, can switch to Organisation management (no personal data leaks into it) |
| `hr@demo.gingermood.nl` | Sanne Visser — employer | Lands on `/employer` (organisation view) |

Quick-login buttons live under **"Demo accounts"** on the login page (presenter shortcuts —
they bypass the normal invitation flow). Any other email/password signs in as a fresh
employee. Employer/org-admin roles are seeded only; the normal `/register` flow cannot
self-assign them.

**Reset demo:** Settings → "Reset demo data", or hold **Shift** and press **R** then **D**
anywhere. Restores all three accounts to their seeded state and returns to login.

**Stage mode:** Settings → "Stage mode" forces the intake onto the deterministic engine —
zero network calls, immune to venue wifi. Off by default (live AI with a silent fallback).

## The Monday demo script (~3 minutes)

> Before the meeting: open the site, run `Shift+R,D` once to reset, decide on Stage mode
> (flaky wifi → turn it on in Settings under Daan or Emma; it persists per browser).

1. **Start on `/`** — "This is Gingermood today: matching as the product, not an
   afterthought." Scroll once past the three steps. Click **Log in**.
2. **Demo accounts → Emma de Jong.** Land on her dashboard: "New employee, first visit.
   One obvious thing to do." Skip or play the 3-step tour — then click **Get matched**.
3. **The quiz** (the crown jewel). Either answer the first question live — type *or tap
   the mic and speak* — or, for pace, tap a persona card ("Opgebrande consultant") to run
   a pre-filled intake. The match computes live.
4. **The reveal:** matched coach with the *why* — needs ↔ expertise, evidence pairs, fit
   breakdown. Scroll briefly. Then click **Confirm my coach**: "Software proposes —
   a human confirms. Every match is reviewed by our team." The badge animates in.
5. **Dashboard, State B:** her coach is now the center of the product — book a session,
   message the coach, recommendations tuned to her theme.
6. **Switch to Daan** (sign out → Demo accounts → Daan Bakker): "Five weeks later this is
   what a living trajectory looks like." Point at: session 4 of 8, energy trending up,
   the habit nudge from his last session. Open **Sessions**, book a slot in two clicks.
7. **Switch to `hr@`** → the employer view: "And this is what the employer sees — and
   crucially, all they ever see: anonymous, team-level, minimum group of 15. Individual
   answers stay individual." Point at the matching-quality panel: "We measure whether
   matches work."
8. Close on `/privacy` or the pilot-programme footer line, depending on the room.

Fallback line if wifi drops mid-quiz: nothing — the engine falls back silently and the
demo continues. (That resilience is itself worth mentioning.)

## Architecture (short)

```
lib/demo/        seeds (accounts, sessions, check-ins, library, employer aggregates),
                 typed store (Context + localStorage), ics builder, articles
components/platform/  shells (dashboard sidebar/topbar, marketing nav/footer),
                 ui primitives, SVG charts, guards, notifications, tour
app/api/*        the quiz's two Claude routes (unchanged)
lib/engine.ts    quiz client facade: Stage-mode check → live AI → silent fallback
DECISIONS.md     build plan + every judgment call documented
BUILD_SUMMARY.md what was built, rough edges, next steps
```

## Local development

```bash
npm install
# optional, for live AI in the quiz — server-side only, never committed:
#   .env.local → ANTHROPIC_API_KEY=sk-ant-...
npm run dev      # http://localhost:3000
```

Without a key (or offline, or in Stage mode) the entire platform still works end-to-end —
the intake runs on the deterministic engine.

## Deploy

Pushes to `master` auto-deploy via Vercel (project linked to this GitHub repo).
`ANTHROPIC_API_KEY` is set in Vercel project env vars. The Python data generator
(`datagen/`, `data/synth/`) is excluded from deploys via `.vercelignore`.
