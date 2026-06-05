# DATAGEN.md — Gingermood Synthetic Data Generator
*Spec for generating the three-table synthetic dataset: coaches, clients, matches+outcomes. Purpose: validate the schema, the full matching pipeline, and the evaluation machinery — and power the demo. This is a Monte Carlo exercise: we define an explicit data-generating process (DGP), simulate from it, and verify the pipeline recovers the planted parameters. It validates the PIPELINE, not the business thesis — the thesis gets tested on real data later.*

---

## 0. Design principles (non-negotiable)

1. **Code generates structure; the LLM generates ONLY text.** All numbers, categories, choices, and outcomes come from the seeded programmatic DGP. The LLM layer writes bios/narratives/comments *conditioned on* finished rows and may never alter a structured field.
2. **Everything parameterized and seeded.** Every coefficient, rate, and distribution lives in `config.yaml` — the assumption registry. Same seed → identical dataset.
3. **Latent truths are stored separately.** True fit, client motivation, and coach true competence go to `latents/` and are NEVER merged into the public CSVs. Public data = what Gingermood would realistically observe.
4. **Calibrate to the real anchors** (section 6). The synthetic world must reproduce the 2025 jaarverslag's aggregate statistics within tolerance.
5. **Plant the literature as ground truth** (section 4). Idiosyncratic need↔competency fit drives outcomes; personality similarity does not (and slightly hurts satisfaction); alliance drives satisfaction but not goal achievement; experience ≠ competence.
6. **Include the warts.** Missing outcome labels (MNAR), a planted unobserved confounder (motivation), a *biased legacy assignment mechanism*, match concentration, seasonal intake.

---

## 1. Outputs

```
/data/synth/v1/
  coaches.csv          # ~120 coaches
  clients.csv          # ~2,500 clients (2023–2025; configurable)
  match_offers.csv     # shortlist stage: ~3 offers per client
  trajectories.csv     # chosen matches + outcomes
  latents/             # true_fit.csv, client_latents.csv, coach_latents.csv (validation only)
  README.md            # every assumption documented
  validation_report.md # produced by validate.py
```

---

## 2. Schemas

### 2a. coaches.csv (~N_COACHES = 120)
| field | type | generation |
|---|---|---|
| coach_id | str | sequential |
| name | str | LLM (Dutch names, fictional) |
| gender | cat | ~55% F |
| region | cat | NL provinces, Randstad-weighted; small Brabant/Gelderland/Limburg/Groningen presence (mirrors documented spread) |
| languages | list | NL 100%, EN ~70%, other ~10% |
| years_experience | int | lognormal, 3–30 |
| specialisms | list(1–3) | from theme taxonomy (§3), distribution roughly proportional to demand |
| methods | list(1–3) | taxonomy: ACT, solution-focused, systemic, cognitive, somatic, positive-psych, transactional analysis |
| sector_experience | list(1–3) | finance, consultancy, healthcare/zorg, logistics, public, tech, retail |
| working_style | 3 floats 0–1 | axes: directive↔exploratory, structured↔flexible, challenging↔supportive |
| personality | 5 floats 0–1 | Big-5-lite; exists PRECISELY so its null effect can be planted and tested |
| capacity | int | max concurrent trajectories, 2–8 |
| join_date / active | date/bool | ~8 join, ~10 leave per simulated year; leaving hazard ↑ when matches/year < 3 (mirrors real churn over "too few matches") |
| bio | text | LLM, conditioned on the full row |

**Latent (separate file):** true_competence per specialism (0–1) — correlated only weakly with years_experience (r ≈ 0.2; experience is planted as a poor proxy, per Graßmann).

