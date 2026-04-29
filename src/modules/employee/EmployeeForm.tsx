/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericForm } from "../../components/custom";
import { employeeFormFields } from "./employeeAttributes";
import { createEmployee, updateEmployee } from "./employeeApi";

import type { Employee } from "../../utils";

import { User2Icon } from "lucide-react";

interface employeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
  companyId?: number;
  onSuccess?: () => void;
  reloadTable: () => Promise<void>;
}

const flattenemployeeData = (employee: Employee | null): any => {
  if (!employee) return {};

  const flattened: any = {
    first_name: employee.first_name,
    middle_name: employee?.middle_name,
    last_name: employee.last_name,
    phone: employee.phone,
    phone2: employee?.phone2,
    email: employee.email,
    gender: employee?.gender,
    dob: employee.dob,
    status: employee.status,
    specialization: employee.specialization,
    license_no: employee.license_no,
    experience_years: employee.experience_years,
    qualification: employee.qualification,
    biography: employee.biography,
  };
  if (employee.address) {
    flattened["address.country"] = employee.address.country;
    flattened["address.district"] = employee.address.district;
    flattened["address.province"] = employee.address.province;
    flattened["address.municipality"] = employee.address.municipality;
    flattened["address.ward_no"] = employee.address.ward_no;
    flattened["address.google_map"] = employee.address.google_map;
  }

  return flattened;
};

export function EmployeeForm({
  open,
  onOpenChange,
  employee,
  companyId,
  reloadTable,
}: employeeFormProps) {
  const handleSubmit = async (formData: Record<string, any>) => {
    if (companyId && employee?.id) {
      await updateEmployee(companyId, employee.id, formData);
    } else {
      await createEmployee(Number(companyId), formData as any);
    }
  };

  const initialData = employee ? flattenemployeeData(employee) : {};
  return (
    <GenericForm
      open={open}
      onOpenChange={onOpenChange}
      title="employee"
      subtitle={
        employee?.id
          ? "Update employee information"
          : "Add a new employee to your company"
      }
      fields={employeeFormFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      reloadTable={reloadTable}
      icon={<User2Icon className="h-5 w-5 text-white cursor-pointer" />}
      isEditing={!!employee?.id}
    />
  );
}
