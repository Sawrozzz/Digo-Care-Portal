/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState, useEffect, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import {
  User2Icon,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  Contact,
  CalendarRange,
  FolderOpen,
  Scan,
  User,
  Cake,
  Droplet,
  Heart,
  BadgeCheck,
  Hash,
  ExternalLink,
} from "lucide-react";
import { getAPatientsOfACompany } from "./patientApi";
import { Loader } from "../../components/custom/Loader";
import { Breadcrumb } from "../../components/custom/Breadcrumb";
import { SiteHeader } from "../../components/ui/site-header";
import { BASE_URL, parseSinglePatientData } from "../../utils";
import type { Patient } from "../../utils";

import { useCompanyStore } from "../../zustand/companyStore";
import { CustomTab } from "../../components/custom";
import { PatientFilesTab } from "./PatientFilesTab";
import PatientVisitSchedulesList from "./PatientVisitSchedulesList";

/** Rounded surface every overview panel sits on. */
function InfoCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: typeof User;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
        className ?? ""
      }`}
    >
      <header className="mb-5 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-(--color-primary-dark) ring-1 ring-emerald-100">
          <Icon size={17} />
        </span>
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof User;
  label: string;
  value?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon size={15} className="mt-1 shrink-0 text-gray-400" />}
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium break-words text-gray-900">
          {value || <span className="text-gray-400">—</span>}
        </dd>
      </div>
    </div>
  );
}

function Chip({
  icon: Icon,
  children,
}: {
  icon?: typeof User;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
      {Icon && <Icon size={12} className="text-gray-500" />}
      {children}
    </span>
  );
}

/** `dob` is a free-form string from the API — only show an age we can trust. */
const ageFrom = (dob?: string) => {
  if (!dob) return null;
  const born = new Date(dob);
  if (Number.isNaN(born.getTime())) return null;
  const years = Math.floor(
    (Date.now() - born.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  return years >= 0 && years < 130 ? years : null;
};

export default function PatientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { activeCompany } = useCompanyStore();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * `silent` refetches keep the page rendered — used after a file upload or
   * delete, where dropping back to the full-page loader would be jarring.
   */
  const loadPatient = useCallback(
    async (silent = false) => {
      if (!id) {
        setError("Patient ID not found");
        setLoading(false);
        return;
      } else if (!activeCompany?.id) {
        setError("Company Id not found");
        setLoading(false);
        return;
      }

      try {
        if (!silent) setLoading(true);
        const response = await getAPatientsOfACompany(
          Number(activeCompany?.id),
          Number(id)
        );
        if (response) {
          setPatient(parseSinglePatientData(response));
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch patient details");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [id, activeCompany?.id]
  );

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  const refreshPatient = useCallback(() => loadPatient(true), [loadPatient]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader size={72} />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader name="Patient Profile" />

        <div className="border-b border-gray-100">
          <div className="px-4 py-3 lg:px-6">
            <Breadcrumb
              items={[
                { label: "Patients", path: "/patients" },
                { label: "Error" },
              ]}
            />
          </div>
        </div>

        <div className="px-4 py-8 lg:px-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <p className="text-lg font-semibold text-red-700">
              {error || "Patient not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = patient.avatar?.url
    ? patient.avatar.url.startsWith("http")
      ? patient.avatar.url
      : `${BASE_URL}${patient.avatar.url}`
    : null;

  const age = ageFrom(patient.dob);
  const phones = [patient.phone, patient.phone2].filter(Boolean) as string[];
  const isActive = patient.status === "active";

  const tabData = [
    {
      value: "overview",
      label: "Overview",
      icon: <User2Icon size={16} />,
      content: (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Personal Information */}
          <InfoCard icon={Contact} title="General Information">
            <dl className="grid grid-cols-2 gap-5">
              <InfoRow icon={User} label="Gender" value={patient.gender} />
              <InfoRow
                icon={Droplet}
                label="Blood Group"
                value={patient.blood_group}
              />
              <InfoRow
                icon={Heart}
                label="Marital Status"
                value={patient.marital_status}
              />
              <InfoRow
                icon={Cake}
                label="Date of Birth"
                value={
                  patient.dob
                    ? `${patient.dob}${age !== null ? ` · ${age} yrs` : ""}`
                    : undefined
                }
              />
            </dl>
          </InfoCard>

          {/* Contact Card */}
          <InfoCard icon={Phone} title="Contact">
            <dl className="space-y-5">
              <InfoRow
                icon={Mail}
                label="Email"
                value={
                  patient.email ? (
                    <a
                      href={`mailto:${patient.email}`}
                      className="text-(--color-primary-dark) hover:underline"
                    >
                      {patient.email}
                    </a>
                  ) : undefined
                }
              />
              <InfoRow
                icon={Phone}
                label={phones.length > 1 ? "Phone Numbers" : "Phone"}
                value={
                  phones.length ? (
                    <span className="flex flex-col gap-0.5">
                      {phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          className="hover:text-(--color-primary-dark)"
                        >
                          {phone}
                        </a>
                      ))}
                    </span>
                  ) : undefined
                }
              />
            </dl>
          </InfoCard>

          {/* Location Card */}
          <InfoCard icon={MapPin} title="Location">
            {patient.address ? (
              <>
                <dl className="grid grid-cols-2 gap-5">
                  {Object.entries(patient.address).map(([key, value]) => {
                    if (!value || key === "id" || key === "google_map")
                      return null;

                    return (
                      <InfoRow
                        key={key}
                        label={key.replace(/_/g, " ")}
                        value={String(value)}
                      />
                    );
                  })}
                </dl>

                {patient.address.google_map && (
                  <a
                    href={String(patient.address.google_map)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-(--color-primary) hover:text-(--color-primary-dark)"
                  >
                    <MapPin size={14} />
                    View on Google Maps
                    <ExternalLink size={12} className="text-gray-400" />
                  </a>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-400">No address on record.</p>
            )}
          </InfoCard>
        </div>
      ),
    },
    {
      value: "x_rays",
      label: "Medical X-Rays",
      icon: <Scan size={16} />,
      content: (
        <PatientFilesTab
          companyId={Number(activeCompany?.id)}
          patientId={Number(id)}
          field="x_rays"
          files={patient.x_rays ?? []}
          onChanged={refreshPatient}
        />
      ),
    },
    {
      value: "documents",
      label: "Documents",
      icon: <FolderOpen size={16} />,
      content: (
        <PatientFilesTab
          companyId={Number(activeCompany?.id)}
          patientId={Number(id)}
          field="documents"
          files={patient.documents ?? []}
          onChanged={refreshPatient}
        />
      ),
    },
    {
      value: "visits",
      label: "Visits",
      icon: <CalendarRange size={16} />,
      content:
        activeCompany?.id && id ? (
          <PatientVisitSchedulesList
            companyId={Number(activeCompany.id)}
            patientId={Number(id)}
          />
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <span className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <CalendarRange size={22} />
            </span>
            <h3 className="font-semibold text-gray-900">No visits scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">
              Visit schedules of the employees assigned to this patient will
              show up here.
            </p>
          </div>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/70">
      <SiteHeader name="Patient Profile" />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-100 bg-white">
        <div className="px-4 py-3 lg:px-6">
          <Breadcrumb
            items={[
              { label: "Patients", path: "/patients" },
              { label: patient?.name || "" },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl px-4 py-6 lg:px-6 lg:py-8">
        {/* Identity banner */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="h-20 bg-linear-to-r from-(--color-primary) via-(--color-primary-soft) to-teal-200 sm:h-24" />

          <div className="px-6 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="-mt-12 flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 shadow-md ring-4 ring-white sm:-mt-14 sm:size-28">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={patient.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <User2Icon size={40} className="text-gray-300" />
                )}
              </div>

              <div className="min-w-0 flex-1 sm:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {patient.name}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isActive ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />
                    {patient.status}
                  </span>
                  {patient.has_account && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                      <BadgeCheck size={12} />
                      Has account
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {patient.patient_id && (
                    <Chip icon={Hash}>{patient.patient_id}</Chip>
                  )}
                  {patient.gender && <Chip icon={User}>{patient.gender}</Chip>}
                  {patient.blood_group && (
                    <Chip icon={Droplet}>{patient.blood_group}</Chip>
                  )}
                  {age !== null && <Chip icon={Cake}>{age} yrs</Chip>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:pb-1">
                {patient.email && (
                  <a
                    href={`mailto:${patient.email}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-(--color-primary) hover:text-(--color-primary-dark)"
                  >
                    <Mail size={15} />
                    Email
                  </a>
                )}
                {patient.phone && (
                  <a
                    href={`tel:${patient.phone}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-(--color-primary) hover:text-(--color-primary-dark)"
                  >
                    <Phone size={15} />
                    Call
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <CustomTab items={tabData} className="w-full" />
      </div>
    </div>
  );
}
