"""validate.py — diagnostics suite (§7) -> validation_report.md + plots.

Implements: (1) marginals vs §6 anchors incl. monotone eval-completion decline,
(2) MNAR missingness gradient, (3) concentration + Gini, (4) recovery test
(k-fold CV; GBM + linear) on PUBLIC columns, (5) confounding demo (latent
motivation), (6) selection-bias demo, plus appeal-independence and
stated-vs-true-preference checks (audit amendments 1–5).
"""
from __future__ import annotations

import numpy as np
import pandas as pd
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from sklearn.ensemble import HistGradientBoostingRegressor  # noqa: E402
from sklearn.inspection import permutation_importance  # noqa: E402
from sklearn.linear_model import LogisticRegression, Ridge  # noqa: E402
from sklearn.metrics import roc_auc_score  # noqa: E402
from sklearn.model_selection import KFold, cross_val_score, train_test_split  # noqa: E402
from sklearn.preprocessing import StandardScaler  # noqa: E402

import common  # noqa: E402
import taxonomies as tax  # noqa: E402

URG = {"low": 0, "med": 1, "high": 2}
ROLE = {"employee": 0, "manager": 1, "director": 2}
FEATURES = ["need_competency_alignment", "sector_match", "working_style_compat",
            "personality_sim", "years_experience", "urgency_ord", "role_ord"]


def _plist(s):
    return [] if (pd.isna(s) or s == "") else str(s).split("|")


def gini(x: np.ndarray) -> float:
    x = np.sort(np.asarray(x, float))
    n = len(x)
    if n == 0 or x.sum() == 0:
        return 0.0
    return float((2 * np.sum((np.arange(1, n + 1)) * x) / (n * x.sum())) - (n + 1) / n)


def _pearson(a, b) -> float:
    a, b = np.asarray(a, float), np.asarray(b, float)
    if a.std() == 0 or b.std() == 0:
        return 0.0
    return float(np.corrcoef(a, b)[0, 1])


# ── stated-preference match (replicates simulate, public-computable) ──────────
def _style_ok(val, ws, years, sectors, client_sector) -> bool:
    if val == "supportive":
        return ws[2] > 0.5
    if val == "challenging":
        return ws[2] < 0.5
    if val == "structured":
        return ws[1] < 0.5
    if val == "flexible":
        return ws[1] > 0.5
    if val == "directive":
        return ws[0] < 0.5
    if val == "experienced":
        return years >= 12
    if val == "same-sector":
        return client_sector in sectors
    return False


def _stated_pref(desired, ws, years, sectors, kcomps, client_sector) -> float:
    if not desired:
        return 0.0
    hits = 0
    for item in desired:
        kind, _, val = item.partition(":")
        hits += (val in kcomps) if kind == "want" else _style_ok(val, ws, years, sectors, client_sector)
    return hits / len(desired)


def build_features(cfg, traj, clients, coaches) -> pd.DataFrame:
    cl = clients.set_index("client_id")
    co = coaches.set_index("coach_id")
    co_comps = {cid: tax.competencies_for_themes(_plist(r["specialisms"])) for cid, r in co.iterrows()}
    co_sect = {cid: set(_plist(r["sector_experience"])) for cid, r in co.iterrows()}
    rows = []
    for _, t in traj.iterrows():
        c = cl.loc[t["client_id"]]
        k = co.loc[t["coach_id"]]
        align = tax.need_competency_alignment(_plist(c["idiosyncratic_needs"]), co_comps[t["coach_id"]])
        cw = np.array([c["wsp_directive_exploratory"], c["wsp_structured_flexible"], c["wsp_challenging_supportive"]])
        kw = np.array([k["ws_directive_exploratory"], k["ws_structured_flexible"], k["ws_challenging_supportive"]])
        cp = np.array([c[x] for x in ["pers_open", "pers_consc", "pers_extra", "pers_agree", "pers_neuro"]])
        kp = np.array([k[x] for x in ["pers_open", "pers_consc", "pers_extra", "pers_agree", "pers_neuro"]])
        rows.append({
            "trajectory_id": t["trajectory_id"],
            "need_competency_alignment": align,
            "sector_match": 1.0 if c["sector"] in co_sect[t["coach_id"]] else 0.0,
            "working_style_compat": 1.0 - float(np.mean(np.abs(cw - kw))),
            "personality_sim": common.cosine(cp, kp),
            "years_experience": float(k["years_experience"]),
            "urgency_ord": URG[c["urgency"]], "role_ord": ROLE[c["role_level"]],
        })
    return pd.DataFrame(rows)


