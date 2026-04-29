import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  confirmLabel?: string;
  successMessage?: string;

  onConfirm: () => Promise<void>;

  loadingText?: string;

  variant?: "danger" | "primary" | "secondary";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  successMessage = "Action completed successfully",
  loadingText = "Processing...",
  variant = "danger",
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      await onConfirm();
      toast.success(successMessage);
      onOpenChange(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const variantStyles = {
    danger: "bg-red-500 hover:bg-red-600 text-white",
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-2xl">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 pt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            disabled={loading}
            onClick={handleAction}
            className={`flex-1 ${variantStyles[variant]} ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? loadingText : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
