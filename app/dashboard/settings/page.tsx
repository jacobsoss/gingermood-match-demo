"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { initialsOf } from "@/lib/demo/format";
import { Avatar } from "@/components/Avatar";
import {
  Card,
  Modal,
  SectionLabel,
  Skeleton,
  btnPrimary,
  btnSecondary,
} from "@/components/platform/ui";
import { IconCheck, IconShield } from "@/components/platform/icons";

/** One privacy promise: purple icon + short bold title + one honest line. */
function PrivacyRow({
  icon,
  title,
  body,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-0.5 shrink-0 text-purple">{icon}</span>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold leading-snug text-ink">{title}</p>
        <p className="mt-0.5 text-[14px] leading-relaxed text-muted">{body}</p>
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { ready, user, stageMode, setStageMode, resetDemo, logout } = useDemo();
  const router = useRouter();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  if (!ready || !user) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <div className="max-w-[640px]">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="mt-7 h-32 w-full" />
          <Skeleton className="mt-4 h-64 w-full" />
          <Skeleton className="mt-4 h-52 w-full" />
        </div>
      </div>
    );
  }

  const roleLabel = user.role === "employer" ? "Employer" : "Employee";

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
      <div className="max-w-[640px]">
        <header className="gm-rise">
          <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">
            Settings
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Your account, our privacy promises, and the demo controls.
          </p>
        </header>

        {/* ── Account ─────────────────────────────────────────────────────── */}
        <Card className="gm-rise mt-7 p-6 sm:p-7">
          <SectionLabel>Account</SectionLabel>
          <div className="mt-4 flex items-center gap-4">
            <Avatar initials={initialsOf(user.name)} size="md" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[16px] font-semibold text-ink">{user.name}</p>
                <span className="rounded-full bg-tint px-2.5 py-0.5 text-[12px] font-semibold text-purple-700">
                  {roleLabel}
                </span>
              </div>
              <p className="mt-0.5 truncate text-[14px] text-muted">{user.email}</p>
            </div>
          </div>
          <p className="mt-5 border-t border-hair pt-4 text-[13px] text-muted">
            Demo account — details are not editable here.
          </p>
        </Card>

        {/* ── Privacy ─────────────────────────────────────────────────────── */}
        <div className="gm-rise mt-4" style={{ animationDelay: "80ms" }}>
          <Card className="p-6 sm:p-7">
          <SectionLabel>Privacy</SectionLabel>
          <div className="mt-5 flex flex-col gap-5">
            <PrivacyRow
              icon={<IconShield size={18} />}
              title="Your answers stay yours"
              body="Your employer only sees anonymous, team-level trends — never your individual answers."
            />
            <PrivacyRow
              icon={<IconCheck size={18} />}
              title="Data minimization"
              body="We store only what matching needs — nothing extra, nothing for later."
            />
            <PrivacyRow
              icon={<IconShield size={18} />}
              title="Delete anytime"
              body="One request and everything we hold about you is erased. No hoops."
            >
              {deletionRequested ? (
                <p className="gm-rise mt-3 flex items-start gap-2 text-[14px] leading-relaxed text-muted">
                  <span className="mt-0.5 shrink-0 text-purple">
                    <IconCheck size={15} />
                  </span>
                  Noted — in the live product your data would be erased within 30 days.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className={`${btnSecondary} mt-3 min-h-[40px] px-5 text-[14px]`}
                >
                  Request deletion
                </button>
              )}
            </PrivacyRow>
          </div>
          </Card>
        </div>

        {/* ── Demo controls ───────────────────────────────────────────────── */}
        <div className="gm-rise mt-4" style={{ animationDelay: "140ms" }}>
          <Card className="p-6 sm:p-7">
          <SectionLabel>Demo controls</SectionLabel>

          <div className="mt-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[15px] font-semibold leading-snug text-ink">Stage mode</p>
              <p className="mt-0.5 text-[14px] leading-relaxed text-muted">
                Runs the intake fully offline on the deterministic engine — for live
                presentations with unreliable wifi.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={stageMode}
              aria-label="Stage mode"
              onClick={() => setStageMode(!stageMode)}
              className="gm-focus -m-1.5 mt-0.5 shrink-0 rounded-full p-1.5"
            >
              <span
                className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors duration-200 ${
                  stageMode ? "bg-purple" : "bg-hair"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full border border-hair bg-surface transition-transform duration-200 ${
                    stageMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </span>
            </button>
          </div>

          <div className="mt-5 border-t border-hair pt-5">
            <p className="text-[15px] font-semibold leading-snug text-ink">Reset demo data</p>
            <p className="mt-0.5 text-[14px] leading-relaxed text-muted">
              Puts every demo account back to its rehearsed starting point.
            </p>
            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className={`${btnSecondary} mt-3 min-h-[40px] px-5 text-[14px]`}
            >
              Reset demo data
            </button>
            <p className="mt-3 text-[13px] text-muted">
              Shortcut: hold Shift, press R then D.
            </p>
          </div>
          </Card>
        </div>

        {/* ── Sign out ────────────────────────────────────────────────────── */}
        <div className="gm-rise mt-4" style={{ animationDelay: "200ms" }}>
          <Card className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[14px] leading-relaxed text-muted">
              Done here? You can sign back in with any demo account.
            </p>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className={btnSecondary}
            >
              Sign out
            </button>
          </div>
          </Card>
        </div>
      </div>

      {/* Deletion confirm */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Request deletion"
      >
        <p className="text-[15px] leading-relaxed text-muted">
          In the live product this starts the formal erasure of your answers, match and
          session history. In this demo, nothing leaves your browser to begin with.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(false)}
            className={btnSecondary}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletionRequested(true);
              setDeleteModalOpen(false);
            }}
            className={btnPrimary}
          >
            Request deletion
          </button>
        </div>
      </Modal>

      {/* Reset confirm */}
      <Modal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset demo data"
      >
        <p className="text-[15px] leading-relaxed text-muted">
          This restores Emma, Daan and the HR account to their starting state. Bookings,
          check-ins and messages from this session are wiped.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setResetModalOpen(false)}
            className={btnSecondary}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setResetModalOpen(false);
              resetDemo();
            }}
            className={btnPrimary}
          >
            Reset demo
          </button>
        </div>
      </Modal>
    </div>
  );
}