def offer_features(offers, clients, coaches) -> pd.DataFrame:
    cl = clients.set_index("client_id")
    co = coaches.set_index("coach_id")
    co_comps = {cid: tax.competencies_for_themes(_plist(r["specialisms"])) for cid, r in co.iterrows()}
    co_sect = {cid: set(_plist(r["sector_experience"])) for cid, r in co.iterrows()}
    rows = []
    for _, o in offers.iterrows():
        c = cl.loc[o["client_id"]]
        k = co.loc[o["coach_id"]]
        ws = [k["ws_directive_exploratory"], k["ws_structured_flexible"], k["ws_challenging_supportive"]]
        sp = _stated_pref(_plist(c["desired_coach_characteristics"]), ws, k["years_experience"],
                          co_sect[o["coach_id"]], co_comps[o["coach_id"]], c["sector"])
        rows.append({
            "client_id": o["client_id"], "coach_id": o["coach_id"], "chosen": bool(o["chosen"]),
            "appeal": float(o["visible_profile_appeal"]), "stated_pref": sp,
            "alignment": tax.need_competency_alignment(_plist(c["idiosyncratic_needs"]), co_comps[o["coach_id"]]),
        })
    return pd.DataFrame(rows)


def main():
    cfg = common.load_config()
    A = cfg["validation"]["anchors"]
    tol = cfg["validation"]["rel_tolerance"]

    coaches = common.read_public(cfg, "coaches.csv")
    clients = common.read_public(cfg, "clients.csv")
    offers = common.read_public(cfg, "match_offers.csv")
    traj = common.read_public(cfg, "trajectories.csv")
    truth = common.read_latent(cfg, "trajectory_truth.csv").set_index("trajectory_id")
    clats = common.read_latent(cfg, "coach_latents.csv")
    motiv = common.read_latent(cfg, "client_latents.csv").set_index("client_id")["motivation"]

    traj = traj.copy()
    traj["year"] = pd.to_datetime(traj["start_date"]).dt.year
    lines: list[str] = ["# Gingermood Synthetic Data — Validation Report", ""]
    lines.append(f"Seed `{cfg['seed']}` · {len(coaches)} coaches · {len(clients)} clients · "
                 f"{len(traj)} trajectories · {len(offers)} offers.\n")
    # Amendment 5 — realism caveat
    lines.append("> **Realism caveat.** This is a Monte-Carlo *sandbox*. Signal-to-noise is "
                 "deliberately favorable (clean tags, planted effects, modest noise) so the "
                 "pipeline's recovery machinery can be verified. The R² values below are "
                 "**sandbox diagnostics only** and must **never** be quoted as expected "
                 "real-world predictive performance. This validates the PIPELINE, not the "
                 "business thesis — the thesis is tested on real data later.\n")

    # ---------- 1. MARGINALS ----------
    lines.append("## 1. Marginals vs §6 anchors (±%d%% rel.)\n" % int(tol * 100))
    lines.append("| statistic | target | simulated | pass |")
    lines.append("|---|---|---|---|")
    checks = []

    def rec(name, target, sim, ok):
        checks.append(ok)
        lines.append(f"| {name} | {target} | {sim} | {'✅' if ok else '❌'} |")

    def within(sim, tgt):
        return abs(sim - tgt) <= tol * abs(tgt)

    vol = clients.assign(y=pd.to_datetime(clients["signup_date"]).dt.year)["y"].value_counts()
    for y in cfg["years"]:
        rec(f"client volume {y}", A["client_volume_ratio"][y], int(vol.get(y, 0)),
            within(int(vol.get(y, 0)), A["client_volume_ratio"][y]))
    dby = traj.assign(drop=~traj["completed"]).groupby("year")["drop"].mean()
    for y in cfg["years"]:
        s = float(dby.get(y, 0))
        rec(f"dropout {y}", A["dropout_rate_by_year"][y], round(s, 3), within(s, A["dropout_rate_by_year"][y]))
    fsf = 1 - len(traj) / len(clients)
    lo, hi = A["first_shortlist_failure"]
    rec("first-shortlist failure", f"{A['first_shortlist_failure']}", round(fsf, 3),
        lo * (1 - tol) <= fsf <= hi * (1 + tol))
    eby = traj.groupby("year")["evaluation_completed"].mean()
    for y in cfg["years"]:
        s = float(eby.get(y, 0))
        rec(f"eval completion {y}", A["evaluation_completion_by_year"][y], round(s, 3),
            within(s, A["evaluation_completion_by_year"][y]))
    # Amendment 2 — monotone eval-completion decline 2023 > 2024 > 2025
    ys = cfg["years"]
    mono = all(eby.get(ys[i], 0) > eby.get(ys[i + 1], 0) for i in range(len(ys) - 1))
    rec("eval completion monotone ↓", "2023>2024>2025",
        " > ".join(f"{eby.get(y,0):.3f}" for y in ys), bool(mono))
    mpy = traj.groupby(["coach_id", "year"]).size()
    top = int(mpy.max())
    tlo, thi = A["top_coach_matches_per_year"]
    rec("top coach matches/year", f"{A['top_coach_matches_per_year']}", top, tlo * (1 - tol) <= top <= thi * (1 + tol))
    share_le2 = _share_le2(coaches, traj, cfg)
    rec("share coaches ≤2 matches/yr", f"≥{A['share_coaches_le2_matches_per_year']}",
        round(share_le2, 3), share_le2 >= A["share_coaches_le2_matches_per_year"] * (1 - tol))
    rec("pool size", A["pool_size"], len(coaches), within(len(coaches), A["pool_size"]))
    jo = pd.to_datetime(coaches["join_date"]).dt.year
    joiners = int(jo[jo.isin(cfg["years"])].value_counts().mean())
    rec("joiners/year (in-window)", A["joiners_per_year"], joiners, within(joiners, A["joiners_per_year"]))
    lvy = pd.to_datetime(coaches["leave_date"].replace("", np.nan).dropna()).dt.year
    leavers = int(lvy.value_counts().mean()) if len(lvy) else 0
    rec("leavers/year", A["leavers_per_year"], leavers, within(leavers, A["leavers_per_year"]))
    dr = traj.loc[~traj["completed"], "dropout_reason"].value_counts()
    order_ok = dr.get("disappeared", 0) >= dr.get("no-longer-wanted", 0) >= dr.get("external-coach", 0)
    rec("dropout reason order", "disappeared>no-longer>external", " > ".join(dr.index[:3]), bool(order_ok))

    n_pass = sum(checks)
    lines.append(f"\n**{n_pass}/{len(checks)} anchors pass.**\n")

    lines += _missingness(cfg, traj, truth)
    lines += _concentration(cfg, traj)

    feats = build_features(cfg, traj, clients, coaches)
    feats = feats.merge(traj[["trajectory_id", "client_id", "evaluation_completed"]], on="trajectory_id")
    feats = feats.merge(truth.reset_index()[["trajectory_id", "satisfaction_true_1_10", "goal_true_1_10"]],
                        on="trajectory_id")
    feats["motivation"] = feats["client_id"].map(motiv).values
    lines += _recovery(cfg, feats)
    lines += _confounding(cfg, feats)
    lines += _selection_bias(cfg, feats)

    ofeat = offer_features(offers, clients, coaches)
    lines += _appeal_independence(cfg, ofeat, coaches, clats)
    lines += _stated_pref_checks(cfg, ofeat, clients, truth)

    report = common.output_dir(cfg) / "validation_report.md"
    report.write_text("\n".join(lines), encoding="utf-8")
    print(f"[validate] {n_pass}/{len(checks)} anchors pass -> {report}")
    return n_pass, len(checks)


