import type { Copy } from "./copy";

/**
 * Dutch platform copy. Mirrors the shape of `en` (typed `: Copy`, so TypeScript
 * flags any missing/renamed key). Written in the repositioned voice: psycholoog
 * of coach, persoonlijke begeleiding, gesprekken (not "sessies"),
 * matching-adviseur. Routes/hrefs stay identical.
 */
const SESSION_RANGE_NL = "vijf tot tien";
const SESSION_RANGE_NL_CAP = "Vijf tot tien";

export const nl: Copy = {
  brand: "Gingermood",

  nav: {
    employers: "Voor werkgevers",
    employees: "Voor medewerkers",
    howItWorks: "Hoe het werkt",
    about: "Over ons",
    privacy: "Privacy",
    login: "Inloggen",
  },

  demo: {
    illustrative: "Illustratieve demodata",
    preview: "Demo-voorbeeld",
    fictional: "Fictief voorbeeld",
  },

  home: {
    eyebrow: "Persoonlijke begeleiding, zorgvuldig gematcht",
    h1a: "Niet zomaar een psycholoog of coach.",
    h1b: "De juiste.",
    subtitle: `We matchen elke persoon aan een van onze [X] psychologen en coaches, op basis van wat iemand echt nodig heeft. En we nemen de tijd: ${SESSION_RANGE_NL} gesprekken van minstens een uur, om te begrijpen wat er echt speelt en er iets aan te doen.`,
    primaryCta: "Bekijk toegang voor werkgevers",
    secondaryCta: "Ik heb toegang via mijn werkgever",
    proofLine:
      "[X] BIG/NIP-geregistreerde psychologen en NOBCO-coaches · [98% — definitie volgt] · Vertrouwd door [klantnamen — toestemming bevestigen]",
    metaTitle: "Gingermood — de juiste psycholoog of coach",
    metaDescription: `Gingermood matcht medewerkers aan de juiste psycholoog of coach voor ${SESSION_RANGE_NL} diepgaande gesprekken. Zorgvuldig gematcht op wat ze nodig hebben, en gecontroleerd door een mens.`,

    audience: {
      title: "Waar wil je beginnen?",
      employer: {
        label: "Voor werkgevers",
        body: "Jaartoegang voor je medewerkers tot zorgvuldig gematchte psychologen en coaches, voor diepgaande gesprekken van minstens een uur. Je ziet anonieme, geaggregeerde rapportage — nooit individuele antwoorden.",
        cta: "Bekijk hoe het werkt voor organisaties",
        href: "/employers",
      },
      employee: {
        label: "Voor medewerkers",
        body: "Je werkgever biedt toegang. We matchen je aan een psycholoog of coach die past bij wat je meemaakt, voor een reeks gesprekken van een vol uur.",
        cta: "Bekijk wat er voor jou beschikbaar is",
        href: "/employees",
      },
    },

    steps: {
      title: "Hoe het werkt",
      items: [
        {
          title: "Vertel wat er speelt",
          body: "Een korte, meebewegende intake — in je eigen woorden, getypt of ingesproken. Je hebt geen kant-en-klare vraag nodig om te beginnen.",
        },
        {
          title: "We vinden de juiste psycholoog of coach",
          body: "Je situatie wordt gematcht aan de werkelijke expertise van onze psychologen en coaches — niet aan een persoonlijkheidstype, en niet aan wie het eerst beschikbaar is. Een Gingermood matching-adviseur controleert elke match voordat die je bereikt.",
        },
        {
          title: "Neem de tijd om ermee aan de slag te gaan",
          body: `${SESSION_RANGE_NL_CAP} gesprekken van minstens een uur, met dezelfde persoon. Genoeg tijd om verder te komen dan de oppervlakte en echt iets te veranderen. Tussen gesprekken door kun je je psycholoog of coach berichten, en periodieke check-ins helpen je je voortgang te zien.`,
        },
      ],
    },

    principles: {
      title: "Waar Gingermood op gebouwd is",
      items: [
        {
          title: "De juiste persoon, niet de eerst beschikbare",
          body: "We matchen de specifieke situatie van een persoon aan de echte expertise van onze psychologen en coaches. Software stelt voor; een Gingermood matching-adviseur bevestigt.",
        },
        {
          title: "Diepgang, geen snelle oplossing",
          body: "Snel te starten, nooit gehaast. Gesprekken van een vol uur geven ruimte om tot de kern te komen, niet alleen de oppervlakte.",
        },
        {
          title: "Privé van opzet",
          body: "Individuele antwoorden zijn alleen voor de medewerker. Werkgevers zien enkel anonieme, geaggregeerde patronen — nooit de antwoorden van één persoon.",
        },
      ],
    },

    closing: {
      title: "Breng doordachte persoonlijke begeleiding naar je organisatie",
      body: "We lopen met je door jaartoegang, matching, en wat je team wel en niet zou zien.",
      cta: "Bespreek de behoefte van je organisatie",
    },
  },

  employers: {
    eyebrow: "Voor werkgevers",
    title: "Doorlopende toegang tot begeleiding voor je mensen",
    subtitle:
      "Geef je medewerkers een doordachte manier om de juiste psycholoog of coach te vinden wanneer dat nodig is — met matching op echte behoeften en een mens die meekijkt.",
    primaryCta: "Bespreek de behoefte van je organisatie",
    secondaryCta: "Bekijk de ervaring voor medewerkers",

    value: {
      title: "Wat jaartoegang omvat",
      items: [
        {
          title: "Doorlopende toegang voor je medewerkers",
          body: "Een jaarafspraak geeft je mensen toegang tot intake en matching wanneer er een behoefte ontstaat — geen eenmalige verwijzing nodig.",
        },
        {
          title: "Individuele ontwikkeling en ondersteuning",
          body: "Van een vroege, ongevormde behoefte tot een heldere hulpvraag — medewerkers kunnen begeleiding zoeken zonder die eerst perfect te formuleren.",
        },
        {
          title: "Menselijke begeleiding, gematcht op behoefte",
          body: "Professionele psychologen en coaches, gematcht aan de specifieke situatie van een persoon en hun werkelijke expertise, met een matching-adviseur die de match bevestigt.",
        },
        {
          title: "Anonieme, geaggregeerde rapportage",
          body: "Je ziet deelname en welzijn op teamniveau, boven een minimale groepsgrootte — nooit iemands individuele antwoorden of gesprekken.",
        },
      ],
    },

    routes: {
      title: "Twee manieren om met Gingermood te werken",
      selected: {
        label: "Ondersteuning voor geselecteerde medewerkers",
        body: "Je weet al wie je wilt ondersteunen. Die medewerkers worden ondersteund via ons bestaande, aparte platform.",
        note: "Buiten deze demo.",
      },
      subscription: {
        label: "Organisatiebrede abonnementstoegang",
        body: "Doorlopende toegang voor al je medewerkers, met een bedrijfsbreed tegoed aan gesprekken en door de werkgever betaalde gesprekken daarbovenop. Dit nieuwe platform is waar die reis gaat leven.",
        note: "Deze demo toont een voorproefje van het abonnementsplatform.",
      },
    },

    commercial: {
      title: "Hoe toegang wordt geregeld",
      body: "Jaartoegang wordt geprijsd per medewerker — momenteel rond de €150 per persoon per jaar. Een bedrijfsbreed tegoed aan gesprekken is inbegrepen, met extra door de werkgever betaalde gesprekken zodra dat op is. We stemmen de afspraak samen met je af.",
      note: "Het inbegrepen aantal gesprekken wordt per organisatie bepaald — we noemen hier geen vast tegoed.",
    },

    closing: {
      title: "Laten we het over je organisatie hebben",
      body: "Vertel ons iets over je team en wat je wilt ondersteunen. Wij pakken het daarna op.",
      cta: "Bespreek de behoefte van je organisatie",
    },
  },

  employees: {
    eyebrow: "Voor medewerkers",
    title: "Vind de psycholoog of coach die past bij jouw situatie",
    subtitle:
      "Je werkgever geeft je toegang tot Gingermood. Als er iets speelt — groot of klein, helder of nog vaag — vind je de juiste begeleiding.",
    primaryCta: "Activeer je toegang",
    secondaryCta: "Inloggen",

    how: {
      title: "Hoe toegang via je werkgever werkt",
      items: [
        {
          title: "Toegang wordt geboden door je organisatie",
          body: "Je werkgever regelt je toegang. Meestal ontvang je een uitnodigingslink; je regelt niets rechtstreeks met Gingermood.",
        },
        {
          title: "Begin waar je nu staat",
          body: "Je hebt geen helder geformuleerde hulpvraag nodig. Een korte, meebewegende intake helpt boven tafel te krijgen wat echt zou helpen.",
        },
        {
          title: "Praat met een echt persoon",
          body: "De intake bevat het aanbod van een gesprek van minstens tien minuten met een echt persoon. Je kunt het aannemen, of overslaan en doorgaan.",
        },
      ],
    },

    afterActivation: {
      title: "Wat er gebeurt nadat je activeert",
      items: [
        "Je doet een korte intake — in je eigen woorden, getypt of ingesproken.",
        "Je wordt gematcht aan een psycholoog of coach op basis van jouw behoeften en hun expertise.",
        "Je plant gesprekken, houdt contact met je psycholoog of coach, en checkt in de loop van de tijd in.",
      ],
    },

    confidentiality: {
      title: "Wat je werkgever wel en niet ziet",
      body: "Je intake-antwoorden en gesprekken zijn voor jou en je psycholoog of coach. Je werkgever ziet alleen anonieme, geaggregeerde patronen over een voldoende grote groep — nooit je individuele antwoorden.",
      demoNote:
        "Dit is een demonstratie. Het laat zien hoe vertrouwelijkheid bedoeld is te werken; het biedt geen productiewaardige gegevensbescherming.",
    },

    invitation: {
      title: "Nog geen uitnodiging?",
      body: "Toegang komt van je werkgever. Denk je dat je organisatie Gingermood aanbiedt maar heb je geen link ontvangen? Vraag je HR- of people-team — zij kunnen je een uitnodiging sturen.",
    },
  },

  welcome: {
    providedThrough: (org) => `Aangeboden via ${org}`,
    eyebrow: "Je bent uitgenodigd",
    title: "Begeleiding, wanneer je die nodig hebt",
    subtitle:
      "Je organisatie geeft je toegang tot Gingermood — een doordachte manier om de juiste psycholoog of coach te vinden en er de tijd voor te nemen.",
    support: {
      title: "Wat er voor jou beschikbaar is",
      items: [
        "Een korte, meebewegende intake — begin zelfs zonder heldere vraag.",
        "Een psycholoog of coach gematcht aan jouw specifieke behoeften, bevestigd door een echt persoon.",
        "Gesprekken, contact met je psycholoog of coach, en periodieke check-ins.",
      ],
      note: "Het inbegrepen aantal gesprekken wordt door je organisatie bepaald — deze demo toont geen vast aantal.",
    },
    confidentiality:
      "Je antwoorden en gesprekken zijn voor jou en je psycholoog of coach. Je organisatie ziet alleen anonieme, geaggregeerde patronen — nooit je individuele antwoorden.",
    activateCta: "Mijn account activeren",
    loginPrompt: "Al geactiveerd?",
    loginCta: "Inloggen",
    demoLabel: "Demo-activatie — er wordt geen echt account aangemaakt",

    invalid: {
      title: "Deze uitnodigingslink is niet geldig",
      body: "De link is mogelijk verkeerd getypt of het bedrijf hoort niet bij deze demo. Je kunt nog steeds bekijken hoe toegang werkt, of je werkgever om een nieuwe uitnodiging vragen.",
      primaryCta: "Bekijk hoe toegang werkt",
      secondaryCta: "Probeer een demobedrijf",
    },
    expired: {
      title: "Deze uitnodiging is verlopen",
      body: "Uitnodigingslinks zijn tijdelijk geldig. Vraag je HR- of people-team om een nieuwe — dat is zo gebeurd.",
      primaryCta: "Bekijk hoe toegang werkt",
      secondaryCta: "Probeer een demobedrijf",
    },
  },

  login: {
    title: "Welkom terug",
    subtitle: "Log in om verder te gaan met je psycholoog of coach.",
    emailLabel: "Werk-e-mail",
    passwordLabel: "Wachtwoord",
    submit: "Inloggen",
    activatePrompt: "Heb je een uitnodiging van je werkgever?",
    activateCta: "Activeer je toegang",
    demoAccounts: "Demo-accounts",
    demoNote: "Presentatiesnelkoppelingen — hiermee land je direct in een voorbeeldweergave.",
    returnNote: (where) => `Je keert na het inloggen terug naar ${where}.`,
  },

  register: {
    title: "Activeer je toegang",
    subtitle: "Een paar gegevens en je bent binnen. Toegang wordt geboden door je werkgever.",
    nameLabel: "Volledige naam",
    emailLabel: "Werk-e-mail",
    passwordLabel: "Wachtwoord",
    submit: "Mijn account activeren",
    loginPrompt: "Heb je al een account?",
    loginCta: "Inloggen",
    employerNote:
      "Begeleiding opzetten voor een organisatie? Dat regel je met ons team — neem contact op over toegang voor werkgevers.",
    employerCta: "Toegang voor werkgevers",
  },

  enquiry: {
    title: "Bespreek de behoefte van je organisatie",
    subtitle:
      "Vertel ons iets over je team en wat je wilt ondersteunen. Deze demo verstuurt niets — het laat zien hoe de aanvraag zou werken.",
    orgLabel: "Organisatie",
    nameLabel: "Je naam",
    emailLabel: "Werk-e-mail",
    sizeLabel: "Voor ongeveer hoeveel mensen zou dit gelden?",
    messageLabel: "Wat zou je willen ondersteunen? (optioneel)",
    submit: "Aanvraag bekijken",
    demoBanner: "Demo-aanvraag — er wordt niets verzonden of opgeslagen.",
    previewTitle: "Dit is wat wij zouden ontvangen",
    previewNote:
      "In het echte product zou dit ons team bereiken. In deze demo blijft het op je scherm en wordt het niet verzonden of opgeslagen.",
    reset: "Aanpassen en opnieuw bekijken",
  },

  dashboard: {
    greetingNew: "Laten we de begeleiding vinden die bij je past.",
    greetingMatched: (coach) => `Jouw begeleiding met ${coach}`,
    actions: {
      checkin: {
        title: "Check in bij jezelf",
        body: "Een paar korte vragen over hoe werk nu voelt. Ongeveer een minuut — alleen voor jou.",
      },
      findSupport: {
        title: "Vind de juiste begeleiding",
        body: "Start de intake en word gematcht aan een psycholoog of coach. Je hebt geen heldere vraag nodig om te beginnen — en ook niet eerst een check-in.",
      },
      viewCoaching: {
        title: "Bekijk je begeleiding",
        body: "Je psycholoog of coach, je volgende gesprek, en waar je staat in je traject.",
      },
    },
    humanNote: "Software stelt de match voor; een Gingermood matching-adviseur bevestigt die.",
    reviewSimulatedNote:
      "In deze demo is de controlestap gesimuleerd zodat de flow op het podium altijd doorloopt.",
  },

  org: {
    switchToPersonal: "Mijn begeleiding",
    switchToOrg: "Organisatiebeheer",
    switchLabel: "Weergave",
    personalHiddenNote:
      "Dit is de organisatieweergave. Individuele antwoorden en gesprekken worden hier nooit getoond.",
  },

  trust: {
    privacyShort:
      "Individuele antwoorden blijven bij de medewerker en hun psycholoog of coach; werkgevers zien alleen anonieme, geaggregeerde patronen.",
    demoDisclaimer:
      "Dit is een productdemo met fictieve personen en illustratieve data. Het is geen productiesysteem en biedt geen productiewaardige vertrouwelijkheid.",
  },

  shell: {
    nav: {
      home: "Home",
      coach: "Mijn coach",
      sessions: "Gesprekken",
      library: "Bibliotheek",
      checkin: "Check-in",
      settings: "Instellingen",
    },
    signOut: "Uitloggen",
    demoEnv: "Demo-omgeving · illustratief product",
    notifications: {
      title: "Meldingen",
      markAllRead: "Alles als gelezen markeren",
      empty: "Nog niets hier.",
    },
    footer: {
      blurb: "De juiste psycholoog of coach voor iedereen. Gematcht op echte behoeften — met een mens die meekijkt.",
      explore: "Ontdek",
      aboutTitle: "Over deze site",
      aboutBody: "Dit is een productdemo. Alle getoonde personen, bedrijven en cijfers zijn fictief en illustratief — het is geen productiesysteem.",
      location: "Gingermood · Amsterdam, Nederland",
    },
  },

  lang: {
    label: "Taal",
    en: "English",
    nl: "Nederlands",
  },
};
