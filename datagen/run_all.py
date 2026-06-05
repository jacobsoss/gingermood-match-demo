"""run_all.py — regenerate the entire structural dataset from seed.

    python datagen/run_all.py

Runs config -> coaches -> clients -> simulate -> validate. The LLM texture
layer (texture_llm.py) is intentionally NOT run here; it is a separate,
post-validation step that only fills text fields.
"""
from __future__ import annotations

import common
from generate_coaches import generate as gen_coaches
from generate_clients import generate as gen_clients
from simulate_matching import simulate
from validate import main as validate_main


def main():
    cfg = common.load_config()
    gen_coaches(cfg)
    gen_clients(cfg)
    simulate(cfg)
    validate_main()


if __name__ == "__main__":
    main()
