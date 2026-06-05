import type { Coach } from "@/lib/types";

const SIZES = {
  sm: "h-11 w-11 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-16 w-16 text-lg",
  xl: "h-20 w-20 text-xl",
} as const;

/**
 * Circular initials avatar on a lavender tint (§4). Never stock photos, never
 * colour-coded blobs. `accent` is accepted (callers pass coach/persona data)
 * but intentionally not used — the design system keeps avatars uniform.
 */
export function Avatar({
  initials,
  accent: _accent,
  size = "md",
  className = "",
}: {
  initials: string;
  accent?: Coach["accent"];
  size?: keyof typeof SIZES;
  className?: string;
}) {
  void _accent;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-tint font-semibold text-purple-700 ${SIZES[size]} ${className}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
