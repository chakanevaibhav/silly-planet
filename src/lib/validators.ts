import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const addressSchema = z.object({
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(3),
  country: z.string().default("US"),
  phone: z.string().optional(),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(2000),
});
