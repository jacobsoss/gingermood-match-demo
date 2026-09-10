"use client";

import { IconCheck } from "./icons";
import { useCopy } from "./LanguageProvider";

/**
 * Small shared primitives for the platform, derived 1:1 from the quiz's design
 * language (tokens in globals.css). Buttons are exported as class strings so
 * pages can use them on <button> or <Link> alike.
 */

export const btnPrimary =
  "gm-focus inline-flex min-h-[48px] items-center justify-center rounded-full bg-orange px-7 text-[16px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

export const btnSecondary =
  "gm-focus inline-flex min-h-[44px] items-center justify-center rounded-full border-[1.5px] border-hair bg-surface px-6 text-[15px] font-semibold text-ink transition-colors hover:border-purple hover:text-purple-700 active:scale-[0.98] disabled:opacity-40";

export const btnLink =
  "gm-focus rounded-sm text-[15px] font-semibold text-purple transition-colors hover:text-purple-700 hover:underline";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[var(--radius-card)] border border-hair bg-surface ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">{children}</p>
  );
}

/** Honest-data tag — required anywhere aggregate statistics are shown. */
export function IllustrativeTag({ className = "" }: { className?: string }) {
  const c = useCopy().components;
  return (
    <span
      className={`inline-flex items-center rounded-full border border-hair bg-surface px-3 py-1 text-[12px] text-muted ${className}`}
    >
      {c.illustrativeTag}
    </span>
  );
}

/** Human-in-the-loop badge — a designed element, not an afterthought. */
export function ConfirmedBadge({ className = "" }: { className?: string }) {
  const c = useCopy().components;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-tint px-3 py-1 text-[13px] font-semibold text-purple-700 ${className}`}
    >
      <IconCheck size={14} />
      {c.confirmedBadge}
    </span>
  );
}

export function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 font-display text-[28px] font-semibold leading-none text-ink">{value}</p>
      {sub && <p className="mt-1.5 text-[13px] text-muted">{sub}</p>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col items-start gap-3 p-7">
      {icon && <span className="text-purple">{icon}</span>}
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      <p className="max-w-md text-[15px] leading-relaxed text-muted">{body}</p>
      {action && <div className="mt-1">{action}</div>}
    </Card>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[var(--radius-input)] bg-wash ${className}`} />;
}

/** Category chip used in library/filters. */
export function Chip({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`gm-focus min-h-[36px] rounded-full px-4 text-[14px] font-semibold transition-colors active:scale-[0.98] ${
        active ? "bg-purple text-white" : "bg-wash text-purple-700 hover:bg-tint"
      }`}
    >
      {children}
    </button>
  );
}

/** Accessible modal — fixed overlay, click-outside + Escape close. */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-4 sm:items-center"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="gm-rise w-full max-w-md rounded-[var(--radius-card)] border border-hair bg-surface p-6 sm:p-7"
      >
        <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
