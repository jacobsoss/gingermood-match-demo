# Gingermood — Adaptive Match Demo

An iPad-demoable prototype of Gingermood's headline feature: an **adaptive AI intake** that
matches a person's *specific, idiosyncratic needs* to a coach's *actual competencies* —
explicitly **not** personality or similarity — and explains its reasoning in those terms.

Built with Next.js (App Router) + TypeScript + Tailwind v4. Dutch UI copy (centralised in
`lib/copy.ts` for an easy language swap).

> ⚠️ **All coach and coachee data is synthetic sample data** and is labelled as such in the UI.
> No real records (GDPR Art. 9).

## Live AI (with a silent safety net)

The app runs **Live AI only** — real adaptive questioning + matching via Claude
(`claude-sonnet-4-6`). On any error/timeout it does one silent retry, then **degrades
invisibly to the deterministic engine** so the flow never breaks (no user-facing mode
switch; the fallback is just resilience). A run that fell back is labelled
"Offline reservematch" on the result.

## Architecture

```
data/coaches.ts        7 synthetic coaches (weighted competencies, distinct clusters)
data/personas.ts       3 sample coachees (instant, contrasting matches)
data/questionBank.ts   fallback adaptive questions (chips carry need/style tags)
lib/types.ts           Coach · NeedsProfile · Match · API contracts
lib/taxonomy.ts        tag → human phrasing, clusters, free-text keyword scan
lib/fallback.ts        deterministic next-question + tag-scoring matcher
lib/engine.ts          client facade: Live (API + retry) → deterministic fallback
lib/prompts.ts         system prompts + JSON schemas for the two Claude calls
lib/anthropicClient.ts server-only Anthropic client (key never reaches the browser)
app/api/next-question  server route: adaptive next question (structured JSON)
app/api/match          server route: needs profile + idiosyncratic-fit match
app/page.tsx           single-page state machine (welcome → questions → result)
components/*            WelcomeScreen · QuestionScreen · ProcessingScreen ·
                       ResultCard · CoachCard · DataReveal · ProgressBar · ModeToggle
```

## Local development

```bash
npm install
# create .env.local with your key (server-side only — never commit it):
#   ANTHROPIC_API_KEY=sk-ant-...
npm run dev      # http://localhost:3000
```

Live AI requires `ANTHROPIC_API_KEY` in `.env.local`. Without it (or offline) the app still
runs end-to-end via the silent deterministic fallback.

## Environment

| Variable            | Where                         | Notes                                  |
| ------------------- | ----------------------------- | -------------------------------------- |
| `ANTHROPIC_API_KEY` | `.env.local` (local) + Vercel | **Server-side only.** Never in client code or git. `.env*` is gitignored. |

## Deploy to Vercel

1. Push this repo to GitHub (or run `npx vercel`).
   - If not yet a git repo: `git init && git add . && git commit -m "Gingermood match demo"`
     then create a GitHub repo and push. `.env.local` is gitignored and will **not** be pushed.
2. Import the project in Vercel (framework auto-detected as Next.js).
3. In **Project → Settings → Environment Variables**, add `ANTHROPIC_API_KEY`
   (Production + Preview). Server-side only — do **not** prefix with `NEXT_PUBLIC_`.
4. Deploy. You'll get a real HTTPS URL for the iPad.

The model string, temperature, and `max_tokens` live in `app/api/*/route.ts` and
`lib/anthropicClient.ts`. Brand colours/fonts are CSS variables in `app/globals.css` +
`app/layout.tsx` — drop real brand assets in there to re-skin.

## iPad test checklist (run before the dinner)

Open the deployed HTTPS URL in **Safari on the actual iPad, on the venue wifi**.

- [ ] **Add to Home Screen** for a full-screen, chrome-free view (optional but nice).
- [ ] **Portrait + landscape** both legible; rotate mid-flow — no layout breakage.
- [ ] **Persona quick-picks**: tap each of the 3 personas → 3 *different* coaches, each with
      idiosyncratic-fit reasoning. Expect ~15–20s on the matching step (live).
- [ ] **Full intake**: "Begin de intake" → tap through. Confirm the questions branch on your
      answers and the result shows "Live AI-match".
- [ ] **Graceful degradation**: turn wifi off, run a persona → it should still complete
      (labelled "Offline reservematch"). Turn wifi back on.
- [ ] **Behind the scenes**: open "Toon de data" on the result → structured JSON shows.
- [ ] **Try another profile** from the result screen → instantly shows a different match.
- [ ] Full run (welcome → result) completes well under ~90s.
- [ ] Tap targets are large; text is readable across a table.

**Note for the dinner:** the app is Live AI, so test the venue wifi beforehand. If the
network is flaky it still completes via the silent fallback — but live gives the real
adaptive "wow", so a solid connection is worth ensuring.
