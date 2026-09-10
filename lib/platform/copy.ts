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

export const PLATFORM = {
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
    eyebrow: "Coaching, properly matched",
    title: "The right coach for every person in your organisation",
    subtitle:
      "Gingermood gives your people ongoing access to professional coaching — matched to what they actually need, with a real person involved in every match.",
    primaryCta: "Explore employer access",
    secondaryCta: "I have access through my employer",

    audience: {
      title: "Where would you like to start?",
      employer: {
        label: "For employers",
        body: "Annual access for your covered employees, individual matching, and anonymous, aggregate reporting — never individual answers.",
        cta: "See how it works for organisations",
        href: "/employers",
      },
      employee: {
        label: "For employees",
        body: "Your employer provides access. Find the coach who fits your situation, and keep the support going over time.",
        cta: "See what's available to you",
        href: "/employees",
      },
    },

    steps: {
      title: "How the matching works",
      items: [
        {
          title: "Tell us what's going on",
          body: "A short, adaptive intake — in your own words, typed or spoken. You don't need a neatly formulated question to begin.",
        },
        {
          title: "We match on needs, a person confirms",
          body: "Your specific needs are matched to a coach's actual competencies — not a personality type. A Gingermood matchmaker reviews the match before it reaches you.",
        },
        {
          title: "Grow with your coach over time",
          body: "Book sessions, keep a thread with your coach, and check in periodically. Support continues beyond the first conversation.",
        },
      ],
    },

    principles: {
      title: "What Gingermood is built on",
      items: [
        {
          title: "Matched on real needs",
          body: "Coaching starts from a person's specific situation and a coach's real competencies — not a quiz result or a personality label.",
        },
        {
          title: "A human stays involved",
          body: "Software proposes; a person confirms. Support continues after the first match, not just at the start.",
        },
        {
          title: "Private by intent",
          body: "Individual answers are meant for the employee alone. Employers see only anonymous, aggregate patterns — never a single person's answers.",
        },
      ],
    },

    closing: {
      title: "Bring considered coaching to your organisation",
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
} as const;
