import { Stethoscope } from "lucide-react";

import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { EmptyStateIllustration } from "./DashboardIllustrations";
import type { BreakdownItem } from "./dashboardStats";

/**
 * Horizontal bars for a nominal breakdown — one hue for every bar, since the
 * categories have no natural order and bar length already carries magnitude.
 */
export function SpecializationCard({
  items,
  totalEmployees,
  className,
}: {
  items: BreakdownItem[];
  totalEmployees: number;
  className?: string;
}) {
  const max = Math.max(1, ...items.map((item) => item.count));
  const covered = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className={cn("gap-0", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-(--color-primary-dark)">
            <Stethoscope className="size-4" />
          </span>
          <div>
            <p className="leading-tight font-medium">Care team mix</p>
            <p className="text-xs text-muted-foreground">
              {items.length
                ? `Top ${items.length} of ${totalEmployees} staff by specialization`
                : "Staff by specialization"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            <EmptyStateIllustration className="h-20 w-auto" />
            <p className="text-sm text-muted-foreground">
              No specializations recorded on staff profiles yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm" title={item.label}>
                    {item.label}
                  </span>
                  <span className="shrink-0 text-sm font-medium tabular-nums">
                    {item.count}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-(--viz-track)">
                  <div
                    className="h-full rounded-full bg-(--viz-series-1) transition-[width] duration-500"
                    style={{ width: `${(item.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            {covered < totalEmployees && (
              <p className="pt-1 text-xs text-muted-foreground">
                {totalEmployees - covered} other{" "}
                {totalEmployees - covered === 1 ? "member" : "members"} not
                shown
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
