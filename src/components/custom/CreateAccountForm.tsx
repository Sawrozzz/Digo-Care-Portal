import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { CustomButton } from "../../components/custom/Button";

interface CreateAccountProps {
  open: boolean;
  onClose: () => void;

  title: string;
  description?: string;

  password: string;
  passwordConfirm: string;

  onPasswordChange: (val: string) => void;
  onPasswordConfirmChange: (val: string) => void;

  errors: Record<string, string>;

  loading?: boolean;
  onSubmit: () => void;

  submitLabel?: string;
}

export function CreateAccountForm({
  open,
  onClose,
  title,
  description,
  password,
  passwordConfirm,
  onPasswordChange,
  onPasswordConfirmChange,
  errors,
  loading = false,
  onSubmit,
  submitLabel = "Submit",
}: CreateAccountProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = password === passwordConfirm && password.length > 0;

  const isDisabled =
    loading ||
    !password ||
    !passwordConfirm ||
    !passwordsMatch ||
    Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Password */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}

          {/* Confirm */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={passwordConfirm}
              onChange={(e) => onPasswordConfirmChange(e.target.value)}
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="text-xs text-red-500">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <CustomButton onClick={onSubmit} disabled={isDisabled}>
            {loading ? "Processing..." : submitLabel}
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
