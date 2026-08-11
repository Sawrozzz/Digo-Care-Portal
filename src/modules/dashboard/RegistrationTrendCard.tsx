import { useMemo, useState } from "react";
import { BarChart2, Table2 } from "lucide-react";

import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { EmptyStateIllustration } from "./DashboardIllustrations";
import type { TrendPoint } from "./dashboardStats";

const SERIES = [
  { key: "patients", label: "Patients", color: "var(--viz-series-1)" },
  { key: "employees", label: "Employees", color: "var(--viz-series-2)" },
] as const;

const PLOT_HEIGHT = 200;

/**
 * Rounds the axis top so all four quarter-ticks land on clean whole numbers
 * (0 / 4 / 8 / 12 / 16 rather than 0 / 3.25 / 6.5 / …).
 */
const niceMax = (value: number) => {
  const target = Math.max(4, value);
  const magnitude = 10 ** Math.floor(Math.log10(target / 4));
  return Math.ceil(target / 4 / magnitude) * magnitude * 4;
};

export function RegistrationTrendCard({
  trend,
  className,
}: {
  trend: TrendPoint[];
  className?: string;
}) {
  const [asTable, setAsTable] = useState(false);

  const max = useMemo(
    () =>
      niceMax(
        Math.max(
          1,
          ...trend.map((point) => Math.max(point.patients, point.employees))
        )
      ),
    [trend]
  );

  const total = trend.reduce(
    (sum, point) => sum + point.patients + point.employees,
    0
  );

  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <Card className={cn("gap-0", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-medium">Registrations</p>
            <p className="text-sm text-muted-foreground">
              New patients and staff over the last {trend.length} months
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAsTable((current) => !current)}
          >
            {asTable ? (
              <BarChart2 className="size-3.5" />
            ) : (
              <Table2 className="size-3.5" />
            )}
            {asTable ? "Chart" : "Table"}
          </Button>
        </div>

        {/* legend — identity is never carried by color alone */}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {SERIES.map((series) => (
            <span
              key={series.key}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                className="size-2.5 rounded-full"
                style={{ background: series.color }}
              />
              {series.label}
            </span>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pb-5">
        {total === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <EmptyStateIllustration className="h-24 w-auto" />
            <p className="text-sm text-muted-foreground">
              No registrations recorded in this period yet.
            </p>
          </div>
        ) : asTable ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Month</th>
                  <th className="py-2 pr-3 font-medium">Nepali month</th>
                  <th className="py-2 pr-3 text-right font-medium">Patients</th>
                  <th className="py-2 text-right font-medium">Employees</th>
                </tr>
              </thead>
              <tbody>
                {trend.map((point) => (
                  <tr key={point.key} className="border-b last:border-0">
                    <td className="py-2 pr-3">{point.adLabel}</td>
                    <td className="py-2 pr-3 text-muted-foreground">
                      {point.bsLabel}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {point.patients}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {point.employees}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="pl-8">
            <div className="relative" style={{ height: PLOT_HEIGHT }}>
              {/* hairline gridlines + y ticks */}
              {ticks.map((tick) => (
                <div
                  key={tick}
                  className="absolute inset-x-0 border-t border-(--viz-grid)"
                  style={{ bottom: `${tick * 100}%` }}
                >
                  <span className="absolute -top-2 -left-8 w-6 text-right text-[11px] text-muted-foreground tabular-nums">
                    {Math.round(max * tick)}
                  </span>
                </div>
              ))}

              <div className="absolute inset-0 flex items-end">
                {trend.map((point) => (
                  <div
                    key={point.key}
                    tabIndex={0}
                    className="group/col relative flex h-full flex-1 items-end justify-center gap-[2px] rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {SERIES.map((series) => (
                      <div
                        key={series.key}
                        className="w-full max-w-[22px] rounded-t-[4px] transition-[height] duration-500"
                        style={{
                          height: `${(point[series.key] / max) * 100}%`,
                          minHeight: point[series.key] > 0 ? 3 : 0,
                          background: series.color,
                        }}
                      />
                    ))}

                    {/* tooltip stays inside the plot box — the card clips overflow */}
                    <div className="pointer-events-none absolute top-0 left-1/2 z-10 hidden -translate-x-1/2 rounded-md border bg-popover px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md group-focus-visible/col:block group-hover/col:block">
                      <p className="font-medium">{point.adLabel}</p>
                      <p className="text-muted-foreground">{point.bsLabel}</p>
                      {SERIES.map((series) => (
                        <p
                          key={series.key}
                          className="mt-0.5 flex items-center gap-1.5"
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ background: series.color }}
                          />
                          {series.label}
                          <span className="ml-auto pl-2 font-medium tabular-nums">
                            {point[series.key]}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* x-axis band, sized inside the card so it never nests a scrollbar */}
            <div className="mt-2 flex border-t pt-2">
              {trend.map((point) => (
                <div key={point.key} className="flex-1 text-center">
                  <p className="text-xs font-medium">{point.adLabel}</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {point.bsLabel.split(" · ")[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
