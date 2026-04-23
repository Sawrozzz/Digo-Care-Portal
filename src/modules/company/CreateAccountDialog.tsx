/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock } from "lucide-react";
import { ZodError } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { CustomButton } from "../../components/custom/Button";
import { createCompanyAdminAccount } from "./companyApi";
import { createCompanyAccountSchema } from "./companyAttributes";

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  onSuccess: () => Promise<void>;
}

export function CreateAccountDialog({
  open,
  onOpenChange,
  companyId,
  onSuccess,
}: CreateAccountDialogProps) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    setErrors({});
    
    try {
      createCompanyAccountSchema.parse({
        password,
        password_confirmation: passwordConfirm,
      });
      return true;
    } catch (error: any) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue: any) => {
          const path = issue.path.join(".");
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    try {
      await createCompanyAdminAccount(companyId, {
        password,
        password_confirmation: passwordConfirm,
      });

      toast.success("Company account created successfully!");
      setPassword("");
      setPasswordConfirm("");
      setErrors({});
      onOpenChange(false);
      await onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setPasswordConfirm("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    onOpenChange(false);
  };

  const passwordsMatch = password === passwordConfirm && password.length > 0;

  const isDisabled =
    loading ||
    !password ||
    !passwordConfirm ||
    !passwordsMatch ||
    Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <Lock size={20} className="text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                Create Company Admin Account
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Set a secure password for the company administrator
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col gap-6 py-4">
          {/* Password Field */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter a secure password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: "" });
                  }
                }}
                disabled={loading}
                className="pr-12 h-11 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  if (errors.password_confirmation) {
                    setErrors({ ...errors, password_confirmation: "" });
                  }
                }}
                disabled={loading}
                className="pr-12 h-11 text-base"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password_confirmation}
              </p>
            )}
          </div>
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
            variantType="primary"

            onClick={handleCreate}
            disabled={
              isDisabled
            }
            className={isDisabled ? "cursor-not-allowed px-6" : "cursor-pointer px-6"}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
