import z from "zod";

export const addressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  district: z.string().optional(),
  province: z.string().optional(),
  municipality: z.string().optional(),
  ward_no: z.number().optional(),
  google_map: z.string().optional(),
});