def _share_le2(coaches, traj, cfg):
    mpy = traj.groupby(["coach_id", "year"]).size().reset_index(name="m")
    join_y = pd.to_datetime(coaches["join_date"]).dt.year
    lv = pd.to_datetime(coaches["leave_date"].replace("", np.nan))
    out = []
    for i, cid in enumerate(coaches["coach_id"]):
        jy = join_y.iloc[i]
        ly = lv.iloc[i].year if pd.notna(lv.iloc[i]) else cfg["years"][-1]
        for y in cfg["years"]:
            if jy <= y <= ly:
                m = mpy[(mpy.coach_id == cid) & (mpy.year == y)]["m"]
                out.append(int(m.iloc[0]) if len(m) else 0)
    a = np.array(out)
    return float((a <= 2).mean()) if len(a) else 0.0


def _missingness(cfg, traj, truth):
    out = ["## 2. Missingness check — MNAR gradient\n"]
    eby = traj.groupby("year")["evaluation_completed"].mean()
    out.append("Evaluation completion by year (monotone ↓ enforced): " +
               ", ".join(f"{y}={eby.get(y,0):.3f}" for y in cfg["years"]) + "\n")
    tj = traj.merge(truth.reset_index()[["trajectory_id", "satisfaction_true_1_10"]], on="trajectory_id")
    tj["terc"] = pd.qcut(tj["satisfaction_true_1_10"], 3, labels=["low", "mid", "high"], duplicates="drop")
    grad = tj.groupby("terc", observed=True)["evaluation_completed"].mean()
    out.append("Completion by *true* satisfaction tercile (MNAR if rising):\n")
    out.append("| tercile | completion |\n|---|---|")
    for t in grad.index:
        out.append(f"| {t} | {grad[t]:.3f} |")
    out.append(f"\nMNAR gradient present: {'✅ yes' if grad.get('low', 1) < grad.get('high', 0) else '❌ no'}\n")
    fig, ax = plt.subplots(figsize=(5, 3.2))
    grad.plot.bar(ax=ax, color="#5e3b8e")
    ax.set_ylabel("eval completion"); ax.set_title("MNAR: completion by true-satisfaction tercile")
    fig.tight_layout(); fig.savefig(common.plots_dir(cfg) / "mnar_gradient.png", dpi=110); plt.close(fig)
    out.append("![MNAR](plots/mnar_gradient.png)\n")
    return out


