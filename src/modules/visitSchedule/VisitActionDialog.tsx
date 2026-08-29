/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export interface VisitActionField {
  name: string;
  label: string;
  type: "text" | "textarea" | "datetime-local";
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

interface VisitActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  /** tailwind classes for the header icon bubble, e.g. "bg-green-100" */
  iconWrapperClass: string;
  fields: VisitActionField[];
  confirmLabel: string;
  confirmClass: string;
  successMessage: string;
  onConfirm: (values: Record<string, string>) => Promise<void>;
  reloadTable: () => Promise<void>;
}

/**
 * The three visit member actions (mark visited / cancel / reschedule) each need
 * a couple of inputs and a confirmation, which is more than
 * DeleteConfirmationDialog offers and less than GenericForm - whose heading is
 * hard-wired to "Create New ..." / "Edit ...". One small dialog covers all
 * three instead of three near-identical ones.
 */
export function VisitActionDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  iconWrapperClass,
  fields,
  confirmLabel,
  confirmClass,
  successMessage,
  onConfirm,
  reloadTable,
}: VisitActionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  // reset to the defaults every time the dialog is opened, otherwise a second
  // open still shows whatever was typed the previous time
  useEffect(() => {
    if (!open) return;

    const next: Record<string, string> = {};
    fields.forEach((field) => {
      next[field.name] = field.defaultValue ?? "";
    });
    setValues(next);
    // `fields` is rebuilt inline by the caller on every render, so depending on
    // its identity would reset the inputs on each keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onConfirm(values);
      toast.success(successMessage);
      onOpenChange(false);
      await reloadTable();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Action failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-linear-to-br from-white to-gray-50 border-0 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className={`p-3 rounded-full ${iconWrapperClass}`}>{icon}</div>
          </div>
          <div className="text-center space-y-2">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {title}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                {field.label}
                {!field.required && (
                  <span className="text-xs font-normal text-gray-400">
                    optional
                  </span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full h-24 bg-white border border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                />
              ) : (
                <Input
                  type={field.type}
                  name={field.name}
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                  className="h-11 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
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
              type="submit"
              disabled={loading}
              className={`flex-1 h-10 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed ${confirmClass}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </span>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