### 2b. clients.csv (~N_CLIENTS = 2,500 over 2023–2025)
| field | type | generation |
|---|---|---|
| client_id | str | sequential |
| signup_date | date | yearly volumes proportional to real growth (653/852/941); seasonality: Sept & Jan peaks, summer dip |
| age_band, gender | cat | working-age distribution |
| sector, employer_size | cat | mirror real client mix (insurance/finance, transport/logistics, zorg, professional services, public) |
| role_level | cat | employee / manager / director (~70/25/5) |
| language, region | cat | NL-dominant; region matches employer footprint |
| primary_theme | cat | sampled from REAL 2025 theme distribution (§3) with year drift: stress & self-examination share rising 2023→2025 |
| secondary_theme | cat | conditional on primary |
| idiosyncratic_needs | list(2–4) | needs taxonomy tags tied to themes (§3) |
| desired_coach_characteristics | list(2–3) | stated preference; only PARTIALLY overlaps what truly helps them (stated ≠ revealed, planted: overlap ≈ 60%) |
| working_style_pref | 3 floats | as coach axes |
| personality | 5 floats | Big-5-lite |
| urgency | cat | low/med/high |
| intake_narrative | text | LLM, conditioned on row |

**Latent (separate file):** motivation ~ Beta(α,β), mean ≈ 0.6 — UNOBSERVED confounder; drives engagement AND outcomes.

### 2c. match_offers.csv (shortlist stage)
client_id, coach_id, rank_shown (1–3), offer_date, visible_profile_appeal (float), chosen (bool)

### 2d. trajectories.csv (chosen matches)
trajectory_id, client_id, coach_id, start_date, n_sessions, completed (bool), dropout_reason (cat: disappeared / no-longer-wanted / external-coach / other — proportions per real report), satisfaction_1_10, goal_achievement_1_10, evaluation_completed (bool), rematch_requested (bool)

---

## 3. Taxonomies

**Themes (2025 anchor counts in parentheses — use as sampling weights):** persoonlijk leiderschap (184), stress (180), zelfonderzoek (129), loopbaan (128), communicatie (102), leiderschap (98), balans werk/privé (95), zelfvertrouwen (83), samenwerken (41); minor: loslaten, emotieregulatie, assertiviteit.

**Needs taxonomy (idiosyncratic tags, examples per theme):** stress → boundary-setting, recovery routines, workload negotiation, perfectionism; loopbaan → direction clarity, transition planning, values mapping; zelfvertrouwen → imposter feelings, visibility, speaking up; leiderschap → first-time-manager skills, difficult conversations, delegation; etc. ~40 tags total, each mapped to 1–2 themes and to coach competency tags.

---

## 4. The DGP (the heart — all coefficients in config.yaml)

### 4a. True fit
```
TrueFit_ij = β1·NeedCompetencyAlignment_ij   # default β1 = 0.50  (dominant)
           + β2·TrueCompetence_j(primary)    # β2 = 0.20  (competence, NOT years)
           + β3·SectorMatch_ij               # β3 = 0.12
           + β4·WorkingStyleCompat_ij        # β4 = 0.10
           + β5·PersonalitySimilarity_ij     # β5 = 0.00  (PLANTED NULL)
           + ε_ij,  ε ~ N(0, 0.15)
```
NeedCompetencyAlignment = weighted overlap(client idiosyncratic_needs, coach specialism/competency tags). PersonalitySimilarity = cosine(personality vectors).

### 4b. Legacy shortlist mechanism (deliberately imperfect — mimics the historical human/TMA process)
Rank coaches by `LegacyScore = 0.4·ThemeMatch + 0.3·PersonalitySimilarity + 0.2·Availability + noise` → top-3 offered. NOTE: legacy overweights similarity, the wrong feature. This creates realistic selection bias in historical data — exactly what the real 6,000 matches will contain.

### 4c. Choice
`P(choose j) ∝ softmax(γ1·visible_profile_appeal + γ2·StatedPreferenceMatch + position_bias)`; some clients choose none. Calibrate: first-shortlist failure (no click / quick re-match) ≈ 30–40%.

