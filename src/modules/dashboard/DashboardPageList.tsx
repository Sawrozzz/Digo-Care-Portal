import { SectionCards } from "../../components/ui/section-cards";
import { SiteHeader } from "../../components/ui/site-header";
import { useCompanyStore } from "../../zustand/companyStore";

export default function DashboardPageList() {
  const { activeCompany } = useCompanyStore();
  return (
    <>
      <SiteHeader name="Dashboard" />
      <SectionCards />
      <section className="p-6">
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Active Company Details
          </h2>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">ID</span>
              <span>{activeCompany?.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Name</span>
              <span>{activeCompany?.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Email</span>
              <span>{activeCompany?.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Phone</span>
              <span>{activeCompany?.phone}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Status</span>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                {activeCompany?.status}
              </span>
            </div>

            <hr className="my-3" />

            <h3 className="text-sm font-semibold text-gray-600">Address</h3>

            <div className="grid grid-cols-2 gap-2">
              <p>
                <span className="text-gray-500">Country:</span>{" "}
                {activeCompany?.address?.country}
              </p>
              <p>
                <span className="text-gray-500">Province:</span>{" "}
                {activeCompany?.address?.province}
              </p>
              <p>
                <span className="text-gray-500">Municipality:</span>{" "}
                {activeCompany?.address?.municipality}
              </p>
              <p>
                <span className="text-gray-500">Ward No:</span>{" "}
                {activeCompany?.address?.ward_no}
              </p>
            </div>

            <div>
              {activeCompany?.address?.google_map && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">
                    Location
                  </h3>
                  <a
                    href={activeCompany?.address?.google_map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
