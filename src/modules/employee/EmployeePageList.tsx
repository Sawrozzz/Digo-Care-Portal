import { Loader } from "../../components/custom";
import { SiteHeader } from "../../components/ui/site-header";
import { useCompanyStore } from "../../zustand/companyStore";
import EmployeeTable from "./EmployeeTable";

export default function EmployeePage() {
  const { activeCompany, loading } = useCompanyStore();
  if (loading) {
    return <Loader size={72} />;
  }
  return (
    <>
      <SiteHeader name="Patient" />
      {activeCompany?.id ? (
        <EmployeeTable companyId={activeCompany.id} />
      ) : (
        <p>No Patients available</p>
      )}
    </>
  );
}
