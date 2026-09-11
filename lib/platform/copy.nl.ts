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

  // ── Batch 1: marketing pages, metadata, chrome, forms, a11y. ──
  a11y: {
    heroImageAlt: "Een psycholoog of coach in gesprek met een cliënt aan tafel",
    mainNav: "Hoofdnavigatie",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
    footer: "Voettekst",
    logoHome: "Gingermood — startpagina",
  },

  about: {
    eyebrow: "Over Gingermood",
    h1: "Al meer dan tien jaar mensen matchen met coaches",
    story: {
      p1: "Gingermood begon ruim tien jaar geleden in Nederland, uit een simpele ergernis: er waren overal coachingsgidsen, maar een gids is geen match. Mensen kozen een coach op basis van een foto en een lijst met certificaten — en te vaak klikte het gewoon niet.",
      p2: "Dus deden we het anders. We luisterden naar de verhalen van mensen — lange telefoongesprekken, zorgvuldige aantekeningen — en stelden hen voor aan die ene coach van wie we echt geloofden dat die zou passen. Het werkte. Het werkt nog steeds.",
      p3: "Vandaag helpt software ons op grote schaal te luisteren: de intake past zich aan op jouw antwoorden en stelt coaches uit ons netwerk voor. Maar het principe is geen millimeter opgeschoven — software stelt voor, mensen bevestigen. Een matching-adviseur uit ons team beoordeelt elke match voordat die bij jou terechtkomt.",
    },
    mission: {
      label: "Onze missie",
      body: "De juiste coach voor ieder mens. Niet de beschikbare, niet de dichtstbijzijnde — de juiste.",
    },
    values: {
      label: "Waar we onszelf aan houden",
      listen: {
        title: "Goed luisteren",
        body: "Jouw verhaal komt eerst, in je eigen woorden. We stellen liever nog één vraag dan dat we gokken.",
      },
      match: {
        title: "Zorgvuldig matchen",
        body: "Fit gaat boven beschikbaarheid. We stellen de coach voor in wie we geloven — en een mens controleert ons werk.",
      },
      measure: {
        title: "Eerlijk meten",
        body: "We vragen na of de coaching echt heeft geholpen. Als een match niet werkt, zeggen we dat en lossen we het op.",
      },
    },
    team: {
      label: "Het team achter jouw match",
      role1: "Oprichter & hoofd matching-adviseur",
      line1: "Matchte onze eerste honderd cliënten telefonisch, met een notitieboekje in de hand.",
      role2: "Lead coachnetwerk",
      line2: "Interviewt elke coach die bij ons komt — en wijst de meeste aanmeldingen af.",
      role3: "Matching-adviseur",
      line3: "Beoordeelt elke dag voorgestelde matches. Bekend om het overrulen van de software.",
      role4: "Product & onderzoek",
      line4: "Bouwt de matching-engine en controleert daarna of die echt heeft geholpen.",
      disclaimer: "De getoonde teamleden zijn illustratief voor deze demo.",
    },
    cta: {
      title: "Benieuwd met wie we jou zouden matchen?",
      body: "Vertel ons jouw verhaal — het duurt ongeveer vijf minuten — en kom erachter.",
      button: "Aan de slag",
    },
  },

  components: {
    confirmedBadge: "Gecontroleerd en bevestigd door het Gingermood-team",
    illustrativeTag: "Illustratieve data",
  },

  forms: {
    emailPlaceholder: "jij@bedrijf.nl",
    passwordPlaceholder: "Je wachtwoord",
    namePlaceholder: "Sanne de Vries",
    passwordHint: "Minimaal 6 tekens",
    orgPlaceholder: "Nova Health Group",
    sizePlaceholder: "bijv. 250",
  },

  howItWorks: {
    eyebrow: "Hoe het werkt",
    h1: "Van jouw verhaal naar de juiste coach, in drie stappen",
    subtitle: "Geen lijsten om doorheen te scrollen, geen coach die je krijgt toegewezen omdat er toevallig een plekje vrij was. Dit is wat er echt gebeurt.",
    step1: {
      title: "Vertel ons jouw verhaal",
      body: "Het begint met een korte intake — zo'n vijf minuten. Je vertelt in je eigen woorden wat er speelt, en de volgende vraag past zich aan op wat je net zei. Liever praten dan typen? Spreek gewoon in; de intake ondersteunt spraak.",
      b1: "Past zich aan op jouw antwoorden — geen twee intakes zijn hetzelfde",
      b2: "Typen of praten, wat voor jou natuurlijk voelt",
      b3: "Je eigen woorden, geen formulier vol vinkjes",
    },
    step2: {
      title: "Wij matchen — een mens bevestigt",
      body: "Onze software vergelijkt jouw verhaal met ons netwerk van professionele coaches: waar je hulp bij nodig hebt, hoe je graag werkt, en de praktische zaken — taal, regio, online of in persoon. Het stelt de beste match voor. Daarna leest een matching-adviseur van Gingermood dat voorstel en bevestigt het, of gaat er tegenin. Geen match bereikt jou ongecontroleerd.",
      b1: "Gematcht op behoeften en werkstijl, niet op beschikbaarheid",
      b2: "Inclusief de praktische fit: taal, regio, online of in persoon",
      b3: "Elke match wordt door een mens gecontroleerd voordat jij hem ziet",
    },
    step3: {
      title: "Groei met jouw coach",
      body: "Je ontmoet elkaar, je praat, je gaat aan de slag. Boek gesprekken zoals ze in jouw week passen — via video, in persoon of telefonisch. Tussen de gesprekken door is er een bibliotheek met korte, praktische artikelen, en een check-in per kwartaal houdt bij hoe het écht met je gaat. En als het eerste gesprek je laat merken dat de match toch niet klopt? Zeg het gerust — dan matchen we je opnieuw, zonder gedoe.",
      b1: "Gesprekken via video, in persoon of telefonisch",
      b2: "Een bibliotheek met korte, praktische artikelen tussen de gesprekken door",
      b3: "Check-ins per kwartaal, zodat vooruitgang wordt gemeten — niet aangenomen",
    },
    why: {
      label: "Waarom matchen ertoe doet",
      p1: "Onderzoek laat zien dat de klik tussen jou en jouw psycholoog of coach een van de sterkste voorspellers van succes is — daarom behandelen we matchen als het product, niet als bijzaak.",
      p2: "Sterker dan de methode, sterker dan de techniek: of je klikt met de persoon tegenover je. Het is het onderdeel waar we ruim tien jaar aan hebben gesleuteld — eerst met de hand, nu met software die een mens nog steeds dubbelcheckt.",
    },
    cta: {
      title: "Ontdek wie bij je past",
      body: "Vijf minuten, je eigen woorden, en een mens controleert de match voordat je elkaar ontmoet.",
      getStartedLink: "Aan de slag",
      privacyLink: "Lees onze privacybeloftes",
    },
  },

  meta: {
    about: {
      title: "Over ons — Gingermood",
      description: "Gingermood matcht al meer dan tien jaar mensen met coaches. Software stelt voor, mensen bevestigen — dat principe is geen millimeter opgeschoven.",
    },
    howItWorks: {
      title: "Hoe het werkt — Gingermood",
      description: "Van jouw verhaal naar de juiste coach in drie stappen: een intake die zich aan jou aanpast, een match voorgesteld door software en bevestigd door een mens, en een traject dat we echt meten.",
    },
    privacy: {
      title: "Privacy — Gingermood",
      description: "Begeleiding werkt alleen als je eerlijk kunt zijn. Onze privacybeloftes in gewone taal: jouw antwoorden blijven van jou, werkgevers zien trends — nooit personen.",
    },
    root: {
      title: "Gingermood — de juiste psycholoog of coach",
      description: "Persoonlijke begeleiding die begint met een zorgvuldige match, gecontroleerd door een mens. Productdemo met illustratieve data.",
    },
    employers: {
      title: "Voor werkgevers — Gingermood",
      description: "Doorlopende toegang tot psychologen en coaches voor je mensen: individuele matching op echte behoeften, een mens die meekijkt, en anonieme geaggregeerde rapportage.",
    },
    employees: {
      title: "Voor medewerkers — Gingermood",
      description: "Je werkgever biedt toegang tot Gingermood. Vind de psycholoog of coach die bij jouw situatie past — en zie wat je werkgever wel en niet kan zien.",
    },
  },

  privacy: {
    promise1: {
      title: "Jouw antwoorden blijven van jou",
      body: "Wat je ons vertelt in de intake, wat je bespreekt met jouw coach, je check-in-scores — niets daarvan is ooit zichtbaar voor je werkgever. Niet voor HR, niet voor je manager, in geen enkel rapport.",
    },
    promise2: {
      title: "Werkgevers zien trends, nooit personen",
      body: "Werkgevers krijgen alleen geanonimiseerde, geaggregeerde inzichten — hoe teams er als geheel voor staan. Als een groep uit minder dan 15 mensen bestaat, laten we helemaal niets zien, zodat niemand eruit gepikt kan worden.",
    },
    promise3: {
      title: "We vragen alleen wat we nodig hebben",
      body: "Geen trackingprofielen, geen verkochte data, geen hamsteren. We verzamelen wat nodig is om je goed te matchen en je traject te ondersteunen — en niets meer dan dat.",
    },
    promise4: {
      title: "Verwijder je gegevens, wanneer je maar wilt",
      body: "Je kunt je account en alles daarin verwijderen wanneer je maar wilt, direct vanuit je instellingen. Weg is weg — verwijderd uit onze systemen, niet alleen uit het zicht.",
    },
    eyebrow: "Privacy",
    h1: "Privacy, in gewone taal",
    subtitle: "Begeleiding werkt alleen als je helemaal eerlijk kunt zijn — over je werk, je manager, jezelf. Daarom is privacy hier niet de kleine lettertjes; het is onderdeel van het product. Dit zijn onze beloftes.",
    practice: {
      title: "Wat dit in de praktijk betekent",
      body: "Zeg wat je echt denkt in je intake en je gesprekken. Je werkgever betaalt voor de begeleiding, maar kijkt nooit over je schouder mee — die grens zit ingebouwd in het product, niet er later opgeplakt.",
      link: "Bekijk hoe matchen werkt",
    },
  },

  // ── Batch 2: authenticated app. ──
  charts: {
    a11y: {
      trend: "Trendgrafiek",
      distribution: (g, o, r) => `${g}% groen, ${o}% oranje, ${r}% rood`,
    },
    zone: {
      green: "Gaat goed",
      orange: "Even opletten",
      red: "Vraagt aandacht",
    },
  },

  checkin: {
    questions: {
      energy: {
        label: "Hoe is je energie de laatste tijd op je werk?",
        low: "Helemaal leeg",
        high: "Helemaal opgeladen",
        short: "Energie",
      },
      workload: {
        label: "Hoe behapbaar is je werkdruk?",
        low: "Ik verzuip erin",
        high: "Prima te doen",
        short: "Werkdruk",
      },
      balance: {
        label: "Hoe is de balans tussen werk en de rest van je leven?",
        low: "Werk slokt alles op",
        high: "Gezonde balans",
        short: "Balans",
      },
      sleep: {
        label: "Hoe slaap je?",
        low: "Slecht, de meeste nachten",
        high: "Goed, de meeste nachten",
        short: "Slaap",
      },
      connection: {
        label: "Hoe verbonden voel je je met de mensen met wie je werkt?",
        low: "Behoorlijk geïsoleerd",
        high: "Echt verbonden",
        short: "Verbinding",
      },
      overall: {
        label: "Alles bij elkaar genomen, hoe gaat het met je op je werk?",
        low: "Ik worstel",
        high: "Het gaat goed",
        short: "Algemeen",
      },
    },
    dimensionNoun: {
      energy: "energie",
      workload: "werkdruk",
      balance: "werk-privébalans",
      sleep: "slaap",
      connection: "verbinding met collega's",
      overall: "algemene beeld",
    },
    weakPhrase: {
      energy: "raakt je energie op",
      workload: "kruipt de werkdruk omhoog",
      balance: "lekt werk door in de rest van je leven",
      sleep: "komt je slaap tekort",
      connection: "voel je je meer geïsoleerd dan je zou willen",
      overall: "voelt werk op dit moment zwaarder dan het zou moeten",
    },
    privacyCard: {
      label: "Standaard privé",
      body: "Je antwoorden zijn persoonlijk voor jou. Je werkgever ziet alleen anonieme trends op teamniveau — nooit je individuele antwoorden.",
      line: "Je antwoorden zijn persoonlijk voor jou — je werkgever ziet alleen anonieme trends op teamniveau.",
    },
    helpCard: {
      meta: (kind, minutes) => `${kind === "video" ? "Video" : "Artikel"} · ${minutes} min`,
    },
    employerEmpty: {
      title: "Check-ins vind je in de medewerkersweergave",
      body: "De kwartaal-check-in is persoonlijk voor elke medewerker. Werkgevers zien alleen anonieme trends op teamniveau — log in met een medewerkersaccount om het te proberen.",
    },
    flow: {
      progress: (current, total) => `Vraag ${current} van ${total}`,
    },
    a11y: {
      option: (n) => `${n} van 5`,
    },
    result: {
      thanks: (name) => `Bedankt, ${name}`,
      subtitle: "Dit kwartaal zit erop. Dit viel op.",
      noticed: "Wat ons opviel",
      summarySteady: "Alles ziet er stabiel uit — niets staat op oranje. Blijf doen wat je doet, en volgend kwartaal vragen we het opnieuw.",
      solidHigh: "zien er goed uit",
      solidBest: "houden zich het beste staande",
      summary: (noun0, noun1, phrase, weak) => `Je ${noun0} en ${noun1} ${phrase}. Tegelijkertijd ${weak} — de moeite waard om in de gaten te houden voordat het groter wordt.`,
      help: "Twee dingen die kunnen helpen",
      backToOverview: "Terug naar overzicht",
    },
    intro: {
      title: "Welzijnscheck-in",
      subtitle: "Zes korte vragen, ongeveer een minuut. Persoonlijk voor jou.",
      firstTitle: "Je eerste check-in",
      firstBody: "Elk kwartaal stellen we dezelfde zes vragen — energie, werkdruk, balans, slaap, verbinding, en hoe het over het geheel met je gaat. Antwoord eerlijk; er zijn geen foute antwoorden. Na verloop van tijd bouwt dit je persoonlijke trend op, zodat je ziet wat er verschuift voordat het een probleem wordt.",
      start: "Start check-in",
      again: "Opnieuw inchecken",
      lastCheckin: (ago) => `Laatste check-in ${ago}.`,
    },
    trend: {
      label: "Jouw trend",
      desc: "Hoe je in de loop van de tijd 'alles bij elkaar genomen' hebt beantwoord, van 1 tot 5.",
      byDimension: "Per dimensie",
      score: (latest) => `${latest}/5`,
    },
  },

  coachCard: {
    matchLabel: "% match",
  },

  coachPage: {
    sessionType: {
      video: "Videogesprek",
      inPerson: "Op locatie",
      phone: "Telefoongesprek",
    },
    empty: {
      title: "Mijn coach",
      intro: "Hier vind je jouw coach zodra je gematcht bent.",
      noCoachTitle: "Nog geen coach",
      noCoachBody: "Match eerst — dat kost ongeveer 5 minuten en begint met jouw verhaal, niet met een formulier.",
      getMatched: "Match starten",
    },
    header: {
      title: "Mijn coach",
      intro: (coachFirst) => `Profiel, planning en berichten — alles tussen jou en ${coachFirst} op één plek.`,
    },
    profile: {
      yearsExperience: "jaar ervaring",
      werkwijze: "Werkwijze",
      bestFitFor: "Past het best bij",
      bookSession: "Plan een gesprek",
      sendMessage: "Stuur een bericht",
    },
    nextSession: {
      label: "Volgend gesprek",
      manage: "Gesprekken beheren",
    },
    messages: {
      heading: (coachFirst) => `Berichten met ${coachFirst}`,
      empty: (coachFirst) => `Nog geen berichten. Zeg gedag, of deel wat je bezighoudt vóór je eerste gesprek — ${coachFirst} leest alles persoonlijk.`,
      send: "Versturen",
      disclaimer: "Antwoord meestal binnen één werkdag. Niet voor dringende zaken.",
    },
    a11y: {
      messageLabel: (coachFirst) => `Bericht aan ${coachFirst}`,
    },
    ph: {
      message: (coachFirst) => `Schrijf aan ${coachFirst}…`,
    },
  },

  common: {
    actions: {
      back: "Terug",
      goToDashboard: "Naar dashboard",
      cancel: "Annuleren",
    },
    datetime: {
      at: "om",
    },
  },

  dash: {
    tour: {
      match: {
        title: "Begin met je match",
        body: "Beantwoord een paar vragen — in je eigen woorden of hardop — en wij vinden de coach die echt bij je past.",
      },
      library: {
        title: "Verken de bibliotheek",
        body: "Korte, praktische artikelen en video's — gekozen op waar je mee bezig bent.",
      },
      checkin: {
        title: "Check elk kwartaal in",
        body: "Zes korte vragen. Persoonlijk voor jou — je werkgever ziet alleen anonieme teamtrends.",
      },
    },
    libraryTeaser: {
      title: "Uit de bibliotheek",
      browseAll: "Bekijk alles",
      meta: (category, minutes) => `${category} · ${minutes} min`,
    },
    checkinTeaser: {
      label: "Kwartaal-check-in",
      done: "Klaar voor dit kwartaal — je trends staan op de check-in-pagina.",
      todo: "Zes korte vragen over hoe werk nu voelt. Ongeveer een minuut.",
      viewTrends: "Bekijk mijn trends",
      start: "Start check-in",
    },
    privacyLine: "Je werkgever ziet nooit je individuele antwoorden — alleen anonieme inzichten op teamniveau.",
    trajectoryWith: (name, specialism) => `Traject met ${name} · ${specialism}`,
    stateA: {
      nextStepEyebrow: "Jouw volgende stap",
      checkinCta: "Check in",
    },
    coach: {
      nextSession: (day, time) => `Volgend gesprek: ${day} om ${time}`,
      noSession: "Nog geen gesprek gepland.",
      book: "Plan een gesprek",
      viewProfile: "Bekijk profiel",
      sendMessage: "Stuur een bericht",
      trajectoryLabel: "Traject",
      sessionCount: (n, total) => `gesprek ${n} van ${total}`,
    },
    wellbeing: {
      label: "Jouw welzijn",
      trendUp: "Je energie stijgt sinds je bent begonnen.",
      viewHistory: "Bekijk check-in-geschiedenis",
    },
    nudge: {
      label: "Uit je laatste gesprek",
      prompt: (habit) => `Je wilde de gewoonte ‘${habit}’ uitproberen. Hoe gaat het ermee?`,
      notedWell: "Genoteerd — mooi en stabiel. Mara hoort dat vast graag.",
      notedStruggling: "Genoteerd. Goed om te weten — neem het mee naar je volgende gesprek, of lees het artikel hieronder nog eens.",
      goingWell: "Gaat goed",
      struggling: "Moeizaam",
      reread: "Lees het artikel opnieuw",
    },
  },

  employerView: {
    a11y: {
      signOut: "Uitloggen",
    },
    header: {
      title: (company) => `${company} — Overzicht welzijn medewerkers`,
      subtitle: "Kwartaaloverzicht · deze week bijgewerkt",
    },
    kpis: {
      participation: "Deelname",
      avgWellbeingIndex: "Gemiddelde welzijnsindex",
      indexDelta: (delta) => `+${delta} t.o.v. vorig kwartaal`,
      sessionsQuarter: "Gesprekken dit kwartaal",
      checkinsGreen: "Check-ins in het groen",
      checkinSplit: (orange, red) => `${orange}% oranje · ${red}% rood`,
    },
    departments: {
      title: "Welzijn per afdeling",
      headcount: (count) => `${count} mensen`,
      minGroupNote: (size) => `Minimale groepsgrootte ${size} — individuele antwoorden worden nooit getoond.`,
    },
    trend: {
      title: "Welzijnstrend",
      note: "Gestage stijging sinds de start van het programma.",
    },
    matching: {
      title: "Matchkwaliteit",
      intakeCompletion: "Intake voltooid",
      rematchRate: "Rematch-percentage",
      rematchSub: "mensen die om een andere coach vroegen",
      avgSessionRating: "Gemiddelde gesprekbeoordeling",
      note: "We meten of matches werken — en verbeteren de matches die dat niet doen.",
    },
    footer: "Volledige werkgeversanalyses komen met het pilotprogramma.",
  },

  library: {
    minutesBadge: (minutes) => `${minutes} min`,
    header: {
      title: "Bibliotheek",
      subtitle: "Kort en praktisch — uitgekozen voor waar je mee bezig bent.",
    },
    search: {
      placeholder: "Zoek in de bibliotheek",
      ariaLabel: "Zoek in de bibliotheek",
      clearAria: "Zoekopdracht wissen",
    },
    filters: {
      all: "Alles",
    },
    recommended: {
      heading: "Aanbevolen voor jou",
    },
    noMatches: {
      title: "Geen resultaten",
      body: "Probeer een ander woord — of wis de zoekopdracht en blader per categorie.",
      action: "Zoekopdracht wissen",
    },
    kindLabel: (kind, minutes) => kind === "video" ? `Video · ${minutes} min` : `Artikel · ${minutes} min lezen`,
    detail: {
      backLink: "← Bibliotheek",
      relatedHeading: (category) => `Meer over ${category}`,
      articleMeta: (category, minutes) => `${category} · ${minutes} min lezen`,
      videoMeta: (category, minutes) => `${category} · Video · ${minutes} min`,
      articleFullVersion: "Dit artikel is beschikbaar in de volledige versie",
      videoFullVersion: "Video beschikbaar in de volledige versie",
      backToLibrary: "Terug naar de bibliotheek",
    },
    notFound: {
      title: "Die konden we niet vinden",
      body: "De link is misschien verouderd, of het item is verplaatst. De bibliotheek heeft nog genoeg dat je tijd waard is.",
    },
  },

  matchResult: {
    confirm: {
      heading: "Tevreden met deze match?",
      body: "Elke match wordt door een Gingermood matching-adviseur nagekeken voordat die definitief is — software stelt voor, een mens bevestigt.",
      cta: "Bevestig mijn coach",
      reviewing: "Je match is naar het Gingermood-team gestuurd voor controle — normaal ben je binnen één werkdag bevestigd.",
      confirmed: (name) => `${name} is bevestigd als jouw coach. Je vindt je volgende stappen op je dashboard.`,
      goToDashboard: "Ga naar je dashboard",
    },
  },

  sessions: {
    type: {
      video: "Videogesprek",
      inPerson: (region) => `Op locatie — ${region}`,
      phone: "Telefonisch",
    },
    slots: {
      showFewer: "Minder dagen tonen",
      showMore: "Meer dagen tonen",
    },
    rating: {
      stars: (n) => n === 1 ? "1 ster" : `${n} sterren`,
      ratedOutOf: (rating) => `Beoordeeld met ${rating} van 5`,
    },
    header: {
      title: "Gesprekken",
      subtitle: (coach) => `Plan tijd met ${coach} en kijk terug op wat je al hebt besproken.`,
    },
    empty: {
      subtitle: "Plannen kan zodra je een coach hebt.",
      title: "Plan gesprekken zodra je gematcht bent",
      body: "Gesprekken vinden plaats met jouw eigen coach — en die heb je nog niet. Doe eerst de korte intake; dat kost ongeveer 5 minuten, en een matching-adviseur controleert elke match voordat die bij je komt.",
      getMatched: "Word gematcht",
    },
    upcoming: {
      label: "Binnenkort",
      emptyTitle: "Nog niets gepland",
      emptyBody: (coach) => `Kies hieronder een tijd die jou schikt — ${coach} houdt op de meeste doordeweekse dagen ruimte vrij.`,
    },
    card: {
      durationWith: (min, coach) => `${min} min met ${coach}`,
      addToCalendar: "Toevoegen aan agenda",
    },
    reschedule: {
      action: "Verzetten",
      title: "Kies een nieuwe tijd",
      current: (day, time) => `Nu ${day} om ${time}.`,
    },
    book: {
      label: "Plan een gesprek",
      availableWith: (coach) => `Beschikbaar met ${coach}`,
      duration: "Gesprekken duren 60 minuten — via video, op locatie of telefonisch.",
    },
    past: {
      label: "Eerdere gesprekken",
      empty: "Nog geen afgeronde gesprekken — je overzicht bouwt zich hier op na het eerste.",
      fallbackTitle: (coach) => `Gesprek met ${coach}`,
      rateThanks: "Bedankt — dit helpt ons meten wat werkt.",
      ratePrompt: "Hoe was dit gesprek?",
    },
    bookingModal: {
      titleBooked: "Gesprek gepland",
      title: "Plan een gesprek",
      bookedWhen: (day, time) => `Gepland. ${day} om ${time}`,
      addedNote: "Toegevoegd aan je gesprekken — agendabestand hieronder.",
      addToCalendarIcs: "Toevoegen aan agenda (.ics)",
      close: "Sluiten",
      slotSummary: (day, time, coach) => `${day} om ${time} · 60 min met ${coach}`,
      noteLabel: "Notitie (optioneel)",
      confirm: "Planning bevestigen",
    },
    a11y: {
      sessionType: "Type gesprek",
    },
    ph: {
      note: (coach) => `Nog iets wat je ${coach} vooraf wilt laten weten?`,
    },
    cancel: {
      title: "Dit gesprek annuleren?",
      body: (coach) => `${coach} krijgt bericht. Geen kosten voor de demo.`,
      keep: "Behouden",
      confirm: "Gesprek annuleren",
    },
    ics: {
      title: (coach) => `Coachgesprek met ${coach}`,
      descFallback: "Coachgesprek gepland via Gingermood.",
      locationVideo: "Videogesprek (link volgt van Gingermood)",
      locationPhone: "Telefoongesprek",
    },
  },

  settings: {
    header: {
      title: "Instellingen",
      subtitle: "Jouw account, onze privacybeloftes en de demo-instellingen.",
    },
    account: {
      label: "Account",
      roleLabel: (role) => role === "employer" ? "Werkgever" : "Medewerker",
      demoNote: "Demo-account — gegevens zijn hier niet aan te passen.",
    },
    privacy: {
      label: "Privacy",
      answersTitle: "Jouw antwoorden blijven van jou",
      answersBody: "Je werkgever ziet alleen anonieme trends op teamniveau — nooit jouw individuele antwoorden.",
      minimizationTitle: "Dataminimalisatie",
      minimizationBody: "We bewaren alleen wat de match nodig heeft — niets extra, niets voor later.",
      deleteTitle: "Altijd te verwijderen",
      deleteBody: "Eén verzoek en alles wat we van je bewaren wordt gewist. Geen gedoe.",
      deletionNoted: "Genoteerd — in het echte product zouden je gegevens binnen 30 dagen gewist zijn.",
      requestDeletion: "Verwijdering aanvragen",
    },
    demo: {
      label: "Demo-instellingen",
      stageTitle: "Podiummodus",
      stageBody: "Draait de intake volledig offline op de deterministische engine — voor live presentaties met onbetrouwbare wifi.",
      resetTitle: "Demo-data resetten",
      resetBody: "Zet elk demo-account terug naar het ingestudeerde startpunt.",
      resetButton: "Demo-data resetten",
      shortcut: "Sneltoets: houd Shift ingedrukt, druk R en dan D.",
    },
    signout: {
      note: "Klaar hier? Je kunt weer inloggen met elk demo-account.",
      button: "Uitloggen",
    },
    deleteModal: {
      title: "Verwijdering aanvragen",
      body: "In het echte product start dit de formele verwijdering van je antwoorden, match- en gespreksgeschiedenis. In deze demo verlaat er sowieso niets je browser.",
      confirm: "Verwijdering aanvragen",
    },
    resetModal: {
      title: "Demo-data resetten",
      body: "Dit zet Emma, Daan en het HR-account terug naar hun beginstaat. Boekingen, check-ins en berichten uit deze sessie worden gewist.",
      confirm: "Demo resetten",
    },
  },

  tour: {
    a11y: {
      dialog: "Korte rondleiding",
    },
    progress: (current, total) => `${current} van ${total}`,
    skip: "Tour overslaan",
    nextOrDone: (last) => last ? "Klaar" : "Volgende",
  },
};
