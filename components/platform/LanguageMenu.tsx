"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageProvider";
import { IconCheck, IconChevronDown, IconGlobe } from "./icons";

/**
 * Real language switcher (EN / NL). Selecting a language actually translates the
 * platform via the LanguageProvider (cookie + router.refresh()). Mirrors the
 * codebase's dropdown pattern (click-outside + Escape to close).
 */
export function LanguageMenu() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

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

  const options: { code: "en" | "nl"; label: string }[] = [
    { code: "en", label: t.lang.en },
    { code: "nl", label: t.lang.nl },
  ];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t.lang.label} — ${lang === "nl" ? t.lang.nl : t.lang.en}`}
        className="gm-focus inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[15px] font-medium text-muted transition-colors hover:text-ink"
      >
        <IconGlobe size={17} />
        <span className="uppercase">{lang}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <IconChevronDown size={14} />
        </span>
      </button>

      {open && (
        <ul
          role="menu"
          className="gm-rise absolute right-0 top-[calc(100%+8px)] z-50 w-44 overflow-hidden rounded-[var(--radius-input)] border border-hair bg-surface py-1.5 shadow-[var(--shadow-coach)]"
        >
          {options.map((o) => {
            const active = o.code === lang;
            return (
              <li key={o.code} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setLang(o.code);
                    setOpen(false);
                  }}
                  className={`gm-focus flex w-full items-center justify-between px-4 py-2.5 text-left text-[15px] transition-colors hover:bg-wash ${
                    active ? "font-semibold text-ink" : "text-muted"
                  }`}
                >
                  <span>{o.label}</span>
                  {active && (
                    <span className="text-purple">
                      <IconCheck size={15} />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
