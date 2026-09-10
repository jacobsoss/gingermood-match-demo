import { en, type Copy, type Lang } from "./copy";
import { nl } from "./copy.nl";

/** Cookie that holds the chosen language ("en" | "nl"). */
export const LANG_COOKIE = "gm-lang";

/** Copy for a language. Falls back to English for anything unknown. */
export function getCopy(lang: Lang): Copy {
  return lang === "nl" ? nl : en;
}
