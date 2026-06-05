# Gingermood Synthetic Dataset — `data/synth/v1`

**Synthetic sample data. No real coachee or coach records (GDPR Art. 9).** This is a
Monte-Carlo sandbox: an explicit data-generating process (DGP) is defined, simulated
from a fixed seed, and the pipeline is verified to recover the planted parameters. It
validates the **pipeline**, not the business thesis — the thesis is tested on real data later.

> **Signal-to-noise is deliberately favorable** so the recovery machinery can be verified.
> Diagnostic R² values in `validation_report.md` are sandbox-only and must never be quoted
> as expected real-world predictive performance.

## Files

| file | contents |
|---|---|
| `coaches.csv` | ~120 synthetic coaches (structured + LLM name/bio) |
| `clients.csv` | ~2,446 synthetic clients 2023–2025 (structured + LLM intake_narrative) |
| `match_offers.csv` | shortlist stage: ~3 offers per client, `chosen` flag |
| `trajectories.csv` | chosen matches + outcomes (+ LLM evaluation_comment) |
| `latents/` | validation-only truths — **never** merged into public CSVs |
| `plots/` | validation figures |
| `validation_report.md` | the diagnostics suite output (anchors + recovery + caveats) |
| `README.md` | this file (generated from `config.yaml`) |

**Latent files** (`latents/`): `coach_latents.csv` (true_competence per theme),
`client_latents.csv` (motivation), `true_fit.csv` (offered-pair fit components),
`trajectory_truth.csv` (uncensored TrueFit / alliance / satisfaction / goal). Public data
is only what Gingermood would realistically observe.

## Regenerate (one command, from the repo root)

```
python datagen/run_all.py        # config → coaches → clients → simulate → validate
python datagen/texture_llm.py    # LLM text layer (text fields only; cached, resumable)
python datagen/make_readme.py    # regenerate this README from config.yaml
```


## Planted DGP truths (the literature, as ground truth)

All coefficients live in `config.yaml`. The key planted facts:

- **TrueFit** = 0.5·need↔competency-alignment + 0.2·true_competence + 0.12·sector + 0.1·working-style + 0.0·personality-sim + N(0,0.15). Alignment dominates; personality-sim is a planted **null**.
- **Competence ≠ experience**: true_competence correlates with years_experience at only r≈0.2.
- **Legacy shortlist** = 0.4·theme + 0.3·personality-sim + 0.2·availability — deliberately over-weights similarity (the wrong feature) → realistic selection bias.
- **Satisfaction** loads on alliance/truefit/motivation and a small **negative** personality-sim term (a4=0.05); **goal_achievement** loads on alignment + motivation only (alliance does NOT enter).
- **Motivation** ~ Beta(3.0, 2.0) is an **unobserved confounder**; **evaluation completion** is **MNAR** (lower for dropouts & low satisfaction).
- **Stated ≠ revealed**: desired-coach traits overlap genuinely-helpful competencies only ~60%; they steer choice, not goals.

## Assumption registry — every config key

Generated from `config.yaml`. Each row is an assumption you can change in one place.

### `seed`

| config key | value | note |
|---|---|---|
| `seed` | 20250601 | Master seed; same seed → byte-identical dataset. |

### `sizes`

| config key | value | note |
|---|---|---|
| `sizes.n_coaches` | 120 | Coach pool size (§2a). |
| `sizes.clients_per_year.2023` | 653 |  |
| `sizes.clients_per_year.2024` | 852 |  |
| `sizes.clients_per_year.2025` | 941 |  |

### `years`

| config key | value | note |
|---|---|---|
| `years` | [2023, 2024, 2025] |  |

### `seasonality_month_weights`

| config key | value | note |
|---|---|---|
| `seasonality_month_weights.1` | 1.35 |  |
| `seasonality_month_weights.2` | 1.05 |  |
| `seasonality_month_weights.3` | 1.05 |  |
| `seasonality_month_weights.4` | 1.0 |  |
| `seasonality_month_weights.5` | 0.95 |  |
| `seasonality_month_weights.6` | 0.8 |  |
| `seasonality_month_weights.7` | 0.55 |  |
| `seasonality_month_weights.8` | 0.65 |  |
| `seasonality_month_weights.9` | 1.45 |  |
| `seasonality_month_weights.10` | 1.2 |  |
| `seasonality_month_weights.11` | 1.05 |  |
| `seasonality_month_weights.12` | 0.75 |  |

### `coaches`

