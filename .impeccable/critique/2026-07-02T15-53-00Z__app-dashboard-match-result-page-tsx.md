---
target: /dashboard/match/result
total_score: 29
p0_count: 0
p1_count: 3
timestamp: 2026-07-02T15-53-00Z
slug: app-dashboard-match-result-page-tsx
---
# Critique — /dashboard/match/result (coach reveal)

Method: dual-agent (A: design-review a41832ff · B: detector a3353bd1)
Browser visualization unavailable — no browser-automation tool exposed this session, no dev server on :3000. Deterministic detector ran clean.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skeleton, processing screen, aria-live present; "confirmed within one working day" copy contradicts the 2s confirm. |
| 2 | Match System / Real World | 3 | Dutch is natural for the persona, but an English confirm card inside a Dutch reveal breaks the mental model mid-task. |
| 3 | User Control & Freedom | 3 | Restart + persona re-run + human handoff present; no un-confirm, and confirm sits before the evidence. |
| 4 | Consistency & Standards | 2 | Language flip on one screen; DESIGN.md↔code font divergence; three different human/AI signals. |
| 5 | Error Prevention | 3 | Direct-visit guard redirects to intake; no guard against confirming before scrolling the evidence. |
| 6 | Recognition Rather Than Recall | 4 | Recognition block reflects the user's own words; evidence pairs restate need↔strength; nothing to remember. |
| 7 | Flexibility & Efficiency | 3 | Persona quick-picks are a real power path; no keyboard shortcuts, confirm not sticky in thumb zone. |
| 8 | Aesthetic & Minimalist | 3 | Restrained and premium, but three human-in-the-loop artifacts dilute each other. |
| 9 | Error Recovery | 2 | Re-run path has no .catch and settle() retries forever with no cap (latent hard-break). |
| 10 | Help & Documentation | 3 | Data drawer + "software proposes, a human confirms" self-document the model well. |
| **Total** | | **29/40** | **Good — solid foundation, fixable friction** |

## Anti-Patterns Verdict

**Not slop.** This reads as a senior-team product. Against both the Impeccable bans and DESIGN.md's own anti-slop list, the screen is clean: no gradients, no glassmorphism, no side-stripe borders, no gradient text, no emoji icons, no stock photos, exactly one shadow (the hero coach card), one primary orange button at a time, and a deliberate weight hierarchy (hero → bordered fit card → borderless runner-up) rather than a uniform card grid. The 90/7/3 rule holds under a squint.

**Deterministic scan:** detect.mjs over the 6 markup files (page.tsx, ResultCard, CoachCard, DataReveal, Bar, Avatar — 647 lines) returned exit 0, zero findings. Verified as a real pass, not a silent skip.

**Two things crack the illusion, both invisible to the detector:**
1. **The committed type system isn't the one shipping.** DESIGN.md §2 specifies Fraunces + Source Sans and §8 explicitly BANS Inter. The build runs Zilla Slab + Inter (fonts.ts). Inter-body under a slab display is the single most common "AI made this" pairing — defensible here, but the doc is stale and should be reconciled. Corollary: only Inter 400/500 are loaded with font-synthesis:none, so every `font-semibold` (600) on UI text renders at 500 — emphasis hierarchy is quietly flatter than the code claims.
2. **Mid-screen language flip.** The Dutch reveal is interrupted by an all-English confirm card and confirmed-badge, then resumes. On an iPad in front of an investor this reads as a localization bug at the highest-stakes beat.

**Browser overlay:** none produced (no browser tool this session). No visual overlay claim is being made.

## Overall Impression

A genuinely well-composed reveal that already embodies the product thesis — evidence pairs prove fit instead of asserting it, restraint signals a senior hand, and motion/reduced-motion are complete. The single biggest opportunity isn't visual polish; it's **sequence and focus**: the emotional peak (recognition) shares its surface with utility copy so it doesn't land as a peak, and the confirm action is stapled in *before* the evidence it asks you to trust — inverting the propose→examine→confirm logic that is the entire pitch.