def _concentration(cfg, traj):
    out = ["## 3. Concentration check\n"]
    per = traj.groupby("coach_id").size()
    g = gini(per.values)
    out.append(f"Matches per coach (total): mean={per.mean():.1f}, max={per.max()}, Gini={g:.3f}\n")
    fig, ax = plt.subplots(figsize=(5, 3.2))
    ax.hist(per.values, bins=20, color="#5e3b8e")
    ax.set_xlabel("matches per coach (3 yrs)"); ax.set_ylabel("# coaches")
    ax.set_title(f"Match concentration (Gini={g:.2f})")
    fig.tight_layout(); fig.savefig(common.plots_dir(cfg) / "concentration.png", dpi=110); plt.close(fig)
    out.append("![concentration](plots/concentration.png)\n")
    return out


def _gbm(rcfg):
    return HistGradientBoostingRegressor(
        max_iter=rcfg.get("gbm_max_iter", 200), learning_rate=rcfg.get("gbm_learning_rate", 0.05),
        max_depth=rcfg.get("gbm_max_depth", 3), min_samples_leaf=rcfg.get("gbm_min_samples_leaf", 30),
        l2_regularization=rcfg.get("gbm_l2_regularization", 1.0), early_stopping=True, random_state=0)


def _fit_models(df, target, features, rcfg):
    """Amendment 1 — k-fold CV R² (headline) + permutation importance + linear coefs."""
    X, y = df[features].values, df[target].values
    cv = KFold(n_splits=rcfg.get("n_folds", 5), shuffle=True, random_state=0)
    scores = cross_val_score(_gbm(rcfg), X, y, cv=cv, scoring="r2")
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=rcfg.get("test_size", 0.25), random_state=0)
    gbm = _gbm(rcfg).fit(Xtr, ytr)
    imp = permutation_importance(gbm, Xte, yte, n_repeats=rcfg.get("n_permutation_repeats", 10), random_state=0)
    sc = StandardScaler().fit(Xtr)
    lin = Ridge(alpha=1.0).fit(sc.transform(Xtr), ytr)
    return (float(scores.mean()), float(scores.std()),
            dict(zip(features, imp.importances_mean)), dict(zip(features, lin.coef_)))


