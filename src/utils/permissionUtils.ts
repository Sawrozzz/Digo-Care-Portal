import { IconBrandOffice, IconDashboard, IconUserShield } from "@tabler/icons-react";

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
    icon: IconUserShield,
    roles: ["super_admin"],
  },
];

