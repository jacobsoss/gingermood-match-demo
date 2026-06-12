"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { MatchResponse } from "@/lib/types";
import type {
  CheckinEntry,
  CheckinScores,
  CoachingSession,
  DemoState,
  DemoUser,
  EmployeeState,
  Role,
  SessionType,
} from "./types";
import { SESSIONS_PLANNED, freshEmployeeState, seedInitialState } from "./seeds";

/**
 * The demo's single client-side store: one localStorage blob, seeded on first
 * load, hydrated after mount (components show skeletons until `ready`).
 * No backend — reliability on stage beats realism.
 */

const STORAGE_KEY = "gm-demo-v1";
const STAGE_KEY = "gm-stage-mode";

export interface DemoApi {
  /** False until localStorage hydration completes — render skeletons before. */
  ready: boolean;
  user: DemoUser | null;
  /** Current user's employee slice; null for employers / logged out. */
  employee: EmployeeState | null;
  login: (email: string) => DemoUser;
  register: (name: string, email: string, role: Role) => DemoUser;
  logout: () => void;
  resetDemo: () => void;

  setLastResult: (r: MatchResponse) => void;
  clearLastResult: () => void;
  /** Promote lastResult → confirmed match (called after the simulated review). */
  confirmMatch: () => void;
  bookSession: (s: { whenISO: string; type: SessionType; note?: string }) => void;
  cancelSession: (id: string) => void;
  rescheduleSession: (id: string, whenISO: string) => void;
  rateSession: (id: string, rating: number) => void;
  completeCheckin: (scores: CheckinScores) => CheckinEntry;
  sendMessage: (text: string) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  respondNudge: (response: "well" | "struggling") => void;
  setTourDone: () => void;

  /** Stage mode: force the deterministic engine (no network) inside the quiz. */
  stageMode: boolean;
  setStageMode: (on: boolean) => void;
}

const DemoContext = createContext<DemoApi | null>(null);