### 4d. Outcomes (started trajectories only)
```
Alliance_ij      = 0.5·TrueFit + 0.3·Motivation_i + noise        # working alliance proxy
dropout          ~ logit(δ0 − δ1·TrueFit − δ2·Motivation)        # calibrate ≈ 20% overall; allow employer-segment variation up to ~33%
n_sessions       ~ shifted Poisson, mean ↑ in TrueFit & Motivation, typical band 5–12
satisfaction     = a1·Alliance + a2·TrueFit + a3·Motivation − a4·PersonalitySimilarity + noise   # a4 = 0.05 (small PLANTED NEGATIVE, per Solms)
goal_achievement = b1·NeedCompetencyAlignment + b2·Motivation + noise                            # alliance does NOT enter (planted: alliance→satisfaction only)
rematch_requested ~ ↑ when early satisfaction low
evaluation_completed ~ Bernoulli(p): base by year 0.79 / 0.72 / 0.69, AND p lower for dropouts & low satisfaction (MNAR missingness)
```

### 4e. Supply-side dynamics
Concentration emerges from the legacy mechanism; calibrate so top coach ≈ 25–30 matches/year with a long tail at 0–2. Coaches under k matches/year for 2 consecutive years get elevated leave-hazard (reproduces the documented churn-over-few-matches pattern).

---

## 5. Pipeline (build in this order)

1. `config.yaml` — all parameters, seeds, sizes, coefficient defaults as above.
2. `taxonomies.py` — themes, needs tags, competency tags, mappings.
3. `generate_coaches.py` / `generate_clients.py` — structured rows + latents.
4. `simulate_matching.py` — offers → choices → trajectories → outcomes. Pure numpy/pandas. No LLM.
5. `validate.py` — diagnostics suite (§7) → `validation_report.md`.
6. `texture_llm.py` — LAST, after validation passes. Batched Anthropic API calls for name/bio/intake_narrative/evaluation comments, conditioned on each row, cached to disk, resumable. Text only.
7. `README.md` generator — dumps the assumption registry in human language.

Plain Python + numpy/pandas/scipy. No heavy frameworks. Each file ≤ ~300 lines.

---

## 6. Calibration anchor table (must match within tolerance ±15% relative)

| statistic | target | source |
|---|---|---|
| yearly client volume ratio | 653 : 852 : 941 | jaarverslag |
| dropout rate by year | 16.7% / 20.2% / 20.7% | jaarverslag |
| first-shortlist failure | 30–40% | known miss-rate |
| theme distribution 2025 | §3 weights | jaarverslag |
| evaluation completion by year | 78.8% / 72.1% / 68.8% | jaarverslag |
| top coach matches/year | 25–30 | jaarverslag |
| share of coaches with ≤2 matches/year | ≥ 25% | jaarverslag pattern |
| coach pool size / joiners / leavers per year | ~120 / ~8 / ~10 | jaarverslag |
| dropout reason mix | disappeared > no-longer-wanted > external | jaarverslag |

---

## 7. Validation suite (validate.py must produce ALL of these)

1. **Marginals check** — every anchor in §6 vs simulated value, with pass/fail per tolerance.
2. **Missingness check** — evaluation completion by year AND by satisfaction tercile (must show MNAR gradient).
3. **Concentration check** — matches-per-coach distribution + Gini; plot.
4. **Recovery test (the point of the exercise):** train a standard model (gradient boosting + a transparent logistic baseline) on PUBLIC columns only to predict satisfaction and goal_achievement:
   - Feature importance: need↔competency alignment features must dominate.
   - Personality-similarity features must show ≈0 importance for goals and a small negative coefficient for satisfaction (recovering the plant).
   - years_experience must NOT outrank competence-proxy features.
5. **Confounding demonstration** — show the naive satisfaction model improves materially when given the latent motivation column (quantifies the planted confounder; documents why real-world causal claims need the staggered-rollout design, not observational fit).
6. **Selection-bias demonstration** — compare model trained on chosen trajectories vs evaluated-only subset; show the bias the MNAR evaluation introduces.

Report all of it in `validation_report.md` with numbers and 3–4 plots.

---

## 8. Definition of done
- One command (`make all` or `python run_all.py`) regenerates everything from seed.
- Validation report passes all §6 anchors and all §7 recovery checks.
- README documents every assumption with its config key.
- Texture layer complete, cached, and re-runnable without re-simulating.
