/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { User, X } from "lucide-react";
import { CustomButton } from "./Button";

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "select"
    | "number"
    | "textarea"
    | "date"
    | "datetime-local";
  placeholder?: string;
  default?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: string }[] | string[];
  gridCol?: 1 | 2;
  icon?: React.ReactNode;
}

interface GenericFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  fields: FormField[];
  initialData?: Record<string, any>;
  onSubmit: (formData: Record<string, any>) => Promise<void>;
  reloadTable: () => Promise<void>;
  icon?: React.ReactNode;
  isEditing?: boolean;
}

export function GenericForm({
  open,
  onOpenChange,
  title,
  subtitle,
  fields,
  initialData = {},
  onSubmit,
  reloadTable,
  icon = <User className="h-5 w-5 text-white" />,
  isEditing = false,
}: GenericFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  /**
   * Callers build `fields` / `initialData` inline, so those props get a new
   * object identity on every render. Depending on them directly would re-run
   * the effect below on every render, and its setFormData would trigger the
   * next render - an infinite "Maximum update depth exceeded" loop. Compare
   * their *content* instead, so the effect only runs when something changed.
   */
  const initialDataKey = useMemo(
    () => JSON.stringify(initialData ?? {}),
    [initialData]
  );
  const fieldsKey = useMemo(
    () =>
      JSON.stringify(
        fields.map((field) => [
          field.name,
          field.type,
          field.default,
          field.options,
        ])
      ),
    [fields]
  );

  // Initialize form data
  useEffect(() => {
    const newFormData: Record<string, any> = {};
    fields.forEach((field) => {
      if (
        initialData[field.name] !== undefined &&
        initialData[field.name] !== null &&
        initialData[field.name] !== ""
      ) {
        newFormData[field.name] = String(initialData[field.name]);
      } else if (field.default !== undefined) {
        newFormData[field.name] = field.default;
      } else if (
        field.type === "select" &&
        // only required selects fall back to their first option - an optional
        // one starts empty so it can show its "Select Any" placeholder
        field.required &&
        Array.isArray(field.options) &&
        field.options.length > 0
      ) {
        const first = field.options[0];
        const defaultValue =
          typeof first === "string" ? first : (first?.value ?? "");
        newFormData[field.name] = defaultValue;
      } else {
        newFormData[field.name] = "";
      }
    });
    setFormData(newFormData);
    // `fields` / `initialData` are intentionally tracked by content, not identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, fieldsKey, initialDataKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      toast.success(
        `${title} ${isEditing ? "updated" : "created"} successfully!`
      );
      onOpenChange(false);
      await reloadTable();
    } catch (error: any) {
      toast.error(
        `Error: ${error.message || `Failed to save ${title.toLowerCase()}`}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Group fields by column
  const groupedFields = fields.reduce(
    (acc, field) => {
      const col = field.gridCol || 1;
      if (!acc[col]) acc[col] = [];
      acc[col].push(field);
      return acc;
    },
    {} as Record<number, FormField[]>
  );

  // Check if we have 2-column layout
  const has2Columns = Object.keys(groupedFields).length > 1;

  const renderField = (field: FormField) => {
    const value = formData[field.name] ?? "";
    // Radix never emits an empty value, so clearing an optional select has to
    // be driven by our own button
    const canClear = !field.required && !field.disabled && value !== "";

    return (
      <div key={field.name} className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          {field.icon}
          {field.label}
          {!field.required && (
            <span className="text-xs font-normal text-gray-400">optional</span>
          )}
        </label>

        {field.type === "select" ? (
          <div className="relative">
            <Select
              value={value}
              disabled={field.disabled}
              onValueChange={(selected) =>
                handleSelectChange(field.name, selected)
              }
            >
              <SelectTrigger
                className={`h-11 w-full bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  canClear ? "pr-10" : ""
                }`}
              >
                <SelectValue placeholder={field.placeholder || "Select Any"} />
              </SelectTrigger>
              <SelectContent
                position="popper"
                align="start"
                className="max-h-72"
              >
                {field.options?.map((option) => {
                  const optionValue =
                    typeof option === "string" ? option : option.value;
                  const optionLabel =
                    typeof option === "string" ? option : option.label;
                  return (
                    <SelectItem key={optionValue} value={optionValue}>
                      {optionLabel}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {canClear && (
              <button
                type="button"
                onClick={() => handleSelectChange(field.name, "")}
                title={`Clear ${field.label}`}
                aria-label={`Clear ${field.label}`}
                className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ) : field.type === "textarea" ? (
          <textarea
            name={field.name}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            className="w-full h-24 bg-white border border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        ) : (
          <Input
            type={field.type}
            name={field.name}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            className="h-11 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="space-y-3 pb-4 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-linear-to-br from-(--color-primary-soft) to-(--color-primary) rounded-lg">
              {icon}
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {isEditing ? `Edit ${title}` : `Create New ${title}`}
            </DialogTitle>
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 ml-11">{subtitle}</p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {/* Render fields */}
            {has2Columns ? (
              // 2-column layout
              <div className="grid grid-cols-2 gap-4">
                {fields.map(renderField)}
              </div>
            ) : (
              // 1-column layout
              <>{fields.map(renderField)}</>
            )}

            {/* Divider */}
            <div className="pt-2 border-t border-gray-200"></div>

            {/* Submit Buttons */}
            <div className="flex gap-3 py-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-11 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all cursor-pointer"
              >
                Cancel
              </Button>
              <CustomButton
                type="submit"
                disabled={loading}
                variantType="secondary"
                className="flex-1 h-11 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Saving...
                  </span>
                ) : isEditing ? (
                  `Update ${title}`
                ) : (
                  `Create ${title}`
                )}
              </CustomButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