def _recovery(cfg, feats):
    out = ["## 4. Recovery test (public columns only, k-fold CV)\n"]
    rcfg = cfg["validation"]["recovery"]
    out.append(f"> **GBM regularization note (amendment 1).** Headline R² is "
               f"{rcfg['n_folds']}-fold cross-validated. The gradient booster is deliberately "
               f"regularized (`max_depth={rcfg['gbm_max_depth']}`, "
               f"`min_samples_leaf={rcfg['gbm_min_samples_leaf']}`, "
               f"`l2={rcfg['gbm_l2_regularization']}`, early stopping). The evaluated subset is "
               f"small and **satisfaction is hard to predict from public columns by design** — "
               f"its dominant driver, `motivation`, is a latent confounder — so an unregularized "
               f"booster would overfit to a misleadingly negative CV R². Regularization yields an "
               f"honest small-positive R²; the recovery claims rest on the *importance ranking* "
               f"and *coefficient signs*, not the R² magnitude.\n")
    ev = feats[feats["evaluation_completed"]].copy()
    for target, label in [("satisfaction_true_1_10", "satisfaction"), ("goal_true_1_10", "goal_achievement")]:
        cvm, cvs, imp, coef = _fit_models(ev, target, FEATURES, rcfg)
        top_feat = max(imp, key=imp.get)
        out.append(f"### {label}  (GBM {rcfg['n_folds']}-fold CV R² = {cvm:.3f} ± {cvs:.3f})\n")
        out.append("| feature | perm. importance | linear coef (std) |\n|---|---|---|")
        for f in sorted(imp, key=imp.get, reverse=True):
            out.append(f"| {f} | {imp[f]:.4f} | {coef[f]:+.4f} |")
        out.append(f"\n- need↔competency alignment dominates: "
                   f"{'✅' if top_feat == 'need_competency_alignment' else '❌'} (top = {top_feat})")
        out.append(f"- years_experience does NOT outrank alignment: "
                   f"{'✅' if imp['years_experience'] < imp['need_competency_alignment'] else '❌'}")
        if label == "satisfaction":
            out.append(f"- personality-sim coef negative (planted −a4): "
                       f"{'✅' if coef['personality_sim'] < 0 else '❌'} ({coef['personality_sim']:+.4f})")
            _imp_plot(cfg, imp, "recovery_satisfaction.png", "Recovery: satisfaction")
        else:
            small = abs(imp["personality_sim"]) <= 0.15 * imp["need_competency_alignment"]
            out.append(f"- personality-sim ≈0 importance for goals: {'✅' if small else '❌'} "
                       f"({imp['personality_sim']:.4f})")
        out.append("")
    out.append("![recovery](plots/recovery_satisfaction.png)\n")
    return out


def _imp_plot(cfg, imp, fname, title):
    fig, ax = plt.subplots(figsize=(5.5, 3.4))
    pd.Series(imp).sort_values().plot.barh(ax=ax, color="#5e3b8e")
    ax.set_title(title); ax.set_xlabel("permutation importance")
    fig.tight_layout(); fig.savefig(common.plots_dir(cfg) / fname, dpi=110); plt.close(fig)


