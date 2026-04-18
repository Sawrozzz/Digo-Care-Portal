/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  CheckCircle,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { getSingleCompany } from "./companyApi";
import { Loader } from "../../components/custom/Loader";
import { Breadcrumb } from "../../components/custom/Breadcrumb";
import { SiteHeader } from "../../components/ui/site-header";
import { BASE_URL } from "../../utils";
import type { Company } from "./companyAttributes";

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
              { label: company.name },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-6 py-8">
        {/* Top Section - Avatar & Basic Info with Status */}
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden mb-8 shadow-sm">
          {/* Gradient Header */}
          <div className="h-32 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500"></div>

          {/* Content Container */}
          <div className="px-6 pb-6">
            {/* Header with Avatar and Title */}
            <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-6">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-md flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={company.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={64} className="text-gray-300" />
                  )}
                </div>
              </div>

              {/* Company Info & Actions */}
              <div className="flex-1 flex flex-col justify-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {company.name}
                  </h1>
                  <p className="text-sm text-gray-500 mb-4">
                    {company?.display_name ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Grid - Contact & Account Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contact Information Card */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                <Mail size={20} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Contact</h2>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Email
                </p>
                <p className="text-base text-gray-900 font-medium">
                  {company.email}
                </p>
              </div>

              {/* Phone Numbers */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Phone
                </p>
                <div className="space-y-2.5">
                  {company.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-greenshrink-0" />
                      <span className="text-sm text-gray-900">
                        {company.phone}
                      </span>
                    </div>
                  )}
                  {company.phone2 && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-blueshrink-0" />
                      <span className="text-sm text-gray-900">
                        {company.phone2}
                      </span>
                    </div>
                  )}
                  {company.phone3 && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-purple-600 shrink-0" />
                      <span className="text-sm text-gray-900">
                        {company.phone3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  company.has_account ? "bg-emerald-100" : "bg-yellow-100"
                }`}
              >
                <Briefcase
                  size={20}
                  className={
                    company.has_account ? "text-emerald-600" : "text-yellow-600"
                  }
                />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Account</h2>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Status
              </p>
              <div
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  company.has_account
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                <CheckCircle size={16} />
                {company.has_account ? "Active" : "Not Created"}
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        {company.address && (
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100">
                <MapPin size={20} className="text-purple-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Location</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {company.address.country && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Country
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {company.address.country}
                  </p>
                </div>
              )}
              {company.address.province && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Province
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {company.address.province}
                  </p>
                </div>
              )}
              {company.address.district && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    District
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {company.address.district}
                  </p>
                </div>
              )}
              {company.address.municipality && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Municipality
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {company.address.municipality}
                  </p>
                </div>
              )}
              {company.address.ward_no && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Ward
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    #{company.address.ward_no}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
