# Gingermood — Adaptive Match Demo: Build Spec
*Single source of truth for the build. Target: a working, iPad-demoable prototype of Gingermood's headline feature — adaptive AI intake → matched coach with idiosyncratic-fit reasoning. For the dinner with Dickey.*

---

## 1. Objective & definition of done

**Goal:** Make the headline feature real and tappable. Show three things live:
1. **Adaptive AI questioning** — follow-up questions that genuinely branch on prior answers (not a static form).
2. **Idiosyncratic-fit matching** — match a person's *specific, individual needs* to a coach's *actual competencies*, explicitly NOT on personality or similarity (the Kees insight). Different needs must visibly produce different matches.
3. **The data story** — show that the intake becomes structured data (the seed of the outcome flywheel).

**Definition of done:**
- Opens on an iPad in Safari at a real URL, portrait and landscape, large and legible.
- A full run (welcome → ~5 questions → match) completes in under ~90 seconds.
- It NEVER hard-breaks in front of Dickey — guaranteed by a scripted fallback mode.
- Uses only synthetic data (GDPR Art 9 — no real coachee or coach records).
- Looks like a refreshed Gingermood product, not a generic AI demo.

**Out of scope for v1 (separate artifacts):** the HR/intelligence dashboard, the verzuim triage flow, the continuity layer, real HRIS integration, any real database.

---

## 2. User journey (screen by screen)

- **S0 — Welcome.** Refreshed Gingermood brand, one line ("Let's find the coach who fits you"), a Start button, and 2–3 tappable sample personas for fast demoing (see §3). Mode toggle (Live / Demo) tucked in a corner.
- **S1 — Seed questions.** 1–2 opening questions to give the AI something to branch from: an open "What's going on for you right now that made you think about coaching?" plus one light structured question (e.g. context: role/work pressure). Open text + optional chips.
- **S2…Sn — Adaptive loop.** For each step the engine generates the single most useful *next* question based on everything answered so far, steering toward specific needs and desired coach characteristics (Kees: "name three things you'd want in your coach"). ~4–6 questions total. Progress indicator. Open text with AI-suggested quick-pick chips so it's tappable, not typing-heavy.
- **Sn+1 — Processing.** A short, satisfying "Reading your answers… matching…" state (~2–4s).
- **Sn+2 — Result.** Three blocks:
  1. **Your needs profile** — the structured read: presenting themes, specific/idiosyncratic needs, desired coach characteristics, practical constraints.
  2. **Your match** — a coach card + a clear, idiosyncratic-fit "why this coach for *these* needs" explanation, plus a per-dimension fit breakdown and a runner-up.
  3. **Behind the scenes (toggle)** — the same intake shown as structured JSON/data, with a line: "every match becomes data that makes the next match better." (The flywheel point, for Dickey.)
- **Sn+3 — Reset / try another.** Restart, or tap a different persona to instantly show a *different* match (proves differentiation without typing).

---

## 3. Data layer (synthetic, structured)

All data is fabricated and clearly labelled as sample data.

