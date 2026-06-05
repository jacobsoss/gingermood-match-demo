"""generate_coaches.py — structured coach rows (coaches.csv) + latent competence.

Public rows carry NO latent fields. true_competence per theme goes to
latents/coach_latents.csv only. name/bio are left blank for the later LLM
texture layer (which may only fill text, never structured fields).
"""
from __future__ import annotations

import numpy as np
import pandas as pd

import common
import taxonomies as tax


def _pipe(xs) -> str:
    return "|".join(map(str, xs))


def _sample_counts(rng, weights: dict, n: int) -> np.ndarray:
    keys = np.array([int(k) for k in weights.keys()])
    p = np.array([float(v) for v in weights.values()])
    p = p / p.sum()
    return rng.choice(keys, size=n, p=p)


def generate(cfg: dict) -> None:
    rng = common.get_rng(cfg, "coaches")
    cc = cfg["coaches"]
    n = int(cfg["sizes"]["n_coaches"])

    # --- core attributes ---
    gender = np.where(rng.random(n) < cc["gender_female_p"], "F", "M")
    region = np.array(common.weighted_choice(rng, cc["region_weights"], n))

    # languages: NL always; EN/other by prob
    langs = []
    for i in range(n):
        ls = ["nl"]
        if rng.random() < cc["language_probs"]["en"]:
            ls.append("en")
        if rng.random() < cc["language_probs"]["other"]:
            ls.append("other")
        langs.append(_pipe(ls))

    ye = cc["years_experience"]
    years = np.exp(rng.normal(ye["meanlog"], ye["sdlog"], n))
    years = np.clip(np.round(years), ye["min"], ye["max"]).astype(int)

    # specialisms (1-3) sampled by theme demand; methods/sectors uniform-ish
    n_spec = _sample_counts(rng, cc["n_specialisms_weights"], n)
    n_meth = _sample_counts(rng, cc["n_methods_weights"], n)
    n_sect = _sample_counts(rng, cc["n_sectors_weights"], n)

    theme_keys = list(tax.THEME_WEIGHTS.keys())
    theme_p = np.array(list(tax.THEME_WEIGHTS.values()), dtype=float)
    theme_p = theme_p / theme_p.sum()

    specialisms, methods, sectors = [], [], []
    for i in range(n):
        sp = rng.choice(theme_keys, size=int(n_spec[i]), replace=False, p=theme_p)
        specialisms.append(list(sp))
        methods.append(list(rng.choice(tax.METHODS, size=int(n_meth[i]), replace=False)))
        sectors.append(list(rng.choice(tax.SECTORS, size=int(n_sect[i]), replace=False)))

    # working style (3 axes) and personality (5 axes), Beta-distributed in [0,1]
    wa, wb = cc["working_style_beta"]
    ws = rng.beta(wa, wb, size=(n, 3))
    pa, pb = cc["personality_beta"]
    pers = rng.beta(pa, pb, size=(n, 5))

    cap = cc["capacity"]
    capacity = np.clip(rng.poisson(cap["poisson_lambda"], n), cap["min"], cap["max"])

    # --- join dates / provisional active (final churn set in simulate) ---
    join_dates = _make_join_dates(rng, cfg, n)
    active = np.ones(n, dtype=bool)

    coach_ids = [f"C{idx:04d}" for idx in range(1, n + 1)]

    df = pd.DataFrame({
        "coach_id": coach_ids,
        "name": "",                 # LLM texture layer (later)
        "gender": gender,
        "region": region,
        "languages": langs,
        "years_experience": years,
        "specialisms": [_pipe(s) for s in specialisms],
        "methods": [_pipe(m) for m in methods],
        "sector_experience": [_pipe(s) for s in sectors],
        "ws_directive_exploratory": ws[:, 0].round(4),
        "ws_structured_flexible": ws[:, 1].round(4),
        "ws_challenging_supportive": ws[:, 2].round(4),
        "pers_open": pers[:, 0].round(4),
        "pers_consc": pers[:, 1].round(4),
        "pers_extra": pers[:, 2].round(4),
        "pers_agree": pers[:, 3].round(4),
        "pers_neuro": pers[:, 4].round(4),
        "capacity": capacity.astype(int),
        "join_date": [d.date().isoformat() for d in join_dates],
        "active": active,
        "bio": "",                  # LLM texture layer (later)
    })
    common.save_public(cfg, df, "coaches.csv")

    # --- LATENT: true_competence per theme (weak corr with experience) ---
    lat = _make_competence(rng, cfg, df, specialisms, years)
    common.save_latent(cfg, lat, "coach_latents.csv")

    print(f"[coaches] wrote {len(df)} coaches; "
          f"avg years={years.mean():.1f}, active={active.sum()}")


def _make_join_dates(rng, cfg, n) -> list[pd.Timestamp]:
    cc = cfg["coaches"]["churn"]
    years = cfg["years"]
    y0 = min(years)
    n_pre = int(round(cc["prejoin_fraction"] * n))
    dates = []
    # pre-window joiners: spread across the ~10 years before the window
    for _ in range(n_pre):
        yr = int(rng.integers(y0 - 10, y0))
        doy = int(rng.integers(0, 365))
        dates.append(pd.Timestamp(year=yr, month=1, day=1) + pd.Timedelta(days=doy))
    # in-window joiners: ~joiners_per_year each simulated year
    remaining = n - n_pre
    per_year = max(1, remaining // len(years))
    made = 0
    for yi, yr in enumerate(years):
        k = per_year if yi < len(years) - 1 else remaining - made
        for _ in range(k):
            doy = int(rng.integers(0, 365))
            dates.append(pd.Timestamp(year=yr, month=1, day=1) + pd.Timedelta(days=doy))
            made += 1
    rng.shuffle(dates)
    return dates[:n]


def _make_competence(rng, cfg, df, specialisms, years) -> pd.DataFrame:
    tc = cfg["coaches"]["true_competence"]
    r = float(tc["experience_corr"])
    n = len(df)
    # standardized experience -> correlated general skill latent
    z_exp = (np.log(years) - np.log(years).mean()) / np.log(years).std()
    skill_z = r * z_exp + np.sqrt(max(0.0, 1 - r * r)) * rng.normal(0, 1, n)
    skill = np.clip(tc["mean"] + tc["sd"] * skill_z, tc["min"], tc["max"])

    rows = {"coach_id": df["coach_id"].values}
    for theme in tax.THEMES:
        col = np.empty(n)
        for i in range(n):
            jitter = rng.normal(0, 0.06)
            if theme in specialisms[i]:
                col[i] = np.clip(skill[i] + jitter, tc["min"], tc["max"])
            else:
                # non-specialists are markedly weaker in that theme
                col[i] = np.clip(skill[i] * 0.40 + rng.normal(0, 0.05), tc["min"], tc["max"])
        rows[f"comp_{theme}"] = col.round(4)
    return pd.DataFrame(rows)


if __name__ == "__main__":
    generate(common.load_config())
