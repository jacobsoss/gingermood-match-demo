"""Taxonomies: themes (with 2025 anchor weights), idiosyncratic need tags,
coach competency tags, and the mappings between them (§3).

NeedCompetencyAlignment (the dominant driver in §4a) is computed here from
PUBLIC fields only: client need tags <-> coach competency tags (derived from
the coach's specialisms). true_competence is latent and enters separately (β2).
"""
from __future__ import annotations

# 2025 theme anchor counts (§3) used directly as sampling weights.
THEME_WEIGHTS: dict[str, float] = {
    "persoonlijk leiderschap": 184,
    "stress": 180,
    "zelfonderzoek": 129,
    "loopbaan": 128,
    "communicatie": 102,
    "leiderschap": 98,
    "balans werk/prive": 95,
    "zelfvertrouwen": 83,
    "samenwerken": 41,
    # minor themes
    "loslaten": 25,
    "emotieregulatie": 22,
    "assertiviteit": 20,
}
THEMES: list[str] = list(THEME_WEIGHTS.keys())

# Coach competency clusters (what a specialist in a theme can actually do).
COMPETENCY_TAGS: list[str] = [
    "stress_resilience",
    "career_dev",
    "leadership_dev",
    "communication",
    "confidence",
    "self_insight",
    "collaboration",
    "emotion_reg",
    "assertiveness",
    "balance",
]

# theme -> competency tags a specialist in that theme possesses.
THEME_COMPETENCIES: dict[str, list[str]] = {
    "persoonlijk leiderschap": ["leadership_dev", "self_insight", "balance"],
    "stress": ["stress_resilience", "emotion_reg", "balance"],
    "zelfonderzoek": ["self_insight", "emotion_reg"],
    "loopbaan": ["career_dev", "self_insight"],
    "communicatie": ["communication", "assertiveness"],
    "leiderschap": ["leadership_dev", "communication", "collaboration"],
    "balans werk/prive": ["balance", "stress_resilience"],
    "zelfvertrouwen": ["confidence", "assertiveness"],
    "samenwerken": ["collaboration", "communication"],
    "loslaten": ["emotion_reg", "self_insight"],
    "emotieregulatie": ["emotion_reg"],
    "assertiviteit": ["assertiveness", "communication"],
}

