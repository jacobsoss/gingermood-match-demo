import type { NeedTag, Specialism } from "@/lib/types";

/**
 * Human-readable phrasing for the tag taxonomy, used to compose the
 * idiosyncratic-fit reasoning. Two angles per need:
 *  - NEED_PHRASE: how the person experiences it ("the need")
 *  - STRENGTH_PHRASE: what a coach is good at ("the competency")
 * Keeping both lets the match explain "your need X ↔ this coach's strength X".
 */
export const NEED_PHRASE: Record<NeedTag, string> = {
  "stress-burnout": "voorkomen dat je omvalt en herstellen van langdurige stress",
  energieherstel: "weer energie en ontspanning vinden",
  "werk-prive-balans": "werk en privé in balans brengen",
  "grenzen-stellen": "grenzen leren stellen en op tijd nee zeggen",
  perfectionisme: "minder streng voor jezelf zijn",
  "eerste-leidinggevende": "stevig staan als nieuwe leidinggevende",
  delegeren: "loslaten en leren delegeren",
  rolverandering: "wennen aan je nieuwe rol",
  "feedback-geven": "feedback durven geven",
  loopbaankeuze: "een loopbaankeuze maken die klopt",
  "zingeving-identiteit": "weer betekenis in je werk vinden",
  heroriëntatie: "je heroriënteren op een nieuwe richting",
  zelfvertrouwen: "meer vertrouwen in jezelf en je keuzes",
  imposter: "loskomen van het gevoel een bedrieger te zijn",
  zichtbaarheid: "meer durven laten zien wat je waard bent",
  "hoge-druk-executive": "de druk en het toezicht van een topfunctie hanteren",
  besluitvorming: "scherp blijven beslissen onder druk",
  "strategische-eenzaamheid": "een vertrouwelijke sparringpartner aan de top",
  "communicatie-assertiviteit": "duidelijker en assertiever communiceren",
  conflicthantering: "spanning en conflicten goed aangaan",
  "presentie-overtuigingskracht": "meer impact en overtuigingskracht",
};

export const STRENGTH_PHRASE: Record<NeedTag, string> = {
  "stress-burnout": "herstel bij (dreigende) burn-out",
  energieherstel: "energieherstel en ontspanning",
  "werk-prive-balans": "werk-privébalans",
  "grenzen-stellen": "grenzen stellen",
  perfectionisme: "omgaan met perfectionisme",
  "eerste-leidinggevende": "het begeleiden van nieuwe leidinggevenden",
  delegeren: "leren delegeren",
  rolverandering: "rolveranderingen",
  "feedback-geven": "feedback geven",
  loopbaankeuze: "loopbaankeuzes",
  "zingeving-identiteit": "zingeving en werkidentiteit",
  heroriëntatie: "loopbaanheroriëntatie",
  zelfvertrouwen: "het opbouwen van zelfvertrouwen",
  imposter: "het imposter-gevoel",
  zichtbaarheid: "zichtbaarheid en eigenwaarde",
  "hoge-druk-executive": "executives onder hoge druk",
  besluitvorming: "besluitvorming onder druk",
  "strategische-eenzaamheid": "sparren op bestuursniveau",
  "communicatie-assertiviteit": "assertieve communicatie",
  conflicthantering: "conflicthantering",
  "presentie-overtuigingskracht": "presentie en overtuigingskracht",
};

/** Which coarse cluster each fine tag belongs to. */
export const CLUSTER_OF: Record<NeedTag, Specialism> = {
  "stress-burnout": "stress-burnout",
  energieherstel: "stress-burnout",
  "werk-prive-balans": "stress-burnout",
  "grenzen-stellen": "stress-burnout",
  perfectionisme: "confidence-imposter",
  "eerste-leidinggevende": "leadership-transition",
  delegeren: "leadership-transition",
  rolverandering: "leadership-transition",
  "feedback-geven": "leadership-transition",
  loopbaankeuze: "career-direction",
  "zingeving-identiteit": "career-direction",
  heroriëntatie: "career-direction",
  zelfvertrouwen: "confidence-imposter",
  imposter: "confidence-imposter",
  zichtbaarheid: "confidence-imposter",
  "hoge-druk-executive": "high-pressure-exec",
  besluitvorming: "high-pressure-exec",
  "strategische-eenzaamheid": "high-pressure-exec",
  "communicatie-assertiviteit": "communication-assertiveness",
  conflicthantering: "communication-assertiveness",
  "presentie-overtuigingskracht": "communication-assertiveness",
};

/** Presenting-theme labels for the needs profile. */
export const SPECIALISM_THEME: Record<Specialism, string> = {
  "stress-burnout": "Stress, energie en herstel",
  "leadership-transition": "Groeien in een leidinggevende rol",
  "career-direction": "Loopbaanrichting en betekenis",
  "confidence-imposter": "Zelfvertrouwen en eigenwaarde",
  "high-pressure-exec": "Presteren onder hoge druk",
  "communication-assertiveness": "Communicatie en assertiviteit",
  generalist: "Meerdere thema's tegelijk",
};

/** Light keyword → tag map so free-typed answers also contribute signal. */
export const KEYWORD_TAGS: { re: RegExp; tags: NeedTag[] }[] = [
  { re: /burn|opgebrand|uitgeput|tandvlees|op( |$)|moe|uitgeblust/i, tags: ["stress-burnout", "energieherstel"] },
  { re: /ontspan|rust|loslaten|terugschakelen/i, tags: ["energieherstel"] },
  { re: /balans|prive|privé|thuis|werk-privé/i, tags: ["werk-prive-balans"] },
  { re: /grens|grenzen|nee zeggen|teveel ja/i, tags: ["grenzen-stellen"] },
  { re: /perfect|streng voor mezelf|fouten/i, tags: ["perfectionisme"] },
  { re: /leidinggev|manager|teamlead|leider|aansturen/i, tags: ["eerste-leidinggevende", "rolverandering"] },
  { re: /delegeren|loslaten|zelf oppak/i, tags: ["delegeren"] },
  { re: /feedback|aanspreken/i, tags: ["feedback-geven"] },
  { re: /loopbaan|carrière|carriere|ander werk|baan|volgende stap/i, tags: ["loopbaankeuze"] },
  { re: /betekenis|zingeving|voldoening|zin in/i, tags: ["zingeving-identiteit"] },
  { re: /iets anders|omscholen|switch|herori/i, tags: ["heroriëntatie"] },
  { re: /onzeker|twijfel|durf niet|klein/i, tags: ["zelfvertrouwen"] },
  { re: /bedrieger|imposter|niet goed genoeg|toeval/i, tags: ["imposter"] },
  { re: /zichtbaar|laten zien|wegcijfer|profileren/i, tags: ["zichtbaarheid"] },
  { re: /directie|bestuur|executive|toezicht|scrutiny|zuidas/i, tags: ["hoge-druk-executive"] },
  { re: /beslis|knoop|keuze maken|besluit/i, tags: ["besluitvorming"] },
  { re: /eenzaam|alleen aan de top|niemand om mee/i, tags: ["strategische-eenzaamheid"] },
  { re: /assertie|communicat|gehoord|impact in overleg/i, tags: ["communicatie-assertiviteit"] },
  { re: /conflict|spanning|lastig gesprek|confrontatie/i, tags: ["conflicthantering"] },
  { re: /overtuig|presentie|uitstraling|gravitas/i, tags: ["presentie-overtuigingskracht"] },
];
