import { z } from "zod";

export const forgetPasswordSchema = z.object({
  username: z.string().min(1, "Username is required").max(30, "Username must be at most 30 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
