/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericForm } from "../../components/custom/GenericForm";
import { adminFormFields } from "./adminAttributes";
import { createAdmin, updateAdmin } from "./adminApi";
import type { Admin } from "./adminAttributes";
import { User } from "lucide-react";

interface AdminFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin?: Admin | null;
  onSuccess?: () => void;
  reloadTable: () => Promise<void>;
}

export function AdminForm({
  open,
  onOpenChange,
  admin,
  // onSuccess,
  reloadTable,
}: AdminFormProps) {
  const handleSubmit = async (formData: Record<string, any>) => {
    if (admin?.id) {
      await updateAdmin(admin.id, formData);
    } else {
      await createAdmin(formData as any);
    }
  };

  return (
    <GenericForm
      open={open}
      onOpenChange={onOpenChange}
      title="Admin"
      subtitle={
        admin?.id
          ? "Update admin information and permissions"
          : "Add a new admin to your system"
      }
      fields={adminFormFields}
      initialData={admin || {}}
      onSubmit={handleSubmit}
      reloadTable={reloadTable}
      icon={<User className="h-5 w-5 text-white" />}
      isEditing={!!admin?.id}
    />
  );
}
