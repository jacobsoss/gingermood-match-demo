"""consistency_checks.py — post-texture automated checks (run after texture_llm).

1. CENSORING + STRUCTURED-DIFF: no evaluation_comment where evaluation_completed
   is False; public CSVs carry no latent columns; texture changed ONLY the text
   columns (regenerate pristine structured data from seed → diff).
2. NAME COLLISIONS: generated coach names collide with no blocklist name and are
   internally unique.
3. NARRATIVE/COMMENT ↔ STRUCTURE AGREEMENT: LLM-as-checker over a random sample.

  python datagen/consistency_checks.py            # checks 1 & 2 (no network)
  python datagen/consistency_checks.py --llm       # also check 3 (needs API)
"""
from __future__ import annotations

import argparse
import copy
import json
import re
import shutil
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")  # Windows console: allow ↔ etc.
except Exception:
    pass

import numpy as np
import pandas as pd

import common
import generate_clients
import generate_coaches
import simulate_matching

TEXT_COLS = {"coaches.csv": ["name", "bio"], "clients.csv": ["intake_narrative"],
             "trajectories.csv": ["evaluation_comment"]}
LATENT_TOKENS = ["motivation", "true_competence", "true_fit", "satisfaction_true",
                 "goal_true", "alliance", "comp_"]


def _hdr(name):
    print(f"\n=== {name} ===")


# ── Check 1 ───────────────────────────────────────────────────────────────────
def check_censoring(cfg) -> list[str]:
    _hdr("1. CENSORING + STRUCTURED-DIFF")
    fails = []
    traj = common.read_public(cfg, "trajectories.csv")
    if "evaluation_comment" not in traj.columns:
        return ["trajectories.csv has no evaluation_comment column (texture not applied?)"]
    comm = traj["evaluation_comment"].fillna("").astype(str)
    leaked = traj[(~traj["evaluation_completed"]) & (comm.str.len() > 0)]
    print(f"  comments on non-evaluated rows: {len(leaked)} (must be 0)")
    if len(leaked):
        fails.append(f"{len(leaked)} evaluation_comment(s) on evaluation_completed=False rows")

    # latent-leak: no latent column tokens in any public header
    for name in ["coaches.csv", "clients.csv", "match_offers.csv", "trajectories.csv"]:
        cols = list(common.read_public(cfg, name).columns)
        leak = [c for c in cols if any(tok in c for tok in LATENT_TOKENS)]
        if leak:
            fails.append(f"{name} leaks latent column(s): {leak}")
    print(f"  latent-column leak in public CSVs: {'none' if not any('leaks' in f for f in fails) else 'FOUND'}")

    # structured-diff: regenerate pristine from seed, compare non-text columns
    diffs = _structured_diff(cfg)
    print(f"  structured columns altered by texture: {len(diffs)} (must be 0)")
    for d in diffs:
        fails.append(f"structured column changed: {d}")
    return fails


def _structured_diff(cfg) -> list[str]:
    cfg2 = copy.deepcopy(cfg)
    cfg2["paths"] = {"output_dir": "data/synth/_check_tmp",
                     "latents_dir": "data/synth/_check_tmp/latents",
                     "plots_dir": "data/synth/_check_tmp/plots"}
    generate_coaches.generate(cfg2)
    generate_clients.generate(cfg2)
    simulate_matching.simulate(cfg2)
    diffs = []
    for name in ["coaches.csv", "clients.csv", "trajectories.csv"]:
        tex = common.read_public(cfg, name)
        pri = pd.read_csv(common.ROOT / cfg2["paths"]["output_dir"] / name)
        idc = pri.columns[0]
        a = tex.sort_values(idc).reset_index(drop=True)
        b = pri.sort_values(idc).reset_index(drop=True)
        for c in [c for c in b.columns if c not in TEXT_COLS[name]]:
            if c not in a.columns:
                diffs.append(f"{name}:{c} (missing)")
                continue
            sa, sb = a[c], b[c]
            if pd.api.types.is_float_dtype(sb):
                if not np.allclose(sa.fillna(-9e9).astype(float), sb.fillna(-9e9).astype(float), atol=1e-9):
                    diffs.append(f"{name}:{c}")
            elif not sa.fillna("∅").astype(str).equals(sb.fillna("∅").astype(str)):
                diffs.append(f"{name}:{c}")
    shutil.rmtree(common.ROOT / cfg2["paths"]["output_dir"], ignore_errors=True)
    return diffs


# ── Check 2 ───────────────────────────────────────────────────────────────────
def _blocklist() -> set[str]:
    """Real-name blocklist built from repo content (the demo app's fictional coach
    names, etc.). Extend with a user-provided list of real internal names."""
    names = set()
    ts = common.ROOT / "data" / "coaches.ts"
    if ts.exists():
        names |= set(re.findall(r'name:\s*"([^"]+)"', ts.read_text(encoding="utf-8")))
    extra = common.ROOT / "datagen" / "name_blocklist.txt"
    if extra.exists():
        names |= {ln.strip() for ln in extra.read_text(encoding="utf-8").splitlines() if ln.strip()}
    return {n.lower() for n in names}


