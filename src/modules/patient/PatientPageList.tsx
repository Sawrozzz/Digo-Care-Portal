import { Loader } from "../../components/custom";
import { SiteHeader } from "../../components/ui/site-header";
import { useCompanyStore } from "../../zustand/companyStore";

import PatientTable from "./PatientTable";

export default function PatientPage() {
  const { activeCompany, loading } = useCompanyStore();

  if (loading) {
    return <Loader size={72} />;
  }
  return (
    <>
      <SiteHeader name="Patient" />
      {activeCompany?.id ? (
        <PatientTable companyId={activeCompany.id} />
      ) : (
        <p>No Patients available</p>
      )}
    </>
  );
}
