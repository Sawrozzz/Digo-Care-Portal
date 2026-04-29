import { useAuthStore } from "../../zustand/authStore";
import { removeCompanyAdminAccount } from "./companyApi";
import { ConfirmDialog } from "../../components/custom/ConfirmDialouge";

interface RemoveAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  onSuccess: () => Promise<void>;
}

export function RemoveCompanyAccountDialog({
  open,
  onOpenChange,
  companyId,
  onSuccess,
}: RemoveAccountDialogProps) {
  const { account } = useAuthStore();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Remove Company Admin"
      description="This will revoke all access and cannot be undone."
      confirmLabel="Remove Account"
      successMessage="Company admin removed successfully"
      variant="danger"
      onConfirm={async () => {
        if (!account?.id) {
          throw new Error("Unable to identify current user");
        }

        await removeCompanyAdminAccount(account.id, companyId);
        await onSuccess();
      }}
    />
  );
}
