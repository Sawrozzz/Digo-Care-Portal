/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DegoTable } from "../../components/custom/DegoTable";
import { employeeColumns } from "./columns";
import { getAllEmployeesOfACompany } from "./employeeApi";
import { parseEmployeeResponse } from "../../utils/appUtils";
import type { Employee } from "../../utils";
import { EmployeeForm } from "./EmployeeForm";

interface EmployeeTableProps {
  companyId: number;
}

export default function EmployeeTable({ companyId }: EmployeeTableProps) {
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllEmployeesOfACompany(Number(companyId));
      setEmployeeData(parseEmployeeResponse(response) as []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch employees");
      setEmployeeData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!companyId) return;
    fetchEmployees();
  }, [companyId]);

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleRowClick = (employee: Employee) => {
    navigate(`/employees/${employee.id}`);
  };

  if (loading) {
    return <div className="p-4">Loading employees...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <DegoTable
        columns={employeeColumns({
          onEdit: handleEditClick,
          reloadTable: fetchEmployees,
          onRowClick: handleRowClick,
        })}
        data={employeeData}
        searchKey="name"
        onAddData={handleAddClick}
      />
      <EmployeeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        employee={selectedEmployee}
        companyId={companyId}
        onSuccess={() => setFormOpen(false)}
        reloadTable={fetchEmployees}
      />
    </>
  );
}
