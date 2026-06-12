import type { Specialism } from "@/lib/types";
import type {
  CheckinEntry,
  CoachingSession,
  DemoState,
  DemoUser,
  EmployeeState,
  LibraryCategory,
  LibraryItem,
} from "./types";

/**
 * Single source of truth for everything seeded. All dates are computed relative
 * to "now" at seed time so the demo always looks alive (sessions next week,
 * check-ins last quarter), never stale.
 */

export const DEMO_ACCOUNTS = {
  emma: "emma@demo.gingermood.nl",
  daan: "daan@demo.gingermood.nl",
  hr: "hr@demo.gingermood.nl",
} as const;

export const DAAN_COACH_ID = "mara-de-wit";
export const SESSIONS_PLANNED = 8;

// ── Date helpers (seed-time only) ─────────────────────────────────────────────
function at(base: Date, dayOffset: number, hour = 9, minute = 0): string {
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/** Next occurrence of a weekday (1=Mon … 5=Fri) at least `minDays` ahead. */
function nextWeekday(base: Date, minDays: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + minDays);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d;
}

// ── Library catalog ───────────────────────────────────────────────────────────
export const LIBRARY: LibraryItem[] = [
  {
    id: "lib-01",
    kind: "article",
    title: "Why your workday needs a shutdown ritual",
    teaser: "A two-minute habit that stops work from leaking into your evening.",
    category: "Stress & workload",
    minutes: 5,
    full: true,
  },
  {
    id: "lib-02",
    kind: "article",
    title: "Saying no without burning bridges",
    teaser: "Boundaries are a skill, not a personality trait. Here's the craft.",
    category: "Stress & workload",
    minutes: 6,
    full: true,
  },
  {
    id: "lib-03",
    kind: "article",
    title: "The first 90 days as a new manager",
    teaser: "From best-in-the-team to leading it — what actually changes.",
    category: "Leadership",
    minutes: 7,
    full: true,
  },
  {
    id: "lib-04",
    kind: "article",
    title: "Sleep debt is a loan with interest",
    teaser: "What chronic short nights really cost, and how to pay it back.",
    category: "Sleep & energy",
    minutes: 5,
  },
  {
    id: "lib-05",
    kind: "article",
    title: "What burnout actually is (and isn't)",
    teaser: "The difference between a hard month and a depleted system.",
    category: "Stress & workload",
    minutes: 8,
  },
  {
    id: "lib-06",
    kind: "article",
    title: "Career drift: how to notice it early",
    teaser: "Losing interest rarely happens overnight. The early signals.",
    category: "Career transitions",
    minutes: 6,
  },
  {
    id: "lib-07",
    kind: "article",
    title: "Hybrid work without the always-on feeling",
    teaser: "Working from home shouldn't mean living at work.",
    category: "Work-life balance",
    minutes: 5,
  },
  {
    id: "lib-08",
    kind: "article",
    title: "Imposter feelings at work: a field guide",
    teaser: "Why competent people doubt themselves — and what helps.",
    category: "Confidence",
    minutes: 7,
  },
  {
    id: "lib-09",
    kind: "video",
    title: "Box breathing for busy days",
    teaser: "A guided 4-4-4-4 breathing exercise you can do at your desk.",
    category: "Sleep & energy",
    minutes: 4,
  },
  {
    id: "lib-10",
    kind: "video",
    title: "An energy audit: find your leaks",
    teaser: "Map a normal week and spot what drains more than it gives.",
    category: "Stress & workload",
    minutes: 7,
  },
  {
    id: "lib-11",
    kind: "video",
    title: "Difficult conversations, calmly",
    teaser: "A simple structure for saying the hard thing well.",
    category: "Confidence",
    minutes: 9,
  },
  {
    id: "lib-12",
    kind: "video",
    title: "From colleague to manager",
    teaser: "Leading the team you were part of last month.",
    category: "Leadership",
    minutes: 6,
  },
];

export const LIBRARY_BY_ID: Record<string, LibraryItem> = Object.fromEntries(
  LIBRARY.map((i) => [i.id, i]),
);

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  "Stress & workload",
  "Sleep & energy",
  "Leadership",
  "Work-life balance",
  "Career transitions",
  "Confidence",
];

