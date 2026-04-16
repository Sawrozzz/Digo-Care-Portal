import {
  IconBrandOffice,
  IconDashboard,
  IconUsersGroup,
} from "@tabler/icons-react";
import { ShieldCheck, User } from "lucide-react";

export const PERMISSIONS = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
};

export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
    roles: ["admin", "super_admin"],
  },
  {
    title: "Company",
    url: "/companies",
    icon: IconBrandOffice,
    roles: ["super_admin"],
  },
  {
    title: "Admin",
    url: "/admins",
    icon: ShieldCheck,
    roles: ["super_admin"],
  },
  {
    title: "Patient",
    url: "/patients",
    icon: IconUsersGroup,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Employee",
    url: "/employees",
    icon: User,
    roles: ["super_admin", "admin"],
  },
];
