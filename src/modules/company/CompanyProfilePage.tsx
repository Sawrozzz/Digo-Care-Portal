/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  AlertCircle,
  Contact,
  User,
  TimerIcon,
} from "lucide-react";
import { IconUsersGroup } from "@tabler/icons-react";
import { getSingleCompany } from "./companyApi";
import { Loader } from "../../components/custom/Loader";
import { Breadcrumb } from "../../components/custom/Breadcrumb";
import { SiteHeader } from "../../components/ui/site-header";
import { BASE_URL } from "../../utils";
import type { Company } from "./companyAttributes";
import { CustomTab } from "../../components/custom";

export default function CompanyProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) {
        setError("Company ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getSingleCompany(parseInt(id));
        if (response?.data) {
          const attr = response.data.attributes;
          const companyData: Company = {
            id: attr.id,
            name: attr.name,
            display_name: attr.display_name,
            email: attr.email,
            phone: attr.phone,
            phone2: attr.phone2,
            phone3: attr.phone3,
            status: attr.status,
            has_account: attr.has_account,
            avatar: attr.avatar,
            address: attr.address,
          };
          setCompany(companyData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader size={72} />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-white">
        {/* Site Header */}
        <SiteHeader name="Company Profile" />

        {/* Breadcrumb Navigation */}
        <div className="border-b border-gray-100">
          <div className="px-4 lg:px-6 py-3">
            <Breadcrumb
              items={[
                { label: "Companies", path: "/companies" },
                { label: "Error" },
              ]}
            />
          </div>
        </div>

        <div className="px-4 lg:px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-semibold text-lg">
              {error || "Company not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = company.avatar?.url
    ? company.avatar.url.startsWith("http")
      ? company.avatar.url
      : `${BASE_URL}${company.avatar.url}`
    : null;

  const tabData = [
    {
      value: "overview",
      label: "Overview",
      icon: <Building2 size={16} />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Contact Card */}
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
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
                  {company.email}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 uppercase tracking-wider">
                  <Phone size={14} />
                  <span className="text-[10px] font-bold">Phone</span>
                </div>
                <div className="space-y-1 mt-1 ml-6">
                  {[company.phone, company.phone2, company.phone3]
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
          {company.address && (
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <MapPin size={20} />
                <h2 className="text-lg font-bold text-gray-900">Location</h2>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                {Object.entries(company.address).map(([key, value]) => {
                  if (!value || key === "id") return null;

                  if (key === "google_map") {
                    return (
                      <div key={key} className="col-span-2 mt-2">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
                          Map
                        </p>
                        <a
                          href={String(value)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all"
                        >
                          <MapPin size={14} />
                          View on Google Maps
                        </a>
                      </div>
                    );
                  }

                  // Standard address fields
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
      value: "employee",
      label: "Employee",
      icon: <User size={16} />,
      content: (
        <div className="bg-white border border-gray-100 rounded-lg p-8 text-center">
          <h3 className="text-gray-900 font-semibold">Employee List</h3>
        </div>
      ),
    },
    {
      value: "patient",
      label: "Patient",
      icon: <IconUsersGroup size={16} />,
      content: (
        <div className="bg-white border border-gray-100 rounded-lg p-8 text-center">
          <h3 className="text-gray-900 font-semibold">Patient List</h3>
        </div>
      ),
    },
    {
      value: "visit_schedule",
      label: "Visit Schedule",
      icon: <TimerIcon size={16} />,
      content: (
        <div className="bg-white border border-gray-100 rounded-lg p-8 text-center">
          <h3 className="text-gray-900 font-semibold">
            Patient and Employee Visit Schedule
          </h3>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader name="Company Profile" />
      <div className="border-b border-gray-100">
        <div className="px-4 lg:px-6 py-3">
          <Breadcrumb
            items={[
              { label: "Companies", path: "/companies" },
              { label: company.name },
            ]}
          />
        </div>
      </div>

      <div className="px-4 lg:px-6 py-8 max-w-8xl">
        {/* Top Banner remains same */}
        <div className="bg-white border border-gray-100 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-50 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 size={40} className="text-gray-300" />
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {company.name}
              </h1>
              <span
                className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  company?.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {company?.status}
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
