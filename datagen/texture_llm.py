"""texture_llm.py — the LLM TEXT layer (DATAGEN.md §6). LAST step, after validation.

Fills TEXT fields only, conditioned on each finished (public) row:
  - coaches.csv : name, bio
  - clients.csv : intake_narrative
  - trajectories.csv : evaluation_comment  (evaluated rows only)

Hard rules: it may NEVER alter a structured field; it only writes the text
columns above. Generations are batched, cached to disk per field, and resumable
(re-running hits the cache and never re-simulates). Dutch fictional names and
Dutch narratives (this sandbox mirrors the real Dutch operation).

Usage:
  python datagen/texture_llm.py            # full run
  python datagen/texture_llm.py --limit 6  # smoke-test a few rows per field
"""
from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path

import sys

import anthropic
import pandas as pd

import common

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

GENDER = {"F": "vrouw", "M": "man"}


# ── API key + client ──────────────────────────────────────────────────────────
def load_env_key() -> None:
    if os.environ.get("ANTHROPIC_API_KEY"):
        return
    envf = common.ROOT / ".env.local"
    if envf.exists():
        for line in envf.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("ANTHROPIC_API_KEY=") and not line.startswith("#"):
                os.environ["ANTHROPIC_API_KEY"] = line.split("=", 1)[1].strip()


def extract_json(text: str) -> dict:
    t = text.strip().replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(t)
    except json.JSONDecodeError:
        m = re.search(r"\{[\s\S]*\}", t)
        if m:
            return json.loads(m.group(0))
        raise


# ── cache ─────────────────────────────────────────────────────────────────────
def _cache_dir(cfg) -> Path:
    p = common.ROOT / cfg["texture"]["cache_dir"]
    p.mkdir(parents=True, exist_ok=True)
    return p


def load_cache(cfg, field) -> dict:
    f = _cache_dir(cfg) / f"{field}.json"
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else {}


def save_cache(cfg, field, cache) -> None:
    f = _cache_dir(cfg) / f"{field}.json"
    f.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")


# ── batched generation (cached, resumable) ────────────────────────────────────
def generate_field(cfg, client, field, system, items, limit=None) -> dict:
    cache = load_cache(cfg, field)
    todo = [it for it in items if it["id"] not in cache]
    if limit is not None:
        todo = todo[:limit]
    if not todo:
        print(f"[texture] {field}: all {len(items)} cached")
        return cache
    bs = cfg["texture"]["batch_size"]
    tx = cfg["texture"]
    for i in range(0, len(todo), bs):
        chunk = todo[i:i + bs]
        user = (
            "Genereer Nederlandse tekst voor elk item hieronder. Antwoord UITSLUITEND met "
            'JSON in de vorm {"results":[{"id":"...","text":"..."}]} — één resultaat per item, '
            "met exact hetzelfde id.\n\nItems:\n" + json.dumps(chunk, ensure_ascii=False)
        )
        msg = client.messages.create(
            model=tx["model"], max_tokens=tx["max_tokens"], temperature=tx["temperature"],
            system=system, messages=[{"role": "user", "content": user}],
        )
        text = "".join(b.text for b in msg.content if b.type == "text")
        for r in extract_json(text).get("results", []):
            cache[str(r["id"])] = str(r["text"]).strip()
        save_cache(cfg, field, cache)
        print(f"[texture] {field}: {min(i + bs, len(todo))}/{len(todo)} generated")
    return cache


# ── conditioning item builders (read structured PUBLIC fields only) ───────────
def _plist(s):
    return [] if (pd.isna(s) or s == "") else str(s).split("|")


def name_items(coaches):
    return [{"id": r.coach_id, "geslacht": GENDER.get(r.gender, "onbekend")}
            for r in coaches.itertuples()]


def bio_items(coaches, names):
    out = []
    for r in coaches.itertuples():
        out.append({
            "id": r.coach_id, "naam": names.get(r.coach_id, ""),
            "jaren_ervaring": int(r.years_experience), "regio": r.region,
            "specialismen": _plist(r.specialisms),
            "methoden": _plist(r.methods), "sectoren": _plist(r.sector_experience),
        })
    return out


def narrative_items(clients):
    out = []
    for r in clients.itertuples():
        out.append({
            "id": r.client_id, "hoofdthema": r.primary_theme,
            "subthema": r.secondary_theme or "", "behoeften": _plist(r.idiosyncratic_needs),
            "rol": r.role_level, "sector": r.sector, "urgentie": r.urgency,
            "leeftijd": r.age_band,
        })
    return out


def comment_items(traj):
    out = []
    for r in traj.itertuples():
        if not r.evaluation_completed:
            continue
        out.append({
            "id": r.trajectory_id, "tevredenheid_1_10": _num(r.satisfaction_1_10),
            "doelrealisatie_1_10": _num(r.goal_achievement_1_10),
            "afgerond": bool(r.completed),
            "reden_uitval": (r.dropout_reason if isinstance(r.dropout_reason, str) else ""),
        })
    return out


def _num(x):
    return None if pd.isna(x) else int(x)


