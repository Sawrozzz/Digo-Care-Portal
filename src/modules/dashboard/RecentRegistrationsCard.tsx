import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { BS_MONTHS_NP, toBsDate, toNepaliDigits } from "../../utils";
import { EmptyStateIllustration } from "./DashboardIllustrations";
import type { RecentRegistration } from "./dashboardStats";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "?";

const relativeDay = (date: Date, now: Date) => {
  const days = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
};

export function RecentRegistrationsCard({
  entries,
  now,
  className,
}: {
  entries: RecentRegistration[];
  now: Date;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-(--color-primary-dark)">
            <UserPlus className="size-4" />
          </span>
          <div>
            <p className="leading-tight font-medium">Recently added</p>
            <p className="text-xs text-muted-foreground">
              Newest patients and staff in this company
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-5">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            <EmptyStateIllustration className="h-20 w-auto" />
            <p className="text-sm text-muted-foreground">
              Nobody has been registered yet.
            </p>
          </div>
        ) : (
          <ul className="-my-1 divide-y">
            {entries.map((entry) => {
              const bs = toBsDate(entry.registeredAt);

              return (
                <li key={entry.id}>
                  <Link
                    to={`/${entry.kind === "patient" ? "patients" : "employees"}/${entry.id.split("-")[1]}`}
                    className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted"
                  >
                    <Avatar>
                      {entry.avatarUrl && (
                        <AvatarImage src={entry.avatarUrl} alt={entry.name} />
                      )}
                      <AvatarFallback className="text-xs">
                        {initialsOf(entry.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {entry.name}
                      </p>
                      {/* the dot carries identity; the text stays in ink */}
                      <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{
                            background:
                              entry.kind === "patient"
                                ? "var(--viz-series-1)"
                                : "var(--viz-series-2)",
                          }}
                        />
                        <span className="capitalize">{entry.kind}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{entry.detail}</span>
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-xs font-medium">
                        {relativeDay(entry.registeredAt, now)}
                      </p>
                      {bs && (
                        <p className="text-[11px] text-muted-foreground">
                          {BS_MONTHS_NP[bs.month]} {toNepaliDigits(bs.date)}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
