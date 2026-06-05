import type { Method, Sector, Specialism, WorkingStyle, Urgency } from "@/lib/types";

/** Display labels for enum-ish values (Dutch). */
export const METHOD_LABEL: Record<Method, string> = {
  ACT: "ACT",
  oplossingsgericht: "Oplossingsgericht",
  systemisch: "Systemisch",
  somatisch: "Lichaamsgericht",
  cognitief: "Cognitief (CGT)",
  "positieve-psychologie": "Positieve psychologie",
};

export const STYLE_LABEL: Record<WorkingStyle, string> = {
  directief: "Direct",
  reflectief: "Reflectief",
  gestructureerd: "Gestructureerd",
  verkennend: "Verkennend",
  warm: "Warm",
  pragmatisch: "Pragmatisch",
};

export const SECTOR_LABEL: Record<Sector, string> = {
  finance: "Finance",
  consultancy: "Consultancy",
  zorg: "Zorg",
  tech: "Tech",
  publiek: "Publieke sector",
  onderwijs: "Onderwijs",
  creatief: "Creatieve sector",
};

export const SPECIALISM_LABEL: Record<Specialism, string> = {
  "stress-burnout": "Stress & burn-out",
  "leadership-transition": "Leiderschapstransitie",
  "career-direction": "Loopbaanrichting",
  "confidence-imposter": "Zelfvertrouwen & imposter",
  "high-pressure-exec": "Executive onder druk",
  "communication-assertiveness": "Communicatie & assertiviteit",
  generalist: "Brede coach",
};

export const URGENCY_LABEL: Record<Urgency, string> = {
  laag: "Laag",
  gemiddeld: "Gemiddeld",
  hoog: "Hoog",
};
