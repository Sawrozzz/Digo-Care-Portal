/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { CustomButton } from "../../components/custom/Button";

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

  const validatePasswords = (): boolean => {
    if (!password || !passwordConfirm) {
      toast.error("Both password fields are required");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validatePasswords()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/admins/create_company_admin/${companyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            account: {
              password: password,
              password_confirmation: passwordConfirm,
            },
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create account");
      }

      toast.success("Company account created successfully!");
      setPassword("");
      setPasswordConfirm("");
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
    onOpenChange(false);
  };

  const passwordsMatch = password === passwordConfirm && password.length > 0;

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
                onChange={(e) => setPassword(e.target.value)}
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
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span>✓</span> Minimum 8 characters required
            </p>
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
                onChange={(e) => setPasswordConfirm(e.target.value)}
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
            {passwordConfirm && (
              <p
                className={`text-xs mt-2 flex items-center gap-1 ${
                  passwordsMatch ? "text-green-600" : "text-red-600"
                }`}
              >
                <CheckCircle2 size={14} />
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-linear-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>ℹ️ Note:</strong> The company will receive this
              credentials and can update them after first login.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="px-6"
          >
            Cancel
          </Button>
          <CustomButton
            variantType="primary"
            onClick={handleCreate}
            disabled={
              loading || !password || !passwordConfirm || !passwordsMatch
            }
            className="px-8"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