/** Coach specialism → library categories, drives personalized recommendations. */
export const THEME_CATEGORIES: Record<Specialism, LibraryCategory[]> = {
  "stress-burnout": ["Stress & workload", "Sleep & energy"],
  "leadership-transition": ["Leadership", "Confidence"],
  "career-direction": ["Career transitions", "Work-life balance"],
  "confidence-imposter": ["Confidence", "Stress & workload"],
  "high-pressure-exec": ["Leadership", "Stress & workload"],
  "communication-assertiveness": ["Confidence", "Leadership"],
  generalist: ["Work-life balance", "Stress & workload"],
};

export function recommendedFor(theme: Specialism | undefined, count = 3): LibraryItem[] {
  const cats = theme ? THEME_CATEGORIES[theme] : ["Stress & workload" as LibraryCategory];
  const primary = LIBRARY.filter((i) => cats.includes(i.category));
  const rest = LIBRARY.filter((i) => !cats.includes(i.category));
  return [...primary, ...rest].slice(0, count);
}

// ── Coach availability (booking) ──────────────────────────────────────────────
export interface AvailabilitySlot {
  iso: string;
  taken: boolean;
}

const SLOT_TIMES: [number, number][] = [
  [9, 0],
  [10, 30],
  [13, 0],
  [14, 30],
  [16, 0],
];

/** Next 10 weekdays of seeded slots; "taken" is deterministic, ~1 in 3. */
export function coachAvailability(now = new Date()): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  let weekdays = 0;
  let dayIndex = 0;
  while (weekdays < 10) {
    d.setDate(d.getDate() + 1);
    dayIndex++;
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    weekdays++;
    SLOT_TIMES.forEach(([h, m], i) => {
      const s = new Date(d);
      s.setHours(h, m, 0, 0);
      const taken = (dayIndex * 5 + i) % 3 === 0 || (dayIndex + i) % 7 === 4;
      slots.push({ iso: s.toISOString(), taken });
    });
  }
  return slots;
}

// ── Per-account seeds ─────────────────────────────────────────────────────────
function emmaState(now: Date): EmployeeState {
  return {
    sessions: [],
    checkins: [],
    messages: [],
    notifications: [
      {
        id: "n-emma-1",
        title: "Welcome to Gingermood",
        body: "Start with the intake — about 5 minutes, in your own words or out loud.",
        dateISO: at(now, 0, 9, 0),
        read: false,
        href: "/dashboard/match",
      },
      {
        id: "n-emma-2",
        title: "Quarterly check-in is open",
        body: "Six quick questions about how work feels right now.",
        dateISO: at(now, -1, 9, 0),
        read: false,
        href: "/dashboard/checkin",
      },
    ],
    tourDone: false,
  };
}

