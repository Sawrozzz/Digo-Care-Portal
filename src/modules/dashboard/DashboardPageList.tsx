import { useMemo } from "react";
import { HeartPulse, ShieldCheck, Stethoscope, Users } from "lucide-react";

import { Loader } from "../../components/custom";
import { SiteHeader } from "../../components/ui/site-header";
import { Card } from "../../components/ui/card";
import { useCompanyStore } from "../../zustand/companyStore";
import { CompanyHeroCard } from "./CompanyHeroCard";
import { CompanyProfileCard } from "./CompanyProfileCard";
import { EmptyStateIllustration } from "./DashboardIllustrations";
import { NepaliCalendarCard } from "./NepaliCalendarCard";
import { RecentRegistrationsCard } from "./RecentRegistrationsCard";
import { RegistrationTrendCard } from "./RegistrationTrendCard";
import { SpecializationCard } from "./SpecializationCard";
import { StatTile } from "./StatTile";
import { useDashboardData } from "./useDashboardData";

/**
 * Company dashboard. Everything below the header is scoped to `activeCompany`,
 * so switching companies in the sidebar re-scopes the whole page.
 */
export default function DashboardPageList() {
  const activeCompany = useCompanyStore((state) => state.activeCompany);
  const companyLoading = useCompanyStore((state) => state.loading);

  const now = useMemo(() => new Date(), []);
  const { stats, loading, error } = useDashboardData(activeCompany?.id);

  if (companyLoading) {
    return (
      <>
        <SiteHeader name="Dashboard" />
        <div className="flex flex-1 items-center justify-center py-20">
          <Loader size={48} />
        </div>
      </>
    );
  }

  if (!activeCompany) {
    return (
      <>
        <SiteHeader name="Dashboard" />
        <Card className="items-center gap-3 p-10 text-center">
          <EmptyStateIllustration className="h-28 w-auto" />
          <p className="font-medium">No company selected</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Pick a company from the switcher in the sidebar to see its
            dashboard.
          </p>
        </Card>
      </>
    );
  }

  return (
    <>
      <SiteHeader name="Dashboard" />

      {/* Refetches hold the previous render rather than flashing a skeleton. */}
      <div
        className={
          loading
            ? "flex flex-col gap-4 opacity-60 transition-opacity"
            : "flex flex-col gap-4"
        }
      >
        <CompanyHeroCard company={activeCompany} now={now} />

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <StatTile
            label="Patients"
            value={stats.totalPatients}
            icon={HeartPulse}
            delta={{ value: stats.newPatientsThisMonth, period: "this month" }}
            sparkline={{
              points: stats.patientSparkline,
              color: "var(--viz-series-1)",
            }}
          />
          <StatTile
            label="Employees"
            value={stats.totalEmployees}
            icon={Users}
            delta={{ value: stats.newEmployeesThisMonth, period: "this month" }}
            sparkline={{
              points: stats.employeeSparkline,
              color: "var(--viz-series-2)",
            }}
          />
          <StatTile
            label="Active patients"
            value={stats.activePatients}
            icon={Stethoscope}
            caption="Currently under care"
            meter={{
              value: stats.activePatients,
              total: stats.totalPatients,
              color: "var(--viz-series-1)",
            }}
          />
          <StatTile
            label="Portal accounts"
            value={stats.portalAccounts}
            icon={ShieldCheck}
            caption="Staff and patients who can sign in"
            meter={{
              value: stats.portalAccounts,
              total: stats.totalPeople,
              color: "var(--viz-series-1)",
            }}
          />
        </div>

        <div className="grid gap-4 @4xl/main:grid-cols-3">
          <RegistrationTrendCard
            trend={stats.trend}
            className="@4xl/main:col-span-2"
          />
          <NepaliCalendarCard />

          <SpecializationCard
            items={stats.specializations}
            totalEmployees={stats.totalEmployees}
          />
          <RecentRegistrationsCard entries={stats.recent} now={now} />
          <CompanyProfileCard company={activeCompany} />
        </div>
      </div>
    </>
  );
}
