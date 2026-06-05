"""generate_clients.py — structured client rows (clients.csv) + latent motivation.

Public rows carry NO latent fields. motivation (the unobserved confounder) goes
to latents/client_latents.csv only. intake_narrative is blank for the later LLM
texture layer.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

import common
import taxonomies as tax

# Stated desired-characteristic descriptors that are NOT competency tags
# (style/context preferences). Mixed with helpful competencies at the planted
# stated-vs-revealed overlap rate (~60%).
STYLE_DESCRIPTORS = [
    "supportive", "directive", "structured", "flexible",
    "challenging", "experienced", "same-sector",
]


def _pipe(xs) -> str:
    return "|".join(map(str, xs))


def _year_theme_p(cfg, year: int) -> np.ndarray:
    base = dict(tax.THEME_WEIGHTS)
    drift = cfg["clients"]["theme_drift"]
    factor = drift[f"factor_{year}"]
    w = []
    for t in tax.THEMES:
        val = base[t]
        if t in drift["rising_themes"]:
            val = val * factor
        w.append(val)
    w = np.array(w, dtype=float)
    return w / w.sum()


def _signup_dates(rng, cfg, year: int, k: int) -> list[pd.Timestamp]:
    mw = cfg["seasonality_month_weights"]
    months = np.array([int(m) for m in mw.keys()])
    p = np.array([float(mw[m]) for m in mw.keys()])
    p = p / p.sum()
    chosen_m = rng.choice(months, size=k, p=p)
    out = []
    for m in chosen_m:
        day = int(rng.integers(1, 28))
        out.append(pd.Timestamp(year=year, month=int(m), day=day))
    return out


def generate(cfg: dict) -> None:
    rng = common.get_rng(cfg, "clients")
    cl = cfg["clients"]
    years = cfg["years"]
    per_year = cfg["sizes"]["clients_per_year"]

    rows = []
    motivations = []
    cid = 0
    for year in years:
        k = int(per_year[year])
        theme_p = _year_theme_p(cfg, year)
        dates = _signup_dates(rng, cfg, year, k)
        for j in range(k):
            cid += 1
            client_id = f"K{cid:05d}"

            primary = rng.choice(tax.THEMES, p=theme_p)
            secondary = ""
            if rng.random() < cl["secondary_theme_prob"]:
                others = [t for t in tax.THEMES if t != primary]
                op = np.array([tax.THEME_WEIGHTS[t] for t in others], float)
                op = op / op.sum()
                secondary = str(rng.choice(others, p=op))

            needs = _sample_needs(rng, cl, primary, secondary)
            desired = _sample_desired(rng, cl, needs)

            wsp = rng.beta(*cl["working_style_pref_beta"], size=3)
            pers = rng.beta(*cl["personality_beta"], size=5)

            rows.append({
                "client_id": client_id,
                "signup_date": dates[j].date().isoformat(),
                "age_band": common.weighted_choice(rng, cl["age_band_weights"], 1)[0],
                "gender": "F" if rng.random() < cl["gender_female_p"] else "M",
                "sector": common.weighted_choice(rng, cl["sector_weights"], 1)[0],
                "employer_size": common.weighted_choice(rng, cl["employer_size_weights"], 1)[0],
                "role_level": common.weighted_choice(rng, cl["role_level_weights"], 1)[0],
                "language": _client_langs(rng, cl),
                "region": common.weighted_choice(rng, cl["region_weights"], 1)[0],
                "primary_theme": primary,
                "secondary_theme": secondary,
                "idiosyncratic_needs": _pipe(needs),
                "desired_coach_characteristics": _pipe(desired),
                "wsp_directive_exploratory": round(float(wsp[0]), 4),
                "wsp_structured_flexible": round(float(wsp[1]), 4),
                "wsp_challenging_supportive": round(float(wsp[2]), 4),
                "pers_open": round(float(pers[0]), 4),
                "pers_consc": round(float(pers[1]), 4),
                "pers_extra": round(float(pers[2]), 4),
                "pers_agree": round(float(pers[3]), 4),
                "pers_neuro": round(float(pers[4]), 4),
                "urgency": common.weighted_choice(rng, cl["urgency_weights"], 1)[0],
                "intake_narrative": "",     # LLM texture layer (later)
            })
            motivations.append((client_id, float(rng.beta(*cl["motivation_beta"]))))

    df = pd.DataFrame(rows)
    common.save_public(cfg, df, "clients.csv")

    lat = pd.DataFrame(motivations, columns=["client_id", "motivation"])
    lat["motivation"] = lat["motivation"].round(4)
    common.save_latent(cfg, lat, "client_latents.csv")

    print(f"[clients] wrote {len(df)} clients across {years}; "
          f"mean motivation={lat['motivation'].mean():.3f}")


def _client_langs(rng, cl) -> str:
    ls = ["nl"]
    if rng.random() < cl["language_probs"]["en"]:
        ls.append("en")
    if rng.random() < cl["language_probs"]["other"]:
        ls.append("other")
    return _pipe(ls)


def _sample_needs(rng, cl, primary: str, secondary: str) -> list[str]:
    pool = list(tax.THEME_NEEDS.get(primary, []))
    if secondary:
        pool += list(tax.THEME_NEEDS.get(secondary, []))
    pool = list(dict.fromkeys(pool))  # dedupe, keep order
    k = int(common.weighted_choice(rng, cl["n_needs_weights"], 1)[0])
    k = min(k, len(pool))
    idx = rng.choice(len(pool), size=k, replace=False)
    return [pool[i] for i in idx]


def _sample_desired(rng, cl, needs: list[str]) -> list[str]:
    """Stated desired characteristics: ~overlap fraction are genuinely-helpful
    competencies (from the client's needs), the rest are style distractors."""
    overlap = cl["desired_pref_true_overlap"]
    helpful = []
    for n in needs:
        helpful += tax.NEEDS[n]["comp"]
    helpful = list(dict.fromkeys(helpful))
    k = int(common.weighted_choice(rng, cl["n_desired_char"], 1)[0])
    out = []
    for _ in range(k):
        if helpful and rng.random() < overlap:
            out.append("want:" + str(rng.choice(helpful)))
        else:
            out.append("style:" + str(rng.choice(STYLE_DESCRIPTORS)))
    return list(dict.fromkeys(out)) or out[:1]


if __name__ == "__main__":
    generate(common.load_config())
