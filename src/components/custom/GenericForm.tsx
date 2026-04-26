/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
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
import { User } from "lucide-react";
import { CustomButton } from "./Button";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "number" | "textarea";
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
      } else if (field.type === "select" && field.options) {
        const defaultValue =
          typeof field.options[0] === "string"
            ? field.options[0]
            : field.options[0].value;
        newFormData[field.name] = defaultValue;
      } else {
        newFormData[field.name] = "";
      }
    });
    setFormData(newFormData);
  }, [initialData, open, fields]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-linear-to-br from-white to-gray-50 border-0 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-3 pb-4">
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

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Render fields */}
          {has2Columns ? (
            // 2-column layout
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    {field.icon}
                    {field.label}
                  </label>

                  {field.type === "select" ? (
                    <Select
                      value={formData[field.name] || ""}
                      onValueChange={(value) =>
                        handleSelectChange(field.name, value)
                      }
                    >
                      <SelectTrigger className="h-11 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => {
                          const value =
                            typeof option === "string" ? option : option.value;
                          const label =
                            typeof option === "string" ? option : option.label;
                          return (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ""}
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
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={field.disabled}
                      className="h-11 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            // 1-column layout
            <>
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    {field.icon}
                    {field.label}
                  </label>

                  {field.type === "select" ? (
                    <Select
                      value={formData[field.name] || ""}
                      onValueChange={(value) =>
                        handleSelectChange(field.name, value)
                      }
                    >
                      <SelectTrigger className="h-11 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => {
                          const value =
                            typeof option === "string" ? option : option.value;
                          const label =
                            typeof option === "string" ? option : option.label;
                          return (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ""}
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
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={field.disabled}
                      className="h-11 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {/* Divider */}
          <div className="pt-2 border-t border-gray-200"></div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-2">
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
      </DialogContent>
    </Dialog>
  );
}
