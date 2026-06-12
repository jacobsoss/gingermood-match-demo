import type { MatchResponse, Specialism } from "@/lib/types";

/**
 * Typed demo-state model. Everything the platform shows outside the quiz lives
 * here, seeded per demo account and persisted to localStorage. No real backend.
 */

export type Role = "employee" | "employer";

export interface DemoUser {
  name: string;
  email: string;
  role: Role;
}

export type SessionType = "video" | "in-person" | "phone";
export type SessionStatus = "upcoming" | "completed" | "cancelled";

export interface CoachingSession {
  id: string;
  coachId: string;
  /** ISO datetime of the session start. */
  whenISO: string;
  durationMin: number;
  type: SessionType;
  status: SessionStatus;
  /** One-line topic (history) or optional note (upcoming). */
  topic?: string;
  note?: string;
  /** 1–5, set via the rate control on past sessions. */
  rating?: number;
}

export interface CheckinScores {
  energy: number;
  workload: number;
  balance: number;
  sleep: number;
  connection: number;
  overall: number;
}

export interface CheckinEntry {
  id: string;
  dateISO: string;
  scores: CheckinScores; // each 1–5; for workload, higher = healthier (manageable)
}

export interface CoachMessage {
  id: string;
  from: "coach" | "me";
  text: string;
  dateISO: string;
}

export interface DemoNotification {
  id: string;
  title: string;
  body: string;
  dateISO: string;
  read: boolean;
  href?: string;
}

export type LibraryCategory =
  | "Stress & workload"
  | "Sleep & energy"
  | "Leadership"
  | "Work-life balance"
  | "Career transitions"
  | "Confidence";

export interface LibraryItem {
  id: string;
  kind: "article" | "video";
  title: string;
  teaser: string;
  category: LibraryCategory;
  /** Reading minutes for articles, duration for videos. */
  minutes: number;
  /** Items with `full: true` have a real body in lib/demo/articles.ts. */
  full?: boolean;
}

export interface MatchState {
  coachId: string;
  fitScore: number;
  theme: Specialism;
  confirmedAtISO: string;
  sessionsPlanned: number;
}

export interface HabitNudge {
  habit: string;
  /** Library item that supports the habit. */
  libraryId: string;
  response?: "well" | "struggling";
}

/** Per-employee slice of demo state. */
export interface EmployeeState {
  match?: MatchState;
  /** Last quiz result, so /dashboard/match/result survives navigation. */
  lastResult?: MatchResponse;
  sessions: CoachingSession[];
  checkins: CheckinEntry[];
  messages: CoachMessage[];
  notifications: DemoNotification[];
  nudge?: HabitNudge;
  tourDone: boolean;
}

/** The whole persisted blob. */
export interface DemoState {
  version: 1;
  session: DemoUser | null;
  /** Keyed by email. Employers have no employee slice. */
  users: Record<string, { user: DemoUser; employee?: EmployeeState }>;
}