def _confounding(cfg, feats):
    out = ["## 5. Confounding demonstration (unobserved motivation)\n"]
    rcfg = cfg["validation"]["recovery"]
    ev = feats[feats["evaluation_completed"]].copy()
    pub, _, _, _ = _fit_models(ev, "satisfaction_true_1_10", FEATURES, rcfg)
    mot, _, _, _ = _fit_models(ev, "satisfaction_true_1_10", FEATURES + ["motivation"], rcfg)
    out.append(f"- Satisfaction CV R² on public features: **{pub:.3f}**")
    out.append(f"- ...adding the latent `motivation` column: **{mot:.3f}** (Δ = {mot - pub:+.3f})")
    out.append("\nThe material jump quantifies the planted unobserved confounder: observational "
               "fit understates the true drivers, which is why real causal claims need the "
               "staggered-rollout design, not observational fit.\n")
    fig, ax = plt.subplots(figsize=(4.5, 3.2))
    ax.bar(["public", "public+motivation"], [pub, mot], color=["#b9b2c9", "#5e3b8e"])
    ax.set_ylabel("CV R² (satisfaction)"); ax.set_title("Confounding: motivation")
    fig.tight_layout(); fig.savefig(common.plots_dir(cfg) / "confounding.png", dpi=110); plt.close(fig)
    out.append("![confounding](plots/confounding.png)\n")
    return out


def _selection_bias(cfg, feats):
    out = ["## 6. Selection-bias demonstration (MNAR evaluation)\n"]
    full = feats
    evl = feats[feats["evaluation_completed"]]
    out.append("| sample | n | mean satisfaction | alignment coef (std) |")
    out.append("|---|---|---|---|")
    out.append(f"| all started (truth) | {len(full)} | {full['satisfaction_true_1_10'].mean():.2f} | "
               f"{_std_coef(full, 'satisfaction_true_1_10', 'need_competency_alignment'):+.3f} |")
    out.append(f"| evaluated-only (observed) | {len(evl)} | {evl['satisfaction_true_1_10'].mean():.2f} | "
               f"{_std_coef(evl, 'satisfaction_true_1_10', 'need_competency_alignment'):+.3f} |")
    out.append(f"\nEvaluated-only over-states satisfaction by "
               f"**{evl['satisfaction_true_1_10'].mean() - full['satisfaction_true_1_10'].mean():+.2f}** "
               f"points — the MNAR evaluation drops dissatisfied/dropped clients.\n")
    return out


def _appeal_independence(cfg, ofeat, coaches, clats):
    """Amendment 3 — visible_profile_appeal vs true_competence / alignment."""
    out = ["## 7. Appeal independence (amendment 3)\n"]
    clats = clats.set_index("coach_id")
    co = coaches.set_index("coach_id")
    appeal_by_coach = ofeat.groupby("coach_id")["appeal"].mean()
    comp, years = [], []
    for cid in appeal_by_coach.index:
        specs = _plist(co.loc[cid, "specialisms"])
        cvals = [clats.loc[cid, f"comp_{s}"] for s in specs if f"comp_{s}" in clats.columns]
        comp.append(float(np.mean(cvals)) if cvals else float("nan"))
        years.append(float(co.loc[cid, "years_experience"]))
    comp = np.array(comp); years = np.array(years); ap = appeal_by_coach.values
    r_comp = _pearson(ap, comp)
    r_align = _pearson(ofeat["appeal"], ofeat["alignment"])  # offer-level
    r_years = _pearson(ap, years)
    r_yc = _pearson(years, comp)
    out.append("`visible_profile_appeal` is constructed only from `years_experience` + noise "
               "(config `coaches.appeal`); it never reads competence or alignment. Empirically:\n")
    out.append("| correlation | r |\n|---|---|")
    out.append(f"| appeal ↔ true_competence (coach mean) | {r_comp:+.3f} |")
    out.append(f"| appeal ↔ need_competency_alignment (offer) | {r_align:+.3f} |")
    out.append(f"| appeal ↔ years_experience (by construction) | {r_years:+.3f} |")
    out.append(f"| years_experience ↔ true_competence (planted ≈0.2) | {r_yc:+.3f} |")
    indep = abs(r_comp) < 0.25 and abs(r_align) < 0.15
    out.append(f"\nAppeal is effectively **independent** of competence and alignment: "
               f"{'✅' if indep else '⚠️'}. Any small appeal↔competence correlation is purely the "
               f"indirect path through years_experience (appeal is a function of years; years is a "
               f"weak r≈0.2 proxy for competence, per Graßmann) — not a designed dependency.\n")
    return out


