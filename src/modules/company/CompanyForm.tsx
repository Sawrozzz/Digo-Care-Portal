/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericForm } from "../../components/custom/GenericForm";
import { companyFormFields } from "./companyAttributes";
import { createCompany, updateCompany } from "./companyApi";
import type { Company } from "./companyAttributes";
import { Building2 } from "lucide-react";

interface CompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
  onSuccess?: () => void;
  reloadTable: () => Promise<void>;
}

const flattenCompanyData = (company: Company | null | undefined): any => {
  if (!company) return {};

  const flattened: any = {
    name: company.name,
    display_name: company.display_name,
    email: company.email,
    phone: company.phone,
    phone2: company.phone2,
    phone3: company.phone3,
    status: company.status,
  };

  if (company.address) {
    flattened["address.country"] = company.address.country;
    flattened["address.district"] = company.address.district;
    flattened["address.province"] = company.address.province;
    flattened["address.municipality"] = company.address.municipality;
    flattened["address.ward_no"] = company.address.ward_no;
  }

  return flattened;
};

export function CompanyForm({
  open,
  onOpenChange,
  company,
  reloadTable,
}: CompanyFormProps) {
  const handleSubmit = async (formData: Record<string, any>) => {
    if (company?.id) {
      await updateCompany(company.id, formData);
    } else {
      await createCompany(formData as any);
    }
  };

  const initialData = company ? flattenCompanyData(company) : {};

  return (
    <GenericForm
      open={open}
      onOpenChange={onOpenChange}
      title="Company"
      subtitle={
        company?.id
          ? "Update company information"
          : "Add a new company to your system"
      }
      fields={companyFormFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      reloadTable={reloadTable}
      icon={<Building2 className="h-5 w-5 text-white" />}
      isEditing={!!company?.id}
    />
  );
}
