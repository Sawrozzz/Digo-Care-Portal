/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DegoTable } from "../../components/custom/DegoTable";
import { adminColumns } from "./columns";
import { getAllAdmins } from "./adminApi";
import { parseAdminResponseFixed } from "../../utils/appUtils";
import { AdminForm } from "./AdminForm";
import type { Admin } from "./adminAttributes";

export default function AdminTable() {
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllAdmins();
      const parsedAdmins = parseAdminResponseFixed(response);
      setAdminData(parsedAdmins as []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch admins");
      setAdminData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddClick = () => {
    setSelectedAdmin(null);
    setFormOpen(true);
  };

  const handleEditClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormOpen(true);
  };

  if (loading) {
    return <div className="p-4">Loading admins...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <DegoTable
        columns={adminColumns({
          onEdit: handleEditClick,
          reloadTable: fetchAdmins,
        })}
        data={adminData}
        searchKey="name"
        onAddData={handleAddClick}
      />

      <AdminForm
        open={formOpen}
        onOpenChange={setFormOpen}
        admin={selectedAdmin}
        onSuccess={() => setFormOpen(false)}
        reloadTable={fetchAdmins}
      />
    </>
  );
}
