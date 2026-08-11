import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Minus } from "lucide-react";

import { cn } from "../../lib/utils";
import { Card } from "../../components/ui/card";

/** 1,284 / 12.9K / 4.2M — the stat-tile value contract. */
const formatCompact = (value: number) => {
  if (Math.abs(value) >= 1_000_000)
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (Math.abs(value) >= 10_000)
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return value.toLocaleString("en-US");
};

type SparklineProps = {
  points: number[];
  /** css color for the trace; the current period gets the solid end dot */
  color: string;
};

type MeterProps = {
  value: number;
  total: number;
  color: string;
};

type StatTileProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  /** Signed change against a named period, e.g. `{ value: 4, period: "this month" }`. */
  delta?: { value: number; period: string };
  caption?: string;
  sparkline?: SparklineProps;
  meter?: MeterProps;
  className?: string;
};

/**
 * A 12-point-style trace. Drawn with `preserveAspectRatio="none"` so it fills
 * the tile's width; `vector-effect` keeps the 2px stroke from stretching, and
 * the end dot is HTML rather than SVG so it stays a circle.
 */
function Sparkline({ points, color }: SparklineProps) {
  if (points.length < 2) return null;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = 100 / (points.length - 1);

  const coords = points.map((point, index) => ({
    x: index * step,
    // 2px of headroom top and bottom so the stroke is never clipped
    y: 30 - ((point - min) / span) * 28,
  }));

  const line = coords
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x} ${y}`)
    .join(" ");

  const last = coords[coords.length - 1];

  return (
    <div className="relative mt-3 h-8 pr-1.5">
      <svg
        viewBox="0 0 100 32"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        <path
          d={`${line} L100 32 L0 32 Z`}
          fill={color}
          opacity="0.1"
          stroke="none"
        />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* current period, in the accent — 8px mark with a 2px surface ring */}
      <span
        className="absolute size-2 -translate-x-1/2 translate-y-1/2 rounded-full ring-2 ring-card"
        style={{
          background: color,
          left: "calc(100% - 6px)",
          bottom: `${((32 - last.y) / 32) * 100}%`,
        }}
      />
    </div>
  );
}

function Meter({ value, total, color }: MeterProps) {
  const share = total > 0 ? Math.min(1, value / total) : 0;

  return (
    <div className="mt-3 space-y-1.5">
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-(--viz-track)"
        role="img"
        aria-label={`${value} of ${total}`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${share * 100}%`, background: color }}
        />
      </div>
      <p className="text-xs text-muted-foreground tabular-nums">
        {Math.round(share * 100)}% of {total.toLocaleString("en-US")}
      </p>
    </div>
  );
}

export function StatTile({
  label,
  value,
  icon: Icon,
  delta,
  caption,
  sparkline,
  meter,
  className,
}: StatTileProps) {
  const hasDelta = delta && delta.value !== 0;

  return (
    <Card className={cn("gap-0 p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-(--color-primary-dark)">
          <Icon className="size-4" />
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {/* proportional figures — tabular-nums would loosen a large standalone number */}
        <span className="text-3xl leading-none font-semibold">
          {formatCompact(value)}
        </span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              hasDelta ? "text-(--viz-success)" : "text-muted-foreground"
            )}
          >
            {hasDelta ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <Minus className="size-3.5" />
            )}
            {hasDelta ? `+${delta.value}` : "0"} {delta.period}
          </span>
        )}
      </div>

      {caption && (
        <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
      )}

      {sparkline && <Sparkline {...sparkline} />}
      {meter && <Meter {...meter} />}
    </Card>
  );
}