**3a. Coach pool — ~7 coaches**, each a structured record so matching can score. Schema:
```
Coach {
  id, name (fictional), region, languages[], years_experience,
  specialisms[]            // e.g. burnout/stress, leadership-transition, career-direction,
                           //      confidence/imposter, high-pressure-exec, communication/assertiveness
  methods[]                // e.g. ACT, solution-focused, systemic, somatic, cognitive
  sector_experience[]      // e.g. finance, consultancy, healthcare, tech, public
  best_fit_for[]           // plain-language descriptors of who they suit
  working_style[]          // e.g. directive, reflective, structured, exploratory
  bio (2–3 sentences)
  avatar                   // initials/illustrated, NOT a real photo
}
```
Tune the 7 so each owns a distinct need-cluster, guaranteeing different inputs → different matches:
1. Stress / burnout / work-life balance
2. First-time manager / leadership transition
3. Career direction / loopbaan
4. Confidence / imposter syndrome
5. High-pressure executive / finance-compliance context
6. Communication / assertiveness
7. A generalist/flex coach (so there's always a sensible second option)

**3b. Coachee intake model** (the "digital profile" the intake produces):
```
NeedsProfile {
  presenting_themes[], specific_needs[] (idiosyncratic, free-text + tags),
  desired_coach_characteristics[], working_style_prefs[],
  practical_constraints { language, region, format }, urgency
}
```

**3c. Match output model:**
```
Match {
  coach_id, fit_score (0–100), reasoning (idiosyncratic-fit framed),
  fit_breakdown[ {dimension, score} ], runner_up_id
}
```

**3d. Sample personas** — 3 fully pre-filled coachees (e.g. "burnt-out consultant," "newly promoted manager," "career-crossroads analyst") so the demo can run instantly and reliably and show contrasting matches.

**3e. Bridge to production (note, not built):** this intake/match schema is the seed of the real forward-looking outcome dataset — add `outcome` fields (satisfaction, goal-achievement) later and it becomes the flywheel.

---

## 4. AI / engine layer

Two Claude calls, both server-side (key never touches the client).

**Call 1 — next question.** Input: conversation so far + objective. Output (JSON): `{ question, chips[], dimension_probed }`. System prompt encodes: surface *specific, idiosyncratic* needs and desired coach traits; one question at a time; do not probe personality for its own sake; stop signalling after enough signal.

**Call 2 — profile + match.** Input: full intake + the coach pool. Output (JSON): a `NeedsProfile` + a `Match` (chosen coach, fit_score, reasoning, fit_breakdown, runner_up). System prompt encodes the core rule: **match idiosyncratic needs ↔ real coach competencies; explicitly NOT personality similarity; explain the reasoning in those terms.**

**Settings:** model `claude-sonnet-4` family; low temperature for consistency; tight `max_tokens`; strict "JSON only, no prose" with robust parsing (strip code fences, try/catch).

---

## 5. Robustness & modes (the stability guarantee)

- **Two modes, user-toggleable on S0:**
  - **Live** — real adaptive AI (the wow; needs connectivity).
  - **Demo/Scripted** — fully pre-baked questions + matches, zero API calls. Bulletproof for the dinner / weak wifi.
- **Graceful degradation in Live mode:** on API error/timeout, fall back to a curated next-question bank and a deterministic tag-scoring matcher so the flow always completes. One silent retry before fallback.
- Loading states on every async step; nothing ever appears frozen.
- Lock the 3 personas to produce reliably strong matches.
- **Test on the actual iPad and venue wifi before the dinner.**

---

## 6. Design / UX

- **Aesthetic:** refreshed Gingermood — warm, human, calm, premium. A warm amber/terracotta accent over a soft neutral ground; rounded cards; generous space. A characterful display font paired with a clean readable body (avoid generic Inter/Roboto). Subtly signals the repositioning from "service company" to "modern platform."
- **iPad-first:** large tap targets, large type (legible for a 67-year-old across a table), one-thumb flow, portrait + landscape, smooth transitions.
- **Micro-interactions:** staggered reveal on the result screen, smooth question transitions, a satisfying matching animation. High-impact moments only, not scattered effects.
- **Swappable branding:** colours/logo as CSS variables so real brand assets drop in later.

---

## 7. Tech architecture

- **Stack:** Next.js (App Router) + TypeScript + Tailwind. Deployed to Vercel → real HTTPS URL for the iPad.
- **API key:** `ANTHROPIC_API_KEY` in env (`.env.local` + Vercel env). **Server-side only — never in client code or the repo.**
- **No database:** all state in React; coach/persona data as local TS files.
- **Repo structure:**
```
/data/coaches.ts          # 7 synthetic coaches
/data/personas.ts         # 3 sample coachees
/data/questionBank.ts     # fallback questions
/lib/types.ts             # Coach, NeedsProfile, Match
/lib/prompts.ts           # system prompts for both calls
/lib/fallback.ts          # deterministic tag-scoring matcher
/app/api/next-question/route.ts
/app/api/match/route.ts
/app/page.tsx             # single-page state machine (welcome→questions→result)
/components/*             # WelcomeScreen, QuestionScreen, ResultCard, CoachCard, DataReveal, ProgressBar
```

---

## 8. Build sequence (zero → demo)

Ordered so it's testable at every step and a working demo exists early:
1. **Scaffold** — Next.js + TS + Tailwind + repo structure + brand CSS variables.
2. **Data + types** — coaches.ts, personas.ts, questionBank.ts, types.ts.
3. **Static UI shell** — welcome → question → result, styled, mobile-first, with hardcoded content. Make it *look great* first.
4. **Fallback engine** — deterministic question flow + tag-scoring matcher so the ENTIRE demo works with no API. (Now there's always something to show.)
5. **API routes** — next-question + match, server-side Claude calls, JSON parsing, error handling.
6. **Wire modes** — Live (API) + Demo (scripted) toggle; graceful degradation.
7. **Polish** — animations, the structured-data reveal, persona quick-picks, landscape.
8. **Deploy + harden** — Vercel; test on iPad + wifi; lock personas; final copy pass.

---

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Live API breaks at dinner | Scripted Demo mode + silent fallback |
| Latency feels slow | Small max_tokens, loading states, retry-once |
| Off-brand look | Brand as CSS vars; supply real colours/logo |
| Privacy (real data) | Synthetic data only, labelled as such |
| Scope creep | Lock to the single match flow; dashboard is separate |
| Over-promising | Frame to Dickey as a *working prototype of the engine*, not a finished product |

---

## 10. Inputs needed from Jacob
- Anthropic API key (for Live mode; goes in env, server-side only).
- Optional: real Gingermood brand colours + logo to match exactly.
- Language: English (default) or Dutch — copy is centralised so it's a quick swap.
- A glance at the 7 coach need-clusters to confirm they mirror Gingermood's real coaching themes (synthetic, but realistic).
