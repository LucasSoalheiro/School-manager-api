import { z } from "zod";

export const registerStudentSchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters").max(50, "Name cannot exceed 50 characters"),
  last_name: z.string().min(3, "Last name must have at least 3 characters").max(50, "Last name cannot exceed 50 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

export const updateStudentNameSchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters").max(50, "Name cannot exceed 50 characters"),
});

export const changeStudentPasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(6, "New password must have at least 6 characters"),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
});
