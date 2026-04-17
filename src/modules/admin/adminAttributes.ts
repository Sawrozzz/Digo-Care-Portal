import z from "zod";
import type { FormField } from "../../components/custom/GenericForm";

export type Admin = {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  name?: string;
  role: string;
  status: string;
  has_account?: boolean;
};

export const adminSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  role: z.string(),
  status: z.string(),
});

export const adminFormFields: FormField[] = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "Enter first name",
    required: true,
    gridCol: 2,
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Enter last name",
    required: true,
    gridCol: 2,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter email",
    required: true,
    gridCol: 1,
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    gridCol: 2,
    options: [
      { label: "Admin", value: "admin" },
      { label: "Super Admin", value: "super_admin" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    gridCol: 2,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "in_active" },
    ],
  },
];
