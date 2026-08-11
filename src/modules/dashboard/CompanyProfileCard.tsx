import { Link } from "react-router-dom";
import { Building2, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import type { Company } from "../../utils";

const Row = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | number | null;
  href?: string;
}) => (
  <div className="flex items-start gap-2.5">
    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      {value ? (
        href ? (
          <a
            href={href}
            className="text-sm break-words hover:underline"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm break-words">{value}</p>
        )
      ) : (
        <p className="text-sm text-muted-foreground">—</p>
      )}
    </div>
  </div>
);

export function CompanyProfileCard({
  company,
  className,
}: {
  company: Company | null;
  className?: string;
}) {
  const address = company?.address;
  const location = [
    address?.municipality,
    address?.ward_no ? `Ward ${address.ward_no}` : null,
    address?.district,
    address?.province,
    address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className={cn("gap-0", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-(--color-primary-dark)">
              <Building2 className="size-4" />
            </span>
            <div>
              <p className="leading-tight font-medium">Company details</p>
              <p className="text-xs text-muted-foreground">
                {company?.name ?? "No company selected"}
              </p>
            </div>
          </div>

          {company?.id && (
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/companies/${company.id}`}>Open</Link>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5 pb-5">
        <Row
          icon={Mail}
          label="Email"
          value={company?.email}
          href={company?.email ? `mailto:${company.email}` : undefined}
        />
        <Row
          icon={Phone}
          label="Phone"
          value={[company?.phone, company?.phone2].filter(Boolean).join(" · ")}
          href={company?.phone ? `tel:${company.phone}` : undefined}
        />
        <Row icon={MapPin} label="Address" value={location} />

        {address?.google_map && (
          <a
            href={address.google_map}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-(--color-primary-dark) hover:underline"
          >
            View on Google Maps
            <ExternalLink className="size-3.5" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
