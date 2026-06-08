/** Calm purple dot-trio (opacity pulse, §5/§6). Shared by processing + thinking. */
export function LoadingDots() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2.5 w-2.5 rounded-full bg-purple"
          style={{ animation: "gm-dot 1.4s ease-in-out infinite", animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}
