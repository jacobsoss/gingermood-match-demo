# Product

## Register

product

## Users

**Primary (in the room): an investor / partner deciding whether to back Gingermood.**
Someone senior evaluating the engine and the business — watching a live, tappable demo
(often on an iPad, across a table) rather than reading a deck. They need to *feel* that the
headline feature is real and differentiated in under ~90 seconds. Legibility, pace, and
never hard-breaking matter more than feature depth. The original framing was "the dinner
with Dickey"; the same demo now doubles as internal buy-in for the repositioning from
"service company" to "modern platform."

**Depicted (inside the demo): the people the product actually serves.**
- **Employees** — Dutch knowledge workers seeking a coach, in a moment of stress, burnout,
  a leadership transition, or a career crossroads. Their job-to-be-done: *find the coach
  who genuinely fits my specific situation*, quickly, without a personality quiz or sales
  funnel. They run the adaptive intake, get matched, then live in a trajectory (book
  sessions, message the coach, check in quarterly).
- **Employers (HR)** — the buyer who funds the coaching. Their job: *see that it's working*
  without ever seeing individual data. They get anonymous, team-level, minimum-group-of-15
  aggregates and a match-quality read — never a single employee's answers.

The demo's job is to make an investor believe in the product by letting them stand in the
employee's shoes for 90 seconds.

## Product Purpose

Gingermood matches a person's **specific, idiosyncratic needs** to a coach's **actual
competencies** — explicitly *not* personality, similarity, or "klik" (the Kees insight) —
with a **human confirming every match**. The headline feature is an **adaptive AI intake**:
follow-up questions that genuinely branch on prior answers, surfacing what someone actually
needs and what they'd want in a coach, then scoring that against a structured coach pool.

Success for this artifact:
- Different needs *visibly* produce different matches (differentiation is the proof).
- The intake visibly becomes **structured data** — the seed of an outcome flywheel: every
  match becomes data that makes the next match better.
- It reads as a **refreshed Gingermood product built by a senior team**, not a generic AI
  demo — signalling the repositioning from service company to modern platform.
- It **never hard-breaks** in front of the person who matters: a scripted/deterministic
  fallback guarantees the flow always completes, wifi or no wifi.

Everything outside the intake's two AI routes is mocked and seeded — a convincing world
around the real engine, not a real backend. All people, companies, and statistics are
fictional and labelled as illustrative (GDPR Art. 9 — no real coachee or coach records).

## Brand Personality

**Warm · human · quietly competent.** Calm and premium, not clinical; confident without
hype. The intelligence is felt, never announced — no "AI magic," no exclamation marks, no
selling. Voice is second person, plain, Dutch-direct ("Let's find the coach who fits you";
buttons are verbs). The emotional peak is *recognition* — the moment a person reads their
own situation reflected back accurately, before any match is shown. The interface should
evoke: *this system understood me, and someone real stands behind the result.*

(The intake UI ships in Dutch by deliberate choice; the surrounding platform is in English
— see DECISIONS.md. Copy is centralised for a fast language swap.)

## Anti-references

What this must **not** look like:
- **A generic AI-chatbot demo.** No "powered by AI" theatrics, no sparkles, wands, glow, or
  chat-bubble scaffolding. The engine proves itself through branching questions and
  differentiated matches, not badges.
- **The dated "service-company" look.** The old Gingermood positioning — full-saturation
  brand-colour section backgrounds, dense decoration, everything shouting. The repositioning
  is *away* from this.
- **OpenUp (or any peer) cloned.** Aim for comparable restraint and polish, but warmer and
  unmistakably *not them*. Reference the calibre, never the identity.
- **Wellness-app clichés.** No Calm/Headspace territory — soft pastel gradients, lotus /
  leaf / breathing-orb motifs, meditation-app softness. This is a coaching *platform*, not
  a mindfulness app.
- **Enterprise-SaaS coldness.** No sterile B2B-dashboard sprawl — dense data tables,
  navy-and-gray, charts-on-everything HR-analytics vibe. The employer view stays calm,
  anonymous, and human even where it shows numbers.
- **Overclaiming the AI.** The system is quietly competent. Never frame intelligence as the
  spectacle; frame the *fit* and the *human confirmation* as the point.

## Design Principles

1. **Matching is the product, not a feature.** The adaptive intake and the match reveal are
   the centre of gravity; every surface exists to lead to, explain, or extend a good match.
2. **Show idiosyncratic fit, don't assert it.** Prove differentiation — needs ↔ real
   competencies, evidence pairs, a visible fit breakdown, contrasting matches for
   contrasting inputs. Never "great match!"; always *why this coach for these needs.*
3. **Software proposes, a human confirms.** The human-in-the-loop is a brand promise, not a
   disclaimer. Design the confirmation moment as a deliberate, reassuring beat.
4. **Recognition before recommendation.** Reflect the person's situation back to them
   accurately *first*; the emotional weight sits on being understood, not on decoration.
5. **Quiet competence over spectacle.** Restraint is the signal of a senior team. The demo
   should feel effortless and premium precisely because it isn't trying to impress.
6. **Never break in front of the room.** Resilience is a design requirement: deterministic
   fallback, loading states on every async step, nothing ever frozen. A demo that always
   completes is worth more than a flashier one that might not.
7. **Privacy is visible, not buried.** Individual answers stay individual; the employer only
   ever sees anonymous, minimum-group aggregates — and the product makes that legible.

## Accessibility & Inclusion

- **iPad-first, arm's-length legible.** The demo is watched on a tablet across a table,
  sometimes by a 67-year-old — body text never below 17px, large tap targets, one-thumb
  flow, portrait *and* landscape. Legibility outranks density everywhere.
- **Contrast held to WCAG AA.** Body text ≥4.5:1, large text ≥3:1. Never pure-black text
  (near-black aubergine ink); orange reserved for action and never used as body text
  (orange-as-text only ≥18px semibold). Placeholder text must clear 4.5:1, not default gray.
- **Reduced motion respected.** Every reveal, fit-bar animation, and transition has a
  `prefers-reduced-motion` alternative (crossfade / instant). Motion is a high-impact
  accent, not a requirement for comprehension.
- **Colour is never the only signal.** Selected states, progress, and fit use position,
  weight, and text alongside hue — legible without relying on the orange/purple distinction.
- **Voice input as an accommodation.** The intake supports speech dictation, lowering the
  typing burden of an open-text flow.
