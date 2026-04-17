import { SiteHeader } from "../../components/ui/site-header";
import { useAuthStore } from "../../zustand/authStore";
import { useCompanyStore } from "../../zustand/companyStore";

export default function EmployeePage() {
  const { activeCompany } = useCompanyStore();
  const { account } = useAuthStore();
  return (
    <>
      <SiteHeader name="Employee" />
      <p className="p-6">
        This is Employee Page of Company:{" "}
        {account?.company_id || activeCompany?.id}
      </p>
    </>
  );
}