function deriveName(email: string): string {
  const local = email.split("@")[0] ?? "Guest";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p[0]!.toUpperCase() + p.slice(1))
    .join(" ");
}

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState | null>(null);
  const [stageMode, setStageModeState] = useState(false);
  const router = useRouter();

  // Hydrate once on the client (via rAF so the effect body has no sync setState;
  // consumers render skeletons until `ready`).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      let parsed: DemoState | null = null;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) parsed = JSON.parse(raw) as DemoState;
      } catch {
        parsed = null;
      }
      setState(parsed && parsed.version === 1 ? parsed : seedInitialState());
      setStageModeState(window.localStorage.getItem(STAGE_KEY) === "1");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (!state) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full/blocked — demo keeps working in memory */
    }
  }, [state]);

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState(seedInitialState());
    router.push("/login");
  }, [router]);

  // Presenter shortcut: hold Shift, press R then D (within 1.5s).
  const armedRef = useRef(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      const k = e.key.toUpperCase();
      if (k === "R") armedRef.current = Date.now();
      else if (k === "D" && Date.now() - armedRef.current < 1500) {
        armedRef.current = 0;
        resetDemo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resetDemo]);

  const updateEmployee = useCallback(
    (fn: (e: EmployeeState) => EmployeeState) => {
      setState((prev) => {
        if (!prev?.session) return prev;
        const email = prev.session.email;
        const entry = prev.users[email];
        if (!entry?.employee) return prev;
        return {
          ...prev,
          users: { ...prev.users, [email]: { ...entry, employee: fn(entry.employee) } },
        };
      });
    },
    [],
  );

  const api = useMemo<DemoApi>(() => {
    const session = state?.session ?? null;
    const employee = (session && state?.users[session.email]?.employee) || null;

    return {
      ready: state !== null,
      user: session,
      employee,

      login: (email: string) => {
        const norm = email.trim().toLowerCase();
        const existing = state?.users[norm]?.user;
        const user: DemoUser =
          existing ?? { name: deriveName(norm), email: norm, role: "employee" };
        setState((prev) => {
          const base = prev ?? seedInitialState();
          const entry = base.users[norm];
          if (entry) return { ...base, session: entry.user };
          return {
            ...base,
            session: user,
            users: { ...base.users, [norm]: { user, employee: freshEmployeeState() } },
          };
        });
        return user;
      },

      register: (name: string, email: string, role: Role) => {
        const norm = email.trim().toLowerCase();
        const user: DemoUser = { name: name.trim() || deriveName(norm), email: norm, role };
        setState((prev) => {
          const base = prev ?? seedInitialState();
          return {
            ...base,
            session: user,
            users: {
              ...base.users,
              [norm]: {
                user,
                employee: role === "employee" ? freshEmployeeState() : undefined,
              },
            },
          };
        });
        return user;
      },

      logout: () => setState((prev) => (prev ? { ...prev, session: null } : prev)),
      resetDemo,

      setLastResult: (r) => updateEmployee((e) => ({ ...e, lastResult: r })),
      clearLastResult: () => updateEmployee((e) => ({ ...e, lastResult: undefined })),

      confirmMatch: () =>
        updateEmployee((e) => {
          if (!e.lastResult) return e;
          const { coach, match } = e.lastResult;
          return {
            ...e,
            match: {
              coachId: coach.id,
              fitScore: match.fitScore,
              theme: coach.specialisms[0] ?? "generalist",
              confirmedAtISO: new Date().toISOString(),
              sessionsPlanned: SESSIONS_PLANNED,
            },
            notifications: [
              {
                id: nextId("n"),
                title: "Match confirmed",
                body: `${coach.name} is confirmed as your coach. Book your first session whenever you're ready.`,
                dateISO: new Date().toISOString(),
                read: false,
                href: "/dashboard/sessions",
              },
              ...e.notifications,
            ],
          };
        }),

      bookSession: ({ whenISO, type, note }) =>
        updateEmployee((e) => {
          const s: CoachingSession = {
            id: nextId("s"),
            coachId: e.match?.coachId ?? "",
            whenISO,
            durationMin: 60,
            type,
            status: "upcoming",
            note,
          };
          return { ...e, sessions: [...e.sessions, s] };
        }),

      cancelSession: (id) =>
        updateEmployee((e) => ({
          ...e,
          sessions: e.sessions.map((s) => (s.id === id ? { ...s, status: "cancelled" } : s)),
        })),

      rescheduleSession: (id, whenISO) =>
        updateEmployee((e) => ({
          ...e,
          sessions: e.sessions.map((s) => (s.id === id ? { ...s, whenISO } : s)),
        })),

      rateSession: (id, rating) =>
        updateEmployee((e) => ({
          ...e,
          sessions: e.sessions.map((s) => (s.id === id ? { ...s, rating } : s)),
        })),

      completeCheckin: (scores) => {
        const entry: CheckinEntry = {
          id: nextId("c"),
          dateISO: new Date().toISOString(),
          scores,
        };
        updateEmployee((e) => ({ ...e, checkins: [...e.checkins, entry] }));
        return entry;
      },

      sendMessage: (text) =>
        updateEmployee((e) => ({
          ...e,
          messages: [
            ...e.messages,
            { id: nextId("m"), from: "me", text, dateISO: new Date().toISOString() },
          ],
        })),

      markAllNotificationsRead: () =>
        updateEmployee((e) => ({
          ...e,
          notifications: e.notifications.map((n) => ({ ...n, read: true })),
        })),

      markNotificationRead: (id) =>
        updateEmployee((e) => ({
          ...e,
          notifications: e.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      respondNudge: (response) =>
        updateEmployee((e) => (e.nudge ? { ...e, nudge: { ...e.nudge, response } } : e)),

      setTourDone: () => updateEmployee((e) => ({ ...e, tourDone: true })),

      stageMode,
      setStageMode: (on: boolean) => {
        setStageModeState(on);
        try {
          if (on) window.localStorage.setItem(STAGE_KEY, "1");
          else window.localStorage.removeItem(STAGE_KEY);
        } catch {
          /* ignore */
        }
      },
    };
  }, [state, stageMode, resetDemo, updateEmployee]);

  return <DemoContext.Provider value={api}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoApi {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}
