import { SiteHeader } from "../../components/ui/site-header";
import { useAuthStore } from "../../zustand/authStore";
import { useCompanyStore } from "../../zustand/companyStore";

export default function PatientPage() {
  const { activeCompany } = useCompanyStore();
  const { account } = useAuthStore();
  return (
    <>
      <SiteHeader name="Patient" />
      <p className="p-6">
        This is Patient Page of Company:{" "}
        {account?.company_id || activeCompany?.id}
      </p>
    </>
  );
}
