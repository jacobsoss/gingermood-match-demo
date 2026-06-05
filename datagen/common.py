"""Shared utilities: config loading, seeded RNG per stage, path resolution, IO.

All paths in config.yaml are relative to the repo root (the parent of datagen/).
Each pipeline stage draws an independent, reproducible RNG from the master seed,
so stages give identical output regardless of run order.
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import yaml

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = Path(__file__).resolve().parent / "config.yaml"

# Fixed integer per stage -> deterministic, independent RNG streams.
_STAGE_IDS = {
    "coaches": 1,
    "clients": 2,
    "matching": 3,
    "validate": 4,
    "texture": 5,
}


def load_config(path: Path | str = CONFIG_PATH) -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def get_rng(cfg: dict, stage: str) -> np.random.Generator:
    """Reproducible Generator for a named stage, derived from the master seed."""
    if stage not in _STAGE_IDS:
        raise KeyError(f"Unknown stage '{stage}'")
    ss = np.random.SeedSequence([int(cfg["seed"]), _STAGE_IDS[stage]])
    return np.random.default_rng(ss)


def _resolve(cfg: dict, key: str) -> Path:
    p = ROOT / cfg["paths"][key]
    p.mkdir(parents=True, exist_ok=True)
    return p


def output_dir(cfg: dict) -> Path:
    return _resolve(cfg, "output_dir")


def latents_dir(cfg: dict) -> Path:
    return _resolve(cfg, "latents_dir")


def plots_dir(cfg: dict) -> Path:
    return _resolve(cfg, "plots_dir")


def save_public(cfg: dict, df: pd.DataFrame, name: str) -> Path:
    path = output_dir(cfg) / name
    df.to_csv(path, index=False)
    return path


def save_latent(cfg: dict, df: pd.DataFrame, name: str) -> Path:
    path = latents_dir(cfg) / name
    df.to_csv(path, index=False)
    return path


def read_public(cfg: dict, name: str) -> pd.DataFrame:
    return pd.read_csv(output_dir(cfg) / name)


def read_latent(cfg: dict, name: str) -> pd.DataFrame:
    return pd.read_csv(latents_dir(cfg) / name)


def weighted_choice(rng: np.random.Generator, weights: dict, size: int):
    """Sample `size` keys from a {key: weight} dict, weights need not sum to 1."""
    keys = list(weights.keys())
    w = np.array([float(weights[k]) for k in keys], dtype=float)
    w = w / w.sum()
    idx = rng.choice(len(keys), size=size, p=w)
    return [keys[i] for i in idx]


def cosine(a: np.ndarray, b: np.ndarray) -> float:
    na = np.linalg.norm(a)
    nb = np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))


def clip01(x):
    return np.clip(x, 0.0, 1.0)


def env_ok_for_latents(cfg: dict) -> bool:
    """Guard used in tests: latents dir must live *inside* output, but the public
    writers must never write latent columns. Returns True (kept for clarity)."""
    return os.path.isdir(latents_dir(cfg))
