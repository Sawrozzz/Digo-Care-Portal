/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DegoTable } from "../../components/custom/DegoTable";
import { companyColumns } from "./columns";
import { getAllCompanies } from "./companyApi";
import { parseCompanyResponse } from "../../utils/appUtils";
import { CompanyForm } from "./CompanyForm";
import type { Company } from "../../utils";

export default function CompanyTable() {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCompanies();
      const parsedCompanies = parseCompanyResponse(response);
      setCompanyData(parsedCompanies as []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch companies");
      setCompanyData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddClick = () => {
    setSelectedCompany(null);
    setFormOpen(true);
  };

  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setFormOpen(true);
  };

  const handleRowClick = (company: Company) => {
    navigate(`/companies/${company.id}`);
  };

  if (loading) {
    return <div className="p-4">Loading companies...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <DegoTable
        columns={companyColumns({
          onEdit: handleEditClick,
          reloadTable: fetchCompanies,
          onRowClick: handleRowClick,
        })}
        data={companyData}
        searchKey="name"
        onAddData={handleAddClick}
      />

      <CompanyForm
        open={formOpen}
        onOpenChange={setFormOpen}
        company={selectedCompany}
        onSuccess={() => setFormOpen(false)}
        reloadTable={fetchCompanies}
      />
    </>
  );
}
