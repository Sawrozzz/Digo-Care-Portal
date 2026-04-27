/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  User2Icon,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  Contact,
  Building2,
  CalendarRange,
  FileText,
  Download,
  Eye,
  User,
  Timer,
} from "lucide-react";
import { getAPatientsOfACompany } from "./patientApi";
import { Loader } from "../../components/custom/Loader";
import { Breadcrumb } from "../../components/custom/Breadcrumb";
import { SiteHeader } from "../../components/ui/site-header";
import { BASE_URL, parseSinglePatientData } from "../../utils";
import type { Patient } from "../../utils";

import { useCompanyStore } from "../../zustand/companyStore";
import { CustomTab } from "../../components/custom";

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

  const tabData = [
    {
      value: "overview",
      label: "Overview",
      icon: <User2Icon size={16} />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Personal Information*/}
          <div className="bg-white border border-gray-100 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Contact size={20} />
              <h2 className="text-lg font-bold text-gray-900">
                General Informations
              </h2>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-gray-500 uppercase tracking-wider">
                  <User size={14} />
                  <span className="text-[10px] font-bold">
                    Gender | Material Status | Blood Group
                  </span>
                </div>
                <p className="text-sm text-gray-900 ml-6 mt-1">
                  {patient?.gender} | {patient?.marital_status} |{" "}
                  {patient?.blood_group}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 uppercase tracking-wider">
                  <Timer size={14} />
                  <span className="text-[10px] font-bold">DOB</span>
                </div>
                <p className="text-sm text-gray-900 ml-6 mt-1">
                  {patient?.dob}
                </p>
              </div>
            </div>
          </div>
          {/* Contact Card */}
          <div className="bg-white border border-gray-100 rounded-lg p-6 ">
            <div className="flex items-center gap-2 mb-6">
              <Contact size={20} />
              <h2 className="text-lg font-bold text-gray-900">Contact</h2>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-gray-500 uppercase tracking-wider">
                  <Mail size={14} />
                  <span className="text-[10px] font-bold">Email</span>
                </div>
                <p className="text-sm text-gray-900 ml-6 mt-1">
                  {patient.email}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 uppercase tracking-wider">
                  <Phone size={14} />
                  <span className="text-[10px] font-bold">Phone</span>
                </div>
                <div className="space-y-1 mt-1 ml-6">
                  {[patient.phone, patient.phone2]
                    .filter(Boolean)
                    .map((phone, i) => (
                      <p key={i} className="text-sm text-gray-900">
                        {phone}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Location Card */}
          {patient.address && (
            <div className="bg-white border border-gray-100 rounded-lg p-6 ">
              <div className="flex items-center gap-2 mb-6">
                <MapPin size={20} />
                <h2 className="text-lg font-bold text-gray-900">Location</h2>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                {Object.entries(patient.address).map(([key, value]) => {
                  if (!value || key === "id") return null;
                  return (
                    <div key={key}>
                      <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">
                        {key.replace("_", " ")}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {String(value)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      value: "x_rays",
      label: "Medical X-Rays",
      icon: <FileText size={16} />,
      content: (
        <div className="bg-white border border-gray-100 rounded-lg  overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">X-Ray Images</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
              {patient?.x_rays?.length || 0} Files
            </span>
          </div>

          <div className="divide-y divide-gray-50">
            {patient?.x_rays && patient.x_rays.length > 0 ? (
              patient.x_rays.map((doc) => {
                const fullUrl = doc.url.startsWith("http")
                  ? doc.url
                  : `${BASE_URL}${doc.url}`;

                return (
                  <div
                    key={doc.id}
                    className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 cursor-zoom-in border border-gray-200 group relative"
                        onClick={() => window.open(fullUrl, "_blank")} // Simple preview for now, or use a Modal
                      >
                        <img
                          src={fullUrl}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          alt="thumbnail"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye size={16} className="text-white" />
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-tighter">
                          {(doc.byte_size / 1024).toFixed(2)} KB •{" "}
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Download Button */}
                      <a
                        href={fullUrl}
                        download={doc.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Download Image"
                      >
                        <Download size={18} />
                      </a>

                      {/* Full View Button */}
                      <button
                        onClick={() => window.open(fullUrl, "_blank")}
                        className="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        View Full
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-sm italic">
                  No medical X-Rays found for this patient.
                </p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      value: "visits",
      label: "Visits",
      icon: <CalendarRange size={16} />,
      content: (
        <div className="bg-white border border-gray-100 rounded-lg p-8 text-center">
          <h3 className="text-gray-900 font-semibold">
            Visit Schedules of assigned Employees here.
          </h3>
        </div>
      ),
    },
  ];

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
      <div className="px-4 lg:px-6 py-8 max-w-8xl">
        {/* Top Banner remains same */}
        <div className="bg-white border border-gray-100 rounded-lg p-6 mb-8 ">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-50 border-2 border-white  flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={patient.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 size={40} className="text-gray-300" />
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {patient.name}
              </h1>
              <span
                className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  patient?.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {patient?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs - This now contains your Contact/Location info in the first tab */}
        <CustomTab items={tabData} className="w-full" />
      </div>
    </div>
  );
}
