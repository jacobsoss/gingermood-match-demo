import type { Format, NeedTag, Urgency, WorkingStyle } from "@/lib/types";

/**
 * Runtime arrays of the enum-like unions, used to build JSON schemas for the
 * Claude structured-output calls. Kept in sync with the unions in types.ts.
 * (The `satisfies` checks below fail to compile if they drift.)
 */
export const NEED_TAGS = [
  "stress-burnout",
  "energieherstel",
  "werk-prive-balans",
  "grenzen-stellen",
  "perfectionisme",
  "eerste-leidinggevende",
  "delegeren",
  "rolverandering",
  "feedback-geven",
  "loopbaankeuze",
  "zingeving-identiteit",
  "heroriëntatie",
  "zelfvertrouwen",
  "imposter",
  "zichtbaarheid",
  "hoge-druk-executive",
  "besluitvorming",
  "strategische-eenzaamheid",
  "communicatie-assertiviteit",
  "conflicthantering",
  "presentie-overtuigingskracht",
] as const satisfies readonly NeedTag[];

export const WORKING_STYLES = [
  "directief",
  "reflectief",
  "gestructureerd",
  "verkennend",
  "warm",
  "pragmatisch",
] as const satisfies readonly WorkingStyle[];

export const FORMATS = [
  "online",
  "in-persoon",
  "hybride",
  "geen-voorkeur",
] as const satisfies readonly Format[];

export const URGENCIES = ["laag", "gemiddeld", "hoog"] as const satisfies readonly Urgency[];
