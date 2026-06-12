import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Browser-native voice dictation via the Web Speech API. No external service,
 * no backend. Hardened for iOS Safari, which ends recognition after short pauses:
 * while the toggle is on we auto-restart in onend and preserve accumulated text.
 *
 * Emits finalized text as deltas (onFinal) and the live, unfinalized tail
 * (onInterim). The caller owns the committed value; dictation only ever appends.
 */

// Minimal typing for the (non-standard) SpeechRecognition API.
interface SRAlternative {
  transcript: string;
}
interface SRResult {
  readonly length: number;
  readonly isFinal: boolean;
  0: SRAlternative;
}
interface SRResultList {
  readonly length: number;
  [index: number]: SRResult;
}
interface SRResultEvent {
  results: SRResultList;
}
interface SRErrorEvent {
  error: string;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SRResultEvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type SRConstructor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface SpeechDictation {
  /** API present + secure context. When false, hide the mic entirely. */
  supported: boolean;
  recording: boolean;
  /** Mic permission denied or unavailable — show a quiet note, hide the mic. */
  denied: boolean;
  toggle: () => void;
  stop: () => void;
}

export function useSpeechDictation(opts: {
  lang: string;
  onFinal: (text: string) => void;
  onInterim: (text: string) => void;
}): SpeechDictation {
  const { lang } = opts;
  const [supported, setSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [denied, setDenied] = useState(false);

  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const recordingRef = useRef(false);
  const interimRef = useRef("");
  // Length of this recognition SESSION's finalized transcript already committed,
  // so onresult only appends the new delta (and a restart resets cleanly).
  const finalLenRef = useRef(0);

  const onFinalRef = useRef(opts.onFinal);
  const onInterimRef = useRef(opts.onInterim);
  useEffect(() => {
    onFinalRef.current = opts.onFinal;
    onInterimRef.current = opts.onInterim;
  });

  // Detect on the client only (window.isSecureContext → HTTPS/localhost), so the
  // server and first client render agree (no hydration mismatch, no flash modal).
  // Via rAF so the effect body has no synchronous setState (lint rule).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setSupported(!!getRecognitionCtor() && window.isSecureContext);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const emitInterim = useCallback((t: string) => {
    interimRef.current = t;
    onInterimRef.current(t);
  }, []);

  // Commit any spoken-but-unfinalized tail (Safari often cuts off mid-utterance).
  const flushInterim = useCallback(() => {
    const pending = interimRef.current.trim();
    if (pending) onFinalRef.current(pending);
    interimRef.current = "";
    onInterimRef.current("");
  }, []);

  const build = useCallback((): SpeechRecognitionLike | null => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return null;
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = true;

    rec.onresult = (e) => {
      let finalStr = "";
      let interimStr = "";
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        const txt = res[0]?.transcript ?? "";
        if (res.isFinal) finalStr += txt;
        else interimStr += txt;
      }
      // Only append the newly finalized portion of THIS session.
      if (finalStr.length > finalLenRef.current) {
        const delta = finalStr.slice(finalLenRef.current);
        finalLenRef.current = finalStr.length;
        onFinalRef.current(delta);
      }
      emitInterim(interimStr);
    };

    rec.onerror = (e) => {
      const err = e.error;
      if (err === "not-allowed" || err === "service-not-allowed" || err === "audio-capture") {
        // Permission denied or no mic — give up quietly, no modal.
        recordingRef.current = false;
        setDenied(true);
        setRecording(false);
      } else if (err === "no-speech" || err === "aborted") {
        // Recoverable: onend will auto-restart while the toggle is still on.
      } else {
        // network / unknown — stop without an error modal.
        recordingRef.current = false;
        setRecording(false);
      }
    };

    rec.onend = () => {
      flushInterim();
      finalLenRef.current = 0;
      if (recordingRef.current) {
        // iOS Safari ends after pauses — restart to keep listening.
        try {
          rec.start();
        } catch {
          // Too soon after end; retry once shortly.
          window.setTimeout(() => {
            if (recordingRef.current) {
              try {
                rec.start();
              } catch {
                recordingRef.current = false;
                setRecording(false);
              }
            }
          }, 300);
        }
      } else {
        setRecording(false);
      }
    };

    return rec;
  }, [lang, emitInterim, flushInterim]);

  const start = useCallback(() => {
    if (!getRecognitionCtor() || !window.isSecureContext) return;
    setDenied(false);
    finalLenRef.current = 0;
    interimRef.current = "";
    if (!recRef.current) recRef.current = build();
    const rec = recRef.current;
    if (!rec) return;
    rec.lang = lang;
    recordingRef.current = true;
    try {
      rec.start();
      setRecording(true);
    } catch {
      // start() while already running throws — ignore.
    }
  }, [build, lang]);

  const stop = useCallback(() => {
    recordingRef.current = false;
    flushInterim();
    const rec = recRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        /* not running */
      }
    }
    setRecording(false);
  }, [flushInterim]);

  const toggle = useCallback(() => {
    if (recordingRef.current) stop();
    else start();
  }, [start, stop]);

  // Stop on unmount — covers pressing Continue and navigating screens.
  useEffect(() => {
    return () => {
      recordingRef.current = false;
      const rec = recRef.current;
      if (rec) {
        try {
          rec.stop();
        } catch {
          /* */
        }
      }
    };
  }, []);

  return { supported, recording, denied, toggle, stop };
}