| config key | value | note |
|---|---|---|
| `coaches.gender_female_p` | 0.55 |  |
| `coaches.region_weights.Noord-Holland` | 0.2 |  |
| `coaches.region_weights.Zuid-Holland` | 0.2 |  |
| `coaches.region_weights.Utrecht` | 0.16 |  |
| `coaches.region_weights.Noord-Brabant` | 0.11 |  |
| `coaches.region_weights.Gelderland` | 0.1 |  |
| `coaches.region_weights.Overijssel` | 0.05 |  |
| `coaches.region_weights.Limburg` | 0.05 |  |
| `coaches.region_weights.Groningen` | 0.04 |  |
| `coaches.region_weights.Friesland` | 0.03 |  |
| `coaches.region_weights.Flevoland` | 0.03 |  |
| `coaches.region_weights.Drenthe` | 0.02 |  |
| `coaches.region_weights.Zeeland` | 0.01 |  |
| `coaches.language_probs.nl` | 1.0 |  |
| `coaches.language_probs.en` | 0.7 |  |
| `coaches.language_probs.other` | 0.1 |  |
| `coaches.years_experience.meanlog` | 2.3 |  |
| `coaches.years_experience.sdlog` | 0.45 |  |
| `coaches.years_experience.min` | 3 |  |
| `coaches.years_experience.max` | 30 |  |
| `coaches.n_specialisms_weights.1` | 0.45 |  |
| `coaches.n_specialisms_weights.2` | 0.4 |  |
| `coaches.n_specialisms_weights.3` | 0.15 |  |
| `coaches.n_methods_weights.1` | 0.3 |  |
| `coaches.n_methods_weights.2` | 0.45 |  |
| `coaches.n_methods_weights.3` | 0.25 |  |
| `coaches.n_sectors_weights.1` | 0.4 |  |
| `coaches.n_sectors_weights.2` | 0.4 |  |
| `coaches.n_sectors_weights.3` | 0.2 |  |
| `coaches.working_style_beta` | [2.0, 2.0] |  |
| `coaches.personality_beta` | [2.0, 2.0] |  |
| `coaches.capacity.min` | 2 |  |
| `coaches.capacity.max` | 8 |  |
| `coaches.capacity.poisson_lambda` | 7.0 |  |
| `coaches.appeal.experience_coef` | 0.025 | visible_profile_appeal is built only from years_experience + noise — independent of competence/alignment. |
| `coaches.appeal.base` | 0.45 |  |
| `coaches.appeal.noise_sd` | 0.3 |  |
| `coaches.churn.joiners_per_year` | 8 |  |
| `coaches.churn.leavers_per_year` | 10 |  |
| `coaches.churn.low_match_threshold_k` | 3 | Coaches under k matches/year get elevated leave-hazard (churn-over-few-matches). |
| `coaches.churn.base_leave_hazard` | 0.095 |  |
| `coaches.churn.low_match_hazard` | 0.22 |  |
| `coaches.churn.prejoin_fraction` | 0.8 |  |
| `coaches.true_competence.mean` | 0.55 |  |
| `coaches.true_competence.sd` | 0.18 |  |
| `coaches.true_competence.experience_corr` | 0.2 | Planted r between true_competence and years_experience (experience is a POOR proxy, Graßmann). |
| `coaches.true_competence.min` | 0.02 |  |
| `coaches.true_competence.max` | 0.99 |  |

### `clients`

