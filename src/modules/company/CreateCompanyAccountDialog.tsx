/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "react-toastify";
import { CreateAccountForm } from "../../components/custom/CreateAccountForm";

import { createCompanyAdminAccount } from "./companyApi";
import { passwordSchema, validateWithZod } from "../../utils";

interface Props {
  open: boolean;
  onClose: () => void;
  companyId: number;
  onSuccess: () => Promise<void>;
}

export function CreateCompanyAccountDialog({
  open,
  onClose,
  companyId,
  onSuccess,
}: Props) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setPassword("");
    setPasswordConfirm("");
    setErrors({});
  };

  const validate = () => {
    const { success, errors } = validateWithZod(passwordSchema, {
      password,
      password_confirmation: passwordConfirm,
    });

    setErrors(errors);
    return success;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Fix validation errors");
      return;
    }

    setLoading(true);
    try {
      await createCompanyAdminAccount(companyId, {
        password,
        password_confirmation: passwordConfirm,
      });

      toast.success("Account created");
      resetState();
      onClose();
      await onSuccess();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <CreateAccountForm
      open={open}
      onClose={handleClose}
      title="Create Company Admin Account"
      description="Set a secure password"
      password={password}
      passwordConfirm={passwordConfirm}
      onPasswordChange={setPassword}
      onPasswordConfirmChange={setPasswordConfirm}
      errors={errors}
      loading={loading}
      onSubmit={handleSubmit}
      submitLabel="Create Account"
    />
  );
}
