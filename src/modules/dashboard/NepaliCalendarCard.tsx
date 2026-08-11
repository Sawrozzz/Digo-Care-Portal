import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import type { BsCalendarCell } from "../../utils";
import {
  BS_MAX_YEAR,
  BS_MIN_YEAR,
  BS_MONTHS_EN,
  BS_MONTHS_NP,
  WEEKDAYS_EN,
  WEEKDAYS_NP,
  buildBsMonthGrid,
  shiftBsMonth,
  toBsDate,
  toNepaliDigits,
} from "../../utils";

/**
 * Bikram Sambat month grid with the Gregorian day carried in each cell, so the
 * two calendars can be read against each other without switching views.
 */
export function NepaliCalendarCard({ className }: { className?: string }) {
  const today = useMemo(() => new Date(), []);
  const todayBs = useMemo(() => toBsDate(today), [today]);

  const [view, setView] = useState(() =>
    todayBs
      ? { year: todayBs.year, month: todayBs.month }
      : { year: BS_MIN_YEAR, month: 0 }
  );

  const cells = useMemo(
    () => buildBsMonthGrid(view.year, view.month, today),
    [view, today]
  );

  const isCurrentMonth =
    todayBs?.year === view.year && todayBs?.month === view.month;

  const atStart = view.year <= BS_MIN_YEAR && view.month === 0;
  const atEnd = view.year >= BS_MAX_YEAR && view.month === 11;

  /** The BS month spans two AD months — name both, e.g. "Jul – Aug 2026". */
  const adRange = useMemo(() => {
    const days = cells.filter((cell): cell is BsCalendarCell => cell !== null);
    if (!days.length) return "";

    const first = days[0].adDate;
    const last = days[days.length - 1].adDate;
    const month = (date: Date) =>
      date.toLocaleString("en-US", { month: "short" });

    return first.getMonth() === last.getMonth()
      ? `${month(first)} ${first.getFullYear()}`
      : `${month(first)} – ${month(last)} ${last.getFullYear()}`;
  }, [cells]);

  if (!todayBs) {
    return null;
  }

  return (
    <Card className={cn("gap-0", className)}>
      <CardHeader className="gap-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-(--color-primary-dark)">
              <CalendarDays className="size-4" />
            </span>
            <div>
              <p className="leading-tight font-medium">
                {BS_MONTHS_NP[view.month]} {toNepaliDigits(view.year)}
              </p>
              <p className="text-xs text-muted-foreground">
                {BS_MONTHS_EN[view.month]} {view.year} · {adRange}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Previous month"
              disabled={atStart}
              onClick={() =>
                setView((current) =>
                  shiftBsMonth(current.year, current.month, -1)
                )
              }
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Next month"
              disabled={atEnd}
              onClick={() =>
                setView((current) =>
                  shiftBsMonth(current.year, current.month, 1)
                )
              }
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-lg bg-primary/10 px-3 py-2">
          <div>
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="text-sm font-medium">
              {BS_MONTHS_NP[todayBs.month]} {toNepaliDigits(todayBs.date)},{" "}
              {toNepaliDigits(todayBs.year)}
            </p>
          </div>
          <p className="text-right text-xs text-muted-foreground">
            {BS_MONTHS_EN[todayBs.month]} {todayBs.date}
            <br />
            {today.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pb-1">
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS_NP.map((day, index) => (
            <div
              key={day}
              className={cn(
                "pb-1 text-center text-[11px] font-medium",
                index === 6 ? "text-destructive" : "text-muted-foreground"
              )}
              title={WEEKDAYS_EN[index]}
            >
              {day}
            </div>
          ))}

          {cells.map((cell, index) =>
            cell === null ? (
              <div key={`blank-${index}`} aria-hidden="true" />
            ) : (
              <div
                key={cell.bsDate}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center rounded-md leading-none transition-colors",
                  // the deep green, not --color-primary: white needs 4.5:1 and
                  // the brand green is far too light to carry it
                  cell.isToday
                    ? "bg-(--color-primary-dark) text-white shadow-sm"
                    : "hover:bg-muted",
                  !cell.isToday && cell.isHoliday && "text-destructive"
                )}
              >
                <span className="text-[13px] font-medium tabular-nums">
                  {toNepaliDigits(cell.bsDate)}
                </span>
                <span
                  className={cn(
                    "mt-0.5 text-[9px] tabular-nums",
                    cell.isToday ? "text-white/85" : "text-muted-foreground"
                  )}
                >
                  {cell.adDate.getDate()}
                </span>
              </div>
            )
          )}
        </div>
      </CardContent>

      {!isCurrentMonth && (
        <div className="px-4 pb-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-full text-xs"
            onClick={() =>
              setView({ year: todayBs.year, month: todayBs.month })
            }
          >
            Back to {BS_MONTHS_EN[todayBs.month]}
          </Button>
        </div>
      )}
    </Card>
  );
}
