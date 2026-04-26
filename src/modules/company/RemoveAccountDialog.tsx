/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "react-toastify";
import { AlertCircle } from "lucide-react";
import { useAuthStore } from "../../zustand/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { CustomButton } from "../../components/custom/Button";
import { removeCompanyAdminAccount } from "./companyApi";

interface RemoveAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  onSuccess: () => Promise<void>;
}

export function RemoveAccountDialog({
  open,
  onOpenChange,
  companyId,
  onSuccess,
}: RemoveAccountDialogProps) {
  const [loading, setLoading] = useState(false);
  const { account } = useAuthStore();

  const handleRemove = async () => {
    if (!account?.id) {
      toast.error("Unable to identify current user");
      return;
    }

    setLoading(true);
    try {
      await removeCompanyAdminAccount(account.id, companyId);

      toast.success("Company admin account removed successfully!");
      onOpenChange(false);
      await onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove account");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 rounded-lg">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                Remove Company Admin Account
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-gray-700">
            Are you sure you want to remove the admin account for this company?
            This will revoke all access and permissions associated with this
            account.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="px-6 cursor-pointer"
          >
            Cancel
          </Button>
          <CustomButton
            variantType="secondary"
            onClick={handleRemove}
            disabled={loading}
            className={
              loading ? "cursor-not-allowed px-6" : "cursor-pointer px-6"
            }
          >
            {loading ? "Removing Account..." : "Remove Account"}
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