function daanState(now: Date): EmployeeState {
  const nextSession = nextWeekday(now, 3);
  const sessions: CoachingSession[] = [
    {
      id: "s-daan-1",
      coachId: DAAN_COACH_ID,
      whenISO: at(now, -28, 10, 30),
      durationMin: 60,
      type: "video",
      status: "completed",
      topic: "Intake & goals — where the energy goes",
      rating: 4,
    },
    {
      id: "s-daan-2",
      coachId: DAAN_COACH_ID,
      whenISO: at(now, -19, 10, 30),
      durationMin: 60,
      type: "video",
      status: "completed",
      topic: "Boundaries — saying no without guilt",
      rating: 5,
    },
    {
      id: "s-daan-3",
      coachId: DAAN_COACH_ID,
      whenISO: at(now, -9, 13, 0),
      durationMin: 60,
      type: "in-person",
      status: "completed",
      topic: "Recovery routines for evenings and sleep",
    },
    {
      id: "s-daan-4",
      coachId: DAAN_COACH_ID,
      whenISO: at(nextSession, 0, 10, 30),
      durationMin: 60,
      type: "video",
      status: "upcoming",
      note: "Peak weeks — keeping boundaries when it gets busy",
    },
  ];

  const checkins: CheckinEntry[] = [
    {
      id: "c-daan-1",
      dateISO: at(now, -70, 12, 0),
      scores: { energy: 2, workload: 2, balance: 3, sleep: 3, connection: 4, overall: 3 },
    },
    {
      id: "c-daan-2",
      dateISO: at(now, -35, 12, 0),
      scores: { energy: 3, workload: 2, balance: 3, sleep: 3, connection: 4, overall: 3 },
    },
    {
      id: "c-daan-3",
      dateISO: at(now, -7, 12, 0),
      scores: { energy: 4, workload: 3, balance: 4, sleep: 4, connection: 4, overall: 4 },
    },
  ];

  return {
    match: {
      coachId: DAAN_COACH_ID,
      fitScore: 92,
      theme: "stress-burnout",
      confirmedAtISO: at(now, -35, 14, 0),
      sessionsPlanned: SESSIONS_PLANNED,
    },
    sessions,
    checkins,
    messages: [
      {
        id: "m-daan-1",
        from: "coach",
        text: "Good session today, Daan. As discussed: try closing each workday with a short shutdown note — what's done, what can wait until tomorrow. Curious how it lands.",
        dateISO: at(now, -9, 17, 10),
      },
      {
        id: "m-daan-2",
        from: "me",
        text: "Thanks Mara. The first evening felt a bit forced, but I did notice I stopped re-opening my laptop after dinner.",
        dateISO: at(now, -8, 20, 5),
      },
      {
        id: "m-daan-3",
        from: "coach",
        text: "That's exactly the point — the ritual matters more than the note itself. Let's look at your peak weeks next session.",
        dateISO: at(now, -8, 21, 40),
      },
    ],
    notifications: [
      {
        id: "n-daan-1",
        title: "Session reminder",
        body: "Video session with Mara de Wit, this week at 10:30.",
        dateISO: at(now, -1, 8, 0),
        read: false,
        href: "/dashboard/sessions",
      },
      {
        id: "n-daan-2",
        title: "New for you in the library",
        body: "Why your workday needs a shutdown ritual — 5 min read.",
        dateISO: at(now, -2, 9, 30),
        read: false,
        href: "/dashboard/library/lib-01",
      },
      {
        id: "n-daan-3",
        title: "Message from Mara",
        body: "That's exactly the point — the ritual matters more than the note itself…",
        dateISO: at(now, -8, 21, 40),
        read: true,
        href: "/dashboard/coach",
      },
    ],
    nudge: {
      habit: "End your workday with a shutdown note",
      libraryId: "lib-01",
    },
    tourDone: true,
  };
}

const USERS: DemoUser[] = [
  { name: "Emma de Jong", email: DEMO_ACCOUNTS.emma, role: "employee" },
  { name: "Daan Bakker", email: DEMO_ACCOUNTS.daan, role: "employee" },
  { name: "Sanne Visser", email: DEMO_ACCOUNTS.hr, role: "employer" },
];

export function seedInitialState(now = new Date()): DemoState {
  return {
    version: 1,
    session: null,
    users: {
      [DEMO_ACCOUNTS.emma]: { user: USERS[0], employee: emmaState(now) },
      [DEMO_ACCOUNTS.daan]: { user: USERS[1], employee: daanState(now) },
      [DEMO_ACCOUNTS.hr]: { user: USERS[2] },
    },
  };
}

/** Fresh slice for accounts created via /register or unknown logins. */
export function freshEmployeeState(now = new Date()): EmployeeState {
  const s = emmaState(now);
  return { ...s, notifications: s.notifications.map((n) => ({ ...n })) };
}

// ── Employer aggregates (illustrative) ────────────────────────────────────────
export const EMPLOYER = {
  company: "Meridiaan Consulting B.V.",
  minGroupSize: 15,
  kpis: {
    participation: 0.78,
    wellbeingIndex: 7.2,
    indexDelta: 0.3,
    sessionsQuarter: 142,
    checkinSplit: { green: 64, orange: 26, red: 10 },
  },
  departments: [
    { name: "Consulting", headcount: 86, green: 58, orange: 30, red: 12 },
    { name: "Technology", headcount: 64, green: 66, orange: 24, red: 10 },
    { name: "Finance & Operations", headcount: 41, green: 70, orange: 22, red: 8 },
    { name: "Sales & Marketing", headcount: 38, green: 61, orange: 29, red: 10 },
    { name: "People & Culture", headcount: 19, green: 74, orange: 20, red: 6 },
  ],
  trend: [
    { label: "Q3 '25", value: 6.8 },
    { label: "Q4 '25", value: 6.9 },
    { label: "Q1 '26", value: 7.0 },
    { label: "Q2 '26", value: 7.2 },
  ],
  matching: { completionRate: 0.93, rematchRate: 0.06, avgRating: 4.6 },
} as const;
