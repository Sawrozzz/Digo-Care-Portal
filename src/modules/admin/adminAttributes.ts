import z from "zod";

export type Admin = {
  id: number;
  name: string;
  role?: string;
  status?: string;
};

export const adminSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string().default("admin"),
  status: z.string().default("active"),
});

export const adminFields = [
  {
    name: "name",
    input_type: "text",
    label: "Name",
    placeholder: "Enter Name",
    required: true,
  },
  {
    name: "role",
    label: "Role",
    input_type: "select",
    placeholder: "Select One",
    options: ["admin", "superadmin"],
  },
  {
    name: "status",
    label: "Status",
    input_type: "text",
    disabled: true,
  },
];