| config key | value | note |
|---|---|---|
| `clients.age_band_weights.25-34` | 0.28 |  |
| `clients.age_band_weights.35-44` | 0.34 |  |
| `clients.age_band_weights.45-54` | 0.24 |  |
| `clients.age_band_weights.55-64` | 0.14 |  |
| `clients.gender_female_p` | 0.58 |  |
| `clients.sector_weights.insurance_finance` | 0.24 |  |
| `clients.sector_weights.transport_logistics` | 0.18 |  |
| `clients.sector_weights.zorg` | 0.17 |  |
| `clients.sector_weights.professional_services` | 0.2 |  |
| `clients.sector_weights.public` | 0.13 |  |
| `clients.sector_weights.tech` | 0.08 |  |
| `clients.employer_size_weights.small` | 0.18 |  |
| `clients.employer_size_weights.medium` | 0.34 |  |
| `clients.employer_size_weights.large` | 0.48 |  |
| `clients.role_level_weights.employee` | 0.7 |  |
| `clients.role_level_weights.manager` | 0.25 |  |
| `clients.role_level_weights.director` | 0.05 |  |
| `clients.language_probs.nl` | 1.0 |  |
| `clients.language_probs.en` | 0.25 |  |
| `clients.language_probs.other` | 0.04 |  |
| `clients.region_weights.Noord-Holland` | 0.21 |  |
| `clients.region_weights.Zuid-Holland` | 0.21 |  |
| `clients.region_weights.Utrecht` | 0.15 |  |
| `clients.region_weights.Noord-Brabant` | 0.12 |  |
| `clients.region_weights.Gelderland` | 0.1 |  |
| `clients.region_weights.Overijssel` | 0.05 |  |
| `clients.region_weights.Limburg` | 0.05 |  |
| `clients.region_weights.Groningen` | 0.04 |  |
| `clients.region_weights.Friesland` | 0.02 |  |
| `clients.region_weights.Flevoland` | 0.03 |  |
| `clients.region_weights.Drenthe` | 0.01 |  |
| `clients.region_weights.Zeeland` | 0.01 |  |
| `clients.n_needs_weights.2` | 0.4 |  |
| `clients.n_needs_weights.3` | 0.4 |  |
| `clients.n_needs_weights.4` | 0.2 |  |
| `clients.n_desired_char.2` | 0.55 |  |
| `clients.n_desired_char.3` | 0.45 |  |
| `clients.desired_pref_true_overlap` | 0.6 | Stated desired-coach traits overlap genuinely-helpful competencies only ~60% (stated≠revealed). |
| `clients.working_style_pref_beta` | [2.0, 2.0] |  |
| `clients.personality_beta` | [2.0, 2.0] |  |
| `clients.urgency_weights.low` | 0.3 |  |
| `clients.urgency_weights.med` | 0.5 |  |
| `clients.urgency_weights.high` | 0.2 |  |
| `clients.secondary_theme_prob` | 0.7 |  |
| `clients.theme_drift.rising_themes` | ['stress', 'zelfonderzoek'] |  |
| `clients.theme_drift.factor_2023` | 0.78 |  |
| `clients.theme_drift.factor_2024` | 0.9 |  |
| `clients.theme_drift.factor_2025` | 1.0 |  |
| `clients.motivation_beta` | [3.0, 2.0] | Latent motivation ~ Beta(α,β), mean≈0.6 — the UNOBSERVED confounder driving engagement AND outcomes. |

### `dgp`

| config key | value | note |
|---|---|---|
| `dgp.true_fit.beta1_need_competency` | 0.5 | TrueFit weight on need↔competency alignment (DOMINANT planted driver). |
| `dgp.true_fit.beta2_true_competence` | 0.2 | TrueFit weight on true competence (NOT years). |
| `dgp.true_fit.beta3_sector_match` | 0.12 |  |
| `dgp.true_fit.beta4_working_style` | 0.1 |  |
| `dgp.true_fit.beta5_personality_sim` | 0.0 | TrueFit weight on personality similarity — PLANTED NULL (0). |
| `dgp.true_fit.eps_sd` | 0.15 |  |
| `dgp.legacy.w_theme_match` | 0.4 |  |
| `dgp.legacy.w_personality_sim` | 0.3 | Legacy shortlist over-weights personality similarity — the WRONG feature (selection bias). |
| `dgp.legacy.w_availability` | 0.2 |  |
| `dgp.legacy.noise_sd` | 0.008 |  |
| `dgp.legacy.shortlist_size` | 3 |  |
| `dgp.choice.gamma_appeal` | 4.6 |  |
| `dgp.choice.gamma_stated_pref` | 1.8 |  |
| `dgp.choice.position_bias` | [0.45, 0.15, 0.0] |  |
| `dgp.choice.outside_option_utility` | 5.15 | Utility of choosing no coach — calibrates first-shortlist failure to 30–40%. |
| `dgp.choice.temperature` | 1.0 |  |
| `dgp.outcomes.alliance.w_true_fit` | 0.5 |  |
| `dgp.outcomes.alliance.w_motivation` | 0.3 |  |
| `dgp.outcomes.alliance.noise_sd` | 0.1 |  |
| `dgp.outcomes.dropout.delta0` | 0.18 |  |
| `dgp.outcomes.dropout.delta1_true_fit` | 1.7 |  |
| `dgp.outcomes.dropout.delta2_motivation` | 1.3 |  |
| `dgp.outcomes.dropout.year_offset.2023` | -0.24 |  |
| `dgp.outcomes.dropout.year_offset.2024` | 0.18 |  |
| `dgp.outcomes.dropout.year_offset.2025` | 0.19 |  |
| `dgp.outcomes.dropout.employer_segment_extra.public` | 0.55 |  |
| `dgp.outcomes.n_sessions.base_lambda` | 2.8 |  |
| `dgp.outcomes.n_sessions.true_fit_coef` | 4.5 |  |
| `dgp.outcomes.n_sessions.motivation_coef` | 2.5 |  |
| `dgp.outcomes.n_sessions.shift` | 1 |  |
| `dgp.outcomes.n_sessions.session_interval_days` | 10 |  |
| `dgp.outcomes.satisfaction.a1_alliance` | 0.45 |  |
| `dgp.outcomes.satisfaction.a2_true_fit` | 0.3 |  |
| `dgp.outcomes.satisfaction.a3_motivation` | 0.2 |  |
| `dgp.outcomes.satisfaction.a4_personality_sim` | 0.05 | Small PLANTED NEGATIVE of personality similarity on satisfaction (Solms). |
| `dgp.outcomes.satisfaction.noise_sd` | 0.07 |  |
| `dgp.outcomes.goal_achievement.b1_need_competency` | 0.62 | Goal achievement loads on alignment (alliance does NOT enter). |
| `dgp.outcomes.goal_achievement.b2_motivation` | 0.3 |  |
| `dgp.outcomes.goal_achievement.noise_sd` | 0.08 |  |
| `dgp.outcomes.rematch.base` | 0.05 |  |
| `dgp.outcomes.rematch.low_satis_slope` | 0.55 |  |
| `dgp.outcomes.rematch.low_satis_threshold` | 0.45 |  |
| `dgp.outcomes.evaluation_completed.base_by_year.2023` | 0.92 |  |
| `dgp.outcomes.evaluation_completed.base_by_year.2024` | 0.85 |  |
| `dgp.outcomes.evaluation_completed.base_by_year.2025` | 0.78 |  |
| `dgp.outcomes.evaluation_completed.dropout_penalty` | 0.28 |  |
| `dgp.outcomes.evaluation_completed.low_satis_penalty` | 0.22 |  |
| `dgp.outcomes.evaluation_completed.low_satis_threshold` | 0.45 |  |
| `dgp.dropout_reason_weights.disappeared` | 0.42 |  |
| `dgp.dropout_reason_weights.no-longer-wanted` | 0.3 |  |
| `dgp.dropout_reason_weights.external-coach` | 0.18 |  |
| `dgp.dropout_reason_weights.other` | 0.1 |  |