# ── systems prompts (Dutch) ───────────────────────────────────────────────────
SYS_NAME = (
    "Je verzint duidelijk FICTIEVE, realistische Nederlandse volledige namen voor coaches in een "
    "demo-dataset. Kies een voornaam passend bij het opgegeven geslacht en een Nederlandse "
    "achternaam. Gebruik geen namen van bekende bestaande personen. 'text' is de volledige naam."
)
SYS_BIO = (
    "Je schrijft korte, professionele Nederlandse coach-bio's van 2-3 zinnen, gebaseerd op de "
    "opgegeven kenmerken (naam, ervaring, specialismen, methoden, sectoren, regio). Warm en "
    "nuchter, zonder superlatieven of marketingtaal. Schrijf in de derde persoon. 'text' is de bio."
)
SYS_NARR = (
    "Je schrijft een korte intake-notitie in de IK-vorm (Nederlands, 2-3 zinnen): waarom deze "
    "persoon nú coaching zoekt, gebaseerd op het thema, de behoeften en de context. Concreet en "
    "menselijk, geen clichés. 'text' is de notitie."
)
SYS_COMMENT = (
    "Je schrijft een korte evaluatie-opmerking (Nederlands, 1-2 zinnen) van een coachee na afloop "
    "van een traject, passend bij de cijfers voor tevredenheid en doelrealisatie (1-10) en of het "
    "traject is afgerond. Hoge cijfers: positief en specifiek; lage cijfers of uitval: eerlijk en "
    "kritisch maar respectvol. 'text' is de opmerking."
)


# ── apply text to the public CSVs (structured fields untouched) ───────────────
def apply_texts(cfg, names, bios, narratives, comments):
    coaches = common.read_public(cfg, "coaches.csv")
    coaches["name"] = coaches["coach_id"].map(names).fillna(coaches["name"])
    coaches["bio"] = coaches["coach_id"].map(bios).fillna(coaches["bio"])
    common.save_public(cfg, coaches, "coaches.csv")

    clients = common.read_public(cfg, "clients.csv")
    clients["intake_narrative"] = clients["client_id"].map(narratives).fillna(
        clients["intake_narrative"])
    common.save_public(cfg, clients, "clients.csv")

    traj = common.read_public(cfg, "trajectories.csv")
    traj["evaluation_comment"] = traj["trajectory_id"].map(comments).fillna("")
    common.save_public(cfg, traj, "trajectories.csv")
    print(f"[texture] applied: {coaches['name'].astype(bool).sum()} names, "
          f"{(clients['intake_narrative'].fillna('') != '').sum()} narratives, "
          f"{(traj['evaluation_comment'] != '').sum()} comments")


def dedupe_names(cfg, client, coaches, names: dict) -> dict:
    """Ensure all generated coach names are internally unique. Regenerate any
    duplicate (gender-appropriate, excluding existing names) and invalidate that
    coach's cached bio so it is rewritten with the new name."""
    co = coaches.set_index("coach_id")
    seen: dict[str, str] = {}
    dups: list[str] = []
    for cid, nm in names.items():
        key = nm.strip().lower()
        (dups.append(cid) if key in seen else seen.setdefault(key, cid))
    if not dups:
        print("[texture] names already unique")
        return names
    print(f"[texture] de-duplicating {len(dups)} name(s): "
          f"{[names[c] for c in dups]}")
    existing = {n.strip() for n in names.values()}
    bios = load_cache(cfg, "bios")
    for cid in dups:
        geslacht = GENDER.get(co.loc[cid, "gender"], "onbekend")
        user = (
            f"Verzin één nieuwe, duidelijk FICTIEVE Nederlandse volledige naam voor een "
            f"{geslacht}-coach. De naam mag NIET in deze lijst voorkomen: "
            f"{sorted(existing)}. Antwoord UITSLUITEND met JSON "
            f'{{"results":[{{"id":"{cid}","text":"Voornaam Achternaam"}}]}}.'
        )
        msg = client.messages.create(
            model=cfg["texture"]["model"], max_tokens=200, temperature=0.9,
            system=SYS_NAME, messages=[{"role": "user", "content": user}])
        text = "".join(b.text for b in msg.content if b.type == "text")
        new = str(extract_json(text)["results"][0]["text"]).strip()
        names[cid] = new
        existing.add(new)
        bios.pop(cid, None)  # force the bio to be regenerated with the new name
    save_cache(cfg, "names", names)
    save_cache(cfg, "bios", bios)
    return names


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None, help="max rows per field (smoke test)")
    args = ap.parse_args()

    cfg = common.load_config()
    load_env_key()
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        raise SystemExit("ANTHROPIC_API_KEY ontbreekt (zet in env of .env.local).")
    # An empty ANTHROPIC_AUTH_TOKEN in the env makes the SDK send "Bearer " (illegal);
    # drop it and authenticate with the API key explicitly.
    os.environ.pop("ANTHROPIC_AUTH_TOKEN", None)
    client = anthropic.Anthropic(api_key=key)

    coaches = common.read_public(cfg, "coaches.csv")
    clients = common.read_public(cfg, "clients.csv")
    traj = common.read_public(cfg, "trajectories.csv")

    names = generate_field(cfg, client, "names", SYS_NAME, name_items(coaches), args.limit)
    names = dedupe_names(cfg, client, coaches, names)
    bios = generate_field(cfg, client, "bios", SYS_BIO, bio_items(coaches, names), args.limit)
    narratives = generate_field(cfg, client, "narratives", SYS_NARR, narrative_items(clients), args.limit)
    comments = generate_field(cfg, client, "eval_comments", SYS_COMMENT, comment_items(traj), args.limit)

    apply_texts(cfg, names, bios, narratives, comments)
    print("[texture] done — text fields only; structured fields untouched.")


if __name__ == "__main__":
    main()
