"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useDemo } from "@/lib/demo/store";
import { coachAvailability, type AvailabilitySlot } from "@/lib/demo/seeds";
import { firstName, formatDay, formatDayShort, formatTime } from "@/lib/demo/format";
import { getCoach } from "@/data/coaches";
import { buildIcs, downloadIcs } from "@/lib/demo/ics";
import type { CoachingSession, SessionType } from "@/lib/demo/types";
import { Avatar } from "@/components/Avatar";
import {
  Card,
  EmptyState,
  Modal,
  SectionLabel,
  Skeleton,
  btnLink,
  btnPrimary,
  btnSecondary,
} from "@/components/platform/ui";
import {
  IconCalendar,
  IconCheck,
  IconDownload,
  IconMapPin,
  IconPhone,
  IconStar,
  IconVideo,
} from "@/components/platform/icons";

/* ── Small helpers ──────────────────────────────────────────────────────────── */

function typeLabel(type: SessionType, region: string): string {
  if (type === "video") return "Video call";
  if (type === "in-person") return `In person — ${region}`;
  return "Phone";
}

function TypeIcon({ type, size = 16 }: { type: SessionType; size?: number }) {
  if (type === "video") return <IconVideo size={size} />;
  if (type === "in-person") return <IconMapPin size={size} />;
  return <IconPhone size={size} />;
}

/** A slot is blocked when it overlaps an upcoming session (excluding one being moved). */
function hasConflict(slotISO: string, sessions: CoachingSession[], excludeId?: string): boolean {
  const start = new Date(slotISO).getTime();
  const end = start + 60 * 60_000;
  return sessions.some((s) => {
    if (s.status !== "upcoming" || s.id === excludeId) return false;
    const sStart = new Date(s.whenISO).getTime();
    const sEnd = sStart + s.durationMin * 60_000;
    return start < sEnd && end > sStart;
  });
}

function groupByDay(slots: AvailabilitySlot[]): { key: string; slots: AvailabilitySlot[] }[] {
  const groups: { key: string; slots: AvailabilitySlot[] }[] = [];
  for (const slot of slots) {
    const key = new Date(slot.iso).toDateString();
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.slots.push(slot);
    else groups.push({ key, slots: [slot] });
  }
  return groups;
}

/* ── Slot picker (booking section + reschedule modal) ───────────────────────── */

