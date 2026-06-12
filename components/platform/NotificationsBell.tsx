"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { timeAgo } from "@/lib/demo/format";
import { IconBell } from "./icons";

/** Topbar bell with unread dot + dropdown panel. */
export function NotificationsBell() {
  const { employee, markAllNotificationsRead, markNotificationRead } = useDemo();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const items = employee?.notifications ?? [];
  const unread = items.filter((n) => !n.read).length;
  if (!employee) return null;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={unread ? `Notifications (${unread} unread)` : "Notifications"}
        aria-expanded={open}
        className="gm-focus relative flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-wash hover:text-ink"
      >
        <IconBell size={19} />
        {unread > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange" aria-hidden />
        )}
      </button>

      {open && (
        <div className="gm-rise absolute right-0 top-[calc(100%+8px)] z-40 w-[340px] overflow-hidden rounded-[var(--radius-card)] border border-hair bg-surface shadow-[var(--shadow-coach)]">
          <div className="flex items-center justify-between border-b border-hair px-4 py-3">
            <p className="text-[14px] font-semibold text-ink">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="gm-focus rounded-sm text-[13px] font-semibold text-purple hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-[320px] overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-6 text-[14px] text-muted">Nothing here yet.</li>
            )}
            {items.map((n) => (
              <li key={n.id} className="border-b border-hair last:border-b-0">
                <button
                  type="button"
                  onClick={() => {
                    markNotificationRead(n.id);
                    setOpen(false);
                    if (n.href) router.push(n.href);
                  }}
                  className="gm-focus flex w-full items-start gap-2.5 px-4 py-3 text-left transition-colors hover:bg-wash"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-hair" : "bg-purple"}`}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold text-ink">{n.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                      {n.body}
                    </span>
                    <span className="mt-1 block text-[12px] text-muted">{timeAgo(n.dateISO)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
