/** Thin fit bar (§4): purple fill on a lavender track, grows from 0 once. */
export function Bar({ value, className = "h-1" }: { value: number; className?: string }) {
  const pct = Math.max(2, Math.min(100, value));
  return (
    <div className={`w-full overflow-hidden rounded-full bg-tint ${className}`}>
      <div className="gm-grow h-full rounded-full bg-purple" style={{ width: `${pct}%` }} />
    </div>
  );
}
