import { ConfirmDialog } from "../../components/custom/ConfirmDialouge";
import { removeEmployeeAccount } from "./employeeApi";

interface RemoveAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  employeeId: number;
  onSuccess: () => Promise<void>;
}

export function RemoveEmployeeAccountDialog({
  open,
  onOpenChange,
  companyId,
  employeeId,
  onSuccess,
}: RemoveAccountDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Remove Employee Account"
      description="This will revoke all access and cannot be undone."
      confirmLabel="Remove Account"
      successMessage="Employee account removed successfully"
      variant="danger"
      onConfirm={async () => {
        if (!employeeId) {
          throw new Error("Unable to identify current employee");
        }

        await removeEmployeeAccount(companyId, employeeId);
        await onSuccess();
      }}
    />
  );
}
