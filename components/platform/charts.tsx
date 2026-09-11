"use client";

/**
 * Hand-rolled SVG charts — no chart dependency, tokens only, reliable on stage.
 * Orange/green/red here are SEMANTIC data colors (check-in zones), distinct from
 * the "orange = actions" rule that governs interactive UI (see DECISIONS.md).
 */

import { useCopy } from "@/components/platform/LanguageProvider";

const PURPLE = "var(--gm-purple-500)";
const TINT = "var(--gm-border)";
const GREEN = "var(--gm-success)";
const ORANGE = "var(--gm-orange-500)";
const RED = "var(--gm-error)";

function points(values: number[], w: number, h: number, min: number, max: number): string {
  const span = Math.max(1e-6, max - min);
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  return values
    .map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - min) / span) * h).toFixed(1)}`)
    .join(" ");
}

/** Tiny inline trend line (e.g. energy over check-ins). */
export function Sparkline({
  values,
  min = 1,
  max = 5,
  width = 96,
  height = 28,
}: {
  values: number[];
  min?: number;
  max?: number;
  width?: number;
  height?: number;
}) {
  if (values.length < 2) return null;
  const pad = 3;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <g transform={`translate(${pad},${pad})`}>
        <polyline
          points={points(values, width - pad * 2, height - pad * 2, min, max)}
          fill="none"
          stroke={PURPLE}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** Labeled line chart (employer wellbeing trend, check-in history). */
export function TrendChart({
  data,
  min,
  max,
  height = 160,
  formatValue = (v: number) => v.toFixed(1),
}: {
  data: { label: string; value: number }[];
  min: number;
  max: number;
  height?: number;
  formatValue?: (v: number) => string;
}) {
  const t = useCopy();
  const w = 560;
  const padX = 16;
  const padY = 22;
  const innerW = w - padX * 2;
  const innerH = height - padY * 2;
  const span = Math.max(1e-6, max - min);
  const step = data.length > 1 ? innerW / (data.length - 1) : 0;
  const xy = (v: number, i: number): [number, number] => [
    padX + i * step,
    padY + (innerH - ((v - min) / span) * innerH),
  ];

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      className="w-full"
      role="img"
      aria-label={t.charts.a11y.trend}
    >
      {/* gridlines */}
      {[0, 0.5, 1].map((t) => (
        <line
          key={t}
          x1={padX}
          x2={w - padX}
          y1={padY + innerH * t}
          y2={padY + innerH * t}
          stroke={TINT}
          strokeWidth="1"
        />
      ))}
      <polyline
        points={data.map((d, i) => xy(d.value, i).join(",")).join(" ")}
        fill="none"
        stroke={PURPLE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        const [x, y] = xy(d.value, i);
        return (
          <g key={d.label}>
            <circle cx={x} cy={y} r="4" fill="var(--gm-surface)" stroke={PURPLE} strokeWidth="2" />
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill="var(--gm-ink)"
            >
              {formatValue(d.value)}
            </text>
            <text
              x={x}
              y={height - 4}
              textAnchor="middle"
              fontSize="11"
              fill="var(--gm-text-2)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Horizontal green/orange/red distribution bar (percentages sum ~100). */
export function ZoneBar({
  green,
  orange,
  red,
  height = 12,
}: {
  green: number;
  orange: number;
  red: number;
  height?: number;
}) {
  const t = useCopy();
  const total = Math.max(1, green + orange + red);
  const g = (green / total) * 100;
  const o = (orange / total) * 100;
  const r = (red / total) * 100;
  return (
    <div
      className="flex w-full overflow-hidden rounded-full"
      style={{ height }}
      role="img"
      aria-label={t.charts.a11y.distribution(Math.round(g), Math.round(o), Math.round(r))}
    >
      <div style={{ width: `${g}%`, background: GREEN }} />
      <div style={{ width: `${o}%`, background: ORANGE }} />
      <div style={{ width: `${r}%`, background: RED }} />
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
  );
}

export function ZoneLegend() {
  const t = useCopy();
  return (
    <div className="flex items-center gap-4 text-[13px] text-muted">
      <span className="inline-flex items-center gap-1.5">
        <Dot color={GREEN} /> {t.charts.zone.green}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Dot color={ORANGE} /> {t.charts.zone.orange}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Dot color={RED} /> {t.charts.zone.red}
      </span>
    </div>
  );
}
