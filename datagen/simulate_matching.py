"""simulate_matching.py — offers -> choices -> trajectories -> outcomes (§4).

Pure numpy/pandas, fully seeded, no LLM. Processes clients in signup-date order,
tracks per-coach concurrency (capacity), runs the deliberately-biased legacy
shortlist, the softmax choice with an outside option, and the planted outcome
model. Public CSVs censor satisfaction/goal where evaluation is not completed
(MNAR); uncensored truth + latents go to latents/.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

import common
import taxonomies as tax


def _parse_list(s):
    return [] if (pd.isna(s) or s == "") else str(s).split("|")


def _sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))


def simulate(cfg: dict) -> None:
    rng = common.get_rng(cfg, "matching")
    # Separate, fixed-consumption RNG for OUTCOMES so that tuning outcome
    # parameters (dropout/eval offsets, etc.) never perturbs the matching stream
    # (concentration, churn, volume stay invariant).
    rng_out = np.random.default_rng(np.random.SeedSequence([int(cfg["seed"]), 33]))
    d = cfg["dgp"]

    coaches = common.read_public(cfg, "coaches.csv")
    clats = common.read_latent(cfg, "coach_latents.csv").set_index("coach_id")
    clients = common.read_public(cfg, "clients.csv")
    mlat = common.read_latent(cfg, "client_latents.csv").set_index("client_id")["motivation"]

    # ---- precompute coach feature arrays ----
    C = _coach_features(coaches, clats, cfg, rng)
    n_coach = len(coaches)
    cid_index = {cid: i for i, cid in enumerate(coaches["coach_id"])}

    # concurrency + churn state
    end_ords = [[] for _ in range(n_coach)]      # trajectory end ordinals per coach
    join_ord = np.array([pd.Timestamp(j).toordinal() for j in coaches["join_date"]])
    leave_ord = np.full(n_coach, 10**9)          # set when a coach leaves
    matches_year = {cid: {y: 0 for y in cfg["years"]} for cid in coaches["coach_id"]}
    consec_low = np.zeros(n_coach, dtype=int)

    clients = clients.sort_values("signup_date").reset_index(drop=True)
    offers_rows, traj_rows, fit_rows, truth_rows = [], [], [], []
    traj_seq = 0
    cur_year = cfg["years"][0]

    for _, cl in clients.iterrows():
        sdate = pd.Timestamp(cl["signup_date"])
        sord = sdate.toordinal()
        year = sdate.year
        if year != cur_year:
            for y in range(cur_year, year):
                _year_end_churn(cfg, rng, coaches, matches_year, consec_low,
                                leave_ord, join_ord, y)
            cur_year = year

        elig = _eligible(C, join_ord, leave_ord, end_ords, sord)
        if elig.size == 0:
            continue

        offers = _legacy_shortlist(cfg, rng, C, cl, elig, end_ords, sord)
        chosen_local = _choice(cfg, rng, C, cl, offers)

        for rank, ci in enumerate(offers, start=1):
            offers_rows.append({
                "client_id": cl["client_id"],
                "coach_id": coaches["coach_id"].iloc[ci],
                "rank_shown": rank,
                "offer_date": cl["signup_date"],
                "visible_profile_appeal": round(float(C["appeal"][ci]), 4),
                "chosen": (ci == chosen_local),
            })
            fit_rows.append(_fit_record(cl, coaches["coach_id"].iloc[ci], C, ci, clats))

        if chosen_local is None:
            continue

        traj_seq += 1
        tid = f"T{traj_seq:05d}"
        rec, truth, end_ord = _trajectory(cfg, rng_out, C, cl, chosen_local, coaches,
                                           clats, mlat, tid, sdate, year)
        traj_rows.append(rec)
        truth_rows.append(truth)
        end_ords[chosen_local].append(end_ord)
        matches_year[coaches["coach_id"].iloc[chosen_local]][year] += 1

    # final churn only for years not yet processed mid-loop (avoid double-churn)
    for y in cfg["years"]:
        if y >= cur_year:
            _year_end_churn(cfg, rng, coaches, matches_year, consec_low,
                            leave_ord, join_ord, y)

    _write(cfg, coaches, leave_ord, offers_rows, traj_rows, fit_rows, truth_rows)


# ----------------------------------------------------------------------------
def _coach_features(coaches, clats, cfg, rng) -> dict:
    n = len(coaches)
    ap = cfg["coaches"]["appeal"]
    appeal = np.clip(ap["base"] + ap["experience_coef"] * coaches["years_experience"].values
                     + rng.normal(0, ap["noise_sd"], n), 0, 1)
    ws = coaches[["ws_directive_exploratory", "ws_structured_flexible",
                  "ws_challenging_supportive"]].values
    pers = coaches[["pers_open", "pers_consc", "pers_extra",
                    "pers_agree", "pers_neuro"]].values
    specialisms = [_parse_list(s) for s in coaches["specialisms"]]
    sectors = [set(_parse_list(s)) for s in coaches["sector_experience"]]
    comps = [tax.competencies_for_themes(s) for s in specialisms]
    comp_by_theme = clats.reindex(coaches["coach_id"]).reset_index(drop=True)
    return {
        "appeal": appeal, "ws": ws, "pers": pers, "specialisms": specialisms,
        "sectors": sectors, "comps": comps, "years": coaches["years_experience"].values,
        "capacity": coaches["capacity"].values, "comp_by_theme": comp_by_theme,
        "session_days": cfg["dgp"]["outcomes"]["n_sessions"]["session_interval_days"],
    }


def _eligible(C, join_ord, leave_ord, end_ords, sord) -> np.ndarray:
    active = (join_ord <= sord) & (leave_ord > sord)
    free = np.array([C["capacity"][i] - sum(e > sord for e in end_ords[i])
                     for i in range(len(join_ord))])
    return np.where(active & (free > 0))[0]


def _legacy_shortlist(cfg, rng, C, cl, elig, end_ords, sord) -> list[int]:
    lg = cfg["dgp"]["legacy"]
    cthemes = [cl["primary_theme"], cl["secondary_theme"]]
    cpers = np.array([cl[k] for k in ["pers_open", "pers_consc", "pers_extra",
                                      "pers_agree", "pers_neuro"]])
    scores = np.empty(elig.size)
    for k, ci in enumerate(elig):
        tm = tax.theme_match(cthemes, C["specialisms"][ci])
        ps = common.cosine(cpers, C["pers"][ci])
        free = C["capacity"][ci] - sum(e > sord for e in end_ords[ci])
        avail = free / max(1, C["capacity"][ci])
        scores[k] = (lg["w_theme_match"] * tm + lg["w_personality_sim"] * ps
                     + lg["w_availability"] * avail + rng.normal(0, lg["noise_sd"]))
    order = elig[np.argsort(-scores)]
    return list(order[: lg["shortlist_size"]])


def _stated_pref_match(C, cl, ci) -> float:
    desired = _parse_list(cl["desired_coach_characteristics"])
    if not desired:
        return 0.0
    ws = C["ws"][ci]
    hits = 0
    for item in desired:
        kind, _, val = item.partition(":")
        if kind == "want":
            hits += val in C["comps"][ci]
        else:  # style descriptor
            hits += _style_ok(val, ws, C, cl, ci)
    return hits / len(desired)


def _style_ok(val, ws, C, cl, ci) -> bool:
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
        return C["years"][ci] >= 12
    if val == "same-sector":
        return cl["sector"] in C["sectors"][ci]
    return False


def _choice(cfg, rng, C, cl, offers):
    ch = cfg["dgp"]["choice"]
    utils = []
    for rank, ci in enumerate(offers):
        u = (ch["gamma_appeal"] * C["appeal"][ci]
             + ch["gamma_stated_pref"] * _stated_pref_match(C, cl, ci)
             + ch["position_bias"][rank])
        utils.append(u)
    utils.append(ch["outside_option_utility"])    # outside option = choose none
    u = np.array(utils) / ch["temperature"]
    p = np.exp(u - u.max())
    p = p / p.sum()
    pick = rng.choice(len(p), p=p)
    return None if pick == len(offers) else offers[pick]


def _components(cl, C, ci, clats):
    needs = _parse_list(cl["idiosyncratic_needs"])
    align = tax.need_competency_alignment(needs, C["comps"][ci])
    comp_primary = float(C["comp_by_theme"].iloc[ci][f"comp_{cl['primary_theme']}"])
    sector = 1.0 if cl["sector"] in C["sectors"][ci] else 0.0
    cw = np.array([cl[k] for k in ["wsp_directive_exploratory", "wsp_structured_flexible",
                                   "wsp_challenging_supportive"]])
    ws_compat = 1.0 - float(np.mean(np.abs(cw - C["ws"][ci])))
    cpers = np.array([cl[k] for k in ["pers_open", "pers_consc", "pers_extra",
                                      "pers_agree", "pers_neuro"]])
    pers_sim = common.cosine(cpers, C["pers"][ci])
    return align, comp_primary, sector, ws_compat, pers_sim


def _fit_record(cl, coach_id, C, ci, clats):
    align, comp, sector, wsc, ps = _components(cl, C, ci, clats)
    return {"client_id": cl["client_id"], "coach_id": coach_id,
            "need_competency_alignment": round(align, 4), "true_competence_primary": round(comp, 4),
            "sector_match": sector, "working_style_compat": round(wsc, 4),
            "personality_sim": round(ps, 4)}


def _trajectory(cfg, rng, C, cl, ci, coaches, clats, mlat, tid, sdate, year):
    d = cfg["dgp"]
    tf = d["true_fit"]
    align, comp, sector, wsc, ps = _components(cl, C, ci, clats)
    motivation = float(mlat[cl["client_id"]])

    true_fit = float(np.clip(
        tf["beta1_need_competency"] * align + tf["beta2_true_competence"] * comp
        + tf["beta3_sector_match"] * sector + tf["beta4_working_style"] * wsc
        + tf["beta5_personality_sim"] * ps + rng.normal(0, tf["eps_sd"]), 0, 1))

    al = d["outcomes"]["alliance"]
    alliance = float(np.clip(al["w_true_fit"] * true_fit + al["w_motivation"] * motivation
                             + rng.normal(0, al["noise_sd"]), 0, 1))

    dr = d["outcomes"]["dropout"]
    logit = (dr["delta0"] - dr["delta1_true_fit"] * true_fit
             - dr["delta2_motivation"] * motivation + dr["year_offset"][year])
    if cl["sector"] == "public":
        logit += dr["employer_segment_extra"].get("public", 0.0)
    dropped = rng.random() < _sigmoid(logit)
    completed = not dropped

    ns = d["outcomes"]["n_sessions"]
    lam = ns["base_lambda"] + ns["true_fit_coef"] * true_fit + ns["motivation_coef"] * motivation
    base_sessions = ns["shift"] + int(rng.poisson(lam))   # full planned duration
    n_sessions = base_sessions if not dropped else max(1, int(round(base_sessions * 0.4)))

    sa = d["outcomes"]["satisfaction"]
    sat = float(np.clip(sa["a1_alliance"] * alliance + sa["a2_true_fit"] * true_fit
                        + sa["a3_motivation"] * motivation - sa["a4_personality_sim"] * ps
                        + rng.normal(0, sa["noise_sd"]), 0, 1))
    go = d["outcomes"]["goal_achievement"]
    goal = float(np.clip(go["b1_need_competency"] * align + go["b2_motivation"] * motivation
                         + rng.normal(0, go["noise_sd"]), 0, 1))
    sat10 = int(np.clip(round(1 + 9 * sat), 1, 10))
    goal10 = int(np.clip(round(1 + 9 * goal), 1, 10))

    rm = d["outcomes"]["rematch"]
    p_rm = rm["base"] + rm["low_satis_slope"] * (sat < rm["low_satis_threshold"])
    rematch = bool(rng.random() < p_rm)

    ev = d["outcomes"]["evaluation_completed"]
    p_ev = ev["base_by_year"][year] - ev["dropout_penalty"] * dropped \
        - ev["low_satis_penalty"] * (sat < ev["low_satis_threshold"])
    evaluated = bool(rng.random() < np.clip(p_ev, 0.02, 0.99))

    # Draw unconditionally (fixed RNG consumption), assign only if dropped.
    reason_draw = common.weighted_choice(rng, d["dropout_reason_weights"], 1)[0]
    reason = reason_draw if dropped else ""

    # Occupancy uses the FULL planned duration (independent of dropout) so the
    # matching stream is decoupled from outcome-parameter tuning.
    end_ord = sdate.toordinal() + base_sessions * C["session_days"]
    rec = {
        "trajectory_id": tid, "client_id": cl["client_id"],
        "coach_id": coaches["coach_id"].iloc[ci], "start_date": cl["signup_date"],
        "n_sessions": n_sessions, "completed": completed, "dropout_reason": reason,
        "satisfaction_1_10": (sat10 if evaluated else np.nan),       # MNAR censoring
        "goal_achievement_1_10": (goal10 if evaluated else np.nan),
        "evaluation_completed": evaluated, "rematch_requested": rematch,
    }
    truth = {
        "trajectory_id": tid, "client_id": cl["client_id"],
        "coach_id": coaches["coach_id"].iloc[ci], "true_fit": round(true_fit, 4),
        "alliance": round(alliance, 4), "motivation": round(motivation, 4),
        "need_competency_alignment": round(align, 4), "true_competence_primary": round(comp, 4),
        "personality_sim": round(ps, 4), "satisfaction_true_1_10": sat10,
        "goal_true_1_10": goal10, "dropout": dropped,
    }
    return rec, truth, end_ord


def _year_end_churn(cfg, rng, coaches, matches_year, consec_low, leave_ord, join_ord, y):
    cc = cfg["coaches"]["churn"]
    y_end = pd.Timestamp(year=y, month=12, day=31).toordinal()
    for i, cid in enumerate(coaches["coach_id"]):
        if leave_ord[i] <= y_end or join_ord[i] > y_end:
            continue
        low = matches_year[cid][y] < cc["low_match_threshold_k"]
        consec_low[i] = consec_low[i] + 1 if low else 0
        hazard = cc["low_match_hazard"] if consec_low[i] >= 2 else cc["base_leave_hazard"]
        if rng.random() < hazard:
            leave_ord[i] = y_end


def _write(cfg, coaches, leave_ord, offers_rows, traj_rows, fit_rows, truth_rows):
    pd.DataFrame(offers_rows).to_csv(common.output_dir(cfg) / "match_offers.csv", index=False)
    pd.DataFrame(traj_rows).to_csv(common.output_dir(cfg) / "trajectories.csv", index=False)
    common.save_latent(cfg, pd.DataFrame(fit_rows), "true_fit.csv")
    common.save_latent(cfg, pd.DataFrame(truth_rows), "trajectory_truth.csv")

    # finalize coach churn columns in the public table
    big = 10**9
    coaches = coaches.copy()
    coaches["active"] = leave_ord >= big
    coaches["leave_date"] = [
        "" if lv >= big else pd.Timestamp.fromordinal(int(lv)).date().isoformat()
        for lv in leave_ord
    ]
    common.save_public(cfg, coaches, "coaches.csv")

    n_traj = len(traj_rows)
    print(f"[matching] offers={len(offers_rows)} trajectories={n_traj} "
          f"active_coaches={int((leave_ord >= big).sum())}")


if __name__ == "__main__":
    simulate(common.load_config())
