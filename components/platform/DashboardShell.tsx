"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { initialsOf } from "@/lib/demo/format";
import { Avatar } from "@/components/Avatar";
import { NotificationsBell } from "./NotificationsBell";
import { RoleSwitch } from "./RoleSwitch";
import { LanguageMenu } from "./LanguageMenu";
import { useCopy } from "./LanguageProvider";
import {
  IconBook,
  IconCalendar,
  IconHome,
  IconLogout,
  IconPulse,
  IconSettings,
  IconUser,
} from "./icons";

/** `key` indexes into copy `shell.nav` so labels translate with the language switch. */
const NAV = [
  { href: "/dashboard", key: "home", icon: IconHome, exact: true },
  { href: "/dashboard/coach", key: "coach", icon: IconUser, exact: false },
  { href: "/dashboard/sessions", key: "sessions", icon: IconCalendar, exact: false },
  { href: "/dashboard/library", key: "library", icon: IconBook, exact: false },
  { href: "/dashboard/checkin", key: "checkin", icon: IconPulse, exact: false },
  { href: "/dashboard/settings", key: "settings", icon: IconSettings, exact: false },
] as const;

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Persistent product chrome: the quiz's 3px orange stripe + 68px topbar are kept
 * exactly (so --nav-h still holds inside the quiz), with a left sidebar on
 * desktop and a horizontal pill nav on mobile.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useDemo();
  const t = useCopy();
  const nav = t.shell.nav;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <div className="sticky top-0 z-40">
        <div className="h-[3px] w-full bg-orange" />
        <header className="h-[68px] border-b border-hair bg-surface/85 backdrop-blur">
          <div className="flex h-full items-center justify-between gap-4 px-5 sm:px-7">
            <Link href="/dashboard" className="gm-focus -m-2 rounded-md p-2" aria-label="Gingermood — dashboard home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Gingermood" className="h-7 w-auto" />
            </Link>
            <div className="flex items-center gap-2.5">
              <LanguageMenu />
              <RoleSwitch current="personal" />
              <NotificationsBell />
              {user && (
                <span className="hidden items-center gap-2.5 sm:flex">
                  <Avatar initials={initialsOf(user.name)} size="sm" />
                  <span className="text-[14px] font-semibold text-ink">{user.name}</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                aria-label={t.shell.signOut}
                title={t.shell.signOut}
                className="gm-focus flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-wash hover:text-ink"
              >
                <IconLogout size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile nav — horizontal pills (reliable on stage; no drawer) */}
        <nav className="border-b border-hair bg-surface/95 backdrop-blur lg:hidden" aria-label="Dashboard">
          <ul className="flex gap-1.5 overflow-x-auto px-4 py-2.5">
            {NAV.map(({ href, key, exact }) => {
              const active = isActive(pathname, href, exact);
              return (
                <li key={href} className="shrink-0">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`gm-focus inline-flex min-h-[38px] items-center rounded-full px-4 text-[14px] font-semibold transition-colors ${
                      active ? "bg-purple text-white" : "bg-wash text-purple-700 hover:bg-tint"
                    }`}
                  >
                    {nav[key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="sticky top-[71px] hidden h-[calc(100dvh-71px)] w-60 shrink-0 flex-col border-r border-hair bg-surface lg:flex">
          <nav className="flex-1 px-3 py-5" aria-label="Dashboard">
            <ul className="flex flex-col gap-1">
              {NAV.map(({ href, key, icon: Icon, exact }) => {
                const active = isActive(pathname, href, exact);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`gm-focus flex items-center gap-3 rounded-[var(--radius-input)] px-3.5 py-2.5 text-[15px] font-semibold transition-colors ${
                        active
                          ? "bg-wash text-purple-700"
                          : "text-muted hover:bg-wash hover:text-ink"
                      }`}
                    >
                      <Icon size={18} />
                      {nav[key]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t border-hair px-5 py-4">
            <p className="text-[12px] leading-relaxed text-muted">
              {t.shell.demoEnv}
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
