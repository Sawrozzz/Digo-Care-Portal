import { useEffect } from "react";
import { SiteHeader } from "../../components/ui/site-header";
import {  useCompanyStore } from "../../zustand/companyStore";
import CompanyTable from "./CompanyTable";
import { Loader } from "../../components/custom/Loader";


export default function CompanyPageList() {
  const { getAllCompanies, companies, loading } = useCompanyStore();

  useEffect(() => {
    getAllCompanies();
  }, [getAllCompanies]);

  const formattedData = companies ||[];

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