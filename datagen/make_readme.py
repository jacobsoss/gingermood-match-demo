"""make_readme.py — generate data/synth/v1/README.md, the assumption registry
in human language (DATAGEN.md step 7).

Reads config.yaml so the documentation can never drift from the parameters that
actually drove the simulation. Every assumption is printed with its config key.

  python datagen/make_readme.py
"""
from __future__ import annotations

import common

# Human descriptions for the headline (planted / load-bearing) config keys.
DESC = {
    "seed": "Master seed; same seed → byte-identical dataset.",
    "sizes.n_coaches": "Coach pool size (§2a).",
    "sizes.clients_per_year": "Yearly client volumes — the real 653:852:941 growth anchor.",
    "coaches.true_competence.experience_corr":
        "Planted r between true_competence and years_experience (experience is a POOR proxy, Graßmann).",
    "coaches.appeal.experience_coef":
        "visible_profile_appeal is built only from years_experience + noise — independent of competence/alignment.",
    "coaches.churn.low_match_threshold_k":
        "Coaches under k matches/year get elevated leave-hazard (churn-over-few-matches).",
    "clients.desired_pref_true_overlap":
        "Stated desired-coach traits overlap genuinely-helpful competencies only ~60% (stated≠revealed).",
    "clients.motivation_beta":
        "Latent motivation ~ Beta(α,β), mean≈0.6 — the UNOBSERVED confounder driving engagement AND outcomes.",
    "dgp.true_fit.beta1_need_competency": "TrueFit weight on need↔competency alignment (DOMINANT planted driver).",
    "dgp.true_fit.beta2_true_competence": "TrueFit weight on true competence (NOT years).",
    "dgp.true_fit.beta5_personality_sim": "TrueFit weight on personality similarity — PLANTED NULL (0).",
    "dgp.legacy.w_personality_sim": "Legacy shortlist over-weights personality similarity — the WRONG feature (selection bias).",
    "dgp.choice.outside_option_utility": "Utility of choosing no coach — calibrates first-shortlist failure to 30–40%.",
    "dgp.outcomes.satisfaction.a4_personality_sim": "Small PLANTED NEGATIVE of personality similarity on satisfaction (Solms).",
    "dgp.outcomes.goal_achievement.b1_need_competency": "Goal achievement loads on alignment (alliance does NOT enter).",
    "dgp.outcomes.evaluation_completed.base_by_year": "Eval-completion base rate per year (monotone ↓); MNAR penalties below.",
    "validation.rel_tolerance": "±15% relative tolerance on every §6 anchor.",
    "texture.model": "LLM used for the TEXT layer only (names/bios/narratives/comments) — never structured fields.",
}

INTRO = """# Gingermood Synthetic Dataset — `data/synth/v1`

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
"""


def _planted(cfg) -> list[str]:
    d = cfg["dgp"]
    tf, o = d["true_fit"], d["outcomes"]
    L = ["## Planted DGP truths (the literature, as ground truth)\n",
         "All coefficients live in `config.yaml`. The key planted facts:\n"]
    L.append(f"- **TrueFit** = {tf['beta1_need_competency']}·need↔competency-alignment "
             f"+ {tf['beta2_true_competence']}·true_competence + {tf['beta3_sector_match']}·sector "
             f"+ {tf['beta4_working_style']}·working-style + {tf['beta5_personality_sim']}·personality-sim "
             f"+ N(0,{tf['eps_sd']}). Alignment dominates; personality-sim is a planted **null**.")
    L.append(f"- **Competence ≠ experience**: true_competence correlates with years_experience at only "
             f"r≈{cfg['coaches']['true_competence']['experience_corr']}.")
    L.append(f"- **Legacy shortlist** = {d['legacy']['w_theme_match']}·theme "
             f"+ {d['legacy']['w_personality_sim']}·personality-sim + {d['legacy']['w_availability']}·availability "
             f"— deliberately over-weights similarity (the wrong feature) → realistic selection bias.")
    L.append(f"- **Satisfaction** loads on alliance/truefit/motivation and a small **negative** "
             f"personality-sim term (a4={o['satisfaction']['a4_personality_sim']}); "
             f"**goal_achievement** loads on alignment + motivation only (alliance does NOT enter).")
    L.append(f"- **Motivation** ~ Beta{tuple(cfg['clients']['motivation_beta'])} is an **unobserved confounder**; "
             f"**evaluation completion** is **MNAR** (lower for dropouts & low satisfaction).")
    L.append(f"- **Stated ≠ revealed**: desired-coach traits overlap genuinely-helpful competencies only "
             f"~{int(cfg['clients']['desired_pref_true_overlap']*100)}%; they steer choice, not goals.\n")
    return L


def _flatten(prefix, val, out):
    if isinstance(val, dict):
        for k, v in val.items():
            _flatten(f"{prefix}.{k}" if prefix else k, v, out)
    else:
        out.append((prefix, val))


def _registry(cfg) -> list[str]:
    L = ["## Assumption registry — every config key\n",
         "Generated from `config.yaml`. Each row is an assumption you can change in one place.\n"]
    order = ["seed", "sizes", "years", "seasonality_month_weights", "coaches", "clients",
             "dgp", "texture", "validation", "paths"]
    keys = order + [k for k in cfg if k not in order]
    for top in keys:
        if top not in cfg:
            continue
        L.append(f"### `{top}`\n")
        flat: list[tuple[str, object]] = []
        _flatten(top, cfg[top], flat)
        L.append("| config key | value | note |")
        L.append("|---|---|---|")
        for path, value in flat:
            v = str(value)
            if len(v) > 70:
                v = v[:67] + "…"
            note = DESC.get(path, "")
            L.append(f"| `{path}` | {v} | {note} |")
        L.append("")
    return L


def main():
    cfg = common.load_config()
    lines = [INTRO, ""]
    lines += _planted(cfg)
    lines += _registry(cfg)
    lines.append("## Validation\n")
    lines.append("See `validation_report.md` for the live anchor table (±%d%% tolerance), the MNAR "
                 "gradient, concentration/Gini, the k-fold recovery test, confounding and "
                 "selection-bias demonstrations, appeal-independence, and the stated-vs-revealed "
                 "preference checks.\n" % int(cfg["validation"]["rel_tolerance"] * 100))
    out = common.output_dir(cfg) / "README.md"
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"[readme] wrote {out}")


if __name__ == "__main__":
    main()
