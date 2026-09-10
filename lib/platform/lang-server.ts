import { cookies } from "next/headers";
import { getCopy, LANG_COOKIE } from "./i18n";
import type { Copy, Lang } from "./copy";

/**
 * Server-side language + copy, read from the locale cookie. Using next/headers
 * makes the reading route dynamic (rendered per request) — fine for this demo,
 * and it lets server-rendered pages switch language on router.refresh().
 * next/headers is server-only, so importing this file from the client errors.
 */
export async function getServerLang(): Promise<Lang> {
  const store = await cookies();
  return store.get(LANG_COOKIE)?.value === "nl" ? "nl" : "en";
}

export async function getServerCopy(): Promise<Copy> {
  return getCopy(await getServerLang());
}