### `texture`

| config key | value | note |
|---|---|---|
| `texture.model` | claude-haiku-4-5 | LLM used for the TEXT layer only (names/bios/narratives/comments) — never structured fields. |
| `texture.temperature` | 0.85 |  |
| `texture.max_tokens` | 2000 |  |
| `texture.batch_size` | 20 |  |
| `texture.cache_dir` | data/synth/v1/texture_cache |  |

### `validation`

| config key | value | note |
|---|---|---|
| `validation.rel_tolerance` | 0.15 | ±15% relative tolerance on every §6 anchor. |
| `validation.anchors.client_volume_ratio.2023` | 653 |  |
| `validation.anchors.client_volume_ratio.2024` | 852 |  |
| `validation.anchors.client_volume_ratio.2025` | 941 |  |
| `validation.anchors.dropout_rate_by_year.2023` | 0.167 |  |
| `validation.anchors.dropout_rate_by_year.2024` | 0.202 |  |
| `validation.anchors.dropout_rate_by_year.2025` | 0.207 |  |
| `validation.anchors.first_shortlist_failure` | [0.3, 0.4] |  |
| `validation.anchors.evaluation_completion_by_year.2023` | 0.788 |  |
| `validation.anchors.evaluation_completion_by_year.2024` | 0.721 |  |
| `validation.anchors.evaluation_completion_by_year.2025` | 0.688 |  |
| `validation.anchors.top_coach_matches_per_year` | [25, 30] |  |
| `validation.anchors.share_coaches_le2_matches_per_year` | 0.25 |  |
| `validation.anchors.pool_size` | 120 |  |
| `validation.anchors.joiners_per_year` | 8 |  |
| `validation.anchors.leavers_per_year` | 10 |  |
| `validation.recovery.test_size` | 0.25 |  |
| `validation.recovery.n_folds` | 5 |  |
| `validation.recovery.gbm_max_iter` | 200 |  |
| `validation.recovery.gbm_learning_rate` | 0.05 |  |
| `validation.recovery.gbm_max_depth` | 3 |  |
| `validation.recovery.gbm_min_samples_leaf` | 30 |  |
| `validation.recovery.gbm_l2_regularization` | 1.0 |  |
| `validation.recovery.n_permutation_repeats` | 10 |  |

### `paths`

| config key | value | note |
|---|---|---|
| `paths.output_dir` | data/synth/v1 |  |
| `paths.latents_dir` | data/synth/v1/latents |  |
| `paths.plots_dir` | data/synth/v1/plots |  |

## Validation

See `validation_report.md` for the live anchor table (±15% tolerance), the MNAR gradient, concentration/Gini, the k-fold recovery test, confounding and selection-bias demonstrations, appeal-independence, and the stated-vs-revealed preference checks.
