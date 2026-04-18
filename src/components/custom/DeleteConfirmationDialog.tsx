/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => Promise<void>;
  reloadTable: () => Promise<void>;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  reloadTable,
}: DeleteConfirmationDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
      toast.success(`${itemName} deleted successfully!`);
      onOpenChange(false);
      await reloadTable();
    } catch (error: any) {
      toast.error(`✗ Error: ${error.message || "Failed to delete item"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-linear-to-br from-white to-gray-50 border-0 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Delete {itemName}?
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{itemName}"</span>? This action cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 h-10 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="flex-1 h-10 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
