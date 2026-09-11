/**
 * Centralised English copy for the PLATFORM shell (marketing site, entry flows,
 * dashboard chrome). The Dutch intake copy stays in lib/copy.ts and is untouched.
 *
 * Everything here is written for a later Dutch translation: keep it structured,
 * avoid string concatenation of meaning, and keep claims honest (see PRODUCT.md
 * + the brief §8): no guaranteed wellbeing/absenteeism outcomes, no "fit % proves
 * success", no invented session allowance, no invented certifications, no
 * production-grade-confidentiality claims, and human review is described as
 * SIMULATED in this demo.
 */

/**
 * Depth of guidance — a range of conversations, not final. Defined once and
 * reused in the hero subtext, the "How it works" step 3, and the meta
 * description (see app/page.tsx). TODO: confirm session range with Dickey.
 */
export const SESSION_RANGE = "five to ten";
const SESSION_RANGE_CAP = SESSION_RANGE.charAt(0).toUpperCase() + SESSION_RANGE.slice(1);

export const en = {
  brand: "Gingermood",

  nav: {
    employers: "For employers",
    employees: "For employees",
    howItWorks: "How it works",
    about: "About",
    privacy: "Privacy",
    login: "Log in",
  },

  // A small, honest label reused wherever demo/illustrative content appears.
  demo: {
    illustrative: "Illustrative demo data",
    preview: "Demo preview",
    fictional: "Fictional example",
  },

  // ── Homepage — primarily helps a prospective employer evaluate the service,
  //    while making the employee route easy to find. ────────────────────────────
  home: {
    eyebrow: "Personal guidance, carefully matched",
    // H1 is two sentences; the second renders on its own line at every breakpoint
    // (EXCEPTION 1) via a <br> in app/page.tsx.
    h1a: "Not just any psychologist or coach.",
    h1b: "The right one.",
    subtitle:
      `We match each person to one of our [X] psychologists and coaches, based on what they actually need. Then we take the time: ${SESSION_RANGE} conversations of at least an hour, to understand what's really going on and to do something about it.`,
    primaryCta: "Explore employer access",
    secondaryCta: "I have access through my employer",
    proofLine:
      "[X] BIG/NIP-registered psychologists and NOBCO coaches · [98% — definition pending] · Trusted by [client names — confirm permission]",
    metaTitle: "Gingermood — the right psychologist or coach",
    metaDescription: `Gingermood matches employees to the right psychologist or coach for ${SESSION_RANGE} in-depth conversations. Carefully matched on what they need, and checked by a person.`,

    audience: {
      title: "Where would you like to start?",
      employer: {
        label: "For employers",
        body: "Annual access for your employees to carefully matched psychologists and coaches, for in-depth conversations of at least an hour. You see anonymous, aggregate reporting — never individual answers.",
        cta: "See how it works for organisations",
        href: "/employers",
      },
      employee: {
        label: "For employees",
        body: "Your employer provides access. We match you to a psychologist or coach who fits what you're going through, for a series of full-hour conversations.",
        cta: "See what's available to you",
        href: "/employees",
      },
    },

    steps: {
      title: "How it works",
      items: [
        {
          title: "Tell us what's going on",
          body: "A short, adaptive intake — in your own words, typed or spoken. You don't need a neatly formulated question to begin.",
        },
        {
          title: "We find the right psychologist or coach",
          body: "Your situation is matched to the actual expertise of our psychologists and coaches — not to a personality type, and not to whoever is available first. A Gingermood matching advisor checks every match before it reaches you.",
        },
        {
          title: "Take the time to work on it",
          body: `${SESSION_RANGE_CAP} conversations of at least an hour, with the same person. Enough time to get past the surface and change something. Between conversations you can message your psychologist or coach, and periodic check-ins help you see your progress.`,
        },
      ],
    },

    principles: {
      title: "What Gingermood is built on",
      items: [
        {
          title: "The right person, not the first available",
          body: "We match a person's specific situation to the real expertise of our psychologists and coaches. Software proposes; a Gingermood matching advisor confirms.",
        },
        {
          title: "Depth, not a quick fix",
          body: "Fast to start, never rushed. Full-hour conversations leave room to get to the root of things, not just the surface.",
        },
        // TODO: privacy wording pending review by Franka. Do not edit without her sign-off.
        {
          title: "Private by intent",
          body: "Individual answers are meant for the employee alone. Employers see only anonymous, aggregate patterns — never a single person's answers.",
        },
      ],
    },

    closing: {
      title: "Bring considered personal guidance to your organisation",
      body: "We'll walk you through annual access, matching, and what your team would see — and what they wouldn't.",
      cta: "Discuss your organisation's needs",
    },
  },

  // ── /employers — public information for the buyer. ───────────────────────────
  employers: {
    eyebrow: "For employers",
    title: "Ongoing coaching access for the people you cover",
    subtitle:
      "Give your employees a considered way to find the right coach when they need one — with matching on real needs and a person involved throughout.",
    primaryCta: "Discuss your organisation's needs",
    secondaryCta: "See the employee experience",

    value: {
      title: "What annual access includes",
      items: [
        {
          title: "Ongoing access for covered employees",
          body: "An annual arrangement gives your covered people access to intake and matching whenever a need comes up — no one-off referral required.",
        },
        {
          title: "Individual development and support",
          body: "From an early, unformed need to a clear coaching question — employees can seek support without having to frame it perfectly first.",
        },
        {
          title: "Human coaching, matched to needs",
          body: "Professional coaches, matched to a person's specific situation and the coach's real competencies, with a matchmaker confirming the fit.",
        },
        {
          title: "Anonymous, aggregate reporting",
          body: "You see participation and well-being at the team level, above a minimum group size — never an individual's answers or sessions.",
        },
      ],
    },

    routes: {
      title: "Two ways to work with Gingermood",
      selected: {
        label: "Support for selected employees",
        body: "You already know who you want to support. Those employees are supported through our existing, separate platform.",
        note: "Handled outside this demo.",
      },
      subscription: {
        label: "Organisation-wide subscription access",
        body: "Ongoing access for all your covered employees, with a company-wide allowance of sessions and employer-paid sessions beyond it. This new platform is where that journey will live.",
        note: "This demo previews the subscription platform.",
      },
    },

    // Commercial framing — deliberately does NOT state a session allowance.
    commercial: {
      title: "How access is arranged",
      body: "Annual access is priced per covered employee — currently around €150 per person per year. A company-wide allowance of coaching sessions is included, with additional employer-paid sessions available after it is used. We'll size the arrangement with you.",
      note: "The included number of sessions is set per organisation — we don't quote a fixed allowance here.",
    },

    closing: {
      title: "Let's talk about your organisation",
      body: "Tell us a little about your team and what you're trying to support. We'll take it from there.",
      cta: "Discuss your organisation's needs",
    },
  },

  // ── /employees — public information for the covered employee. ────────────────
  employees: {
    eyebrow: "For employees",
    title: "Find the coach who fits your situation",
    subtitle:
      "Your employer gives you access to Gingermood. When something's on your mind — big or small, clear or still forming — you can find the right support.",
    primaryCta: "Activate your access",
    secondaryCta: "Log in",

    how: {
      title: "How access through your employer works",
      items: [
        {
          title: "Access is provided by your organisation",
          body: "Your employer covers your access. You'll usually receive an invitation link; you don't arrange anything with Gingermood directly.",
        },
        {
          title: "Start from wherever you are",
          body: "You don't need a clearly formulated coaching question. A short, adaptive intake helps surface what would actually help.",
        },
        {
          title: "Talk to a real person",
          body: "Intake includes the offer of a conversation of at least ten minutes with a real person. You can take it, or skip it and continue.",
        },
      ],
    },

    afterActivation: {
      title: "What happens after you activate",
      items: [
        "You do a short intake — in your own words, typed or spoken.",
        "You're matched to a coach based on your needs and their competencies.",
        "You book sessions, keep a thread with your coach, and check in over time.",
      ],
    },

    // Placed near the main action — concise, and honest about the demo.
    confidentiality: {
      title: "What your employer can and can't see",
      body: "Your intake answers and sessions are meant for you and your coach. Your employer sees only anonymous, aggregate patterns across a large enough group — never your individual answers.",
      demoNote:
        "This is a demonstration. It shows how confidentiality is intended to work; it does not provide production-grade data protection.",
    },

    invitation: {
      title: "Don't have an invitation yet?",
      body: "Access comes from your employer. If you think your organisation offers Gingermood but you haven't received a link, ask your HR or people team — they can send you an invitation.",
    },
  },

  // ── /welcome/[companySlug] — employer-branded invitation → activation. ───────
  welcome: {
    providedThrough: (org: string) => `Provided through ${org}`,
    eyebrow: "You're invited",
    title: "Coaching support, whenever you need it",
    subtitle:
      "Your organisation gives you access to Gingermood — a considered way to find the right coach and keep the support going over time.",
    support: {
      title: "What's available to you",
      items: [
        "A short, adaptive intake — start even without a clear question.",
        "A coach matched to your specific needs, confirmed by a real person.",
        "Sessions, a thread with your coach, and periodic check-ins.",
      ],
      note: "The number of sessions included is set by your organisation — this demo doesn't show a fixed amount.",
    },
    confidentiality:
      "Your answers and sessions are meant for you and your coach. Your organisation sees only anonymous, aggregate patterns — never your individual answers.",
    activateCta: "Activate my account",
    loginPrompt: "Already activated?",
    loginCta: "Log in",
    demoLabel: "Demo activation — no real account is created",

    // Recovery states for missing / invalid / expired invitations.
    invalid: {
      title: "This invitation link isn't valid",
      body: "The link may be mistyped or the company isn't part of this demo. You can still explore how access works, or ask your employer for a fresh invitation.",
      primaryCta: "See how access works",
      secondaryCta: "Try a demo company",
    },
    expired: {
      title: "This invitation has expired",
      body: "Invitation links are time-limited. Ask your HR or people team to send you a new one — it only takes a moment.",
      primaryCta: "See how access works",
      secondaryCta: "Try a demo company",
    },
  },

  // ── Login / activation entry. ───────────────────────────────────────────────
  login: {
    title: "Welcome back",
    subtitle: "Log in to continue with your coach.",
    emailLabel: "Work email",
    passwordLabel: "Password",
    submit: "Log in",
    activatePrompt: "Have an invitation from your employer?",
    activateCta: "Activate your access",
    demoAccounts: "Demo accounts",
    demoNote: "Presenter shortcuts — these sign you straight into a seeded view.",
    returnNote: (where: string) => `You'll return to ${where} after logging in.`,
  },

  register: {
    title: "Activate your access",
    subtitle: "A few details and you're in. Access is provided by your employer.",
    nameLabel: "Full name",
    emailLabel: "Work email",
    passwordLabel: "Password",
    submit: "Activate my account",
    loginPrompt: "Already have an account?",
    loginCta: "Log in",
    // Honest note: no self-service employer role in the normal flow.
    employerNote:
      "Setting up coaching for an organisation? That's arranged with our team — talk to us about employer access.",
    employerCta: "Employer access",
  },

  // ── Enquiry (employer sales action). Explicitly a demo — never claims sent. ──
  enquiry: {
    title: "Discuss your organisation's needs",
    subtitle:
      "Tell us a little about your team and what you'd like to support. This demo doesn't send anything — it shows how the enquiry would work.",
    orgLabel: "Organisation",
    nameLabel: "Your name",
    emailLabel: "Work email",
    sizeLabel: "Roughly how many people would this cover?",
    messageLabel: "What would you like to support? (optional)",
    submit: "Preview enquiry",
    demoBanner: "Demo enquiry — nothing is sent and no data is stored.",
    // Shown after the demo "submit" — honest, never "we've received your message".
    previewTitle: "This is what we'd receive",
    previewNote:
      "In the live product this would reach our team. In this demo it stays on your screen and is not sent or stored.",
    reset: "Edit and preview again",
  },

  // ── Employee dashboard entry actions (§6). ──────────────────────────────────
  dashboard: {
    greetingNew: "Let's find the support that fits you.",
    greetingMatched: (coach: string) => `Your coaching with ${coach}`,
    actions: {
      checkin: {
        title: "Check in with yourself",
        body: "A few quick questions on how work feels right now. About a minute — just for you.",
      },
      findSupport: {
        title: "Find the right support",
        body: "Start the intake and get matched to a coach. You don't need a clear question to begin — or to have checked in first.",
      },
      viewCoaching: {
        title: "View your coaching",
        body: "Your coach, your next session, and where you are in your trajectory.",
      },
    },
    // Reused reassurance — honest about the human step being simulated here.
    humanNote: "Software proposes the match; a Gingermood matchmaker confirms it.",
    reviewSimulatedNote: "In this demo the review step is simulated so the flow completes on stage.",
  },

  // ── Organisation view / role switch (§5). ───────────────────────────────────
  org: {
    switchToPersonal: "My support",
    switchToOrg: "Organisation management",
    switchLabel: "View",
    personalHiddenNote: "This is the organisation view. Individual answers and sessions are never shown here.",
  },

  // ── Shared honest framing about the demo's confidentiality. ─────────────────
  trust: {
    privacyShort:
      "Individual answers stay with the employee and their coach; employers see only anonymous, aggregate patterns.",
    demoDisclaimer:
      "This is a product demo with fictional people and illustrative data. It is not a production system and does not provide production-grade confidentiality.",
  },

  // ── Signed-in app chrome (dashboard shell). ─────────────────────────────────
  shell: {
    nav: {
      home: "Home",
      coach: "My coach",
      sessions: "Sessions",
      library: "Library",
      checkin: "Check-in",
      settings: "Settings",
    },
    signOut: "Sign out",
    demoEnv: "Demo environment · illustrative product",
    notifications: {
      title: "Notifications",
      markAllRead: "Mark all read",
      empty: "Nothing here yet.",
    },
    footer: {
      blurb: "The right psychologist or coach for every person. Matched on real needs — with a person involved.",
      explore: "Explore",
      aboutTitle: "About this site",
      aboutBody: "This is a product demo. All people, companies and statistics shown are fictional and illustrative — it is not a production system.",
      location: "Gingermood · Amsterdam, The Netherlands",
    },
  },

  // ── Language switcher. ──────────────────────────────────────────────────────
  lang: {
    label: "Language",
    en: "English",
    nl: "Nederlands",
  },

  // ── Batch 1: marketing pages, metadata, chrome, forms, a11y. ──
  a11y: {
    heroImageAlt: "A psychologist or coach in conversation with a client at a table",
    mainNav: "Main",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    footer: "Footer",
    logoHome: "Gingermood — home",
  },

  about: {
    eyebrow: "About Gingermood",
    h1: "Matching people with coaches, for over a decade",
    story: {
      p1: "Gingermood started more than ten years ago in the Netherlands, out of a simple irritation: coaching directories were everywhere, but a directory is not a match. People picked a coach from a photo and a list of certificates — and too often it just didn't click.",
      p2: "So we did it differently. We listened to people's stories — long phone calls, careful notes — and introduced them to the one coach we genuinely believed would fit. It worked. It still does.",
      p3: "Today software helps us listen at scale: the intake adapts to your answers and proposes coaches from our network. But the principle hasn't moved an inch — software proposes, people confirm. A matchmaker from our team reviews every single match before it reaches you.",
    },
    mission: {
      label: "Our mission",
      body: "The right coach for every person. Not the available one, not the nearest one — the right one.",
    },
    values: {
      label: "What we hold ourselves to",
      listen: {
        title: "Listen properly",
        body: "Your story comes first, in your own words. We'd rather ask one more question than guess.",
      },
      match: {
        title: "Match carefully",
        body: "Fit beats availability. We propose the coach we believe in — and a human checks our work.",
      },
      measure: {
        title: "Measure honestly",
        body: "We follow up on whether coaching actually helped. When a match isn't working, we say so and fix it.",
      },
    },
    team: {
      label: "The team behind your match",
      role1: "Founder & head matchmaker",
      line1: "Matched our first hundred clients by phone, notebook in hand.",
      role2: "Coach network lead",
      line2: "Interviews every coach who joins us — and turns most applicants away.",
      role3: "Matchmaker",
      line3: "Reviews proposed matches daily. Known for overruling the software.",
      role4: "Product & research",
      line4: "Builds the matching engine, then checks whether it actually helped.",
      disclaimer: "Team members shown are illustrative for this demo.",
    },
    cta: {
      title: "Curious who we'd match you with?",
      body: "Tell us your story — it takes about five minutes — and find out.",
      button: "Get started",
    },
  },

  components: {
    confirmedBadge: "Reviewed & confirmed by the Gingermood team",
    illustrativeTag: "Illustrative data",
  },

  forms: {
    emailPlaceholder: "you@company.nl",
    passwordPlaceholder: "Your password",
    namePlaceholder: "Sanne de Vries",
    passwordHint: "At least 6 characters",
    orgPlaceholder: "Nova Health Group",
    sizePlaceholder: "e.g. 250",
  },

  howItWorks: {
    eyebrow: "How it works",
    h1: "From your story to the right coach, in three steps",
    subtitle: "No directories to scroll through, no coach assigned because they happened to have a free slot. Here's what actually happens.",
    step1: {
      title: "Tell us your story",
      body: "It starts with a short intake — about five minutes. You tell us what's going on in your own words, and the next question adapts to what you just said. Prefer talking over typing? Just speak; the intake supports voice.",
      b1: "Adapts to your answers — no two intakes are the same",
      b2: "Type or talk, whatever feels natural",
      b3: "Your own words, not a form full of checkboxes",
    },
    step2: {
      title: "We match — a human confirms",
      body: "Our software compares your story against our network of professional coaches: what you need help with, how you like to work, and the practical things — language, region, online or in person. It proposes the best fit. Then a Gingermood matchmaker reads that proposal and confirms it, or overrules it. No match reaches you unchecked.",
      b1: "Matched on needs and working style, not on availability",
      b2: "Practical fit included: language, region, online or in person",
      b3: "Every match reviewed by a human before you see it",
    },
    step3: {
      title: "Grow with your coach",
      body: "You meet, you talk, you get to work. Book sessions the way they fit your week — video, in person or by phone. Between sessions there's a library of short, practical reads, and a quarterly check-in tracks how you're actually doing. And if the first session tells you the fit isn't right after all? Say so — we'll rematch you, no questions asked.",
      b1: "Sessions by video, in person or by phone",
      b2: "A library of short, practical reads between sessions",
      b3: "Quarterly check-ins, so progress is measured — not assumed",
    },
    why: {
      label: "Why matching matters",
      p1: "Research shows the fit between you and your professional is one of the strongest predictors of success — so we treat matching as the product, not an afterthought.",
      p2: "Stronger than the method, stronger than the technique: whether you click with the person across the table. It's the part we've spent over a decade getting right — first by hand, now with software that a human still double-checks.",
    },
    cta: {
      title: "See who fits you",
      body: "Five minutes, your own words, and a human checks the match before you meet.",
      getStartedLink: "Get started",
      privacyLink: "Read our privacy promises",
    },
  },

  meta: {
    about: {
      title: "About — Gingermood",
      description: "Gingermood has matched people with coaches for over a decade. Software proposes, people confirm — that principle hasn't moved an inch.",
    },
    howItWorks: {
      title: "How it works — Gingermood",
      description: "From your story to the right coach in three steps: an intake that adapts to you, a match proposed by software and confirmed by a human, and a trajectory we actually measure.",
    },
    privacy: {
      title: "Privacy — Gingermood",
      description: "Coaching only works when you can be honest. Our privacy promises in plain language: your answers stay yours, employers see trends — never people.",
    },
    root: {
      title: "Gingermood — the right psychologist or coach",
      description: "Personal guidance that starts with a careful match, checked by a person. Product demo with illustrative data.",
    },
    employers: {
      title: "For employers — Gingermood",
      description: "Ongoing access to psychologists and coaches for the people you cover: individual matching on real needs, a person involved, and anonymous aggregate reporting.",
    },
    employees: {
      title: "For employees — Gingermood",
      description: "Your employer provides access to Gingermood. Find the psychologist or coach who fits your situation — and see what your employer can and can't see.",
    },
  },

  privacy: {
    promise1: {
      title: "Your answers stay yours",
      body: "What you tell us in the intake, what you discuss with your coach, your check-in scores — none of it is ever visible to your employer. Not to HR, not to your manager, not in any report.",
    },
    promise2: {
      title: "Employers see trends, never people",
      body: "Employers receive anonymised, aggregated insights only — how teams are doing as a whole. If a group has fewer than 15 people, we show nothing at all, so no one can be singled out.",
    },
    promise3: {
      title: "We only ask what we need",
      body: "No tracking profiles, no data sold, no hoarding. We collect what's needed to match you well and support your trajectory — and nothing more than that.",
    },
    promise4: {
      title: "Delete your data, anytime",
      body: "You can delete your account and everything in it whenever you want, straight from your settings. Gone means gone — removed from our systems, not just hidden from view.",
    },
    eyebrow: "Privacy",
    h1: "Privacy, in plain language",
    subtitle: "Coaching only works when you can be completely honest — about your work, your manager, yourself. So privacy isn't the fine print here; it's part of the product. These are our promises.",
    practice: {
      title: "What this means in practice",
      body: "Say what you actually think in your intake and your sessions. Your employer pays for the coaching, but they never look over your shoulder — that boundary is built into the product, not bolted on.",
      link: "See how matching works",
    },
  },

  // ── Batch 2: authenticated app. ──
  charts: {
    a11y: {
      trend: "Trend chart",
      distribution: (g: string | number, o: string | number, r: string | number): string => `${g}% green, ${o}% orange, ${r}% red`,
    },
    zone: {
      green: "Doing well",
      orange: "Keep an eye",
      red: "Needs attention",
    },
  },

  checkin: {
    questions: {
      energy: {
        label: "How is your energy at work lately?",
        low: "Running on empty",
        high: "Fully charged",
        short: "Energy",
      },
      workload: {
        label: "How manageable is your workload?",
        low: "Drowning in it",
        high: "Comfortably manageable",
        short: "Workload",
      },
      balance: {
        label: "How is the balance between work and the rest of life?",
        low: "Work takes everything",
        high: "Healthy balance",
        short: "Balance",
      },
      sleep: {
        label: "How are you sleeping?",
        low: "Poorly, most nights",
        high: "Well, most nights",
        short: "Sleep",
      },
      connection: {
        label: "How connected do you feel to the people you work with?",
        low: "Quite isolated",
        high: "Genuinely connected",
        short: "Connection",
      },
      overall: {
        label: "All things considered, how are you doing at work?",
        low: "Struggling",
        high: "Doing well",
        short: "Overall",
      },
    },
    dimensionNoun: {
      energy: "energy",
      workload: "workload",
      balance: "work-life balance",
      sleep: "sleep",
      connection: "connection with colleagues",
      overall: "overall picture",
    },
    weakPhrase: {
      energy: "your energy is running low",
      workload: "workload is creeping up on you",
      balance: "work is leaking into the rest of life",
      sleep: "sleep is coming up short",
      connection: "you're feeling more isolated than you'd like",
      overall: "work feels heavier than it should right now",
    },
    privacyCard: {
      label: "Private by design",
      body: "Your answers are personal to you. Your employer only ever sees anonymous, team-level trends — never your individual answers.",
      line: "Your answers are personal to you — your employer only ever sees anonymous, team-level trends.",
    },
    helpCard: {
      meta: (kind: string | number, minutes: string | number): string => `${kind === "video" ? "Video" : "Article"} · ${minutes} min`,
    },
    employerEmpty: {
      title: "Check-ins live in the employee view",
      body: "The quarterly check-in is personal to each employee. Employers only ever see anonymous, team-level trends — sign in with an employee account to try it.",
    },
    flow: {
      progress: (current: string | number, total: string | number): string => `Question ${current} of ${total}`,
    },
    a11y: {
      option: (n: string | number): string => `${n} of 5`,
    },
    result: {
      thanks: (name: string | number): string => `Thanks, ${name}`,
      subtitle: "That's this quarter done. Here's what stood out.",
      noticed: "What we noticed",
      summarySteady: "Things look steady across the board — nothing is flashing orange. Keep doing whatever you're doing, and we'll ask again next quarter.",
      solidHigh: "look solid",
      solidBest: "are holding up best",
      summary: (noun0: string | number, noun1: string | number, phrase: string | number, weak: string | number): string => `Your ${noun0} and ${noun1} ${phrase}. At the same time, ${weak} — worth keeping an eye on before it grows.`,
      help: "Two things that might help",
      backToOverview: "Back to overview",
    },
    intro: {
      title: "Wellbeing check-in",
      subtitle: "Six quick questions, about a minute. Personal to you.",
      firstTitle: "Your first check-in",
      firstBody: "Every quarter we ask the same six questions — energy, workload, balance, sleep, connection, and how you're doing overall. Answer honestly; there are no wrong answers. Over time this builds your personal trend, so you spot what's shifting before it becomes a problem.",
      start: "Start check-in",
      again: "Check in again",
      lastCheckin: (ago: string | number): string => `Last check-in ${ago}.`,
    },
    trend: {
      label: "Your trend",
      desc: "How you answered 'all things considered' over time, from 1 to 5.",
      byDimension: "By dimension",
      score: (latest: string | number): string => `${latest}/5`,
    },
  },

  coachCard: {
    matchLabel: "% match",
  },

  coachPage: {
    sessionType: {
      video: "Video call",
      inPerson: "In person",
      phone: "Phone call",
    },
    empty: {
      title: "My coach",
      intro: "This is where your coach lives once you're matched.",
      noCoachTitle: "No coach yet",
      noCoachBody: "Get matched first — it takes about 5 minutes and starts with your story, not a form.",
      getMatched: "Get matched",
    },
    header: {
      title: "My coach",
      intro: (coachFirst: string | number): string => `Profile, planning and messages — everything between you and ${coachFirst} in one place.`,
    },
    profile: {
      yearsExperience: "yrs experience",
      werkwijze: "Werkwijze",
      bestFitFor: "Best fit for",
      bookSession: "Book a session",
      sendMessage: "Send a message",
    },
    nextSession: {
      label: "Next session",
      manage: "Manage sessions",
    },
    messages: {
      heading: (coachFirst: string | number): string => `Messages with ${coachFirst}`,
      empty: (coachFirst: string | number): string => `No messages yet. Say hello, or share what's on your mind before your first session — ${coachFirst} reads everything personally.`,
      send: "Send",
      disclaimer: "Replies usually within one working day. Not for urgent matters.",
    },
    a11y: {
      messageLabel: (coachFirst: string | number): string => `Message to ${coachFirst}`,
    },
    ph: {
      message: (coachFirst: string | number): string => `Write to ${coachFirst}…`,
    },
  },

  common: {
    actions: {
      back: "Back",
      goToDashboard: "Go to dashboard",
      cancel: "Cancel",
    },
    datetime: {
      at: "at",
    },
  },

  dash: {
    tour: {
      match: {
        title: "Start with your match",
        body: "Answer a few questions — in your own words or out loud — and we find the coach who actually fits you.",
      },
      library: {
        title: "Browse the library",
        body: "Short, practical reads and videos — picked for what you're working on.",
      },
      checkin: {
        title: "Check in each quarter",
        body: "Six quick questions. Personal to you — your employer only ever sees anonymous team trends.",
      },
    },
    libraryTeaser: {
      title: "From the library",
      browseAll: "Browse all",
      meta: (category: string | number, minutes: string | number): string => `${category} · ${minutes} min`,
    },
    checkinTeaser: {
      label: "Quarterly check-in",
      done: "Done for this quarter — your trends are on the check-in page.",
      todo: "Six quick questions about how work feels right now. About a minute.",
      viewTrends: "View my trends",
      start: "Start check-in",
    },
    privacyLine: "Your employer never sees your individual answers — only anonymous, team-level insights.",
    trajectoryWith: (name: string | number, specialism: string | number): string => `Trajectory with ${name} · ${specialism}`,
    stateA: {
      nextStepEyebrow: "Your next step",
      checkinCta: "Check in",
    },
    coach: {
      nextSession: (day: string | number, time: string | number): string => `Next session: ${day} at ${time}`,
      noSession: "No session booked yet.",
      book: "Book a session",
      viewProfile: "View profile",
      sendMessage: "Send a message",
      trajectoryLabel: "Trajectory",
      sessionCount: (n: string | number, total: string | number): string => `session ${n} of ${total}`,
    },
    wellbeing: {
      label: "Your wellbeing",
      trendUp: "Your energy is trending up since you started.",
      viewHistory: "View check-in history",
    },
    nudge: {
      label: "From your last session",
      prompt: (habit: string | number): string => `You wanted to try the ‘${habit}’ habit. How’s it going?`,
      notedWell: "Noted — nice and steady. Mara will be glad to hear it.",
      notedStruggling: "Noted. That's useful to know — bring it to your next session, or revisit the article below.",
      goingWell: "Going well",
      struggling: "Struggling",
      reread: "Re-read the article",
    },
  },

  employerView: {
    a11y: {
      signOut: "Sign out",
    },
    header: {
      title: (company: string | number): string => `${company} — Workforce wellbeing overview`,
      subtitle: "Quarterly view · updated this week",
    },
    kpis: {
      participation: "Participation",
      avgWellbeingIndex: "Average wellbeing index",
      indexDelta: (delta: string | number): string => `+${delta} vs last quarter`,
      sessionsQuarter: "Sessions this quarter",
      checkinsGreen: "Check-ins in the green",
      checkinSplit: (orange: string | number, red: string | number): string => `${orange}% orange · ${red}% red`,
    },
    departments: {
      title: "Wellbeing by department",
      headcount: (count: string | number): string => `${count} people`,
      minGroupNote: (size: string | number): string => `Minimum group size ${size} — individual answers are never shown.`,
    },
    trend: {
      title: "Wellbeing trend",
      note: "Steady upward drift since the programme started.",
    },
    matching: {
      title: "Matching quality",
      intakeCompletion: "Intake completion",
      rematchRate: "Re-match rate",
      rematchSub: "people who asked for a different coach",
      avgSessionRating: "Average session rating",
      note: "We measure whether matches work — and fix the ones that don't.",
    },
    footer: "Full employer analytics arrive with the pilot programme.",
  },

  library: {
    minutesBadge: (minutes: string | number): string => `${minutes} min`,
    header: {
      title: "Library",
      subtitle: "Short, practical — picked for what you're working on.",
    },
    search: {
      placeholder: "Search the library",
      ariaLabel: "Search the library",
      clearAria: "Clear search",
    },
    filters: {
      all: "All",
    },
    recommended: {
      heading: "Recommended for you",
    },
    noMatches: {
      title: "No matches",
      body: "Try another word — or clear the search and browse by category.",
      action: "Clear search",
    },
    kindLabel: (kind: string | number, minutes: string | number): string => kind === "video" ? `Video · ${minutes} min` : `Article · ${minutes} min read`,
    detail: {
      backLink: "← Library",
      relatedHeading: (category: string | number): string => `More on ${category}`,
      articleMeta: (category: string | number, minutes: string | number): string => `${category} · ${minutes} min read`,
      videoMeta: (category: string | number, minutes: string | number): string => `${category} · Video · ${minutes} min`,
      articleFullVersion: "This article is available in the full version",
      videoFullVersion: "Video available in the full version",
      backToLibrary: "Back to the library",
    },
    notFound: {
      title: "We couldn't find that one",
      body: "The link may be out of date, or the item has moved. The library has plenty more worth your time.",
    },
  },

  matchResult: {
    confirm: {
      heading: "Happy with this match?",
      body: "Every match is reviewed by a Gingermood matcher before it's final — software proposes, a human confirms.",
      cta: "Confirm my coach",
      reviewing: "Your match has been sent to the Gingermood team for review — normally you're confirmed within one working day.",
      confirmed: (name: string | number): string => `${name} is confirmed as your coach. You'll find your next steps on your dashboard.`,
      goToDashboard: "Go to your dashboard",
    },
  },

  sessions: {
    type: {
      video: "Video call",
      inPerson: (region: string | number): string => `In person — ${region}`,
      phone: "Phone",
    },
    slots: {
      showFewer: "Show fewer days",
      showMore: "Show more days",
    },
    rating: {
      stars: (n: string | number): string => n === 1 ? "1 star" : `${n} stars`,
      ratedOutOf: (rating: string | number): string => `Rated ${rating} out of 5`,
    },
    header: {
      title: "Sessions",
      subtitle: (coach: string | number): string => `Plan time with ${coach}, and look back at what you’ve already covered.`,
    },
    empty: {
      subtitle: "Booking opens once you have a coach.",
      title: "Book sessions once you're matched",
      body: "Sessions happen with your own coach — and you don't have one yet. Do the short intake first; it takes about 5 minutes, and a human checks every match before it reaches you.",
      getMatched: "Get matched",
    },
    upcoming: {
      label: "Upcoming",
      emptyTitle: "Nothing booked",
      emptyBody: (coach: string | number): string => `Pick a time below that suits you — ${coach} keeps slots open most weekdays.`,
    },
    card: {
      durationWith: (min: string | number, coach: string | number): string => `${min} min with ${coach}`,
      addToCalendar: "Add to calendar",
    },
    reschedule: {
      action: "Reschedule",
      title: "Pick a new time",
      current: (day: string | number, time: string | number): string => `Currently ${day} at ${time}.`,
    },
    book: {
      label: "Book a session",
      availableWith: (coach: string | number): string => `Available with ${coach}`,
      duration: "Sessions are 60 minutes — video, in person, or by phone.",
    },
    past: {
      label: "Past sessions",
      empty: "No completed sessions yet — your history builds here after the first one.",
      fallbackTitle: (coach: string | number): string => `Session with ${coach}`,
      rateThanks: "Thanks — this helps us measure what works.",
      ratePrompt: "How was this session?",
    },
    bookingModal: {
      titleBooked: "Session booked",
      title: "Book a session",
      bookedWhen: (day: string | number, time: string | number): string => `Booked. ${day} at ${time}`,
      addedNote: "Added to your sessions — calendar file below.",
      addToCalendarIcs: "Add to calendar (.ics)",
      close: "Close",
      slotSummary: (day: string | number, time: string | number, coach: string | number): string => `${day} at ${time} · 60 min with ${coach}`,
      noteLabel: "Note (optional)",
      confirm: "Confirm booking",
    },
    a11y: {
      sessionType: "Session type",
    },
    ph: {
      note: (coach: string | number): string => `Anything you want ${coach} to know beforehand?`,
    },
    cancel: {
      title: "Cancel this session?",
      body: (coach: string | number): string => `${coach} will be notified. No costs for the demo.`,
      keep: "Keep it",
      confirm: "Cancel session",
    },
    ics: {
      title: (coach: string | number): string => `Coaching session with ${coach}`,
      descFallback: "Coaching session booked via Gingermood.",
      locationVideo: "Video call (link follows from Gingermood)",
      locationPhone: "Phone call",
    },
  },

  settings: {
    header: {
      title: "Settings",
      subtitle: "Your account, our privacy promises, and the demo controls.",
    },
    account: {
      label: "Account",
      roleLabel: (role: string | number): string => role === "employer" ? "Employer" : "Employee",
      demoNote: "Demo account — details are not editable here.",
    },
    privacy: {
      label: "Privacy",
      answersTitle: "Your answers stay yours",
      answersBody: "Your employer only sees anonymous, team-level trends — never your individual answers.",
      minimizationTitle: "Data minimization",
      minimizationBody: "We store only what matching needs — nothing extra, nothing for later.",
      deleteTitle: "Delete anytime",
      deleteBody: "One request and everything we hold about you is erased. No hoops.",
      deletionNoted: "Noted — in the live product your data would be erased within 30 days.",
      requestDeletion: "Request deletion",
    },
    demo: {
      label: "Demo controls",
      stageTitle: "Stage mode",
      stageBody: "Runs the intake fully offline on the deterministic engine — for live presentations with unreliable wifi.",
      resetTitle: "Reset demo data",
      resetBody: "Puts every demo account back to its rehearsed starting point.",
      resetButton: "Reset demo data",
      shortcut: "Shortcut: hold Shift, press R then D.",
    },
    signout: {
      note: "Done here? You can sign back in with any demo account.",
      button: "Sign out",
    },
    deleteModal: {
      title: "Request deletion",
      body: "In the live product this starts the formal erasure of your answers, match and session history. In this demo, nothing leaves your browser to begin with.",
      confirm: "Request deletion",
    },
    resetModal: {
      title: "Reset demo data",
      body: "This restores Emma, Daan and the HR account to their starting state. Bookings, check-ins and messages from this session are wiped.",
      confirm: "Reset demo",
    },
  },

  tour: {
    a11y: {
      dialog: "Quick tour",
    },
    progress: (current: string | number, total: string | number): string => `${current} of ${total}`,
    skip: "Skip tour",
    nextOrDone: (last: boolean): string => (last ? "Done" : "Next"),
  },
};

export type Lang = "en" | "nl";
export type Copy = typeof en;

/** English fallback for any surface not yet wired to the language switch. */
export const PLATFORM = en;