## What's Working

1. **Weight-differentiated cards do real hierarchy work.** Hero coach = the only shadow + biggest avatar + counting score; fit = bordered flat card; runner-up = borderless and smaller. Importance shown through restraint.
2. **Evidence pairs prove fit.** `Jij: [need] ↔ Coach: [strength]` (ResultCard.tsx:164-174) is the literal embodiment of "never 'great match!', always why this coach." The arrow drops on mobile with the Jij/Coach labels carrying the meaning.
3. **Motion is complete and accessible.** Staggered gm-rise, one-shot bar growth, a count-up that checks prefers-reduced-motion and still lands the final value; the global reduce block pins bars to scaleX(1). Comprehension never depends on motion.

## Priority Issues

**[P1] Confirm CTA is placed before the evidence it asks you to trust.**
- What: `confirmSlot` renders at ResultCard.tsx:182 (delay 120) — between the coach card and the fit breakdown (:185), runner-up (:204), and data reveal (:218).
- Why it matters: The user is asked to "Confirm my coach" before the per-dimension fit and runner-up are on screen. They either confirm blind or scroll down to read the evidence and back up to act — inverting the propose→examine→confirm logic that is the product's whole thesis.
- Fix: Move confirmSlot to render after the fit breakdown and runner-up (delay ~280, before the data reveal) so confirmation is the natural terminus of the evidence.

**[P1] Language flips mid-screen at the highest-stakes beat.**
- What: The reveal is Dutch (COPY.result), but the confirm card is hardcoded English — "Happy with this match?", "Confirm my coach", "Go to your dashboard" (page.tsx:38-73) — and ConfirmedBadge is English (ui.tsx:58).
- Why it matters: The Dutch-intake / English-platform split is deliberate BETWEEN surfaces, but here both languages collide on one card straddling the emotional peak. To an investor on an iPad it reads as a bug, undermining "built by a senior team" exactly when it matters most.
- Fix: Route the confirm card's copy through COPY.result (Dutch) — the confirmation is part of the intake experience, not English platform chrome. Keep the split at the route boundary, not inside a card.

**[P1] The persona re-run path has no failure exit (latent hard-break).**
- What: getMatch(persona.answers) at page.tsx:100 has no .catch, and handleRerunComplete's settle() recurses on a 120ms timer forever until pendingResult is set (page.tsx:107-117).
- Why it matters: "Never break in front of the room" is a stated principle. getMatch routes through lib/engine.ts which has a silent fallback, so the common case is covered — but if the promise ever rejects or resolves falsy, the processing screen spins indefinitely with no exit. That's the one failure mode the product forbids, on the exact interaction (a live persona quick-pick) an investor is most likely to tap.
- Fix: Add a .catch that sets a deterministic fallback result, and cap settle() with a max-attempts/timeout that surfaces the fallback match.

**[P2] Recognition — the intended peak — shares its skin with utility copy.**
- What: The recognition block uses bg-wash (ResultCard.tsx:118), but so do the range-relaxed notice (:131) and every evidence row (:162). It's distinguished only by type size (23px).
- Why it matters: DESIGN.md §4 wants the recognition block distinct ("the words are the design"). Sharing the lavender wash with utility content means the "this system understood me" beat reads as the first of many lavender cards, not a beat.
- Fix: Give recognition the page's one permitted full-width bg-wash wash (DESIGN.md §5 allows exactly this) and let nothing else share that surface. Add text-wrap:balance to the recognition paragraph (base rule is scoped to h1–h3 only).