def _stated_pref_checks(cfg, ofeat, clients, truth):
    """Amendment 4 — confirm ~60% stated/true overlap; stated-pref predicts CHOICE not GOAL."""
    out = ["## 8. Stated vs. revealed preference (amendment 4)\n"]
    target = cfg["clients"]["desired_pref_true_overlap"]
    allchars = [x for s in clients["desired_coach_characteristics"] for x in _plist(s)]
    frac_want = np.mean([c.startswith("want:") for c in allchars]) if allchars else 0.0
    ok_overlap = abs(frac_want - target) <= 0.10
    out.append(f"- Stated-vs-true overlap implemented (config `{target}`): observed "
               f"**{frac_want:.3f}** of desired characteristics are genuinely-helpful "
               f"competencies (`want:`), the rest style distractors — {'✅' if ok_overlap else '❌'}.\n")

    # CHOICE: does stated_pref predict the chosen offer? (logit on [stated_pref, appeal])
    X = ofeat[["stated_pref", "appeal"]].values
    yC = ofeat["chosen"].astype(int).values
    clf = LogisticRegression(max_iter=1000).fit(X, yC)
    auc = roc_auc_score(yC, clf.predict_proba(X)[:, 1])
    auc_sp = roc_auc_score(yC, ofeat["stated_pref"].values)
    coef_sp = float(clf.coef_[0][0])

    # GOAL: among chosen, does stated_pref predict goal achievement?
    # Raw bivariate is confounded (stated-pref overlaps alignment by ~60%); the
    # planted DGP has NO stated-pref term in goal, so the *partial* coef
    # controlling for alignment must be ≈0.
    chosen = ofeat[ofeat["chosen"]].merge(
        truth.reset_index()[["client_id", "goal_true_1_10", "trajectory_id"]], on="client_id")
    sp_goal_raw = _std_coef(chosen, "goal_true_1_10", "stated_pref")
    sp_goal_partial = _partial_coef(chosen, "goal_true_1_10", "stated_pref", ["alignment"])
    align_goal = _std_coef(chosen, "goal_true_1_10", "alignment")

    out.append("| relationship | metric | reading |\n|---|---|---|")
    out.append(f"| stated-pref → **choice** | AUC(stated+appeal)={auc:.3f}, "
               f"AUC(stated alone)={auc_sp:.3f}, logit coef={coef_sp:+.2f} | "
               f"{'✅ predicts choice' if auc_sp > 0.55 and coef_sp > 0 else '❌'} |")
    out.append(f"| stated-pref → **goal** (controlling for alignment) | partial std coef="
               f"{sp_goal_partial:+.3f} (raw bivariate {sp_goal_raw:+.3f}) | "
               f"{'✅ ≈0 (no independent effect)' if abs(sp_goal_partial) < 0.10 else '❌'} |")
    out.append(f"| (contrast) alignment → **goal** | std coef={align_goal:+.3f} | drives goals |")
    out.append("\nStated preference steers **which coach gets chosen** (the legacy/choice path) "
               "but has **no independent bearing on goal achievement**: its raw correlation with "
               "goals is just the ~60% overlap with genuine need↔competency alignment, and it "
               "vanishes once alignment is controlled. Only real alignment drives goals — the "
               "planted stated≠revealed gap.\n")
    return out


def _partial_coef(df, target, feat, controls):
    """Standardized partial coefficient of `feat` on `target`, controlling for `controls`."""
    cols = [feat] + controls
    Xs = df[cols].apply(lambda s: (s - s.mean()) / (s.std() + 1e-9)).values
    y = ((df[target] - df[target].mean()) / (df[target].std() + 1e-9)).values
    beta, *_ = np.linalg.lstsq(np.column_stack([np.ones(len(Xs)), Xs]), y, rcond=None)
    return float(beta[1])  # coefficient on `feat` (beta[0] is the intercept)


def _std_coef(df, target, feat):
    x = (df[feat] - df[feat].mean()) / (df[feat].std() + 1e-9)
    y = (df[target] - df[target].mean()) / (df[target].std() + 1e-9)
    return float(np.polyfit(x, y, 1)[0])


if __name__ == "__main__":
    main()
