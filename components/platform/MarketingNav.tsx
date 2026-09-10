"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCopy } from "./LanguageProvider";
import { LanguageMenu } from "./LanguageMenu";

const navLink =
  "gm-focus rounded-md px-3 py-2 text-[15px] font-medium text-muted transition-colors hover:text-ink";
const loginLink =
  "gm-focus rounded-md px-3 py-2 text-[15px] font-medium text-purple transition-colors hover:text-purple-700";

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/** Public-site navigation: audience-separated links + real EN/NL switcher, with a mobile disclosure. */
export function MarketingNav() {
  const t = useCopy();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/employers", label: t.nav.employers },
    { href: "/employees", label: t.nav.employees },
    { href: "/how-it-works", label: t.nav.howItWorks },
  ];
  const more = [
    { href: "/about", label: t.nav.about },
    { href: "/privacy", label: t.nav.privacy },
  ];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <nav aria-label="Main">
        {/* Desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={navLink}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/login" className={loginLink}>
              {t.nav.login}
            </Link>
          </li>
          <li>
            <LanguageMenu />
          </li>
        </ul>

        {/* Mobile: Log in + language stay inline; the rest lives behind a menu button */}
        <div className="flex items-center gap-1 md:hidden">
          <LanguageMenu />
          <Link href="/login" className={loginLink}>
            {t.nav.login}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="gm-focus flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors hover:bg-wash"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="gm-rise absolute right-0 top-[calc(100%+10px)] z-50 w-60 overflow-hidden rounded-[var(--radius-input)] border border-hair bg-surface py-1.5 shadow-[var(--shadow-coach)] md:hidden">
          <ul>
            {[...links, ...more].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="gm-focus block px-4 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-wash"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