function SlotGrid({
  slots,
  sessions,
  excludeId,
  onPick,
}: {
  slots: AvailabilitySlot[];
  sessions: CoachingSession[];
  excludeId?: string;
  onPick: (iso: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const days = groupByDay(slots);
  const visible = showAll ? days : days.slice(0, 5);

  return (
    <div className="flex flex-col gap-5">
      {visible.map((day) => (
        <div key={day.key}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
            {formatDayShort(day.slots[0]!.iso)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {day.slots.map((slot) => {
              const blocked = slot.taken || hasConflict(slot.iso, sessions, excludeId);
              return (
                <button
                  key={slot.iso}
                  type="button"
                  disabled={blocked}
                  onClick={() => onPick(slot.iso)}
                  className={`gm-focus min-h-[40px] rounded-full border-[1.5px] px-4 text-[14px] font-semibold tabular-nums transition-colors ${
                    blocked
                      ? "cursor-not-allowed border-hair text-muted line-through opacity-40"
                      : "border-hair bg-surface text-ink hover:border-purple hover:text-purple-700 active:scale-[0.98]"
                  }`}
                >
                  {formatTime(slot.iso)}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {days.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className={`${btnLink} min-h-[40px] self-start`}
        >
          {showAll ? "Show fewer days" : "Show more days"}
        </button>
      )}
    </div>
  );
}

/* ── Rating (past sessions) ─────────────────────────────────────────────────── */

function RatingControl({ onRate }: { onRate: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={n === 1 ? "1 star" : `${n} stars`}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onClick={() => onRate(n)}
          className={`gm-focus flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            n <= hover ? "text-purple" : "text-muted"
          }`}
        >
          <IconStar size={20} filled={n <= hover} />
        </button>
      ))}
    </div>
  );
}

function StarsSmall({ rating }: { rating: number }) {
  return (
    <span
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className="flex items-center gap-0.5 text-muted"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <IconStar key={n} size={14} filled={n <= rating} />
      ))}
    </span>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────── */

export default function SessionsPage() {
  const { ready, user, employee, bookSession, cancelSession, rescheduleSession, rateSession } =
    useDemo();

  const slots = useMemo(() => coachAvailability(), []);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<SessionType>("video");
  const [bookingNote, setBookingNote] = useState("");
  const [booked, setBooked] = useState<{ whenISO: string; type: SessionType; note?: string } | null>(
    null,
  );
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [justRated, setJustRated] = useState<string | null>(null);

  if (!ready || !user || !employee) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-7 h-36 w-full" />
        <Skeleton className="mt-4 h-72 w-full" />
        <Skeleton className="mt-4 h-44 w-full" />
      </div>
    );
  }

  const match = employee.match;
  const coach = match ? getCoach(match.coachId) : undefined;

  if (!match || !coach) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <header className="gm-rise">
          <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">
            Sessions
          </h1>
          <p className="mt-1 text-[15px] text-muted">Booking opens once you have a coach.</p>
        </header>
        <div className="gm-rise mt-7" style={{ animationDelay: "80ms" }}>
          <EmptyState
            icon={<IconCalendar size={22} />}
            title="Book sessions once you're matched"
            body="Sessions happen with your own coach — and you don't have one yet. Do the short intake first; it takes about 5 minutes, and a human checks every match before it reaches you."
            action={
              <Link href="/dashboard/match" className={btnPrimary}>
                Get matched
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const coachFirst = firstName(coach.name);

  const upcoming = employee.sessions
    .filter((s) => s.status === "upcoming")
    .sort((a, b) => a.whenISO.localeCompare(b.whenISO));
  const past = employee.sessions
    .filter((s) => s.status === "completed")
    .sort((a, b) => b.whenISO.localeCompare(a.whenISO));
  const ratePromptId = past.find((s) => !s.rating)?.id;
  const rescheduleTarget = rescheduleId
    ? employee.sessions.find((s) => s.id === rescheduleId)
    : undefined;

  const icsFor = (whenISO: string, type: SessionType, durationMin: number, note?: string) =>
    buildIcs({
      title: `Coaching session with ${coach.name}`,
      description: note ?? "Coaching session booked via Gingermood.",
      startISO: whenISO,
      durationMin,
      location:
        type === "video"
          ? "Video call (link follows from Gingermood)"
          : type === "in-person"
            ? coach.region
            : "Phone call",
    });

  const downloadSessionIcs = (whenISO: string, type: SessionType, durationMin: number, note?: string) =>
    downloadIcs(`gingermood-session-${whenISO.slice(0, 10)}.ics`, icsFor(whenISO, type, durationMin, note));

  const typeOptions: { value: SessionType; label: string; icon: ReactNode }[] = [
    { value: "video", label: "Video call", icon: <IconVideo size={18} /> },
    { value: "in-person", label: `In person — ${coach.region}`, icon: <IconMapPin size={18} /> },
    { value: "phone", label: "Phone", icon: <IconPhone size={18} /> },
  ];

  const confirmBooking = () => {
    if (!bookingSlot) return;
    const note = bookingNote.trim() || undefined;
    bookSession({ whenISO: bookingSlot, type: bookingType, note });
    setBooked({ whenISO: bookingSlot, type: bookingType, note });
  };

  const closeBooking = () => {
    setBookingSlot(null);
    setBooked(null);
    setBookingNote("");
    setBookingType("video");
  };

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
      <header className="gm-rise">
        <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">Sessions</h1>
        <p className="mt-1 text-[15px] text-muted">
          Plan time with {coachFirst}, and look back at what you&apos;ve already covered.
        </p>
      </header>

      {/* ── Upcoming ─────────────────────────────────────────────────────────── */}
      <section className="gm-rise mt-7" style={{ animationDelay: "60ms" }}>
        <SectionLabel>Upcoming</SectionLabel>
        <div className="mt-3 flex flex-col gap-4">
          {upcoming.length === 0 ? (
            <EmptyState
              title="Nothing booked"
              body={`Pick a time below that suits you — ${coachFirst} keeps slots open most weekdays.`}
            />
          ) : (
            upcoming.map((s) => (
              <Card key={s.id} className="p-6">
                <div className="flex items-start gap-3.5">
                  <Avatar initials={coach.initials} size="sm" />
                  <div className="min-w-0">
                    <p className="text-[16px] font-semibold text-ink">
                      {formatDay(s.whenISO)} at {formatTime(s.whenISO)}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-[14px] text-muted">
                      <span className="text-purple">
                        <TypeIcon type={s.type} />
                      </span>
                      {typeLabel(s.type, coach.region)} · {s.durationMin} min with {coachFirst}
                    </p>
                    {s.note && (
                      <p className="mt-2 text-[14px] leading-relaxed text-muted">
                        &ldquo;{s.note}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-hair pt-3">
                  <button
                    type="button"
                    onClick={() => downloadSessionIcs(s.whenISO, s.type, s.durationMin, s.note)}
                    className={`${btnLink} inline-flex min-h-[40px] items-center gap-1.5`}
                  >
                    <IconDownload size={15} />
                    Add to calendar
                  </button>
                  <button
                    type="button"
                    onClick={() => setRescheduleId(s.id)}
                    className={`${btnLink} min-h-[40px]`}
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancelId(s.id)}
                    className={`${btnLink} min-h-[40px]`}
                  >
                    Cancel
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* ── Book a session ───────────────────────────────────────────────────── */}
      <section className="gm-rise mt-8" style={{ animationDelay: "120ms" }}>
        <SectionLabel>Book a session</SectionLabel>
        <Card className="mt-3 p-6 sm:p-7">
          <div className="flex items-center gap-3.5">
            <Avatar initials={coach.initials} size="sm" />
            <div className="min-w-0">
              <h2 className="font-display text-xl font-semibold text-ink">
                Available with {coach.name}
              </h2>
              <p className="mt-0.5 text-[14px] text-muted">
                Sessions are 60 minutes — video, in person, or by phone.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <SlotGrid
              slots={slots}
              sessions={employee.sessions}
              onPick={(iso) => setBookingSlot(iso)}
            />
          </div>
        </Card>
      </section>

      {/* ── Past sessions ────────────────────────────────────────────────────── */}
      <section className="gm-rise mt-8" style={{ animationDelay: "180ms" }}>
        <SectionLabel>Past sessions</SectionLabel>
        {past.length === 0 ? (
          <p className="mt-3 text-[15px] text-muted">
            No completed sessions yet — your history builds here after the first one.
          </p>
        ) : (
          <Card className="mt-3 px-6 py-1">
            <ul className="divide-y divide-hair">
              {past.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-snug text-ink">
                      {s.topic ?? `Session with ${coachFirst}`}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted">
                      {formatDayShort(s.whenISO)} · {typeLabel(s.type, coach.region)}
                    </p>
                  </div>
                  {s.id === justRated && s.rating ? (
                    <div className="gm-rise flex flex-col items-start gap-1">
                      <StarsSmall rating={s.rating} />
                      <p className="text-[13px] text-muted">
                        Thanks — this helps us measure what works.
                      </p>
                    </div>
                  ) : s.rating ? (
                    <StarsSmall rating={s.rating} />
                  ) : s.id === ratePromptId ? (
                    <div>
                      <p className="text-[14px] font-semibold text-ink">How was this session?</p>
                      <RatingControl
                        onRate={(n) => {
                          rateSession(s.id, n);
                          setJustRated(s.id);
                        }}
                      />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      {/* ── Booking modal ────────────────────────────────────────────────────── */}
      <Modal
        open={bookingSlot !== null}
        onClose={closeBooking}
        title={booked ? "Session booked" : "Book a session"}
      >
        {booked ? (
          <div className="flex flex-col items-start gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tint text-purple-700">
              <IconCheck size={22} />
            </span>
            <p className="text-[17px] font-semibold text-ink">
              Booked. {formatDay(booked.whenISO)} at {formatTime(booked.whenISO)}
            </p>
            <p className="text-[15px] leading-relaxed text-muted">
              Added to your sessions — calendar file below.
            </p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() =>
                  downloadSessionIcs(booked.whenISO, booked.type, 60, booked.note)
                }
                className={`${btnSecondary} gap-2`}
              >
                <IconDownload size={16} />
                Add to calendar (.ics)
              </button>
              <button type="button" onClick={closeBooking} className={btnSecondary}>
                Close
              </button>
            </div>
          </div>
        ) : (
          bookingSlot && (
            <div className="flex flex-col gap-4">
              <p className="text-[15px] text-ink">
                {formatDay(bookingSlot)} at {formatTime(bookingSlot)} · 60 min with {coachFirst}
              </p>
              <div className="flex flex-col gap-2" role="radiogroup" aria-label="Session type">
                {typeOptions.map((opt) => {
                  const selected = bookingType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setBookingType(opt.value)}
                      className={`gm-focus flex min-h-[48px] w-full items-center gap-3 rounded-[var(--radius-input)] border-[1.5px] px-4 py-2.5 text-left text-[15px] font-semibold transition-colors ${
                        selected
                          ? "border-purple bg-wash text-purple-700"
                          : "border-hair text-ink hover:border-purple"
                      }`}
                    >
                      <span className={selected ? "text-purple" : "text-muted"}>{opt.icon}</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <div>
                <label
                  htmlFor="booking-note"
                  className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted"
                >
                  Note (optional)
                </label>
                <textarea
                  id="booking-note"
                  rows={2}
                  value={bookingNote}
                  onChange={(e) => setBookingNote(e.target.value)}
                  placeholder={`Anything you want ${coachFirst} to know beforehand?`}
                  className="gm-focus mt-2 w-full resize-none rounded-[var(--radius-input)] border-[1.5px] border-hair bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-muted"
                />
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button type="button" onClick={confirmBooking} className={btnPrimary}>
                  Confirm booking
                </button>
                <button type="button" onClick={closeBooking} className={btnSecondary}>
                  Back
                </button>
              </div>
            </div>
          )
        )}
      </Modal>

      {/* ── Reschedule modal ─────────────────────────────────────────────────── */}
      <Modal
        open={rescheduleId !== null}
        onClose={() => setRescheduleId(null)}
        title="Pick a new time"
      >
        {rescheduleTarget && (
          <p className="text-[14px] text-muted">
            Currently {formatDay(rescheduleTarget.whenISO)} at{" "}
            {formatTime(rescheduleTarget.whenISO)}.
          </p>
        )}
        <div className="mt-4 max-h-[55vh] overflow-y-auto pr-1">
          <SlotGrid
            slots={slots}
            sessions={employee.sessions}
            excludeId={rescheduleId ?? undefined}
            onPick={(iso) => {
              if (rescheduleId) rescheduleSession(rescheduleId, iso);
              setRescheduleId(null);
            }}
          />
        </div>
      </Modal>

      {/* ── Cancel modal ─────────────────────────────────────────────────────── */}
      <Modal
        open={cancelId !== null}
        onClose={() => setCancelId(null)}
        title="Cancel this session?"
      >
        <p className="text-[15px] leading-relaxed text-muted">
          {coachFirst} will be notified. No costs for the demo.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <button type="button" onClick={() => setCancelId(null)} className={btnSecondary}>
            Keep it
          </button>
          <button
            type="button"
            onClick={() => {
              if (cancelId) cancelSession(cancelId);
              setCancelId(null);
            }}
            className={btnPrimary}
          >
            Cancel session
          </button>
        </div>
      </Modal>
    </div>
  );
}
