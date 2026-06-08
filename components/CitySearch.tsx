"use client";

import { useEffect, useId, useRef, useState } from "react";
import { searchCities } from "@/lib/geo";
import { COPY } from "@/lib/copy";

function SearchIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/** Search-as-you-type city picker: focus shows the 5 largest NL cities,
 *  typing narrows the list down to a specific city. */
export function CitySearch({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (city: string) => void;
  onEnter?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const suggestions = searchCities(value);
  // An exact (case-insensitive) match means the box is "settled" — no dropdown.
  const settled = suggestions.length === 1 && suggestions[0].toLowerCase() === value.trim().toLowerCase();
  const showList = open && suggestions.length > 0 && !settled;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(city: string) {
    onChange(city);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (showList && suggestions[active]) {
        e.preventDefault();
        pick(suggestions[active]);
      } else if (value.trim()) {
        onEnter?.();
      }
      return;
    }
    if (!showList) {
      if (e.key === "ArrowDown") setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative mt-6">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
        <SearchIcon />
      </div>
      <input
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={value}
        placeholder={COPY.question.cityPlaceholder}
        onChange={(e) => {
          onChange(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="gm-focus w-full rounded-[var(--radius-input)] border-[1.5px] border-hair bg-surface py-4 pl-12 pr-11 text-[17px] text-ink outline-none transition-colors placeholder:text-muted"
      />
      {value && (
        <button
          type="button"
          aria-label="Wissen"
          onClick={() => {
            onChange("");
            setOpen(true);
          }}
          className="gm-focus absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition-colors hover:bg-wash hover:text-ink"
        >
          <ClearIcon />
        </button>
      )}

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-[var(--radius-input)] border border-hair bg-surface py-1.5 shadow-[0_12px_32px_-12px_rgba(20,16,40,0.22)]"
        >
          {value.trim() === "" && (
            <li className="px-4 pb-1 pt-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
              {COPY.question.citySuggested}
            </li>
          )}
          {suggestions.map((city, i) => (
            <li key={city} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(city)}
                className={`flex w-full items-center px-4 py-2.5 text-left text-[16px] transition-colors ${
                  i === active ? "bg-wash text-ink" : "text-ink hover:bg-wash"
                }`}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
