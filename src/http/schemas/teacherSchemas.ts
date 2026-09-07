import { z } from "zod";

export const registerTeacherSchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters").max(50, "Name cannot exceed 50 characters"),
  last_name: z.string().min(3, "Last name must have at least 3 characters").max(50, "Last name cannot exceed 50 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

export const updateTeacherNameSchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters").max(50, "Name cannot exceed 50 characters"),
});

export const changeTeacherPasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(6, "New password must have at least 6 characters"),
});

export const addClassToTeacherSchema = z.object({
  class_id: z.string().uuid("Invalid class ID format"),
});

export const teacherClassParamsSchema = z.object({
  id: z.string().uuid("Invalid teacher ID format"),
  class_id: z.string().uuid("Invalid class ID format"),
});
