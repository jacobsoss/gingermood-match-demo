# SALIENCE.md — The Salience Engine
*Extension to the Gingermood match demo spec. Defines how the system decides which attributes matter, how much, for whom. Core rule: relevance is never a property of an attribute — it is a property of the attribute's FUNCTION for this specific person.*

---

## 0. The governing rule

A coach attribute earns weight only insofar as it does one of three jobs for THIS client:
1. **Competence** — expertise on their actual question, including lived or professional experience as a form of expertise.
2. **Safety** — whatever lets this person speak freely: stated concordance preferences, working style, modality (e.g. walking sessions).
3. **Logistics** — language, region, format, availability.

Resemblance that does none of these jobs is noise. The same attribute can be noise for one client and core for another (shared hiking = biography → noise; hiking = "I open up while walking" → modality → safety). Therefore: **weights live on the client side. There are no global attribute weights, only priors.**

One-liner for all reasoning output: *we don't ban similarity — we ban unweighted similarity.*

---

## 1. Data model

Extend the intake extraction output (API Call 2) with:

```ts
ExtractedNeed {
  id: string
  text: string                 // close to the client's own words
  category: string[]           // taxonomy tags
  function: "competence" | "safety" | "logistics" | "context"
  type: "hard_constraint" | "strong_preference" | "mild_preference" | "context"
  weight: number               // 0–1 salience
  source: "stated" | "elicited" | "inferred"
  confirmed: boolean           // see §3 — inferred needs must be confirmed to carry full weight
  coach_supply_tags: string[]  // which coach attributes would satisfy this need
}
```

`NeedsProfile` becomes: `{ recognition, needs: ExtractedNeed[], practical_constraints, themes (behind-the-scenes only) }`.

---

## 2. Salience priors (defaults; client signal overrides)

| Attribute class | Prior weight | Escalation rule |
|---|---|---|
| Life event causally entangled with the presenting problem (pregnancy, bereavement, divorce, burnout trigger, reorganisation) | 0.7–0.9 | Always high; the event is the engine of the problem, not a trait |
| Competence on the presenting question (specialism; lived/professional experience with the situation) | 0.6–0.8 | Always relevant (function 1) |
| Working style / modality (directive↔exploratory, structure, walking/outdoor) | 0.3–0.5 | → 0.7+ when stated |
| Sector experience | 0.3–0.5 | → higher when client's narrative is work-context-heavy |
| Demographic concordance (gender, age, cultural background) | **0.0 by default** | Enters ONLY when stated, or inferred-and-confirmed (§3); then 0.6–0.8 as a safety need |
| Personality-trait similarity | **0.0 — never a positive signal** | Never. Planted null per the literature |
| Shared hobbies / biography | 0.0 | Only re-enters if the client reframes it as modality or safety |

**Weighting heuristic for the LLM:** weight ∝ causal centrality — how entangled is this attribute/need with the reason they came? The unexpected pregnancy of a single mother up for promotion is the engine of her conflict (0.85+). Her colleague's identical pregnancy mentioned in passing is context (0.1).

---

## 3. The confirm-step (inference → consent)

- If the LLM **infers** a need/preference with weight > 0.5 that the client never stated, it may NOT carry that weight silently. The adaptive flow (API Call 1) must ask ONE confirming question, phrased as recognition, e.g.:
  *"It sounds like it might matter to you that your coach has personally navigated combining career and parenthood — is that right?"*
- Confirmed → `source: "elicited"`, full weight. Declined → demote to `context`, weight ≤ 0.2.
- Cap: any `inferred` + `confirmed: false` need is clipped at weight 0.4.
- Max one confirm-question per run (pick the highest-stakes inference). It doubles as the mid-flow recognition moment.

---

## 4. Scoring (Layer order)

1. **Hard filters** → candidate set: language, format, availability, plus any client-stated `hard_constraint` (e.g. "must be a woman"). Keep this list short — everything else is soft.
2. **Need–supply scoring:** for each candidate coach j:
   `base_j = Σ_k ( weight_k × supply_k(j) )` over all ExtractedNeeds, where supply_k(j) ∈ [0,1] = how well coach j's tags satisfy need k. Normalize by Σ weight_k.
3. **Soft-floor penalty (non-compensatory safety):** an unmet need with `type: strong_preference` and `function: safety` multiplies the score by 0.6 — competence cannot fully buy back a violated safety preference.
4. **Fit score** = 100 × penalized base. **Shortlist** = top 3 with a load-balancing tiebreaker (prefer the less-recently-matched coach when scores are within 5 points — supply fairness).
5. **Fallback engine parity:** the deterministic matcher uses the same formula with keyword-derived weights, so Live and Demo modes behave consistently.

---

## 5. Prompt additions

**Call 1 (next-question):** add — probe salience, not just topics: when a salient life event surfaces, follow up on what they'd want in a coach *relative to it*; implement the §3 confirm-question rule; never suggest demographic preferences uninvited.

**Call 2 (extraction + match):** add — output ExtractedNeed[] per §1 with function/type/weight/source justified by causal centrality; apply the priors table; never assign positive weight to personality similarity or unstated demographic concordance. Match reasoning must explain *by function*, in the client's terms: *"matched because she has guided many professionals through pregnancy–career transitions (experience on what you named most), and offers the structured, practical style you asked for"* — never tag-overlap language like "high similarity score."

**Recognition layer (already specced):** unchanged, leads the result; the salience weights determine WHICH facts the recognition must name (top-weighted needs first).

---

## 6. Guardrails

- Never impose demographic matching by default; only stated or confirmed preferences activate it.
- Lived experience raises weight; it becomes a hard filter only if the client makes it one.
- Mirror, don't presume: needs reflect what the client said; inferred needs follow §3.
- Internal framing for tone and docs: *safety buys openness; competence does the work.*
- Production note (not demo): life-event and preference data is GDPR Art. 9 special-category — demo stays synthetic.

---

## 7. Learning loop (note for production, rehearsable in the sandbox)

Log the full salience vector with every match and its outcomes. The priors in §2 are v1 heuristics; with outcome data they become estimable — "does concordance help, for whom, stated vs unstated?" is heterogeneous-treatment-effect estimation on the flywheel. Optional DATAGEN cross-link: add a config flag planting heterogeneity (e.g. concordance improves outcomes ONLY when stated) and extend the recovery test to verify the pipeline detects it.

---

## 8. Acceptance test

Run the locked persona (52, accountancy, single mother, unexpectedly pregnant, up for promotion, double guilt):
1. Extraction assigns the pregnancy–career conflict weight ≥ 0.8, function competence+safety.
2. The flow asks exactly one confirm-question about coach experience with career–parenthood transitions.
3. Recognition names the pregnancy, the promotion, and the double guilt explicitly.
4. The match reasoning explains by function, and the matched coach's supply tags actually cover the top-weighted needs.
5. A contrast persona (e.g. first-time manager, no life event) produces a different coach with differently-weighted reasoning, and mentions no demographic preference anywhere.