# need tag -> (themes it belongs to [1-2], competency tags that address it [1-2])
NEEDS: dict[str, dict] = {
    # stress
    "boundary-setting": {"themes": ["stress", "balans werk/prive"], "comp": ["stress_resilience", "assertiveness"]},
    "recovery-routines": {"themes": ["stress", "balans werk/prive"], "comp": ["stress_resilience", "balance"]},
    "workload-negotiation": {"themes": ["stress"], "comp": ["stress_resilience"]},
    "perfectionism": {"themes": ["stress", "zelfonderzoek"], "comp": ["stress_resilience", "self_insight"]},
    # loopbaan
    "direction-clarity": {"themes": ["loopbaan"], "comp": ["career_dev"]},
    "transition-planning": {"themes": ["loopbaan"], "comp": ["career_dev"]},
    "values-mapping": {"themes": ["loopbaan", "zelfonderzoek"], "comp": ["career_dev", "self_insight"]},
    "career-switch": {"themes": ["loopbaan"], "comp": ["career_dev"]},
    # zelfvertrouwen
    "imposter-feelings": {"themes": ["zelfvertrouwen", "zelfonderzoek"], "comp": ["confidence", "self_insight"]},
    "visibility": {"themes": ["zelfvertrouwen"], "comp": ["confidence"]},
    "speaking-up": {"themes": ["zelfvertrouwen", "assertiviteit"], "comp": ["confidence", "assertiveness"]},
    "self-worth": {"themes": ["zelfvertrouwen"], "comp": ["confidence"]},
    # leiderschap
    "first-time-manager": {"themes": ["leiderschap"], "comp": ["leadership_dev"]},
    "difficult-conversations": {"themes": ["leiderschap", "communicatie"], "comp": ["communication"]},
    "delegation": {"themes": ["leiderschap"], "comp": ["leadership_dev"]},
    "decision-making": {"themes": ["leiderschap", "persoonlijk leiderschap"], "comp": ["leadership_dev"]},
    # persoonlijk leiderschap
    "self-direction": {"themes": ["persoonlijk leiderschap"], "comp": ["leadership_dev", "self_insight"]},
    "ownership-taking": {"themes": ["persoonlijk leiderschap"], "comp": ["leadership_dev"]},
    "value-alignment": {"themes": ["persoonlijk leiderschap", "zelfonderzoek"], "comp": ["self_insight"]},
    "energy-management": {"themes": ["persoonlijk leiderschap", "balans werk/prive"], "comp": ["balance"]},
    # communicatie
    "feedback-skills": {"themes": ["communicatie"], "comp": ["communication"]},
    "nonviolent-communication": {"themes": ["communicatie"], "comp": ["communication"]},
    "listening": {"themes": ["communicatie", "samenwerken"], "comp": ["communication"]},
    # zelfonderzoek
    "pattern-awareness": {"themes": ["zelfonderzoek"], "comp": ["self_insight"]},
    "limiting-beliefs": {"themes": ["zelfonderzoek", "zelfvertrouwen"], "comp": ["self_insight", "confidence"]},
    "identity-clarity": {"themes": ["zelfonderzoek", "loopbaan"], "comp": ["self_insight", "career_dev"]},
    "reflection-habits": {"themes": ["zelfonderzoek"], "comp": ["self_insight"]},
    # balans werk/prive
    "time-management": {"themes": ["balans werk/prive"], "comp": ["balance"]},
    "role-conflict": {"themes": ["balans werk/prive"], "comp": ["balance", "stress_resilience"]},
    # samenwerken
    "conflict-handling": {"themes": ["samenwerken"], "comp": ["collaboration"]},
    "team-roles": {"themes": ["samenwerken"], "comp": ["collaboration"]},
    "trust-building": {"themes": ["samenwerken"], "comp": ["collaboration"]},
    "alignment": {"themes": ["samenwerken", "leiderschap"], "comp": ["collaboration"]},
    # loslaten
    "control-release": {"themes": ["loslaten"], "comp": ["emotion_reg"]},
    "acceptance": {"themes": ["loslaten"], "comp": ["emotion_reg"]},
    "rumination-reduction": {"themes": ["loslaten", "emotieregulatie"], "comp": ["emotion_reg"]},
    # emotieregulatie
    "emotion-awareness": {"themes": ["emotieregulatie", "zelfonderzoek"], "comp": ["emotion_reg", "self_insight"]},
    "trigger-management": {"themes": ["emotieregulatie"], "comp": ["emotion_reg"]},
    "calming-techniques": {"themes": ["emotieregulatie", "stress"], "comp": ["emotion_reg", "stress_resilience"]},
    # assertiviteit
    "saying-no": {"themes": ["assertiviteit", "stress"], "comp": ["assertiveness", "stress_resilience"]},
}
NEED_TAGS: list[str] = list(NEEDS.keys())

METHODS: list[str] = [
    "ACT", "solution-focused", "systemic", "cognitive",
    "somatic", "positive-psych", "transactional-analysis",
]
SECTORS: list[str] = [
    "finance", "consultancy", "zorg", "logistics", "public", "tech", "retail",
]

# theme -> needs that belong to it (inverse of NEED.themes), for client sampling.
THEME_NEEDS: dict[str, list[str]] = {t: [] for t in THEMES}
for _need, _info in NEEDS.items():
    for _t in _info["themes"]:
        THEME_NEEDS[_t].append(_need)


def competencies_for_themes(specialisms: list[str]) -> set[str]:
    """Union of competency tags a coach has, given their specialism themes."""
    out: set[str] = set()
    for s in specialisms:
        out.update(THEME_COMPETENCIES.get(s, []))
    return out


def need_competency_alignment(client_needs: list[str], coach_comps: set[str]) -> float:
    """Weighted overlap of client needs against coach competency coverage (§4a).

    For each need, coverage = fraction of that need's competency tags the coach
    holds. Alignment = mean coverage across the client's needs, in [0, 1].
    Public-computable (no latent competence).
    """
    if not client_needs:
        return 0.0
    total = 0.0
    for need in client_needs:
        need_comps = NEEDS[need]["comp"]
        hit = sum(1 for c in need_comps if c in coach_comps)
        total += hit / len(need_comps)
    return total / len(client_needs)


def theme_match(client_themes: list[str], coach_specialisms: list[str]) -> float:
    """Overlap of client themes with coach specialism themes, in [0, 1] (§4b)."""
    ct = [t for t in client_themes if t]
    if not ct:
        return 0.0
    hits = sum(1 for t in ct if t in coach_specialisms)
    return hits / len(ct)
