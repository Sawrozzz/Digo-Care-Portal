import { useEffect } from "react";

import { Loader } from "../../components/custom";
import { SiteHeader } from "../../components/ui/site-header";
import { useCompanyStore } from "../../zustand/companyStore";
import { useEmployeeStore } from "../../zustand/employeeStore";

import EmployeeSwitcher from "./EmployeeSwitcher";
import PatientTable from "./PatientTable";

export default function PatientAssignmentPage() {
  const activeCompany = useCompanyStore((state) => state.activeCompany);
  const companiesLoading = useCompanyStore((state) => state.loading);
  const activeEmployeeId = useEmployeeStore(
    (state) => state.activeEmployee?.id
  );
  const employeesLoading = useEmployeeStore((state) => state.loading);
  const employeesError = useEmployeeStore((state) => state.error);
  const initializeEmployees = useEmployeeStore(
    (state) => state.initializeEmployees
  );

  const companyId = activeCompany?.id;

  // the page owns the company, so it owns loading that company's employees -
  // the switcher just renders whatever is in the store
  useEffect(() => {
    if (companyId) {
      initializeEmployees(Number(companyId));
    }
  }, [companyId, initializeEmployees]);

  if (companiesLoading) {
    return <Loader size={72} />;
  }

  if (!companyId) {
    return (
      <>
        <SiteHeader name="Patient Assignment" />
        <p className="p-6 text-sm text-muted-foreground">No company selected</p>
      </>
    );
  }

  return (
    <>
      <SiteHeader name="Patient Assignment" />

      <div className="p-4 lg:p-6">
        {employeesError ? (
          <p className="rounded-lg border border-red-200 bg-white p-8 text-center text-sm text-red-600">
            {employeesError}
          </p>
        ) : activeEmployeeId ? (
          // the switcher rides along in the table's top bar, lined up with the
          // search box and the Add New button
          <PatientTable
            companyId={companyId}
            employeeId={activeEmployeeId}
            toolbar={<EmployeeSwitcher />}
          />
        ) : employeesLoading ? (
          <Loader size={72} />
        ) : (
          <p className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-muted-foreground">
            No employees available for this company
          </p>
        )}
      </div>
    </>
  );
}
