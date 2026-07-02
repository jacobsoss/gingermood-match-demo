/**
 * Centralised UI copy (Dutch). Kept in one place so switching language later
 * is a single-file change. Data-driven content (coaches, questions) lives in /data.
 */
export const COPY = {
  brand: "Gingermood",
  sampleDataBadge: "Demo · synthetische voorbeeldgegevens",

  welcome: {
    eyebrow: "Adaptieve intake",
    title: "Vind de coach die bij jou past",
    subtitle:
      "Geen standaardformulier. Een paar slimme vragen die meebewegen met jouw antwoorden; en een match op je werkelijke behoeften en wensen.",
    start: "Begin de intake",
    personasIntro: "Of bekijk direct een voorbeeld:",
    personaCta: "Probeer dit voorbeeld →",
    privacy:
      "Alle coaches en profielen in deze demo zijn fictief. Er worden geen echte gegevens gebruikt of opgeslagen.",
  },

  question: {
    progress: (current: number, total: number) => `Vraag ${current} van ${total}`,
    openPlaceholder: "Typ hier je antwoord… (of tik hieronder)",
    cityPlaceholder: "Zoek je plaats…",
    citySuggested: "Grootste steden",
    listening: "Luisteren…",
    micStart: "Spreek je antwoord in",
    micStop: "Stop met dicteren",
    micUnavailable: "Microfoon niet beschikbaar",
    chipsHintSingle: "Kies er één",
    chipsHintMulti: "Kies wat past — meerdere mag",
    continue: "Verder",
    thinking: "Even denken…",
    skip: "Sla over",
    back: "Terug",
  },

  processing: {
    lines: ["Je antwoorden lezen…", "Behoeften in kaart brengen…", "Coaches matchen…"],
  },

  thinking: {
    lines: ["Je antwoord lezen…", "De volgende vraag voorbereiden…"],
  },

  result: {
    eyebrow: "Jouw match",
    recognitionLabel: "Wat we hoorden",
    profileTitle: "Jouw behoefteprofiel",
    profileLead: "Dit hebben we uit je antwoorden gehaald:",
    themes: "Thema's",
    specificNeeds: "Specifieke behoeften",
    desired: "Gewenst in een coach",
    practical: "Praktisch",
    urgency: "Urgentie",
    matchTitle: "Waarom deze coach voor jóuw behoeften",
    fitScore: "match",
    fitBreakdown: "Fit per dimension",
    evidenceTitle: "Jouw behoefte ↔ de expertise van de coach",
    runnerUp: "Sterke tweede keuze",
    behindTitle: "Achter de schermen",
    behindLead:
      "Je intake wordt gestructureerde data. Elke match wordt zo data die de volgende match beter maakt.",
    behindToggleOpen: "Toon de data",
    behindToggleClose: "Verberg de data",
    restart: "Opnieuw beginnen",
    tryAnother: "Probeer een ander profiel",
    rangeRelaxed: (city: string, requestedKm: number, nearestKm: number) =>
      `Geen coach binnen ${requestedKm} km van ${city}. We tonen de best passende coach daarbuiten — de dichtstbijzijnde zit op ongeveer ${nearestKm} km. Online coaching is overal mogelijk.`,
    humanPrompt: "Niet tevreden met deze match?",
    humanCta: "Laat een matchmaker het persoonlijk afstemmen",
    humanConfirm:
      "Genoteerd. Een van onze matchmakers kijkt persoonlijk naar je profiel en neemt contact met je op.",
    sourceAi: "Live AI-match",
    sourceFallback: "Offline reservematch",
    rerunError:
      "Dat profiel kon niet worden geladen. Je huidige match staat er nog — kies gerust nog eens een profiel.",
    rerunErrorDismiss: "Sluiten",
  },

  format: {
    online: "Online",
    "in-persoon": "In persoon",
    hybride: "Hybride",
    "geen-voorkeur": "Geen voorkeur",
  } as Record<string, string>,
} as const;
