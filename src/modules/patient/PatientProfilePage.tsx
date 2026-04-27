/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User2Icon, AlertCircle } from "lucide-react";
import { getAPatientsOfACompany } from "./patientApi";
import { Loader } from "../../components/custom/Loader";
import { Breadcrumb } from "../../components/custom/Breadcrumb";
import { SiteHeader } from "../../components/ui/site-header";
import { BASE_URL, parseSinglePatientData } from "../../utils";
import type { Patient } from "../../utils";

import { useCompanyStore } from "../../zustand/companyStore";

export default function PatientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { activeCompany } = useCompanyStore();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
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
        setLoading(true);
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
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, activeCompany?.id]);

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
        {/* Site Header */}
        <SiteHeader name="Patient Profile" />

        {/* Breadcrumb Navigation */}
        <div className="border-b border-gray-100">
          <div className="px-4 lg:px-6 py-3">
            <Breadcrumb
              items={[
                { label: "Patients", path: "/patients" },
                { label: "Error" },
              ]}
            />
          </div>
        </div>

        <div className="px-4 lg:px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-semibold text-lg">
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

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader name="Patient Profile" />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-100">
        <div className="px-4 lg:px-6 py-3">
          <Breadcrumb
            items={[
              { label: "Patients", path: "/patients" },
              { label: patient?.name || "" },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-6 py-8">
        {/* Top Section - Avatar & Basic Info with Status */}
        <div className="bg-white border border-gray-100 rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-100 border flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={patient.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User2Icon size={40} className="text-gray-300" />
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {patient.name}
              </h1>
              <div
                className={`inline-flex items-center justify-center px-3 py-1 min-w-22.5 rounded-md text-xs font-medium capitalize ${
                  patient?.status?.toLowerCase() === "active"
                    ? "bg-green-100 text-green-700"
                    : patient?.status?.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : patient?.status?.toLowerCase() === "archived"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                }`}
              >
                {patient?.status || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