def check_names(cfg) -> list[str]:
    _hdr("2. NAME COLLISIONS")
    fails = []
    coaches = common.read_public(cfg, "coaches.csv")
    gen = [n for n in coaches["name"].fillna("").astype(str) if n]
    block = _blocklist()
    collide = sorted({n for n in gen if n.lower() in block})
    dupes = sorted({n for n in gen if gen.count(n) > 1})
    print(f"  generated names: {len(gen)} · blocklist size: {len(block)}")
    print(f"  collisions with blocklist: {len(collide)} {collide if collide else ''}")
    print(f"  internal duplicates: {len(dupes)} {dupes if dupes else ''}")
    if collide:
        fails.append(f"name collisions: {collide}")
    if dupes:
        fails.append(f"duplicate generated names: {dupes}")
    print("  NOTE: blocklist is repo-derived; add datagen/name_blocklist.txt with real "
          "internal names for a complete check.")
    return fails


# ── Check 3 (LLM-as-checker) ──────────────────────────────────────────────────
def check_agreement(cfg, n_each=30) -> list[str]:
    _hdr("3. NARRATIVE/COMMENT ↔ STRUCTURE AGREEMENT (LLM checker)")
    import os
    import anthropic
    from texture_llm import extract_json, load_env_key
    load_env_key()
    os.environ.pop("ANTHROPIC_AUTH_TOKEN", None)
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    rng = np.random.default_rng(cfg["seed"])
    clients = common.read_public(cfg, "clients.csv")
    traj = common.read_public(cfg, "trajectories.csv")

    cl = clients[clients["intake_narrative"].fillna("").astype(str).str.len() > 0]
    cs = cl.sample(min(n_each, len(cl)), random_state=int(rng.integers(1e6)))
    tj = traj[traj["evaluation_comment"].fillna("").astype(str).str.len() > 0]
    ts = tj.sample(min(n_each, len(tj)), random_state=int(rng.integers(1e6)))

    items = []
    for r in cs.itertuples():
        items.append({"id": f"narr:{r.client_id}", "type": "intake_narrative",
                      "hoofdthema": r.primary_theme, "subthema": r.secondary_theme or "",
                      "behoeften": "" if pd.isna(r.idiosyncratic_needs) else str(r.idiosyncratic_needs),
                      "tekst": r.intake_narrative})
    for r in ts.itertuples():
        items.append({"id": f"comm:{r.trajectory_id}", "type": "evaluation_comment",
                      "tevredenheid_1_10": _num(r.satisfaction_1_10),
                      "doelrealisatie_1_10": _num(r.goal_achievement_1_10),
                      "afgerond": bool(r.completed), "tekst": r.evaluation_comment})

    system_prompt = (
        "Je bent een strenge datakwaliteit-checker. Voor elk item: is de TEKST consistent "
        "met de GESTRUCTUREERDE GEGEVENS? Voor intake_narrative: wordt het hoofdthema "
        "genoemd of duidelijk geïmpliceerd? Voor evaluation_comment: past het sentiment bij "
        "tevredenheid (1-10) en weerspiegelt het uitval als afgerond=false? Houd 'reason' heel "
        "kort (max 12 woorden). Antwoord UITSLUITEND met JSON "
        '{"results":[{"id":"...","consistent":true/false,"reason":"kort"}]}.')
    results = {}
    bs = 10
    for i in range(0, len(items), bs):
        chunk = items[i:i + bs]
        try:
            msg = client.messages.create(
                model=cfg["texture"]["model"], max_tokens=3000, temperature=0,
                system=system_prompt,
                messages=[{"role": "user", "content": json.dumps(chunk, ensure_ascii=False)}])
            text = "".join(b.text for b in msg.content if b.type == "text")
            for r in extract_json(text).get("results", []):
                results[str(r["id"])] = (bool(r["consistent"]), str(r.get("reason", "")))
        except Exception as e:
            print(f"  (batch {i // bs} skipped: {type(e).__name__})")

    ok = sum(1 for v in results.values() if v[0])
    rate = ok / len(results) if results else 0.0
    print(f"  checked: {len(results)} · consistent: {ok} · agreement rate: {rate:.1%}")
    fails_list = [(k, v[1]) for k, v in results.items() if not v[0]]
    if fails_list:
        print("  FAILURES:")
        for k, reason in fails_list:
            print(f"    - {k}: {reason}")
    else:
        print("  no inconsistencies found.")
    return [] if rate >= 0.9 else [f"agreement rate {rate:.1%} < 90%"]


def _num(x):
    return None if pd.isna(x) else int(x)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--llm", action="store_true", help="also run the LLM agreement check")
    args = ap.parse_args()
    cfg = common.load_config()
    fails = []
    fails += check_censoring(cfg)
    fails += check_names(cfg)
    if args.llm:
        fails += check_agreement(cfg)
    print("\n=== SUMMARY ===")
    print("ALL CHECKS PASSED ✅" if not fails else "FAILURES ❌:\n  - " + "\n  - ".join(fails))


if __name__ == "__main__":
    main()
