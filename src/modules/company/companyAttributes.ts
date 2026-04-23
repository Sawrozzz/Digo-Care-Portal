import z from "zod";
import type { FormField } from "../../components/custom/GenericForm";
import type { Company, Address } from "../../utils/utilTypes";

export type { Company, Address };

// Create Company Account Schema with password validation
export const createCompanyAccountSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  password_confirmation: z.string()
    .min(8, "Password confirmation must be at least 8 characters"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

export type CreateCompanyAccountInput = z.infer<typeof createCompanyAccountSchema>;

export const addressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  district: z.string().optional(),
  province: z.string().optional(),
  municipality: z.string().optional(),
  ward_no: z.number().optional(),
});

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  display_name: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone number is required"),
  phone2: z.string().optional(),
  phone3: z.string().optional(),
  status: z.string().default("active"),
  address: addressSchema.optional(),
});

export const companyFormFields: FormField[] = [
  {
    name: "name",
    label: "Company Name",
    type: "text",
    placeholder: "Enter company name",
    required: true,
    gridCol: 2,
  },
  {
    name: "display_name",
    label: "Display Name",
    type: "text",
    placeholder: "Enter display name",
    required: false,
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
    name: "phone",
    label: "Primary Phone",
    type: "text",
    placeholder: "Enter primary phone",
    required: true,
    gridCol: 2,
  },
  {
    name: "phone2",
    label: "Secondary Phone",
    type: "text",
    placeholder: "Enter secondary phone",
    required: false,
    gridCol: 2,
  },
  {
    name: "phone3",
    label: "Tertiary Phone",
    type: "text",
    placeholder: "Enter tertiary phone",
    required: false,
    gridCol: 2,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    gridCol: 2,
    options: [
      { label: "Active", value: "active" },
      { label: "Pending", value: "pending" },
      { label: "Inactive", value: "inactive" },
      { label: "Archived", value: "archived" },
    ],
  },
  {
    name: "address.country",
    label: "Country",
    type: "text",
    placeholder: "Enter country",
    required: true,
    gridCol: 2,
  },
  {
    name: "address.district",
    label: "District",
    type: "text",
    placeholder: "Enter district",
    required: true,
    gridCol: 2,
  },
  {
    name: "address.province",
    label: "Province",
    type: "text",
    placeholder: "Enter province",
    required: true,
    gridCol: 2,
  },
  {
    name: "address.municipality",
    label: "Municipality",
    type: "text",
    placeholder: "Enter municipality",
    required: true,
    gridCol: 2,
  },
  {
    name: "address.ward_no",
    label: "Ward No",
    type: "number",
    placeholder: "Enter ward number",
    required: true,
    gridCol: 2,
  },
];
