/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";

import { NavUser } from "../ui/nav-user";

import { useAuthStore } from "../../zustand/authStore";
import { toast } from "react-toastify";

export default function UserNav() {
  const { loading, logout, account } = useAuthStore();
  const navigate = useNavigate();
  const avatar = "/avatars/shadcn.jpg";
  const accoutRole = account?.role == "super_admin" ? "SUPER ADMIN" : "ADMIN";

  const handleLogout = () => {
    try {
      logout();
      navigate("/login");
      toast.success("Logout successfull");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <NavUser
      handleLogout={handleLogout}
      avatar={avatar}
      role={accoutRole}
      name="Admin"
      email={account?.email ?? ""}
      loading={loading}
    />
  );
}
