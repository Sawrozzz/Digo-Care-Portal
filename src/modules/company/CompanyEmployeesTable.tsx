/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { DegoTable } from "../../components/custom/DegoTable";
import { Badge } from "../../components/ui/badge";
import { getAllEmployeesOfACompany } from "../employee/employeeApi";
import { parseEmployeeResponse } from "../../utils/appUtils";
import { BASE_URL } from "../../utils";
import type { Employee } from "../../utils";

interface CompanyEmployeesTableProps {
  companyId: number;
}

export default function CompanyEmployeesTable({
  companyId,
}: CompanyEmployeesTableProps) {
  const navigate = useNavigate();

  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    let active = true;

    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllEmployeesOfACompany(Number(companyId));
        if (active) {
          setData(
            parseEmployeeResponse(response).map((employee) => ({
              ...employee,
              name: `${employee.first_name} ${employee.last_name}`.trim(),
            }))
          );
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Failed to fetch employees");
          setData([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchEmployees();

    return () => {
      active = false;
    };
  }, [companyId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading employees...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <p>{`E-#${row.original.id}`}</p>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const employee = row.original;
        const name = `${employee.first_name}, ${employee.last_name}`;
        const avatarUrl = employee.avatar?.url;

        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-white shadow-sm">
              {avatarUrl ? (
                <img
                  src={
                    avatarUrl.startsWith("http")
                      ? avatarUrl
                      : `${BASE_URL}${avatarUrl}`
                  }
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-gray-600">
                  {name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>

            <div
              onClick={() => navigate(`/employees/${employee.id}`)}
              className="cursor-pointer hover:bg-gray-50 rounded p-2 transition"
            >
              <p className="font-medium text-blue-600 hover:text-blue-800">
                {name}
              </p>
              <p className="text-xs text-gray-500">{employee.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      cell: ({ row }) => {
        const phones = [row.original.phone, row.original.phone2].filter(Boolean);

        return (
          <div className="flex flex-col gap-1">
            {phones.map((p, idx) => (
              <span
                key={idx}
                className={
                  idx === 0
                    ? "font-semibold text-foreground"
                    : "text-sm text-muted-foreground"
                }
              >
                {p}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status?.toLowerCase();
        const statusStyles: any = {
          active: "bg-green-100 text-green-700 border-green-200",
          inactive: "bg-gray-100 text-gray-700 border-gray-200",
          pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
          archived: "bg-red-100 text-red-700 border-red-200",
        };

        return (
          <Badge
            variant="outline"
            className={`capitalize px-3 py-2 ${statusStyles[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  return <DegoTable columns={columns} data={data} searchKey="name" />;
}
