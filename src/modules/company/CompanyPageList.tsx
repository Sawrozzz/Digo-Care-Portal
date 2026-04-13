import { useEffect } from "react";
import { SiteHeader } from "../../components/ui/site-header";
import { companyStore } from "../../zustand/companyStore";
import { parseCompanyResponse } from "../../utils";
import CompanyTable from "./CompanyTable";
import { Loader } from "../../components/custom/Loader";


export default function CompanyPageList() {
  const { getAllCompanies, companies, loading } = companyStore();

  useEffect(() => {
    getAllCompanies();
  }, [getAllCompanies]);

  const formattedData = parseCompanyResponse(companies || {});

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size={72} />
      </div>
    );
  }

  return (
    <>
      <SiteHeader name="Company" />
      {formattedData.length > 0 ? (
        <CompanyTable companyData={formattedData} />
      ) : (
        <div className="p-10 text-center">
          <p>No companies found.</p>
        </div>
      )}
    </>
  );
}