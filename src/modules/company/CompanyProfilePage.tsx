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
        <div className="bg-white border border-gray-100 rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-100 border flex items-center justify-center shrink-0">
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

            {/* Company Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {company.name}
              </h1>
              <div
                className={`inline-flex items-center justify-center px-3 py-1 min-w-22.5 rounded-md text-xs font-medium capitalize ${
                  company?.status?.toLowerCase() === "active"
                    ? "bg-green-100 text-green-700"
                    : company?.status?.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : company?.status?.toLowerCase() === "archived"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                }`}
              >
                {company?.status || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Grid - Contact & Account Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {/* Contact Card */}
          <div className="bg-white border border-gray-100 rounded-lg p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <Contact size={24} />
              <h2 className="text-lg font-bold text-gray-900">Contact</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex flex-row items-center gap-2">
                  <Mail className="font-semibold text-gray-500" size={16} />
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </p>
                </div>
                <p className="text-sm text-gray-900 ml-6 mt-2">
                  {company.email}
                </p>
              </div>

              <div>
                <div className="flex flex-row items-center gap-2">
                  <Phone className="font-semibold text-gray-500" size={16} />
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </p>
                </div>
                <div className="space-y-1 mt-2 ml-6">
                  {[company.phone, company.phone2, company.phone3]
                    .filter(Boolean)
                    .map((phone, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm text-gray-900">{phone}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Location Card */}
          {company.address && (
            <div className="bg-white border border-gray-100 rounded-lg p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={24} />
                <h2 className="text-lg font-bold text-gray-900">Location</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {company.address.country && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Country
                    </p>
                    <p className="text-sm font-medium">
                      {company.address.country}
                    </p>
                  </div>
                )}
                {company.address.province && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Province
                    </p>
                    <p className="text-sm font-medium">
                      {company.address.province}
                    </p>
                  </div>
                )}
                {company.address.district && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      District
                    </p>
                    <p className="text-sm font-medium">
                      {company.address.district}
                    </p>
                  </div>
                )}
                {company.address.municipality && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Municipality
                    </p>
                    <p className="text-sm font-medium">
                      {company.address.municipality}
                    </p>
                  </div>
                )}
                {company.address.ward_no && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Ward</p>
                    <p className="text-sm font-medium">
                      #{company.address.ward_no}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Card */}
          {/* <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 h-full">
              <h2 className="text-lg font-bold text-gray-900">Account</h2>

            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
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
              {company.has_account ? "Created" : "Not Created"}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
