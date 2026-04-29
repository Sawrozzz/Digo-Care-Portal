import z, { ZodError, type ZodSchema } from "zod";

export const addressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  district: z.string().optional(),
  province: z.string().optional(),
  municipality: z.string().optional(),
  ward_no: z.number().optional(),
  google_map: z.string().optional(),
});

export const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"], // 👈 error goes here
  });

export function validateWithZod<T>(
  schema: ZodSchema<T>,
  data: T
): { success: boolean; errors: Record<string, string> } {
  try {
    schema.parse(data);
    return { success: true, errors: {} };
  } catch (err) {
    if (err instanceof ZodError) {
      const errors: Record<string, string> = {};
      err.issues.forEach((i) => {
        errors[i.path.join(".")] = i.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: {} };
  }
}
