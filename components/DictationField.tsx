"use client";

import { useRef, useState } from "react";
import { COPY } from "@/lib/copy";
import { useSpeechDictation } from "@/lib/useSpeechDictation";

function MicIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

/** Append a finalized/dictated chunk to existing text with sensible spacing. */
function appendText(prev: string, chunk: string): string {
  const c = chunk.trim();
  if (!c) return prev;
  if (!prev) return c;
  return /\s$/.test(prev) ? prev + c : `${prev} ${c}`;
}

/**
 * Open answer field with browser-native voice dictation. Typing and speaking mix
 * freely: the textarea holds committed (ink) text; interim speech renders muted,
 * appended after it, via an aligned overlay. A transparent sizer grows the box to
 * fit committed + interim so the overlay always lines up (no scroll desync).
 */
export function DictationField({
  value,
  onChange,
  placeholder,
  lang = "nl-NL",
  rows = 3,
  autoFocus = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  lang?: string;
  rows?: number;
  autoFocus?: boolean;
}) {
  const [interim, setInterim] = useState("");
  // Read the latest committed value inside the (stable) dictation callbacks.
  const valueRef = useRef(value);
  valueRef.current = value;

  const { supported, recording, denied, toggle } = useSpeechDictation({
    lang,
    onFinal: (t) => onChange(appendText(valueRef.current, t)),
    onInterim: (t) => setInterim(t),
  });

  const needsSpace = value.length > 0 && !/\s$/.test(value);
  const sep = needsSpace ? " " : "";
  const interimShown = interim.replace(/^\s+/, "");

  // Identical typography/box on the textarea, sizer, and overlay so they align.
  const box =
    "whitespace-pre-wrap break-words rounded-[var(--radius-input)] border-[1.5px] px-5 pt-4 pb-12 text-[17px] leading-relaxed";

  return (
    <div className="relative mt-6">
      {/* Sizer — invisible, defines the box height to fit committed + interim. */}
      <div
        aria-hidden
        className={`invisible border-transparent ${box}`}
        style={{ minHeight: `${rows * 1.625 + 4}rem` }}
      >
        {value}
        {sep}
        {interimShown || " "}
      </div>

      {/* Editable textarea — committed ink text. */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        className={`gm-focus absolute inset-0 h-full w-full resize-none border-hair bg-surface text-ink outline-none transition-colors placeholder:text-muted ${box}`}
      />

      {/* Interim overlay — committed transparent (ink shows through), interim muted. */}
      {interim && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 border-transparent text-transparent ${box}`}
        >
          {value}
          <span className="text-muted">
            {sep}
            {interimShown}
          </span>
        </div>
      )}

      {/* Mic toolbar (bottom-right). Hidden when unsupported or permission denied. */}
      {supported && !denied && (
        <div className="absolute bottom-2.5 right-3 flex items-center gap-2">
          {recording && (
            <span className="text-[12px] font-medium text-muted" aria-live="polite">
              {COPY.question.listening}
            </span>
          )}
          <button
            type="button"
            onClick={toggle}
            aria-pressed={recording}
            aria-label={recording ? COPY.question.micStop : COPY.question.micStart}
            className="gm-focus flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-wash"
          >
            {recording ? (
              <span
                className="h-3 w-3 rounded-full bg-orange"
                style={{ animation: "gm-dot 1.2s ease-in-out infinite" }}
              />
            ) : (
              <span className="text-muted">
                <MicIcon />
              </span>
            )}
          </button>
        </div>
      )}

      {denied && <p className="mt-2 text-[13px] text-muted">{COPY.question.micUnavailable}</p>}
    </div>
  );
}
