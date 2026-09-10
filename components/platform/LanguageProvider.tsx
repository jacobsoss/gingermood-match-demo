"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCopy, LANG_COOKIE } from "@/lib/platform/i18n";
import type { Copy, Lang } from "@/lib/platform/copy";

/**
 * Client language state, seeded from the server (initialLang, read from the
 * cookie in the root layout — no hydration mismatch). Switching writes the
 * cookie, updates <html lang>, flips client copy instantly, and calls
 * router.refresh() so server-rendered pages re-render in the new language too.
 */
interface LangApi {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Copy;
}

const Ctx = createContext<LangApi | null>(null);

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const router = useRouter();

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      try {
        document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
        document.documentElement.lang = l;
      } catch {
        /* cookies blocked — client copy still updates in memory */
      }
      router.refresh();
    },
    [router],
  );

  const value = useMemo<LangApi>(() => ({ lang, setLang, t: getCopy(lang) }), [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within <LanguageProvider>");
  return ctx;
}

/** Copy for the current language (client components). */
export function useCopy(): Copy {
  return useLang().t;
}
