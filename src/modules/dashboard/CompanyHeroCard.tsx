import { CalendarDays, Clock, Sparkles } from "lucide-react";

import { cn } from "../../lib/utils";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import type { Company } from "../../utils";
import {
  BS_MONTHS_EN,
  BS_MONTHS_NP,
  WEEKDAYS_EN,
  WEEKDAYS_NP,
  toBsDate,
  toNepaliDigits,
} from "../../utils";
import { CareIllustration } from "./DashboardIllustrations";

const greetingFor = (hour: number) => {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const initialsOf = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "?";

export function CompanyHeroCard({
  company,
  now,
  className,
}: {
  company: Company | null;
  now: Date;
  className?: string;
}) {
  const bs = toBsDate(now);
  const weekday = now.getDay();

  return (
    <Card
      className={cn(
        "relative gap-0 overflow-hidden bg-linear-to-br from-primary/12 via-card to-card p-5",
        className
      )}
    >
      <CareIllustration className="pointer-events-none absolute -top-4 -right-6 hidden h-44 w-auto opacity-90 @3xl/main:block" />

      <div className="relative @3xl/main:max-w-[62%]">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Sparkles className="size-3.5 text-(--color-primary-dark)" />
          {greetingFor(now.getHours())}
        </p>

        <div className="mt-2 flex items-center gap-3">
          <Avatar size="lg" className="size-11">
            {company?.avatar?.url && (
              <AvatarImage
                src={company.avatar.url}
                alt={company.display_name || company.name || "Company"}
              />
            )}
            <AvatarFallback className="bg-primary/20 font-medium text-(--color-primary-dark)">
              {initialsOf(company?.display_name || company?.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold">
              {company?.display_name || company?.name || "No company selected"}
            </h2>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              {company?.status && (
                <Badge
                  variant={
                    company.status.toLowerCase() === "active"
                      ? "default"
                      : "outline"
                  }
                  className="capitalize"
                >
                  {company.status}
                </Badge>
              )}
              {company?.address?.municipality && (
                <span className="text-sm text-muted-foreground">
                  {company.address.municipality}
                  {company.address.province
                    ? `, ${company.address.province}`
                    : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Today, in both calendars */}
        <div className="mt-4 flex flex-wrap gap-2">
          {bs && (
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-foreground/10">
              <CalendarDays className="size-3.5 text-(--color-primary-dark)" />
              <span className="font-medium">
                {WEEKDAYS_NP[weekday]}बार, {BS_MONTHS_NP[bs.month]}{" "}
                {toNepaliDigits(bs.date)}, {toNepaliDigits(bs.year)}
              </span>
              <span className="text-muted-foreground">
                ({BS_MONTHS_EN[bs.month]} {bs.date}, {bs.year} BS)
              </span>
            </span>
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-foreground/10">
            <Clock className="size-3.5 text-muted-foreground" />
            <span className="font-medium">
              {WEEKDAYS_EN[weekday]},{" "}
              {now.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="text-muted-foreground">AD</span>
          </span>
        </div>
      </div>
    </Card>
  );
}
