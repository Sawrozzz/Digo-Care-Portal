import { removePatientAccount } from "./patientApi";
import { ConfirmDialog } from "../../components/custom/ConfirmDialouge";

interface RemoveAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  patientId: number;
  onSuccess: () => Promise<void>;
}

export function RemovePatientAccountDialog({
  open,
  onOpenChange,
  companyId,
  patientId,
  onSuccess,
}: RemoveAccountDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Remove Patient Account"
      description="This will revoke all access and cannot be undone."
      confirmLabel="Remove Account"
      successMessage="Patient account removed successfully"
      variant="danger"
      onConfirm={async () => {
        if (!patientId) {
          throw new Error("Unable to identify current patient");
        }

        await removePatientAccount(companyId, patientId);
        await onSuccess();
      }}
    />
  );
}