**[P2] Reassurance copy contradicts the dramatized behavior.**
- What: The reviewing state says "normally you're confirmed within one working day" (page.tsx:55) but the timer confirms in 2000ms (page.tsx:31) and immediately shows the confirmed badge.
- Why it matters: The demo's point is dramatizing "a human confirms" — but the words promise a day while the eyes see two seconds. The mismatch makes the human-in-the-loop beat feel scripted.
- Fix: Change the reviewing copy to describe what's happening now ("A matcher is reviewing your match…") with no duration claim the demo immediately violates.

## Persona Red Flags

**Sam (screen reader + keyboard, needs 4.5:1, 200% zoom):**
- Focus is dropped on every confirm phase change (idle→reviewing→confirmed, page.tsx:24-76): the triggering button unmounts and nothing receives focus, so a keyboard user is dumped at document top and the new "Go to your dashboard" button isn't focused. Move focus to the new heading/CTA on each phase.
- Color-only meaning in the persona picker: "this persona maps to your current coach" is signalled only by border-purple vs border-hair (ResultCard.tsx:241) — no text or icon. Invisible to Sam.
- Contrast passes AA (text-muted #6B6380 ~5.6:1 on white) but is applied at 13px for the source badge, %-match, tags, and fit scores — the floor of acceptable.

**Casey (one thumb, interrupted):**
- State survives (lastResult persisted in the demo store, re-read on mount) — interruption is safe. Good.
- Confirm is not in the thumb zone: mid-page, left-aligned, non-sticky, on a tall Dutch reveal. Consider a sticky confirm on mobile once evidence has been seen.
- Two marginal touch targets: the data-reveal toggle (~40px, DataReveal.tsx:58) and the inline text links (line-height-sized). Buttons and persona cards clear 44px.

**Investor-on-an-iPad (60s, arm's length — project persona):**
- Body text is below the committed floor. DESIGN.md/PRODUCT say never below 17px; base is 16px and the screen leans on 15px (coach bio, evidence, fit notes, confirm copy) and 13px (badges, tags, scores). Only recognition (23px) and the match reasoning (17px) clear the arm's-length bar — yet the *why* often lives in the 15px copy.
- The reveal reads premium in one glance, and "why this coach" reads as differentiated fit, not "great match." Both land.
- The re-run failure path (P1) is the live-demo landmine.

## Minor Observations

- font-semibold (600) is a no-op on all Inter text (only 400/500 loaded + font-synthesis:none). Load Inter 600 or stop specifying 600.
- DESIGN.md §2/§8 (Fraunces/Source Sans, Inter banned) are stale vs the shipped Zilla/Inter system — reconcile so future critiques judge against reality (a `/impeccable document` re-run would capture the real tokens).
- Two uppercase-tracked eyebrows (coach section :143, runner-up :207). Used sparingly (section labels, not every section) so not a ban violation, but worth a glance against the "eyebrow reflex."
- Three overlapping human/AI signals (source badge "Live AI-match" :147, the confirm card, and the Dutch handoff "Laat een matchmaker afstemmen") spread the signature idea thin across two languages and three meanings (provenance / confirmation / escalation). Let the confirm card own it.
- Bar clamps to a 2% minimum width (Bar.tsx:3), so a near-zero fit dimension visually overstates as "a little."
- Peak-END lands on five exit actions (restart + 3 personas + handoff) rather than on confirmation.

## Questions to Consider

1. Should the user confirm the *coach*, or confirm the *reflection*? What if the flow were recognize → "is this you?" → then reveal the coach as the reward for being understood — putting the human-in-the-loop beat on the emotional peak instead of the transaction?
2. Is the recognition block powerful enough to be a real peak, or just the first lavender card? If it owned the page's one full-width wash and nothing else shared it, would "it understood me" finally stand alone?
3. Why does the most on-brand moment — a human confirming — speak English in a Dutch reveal? If the split is truly at the route boundary, this card is on the wrong side of it.
4. The demo dramatizes a 2-second human review but the copy promises a working day. Which truth do you want the investor to believe — instant human-in-the-loop, or real review takes time? Pick one and let copy and motion tell the same story.
