import { z } from "zod";

export const createSchoolClassSchema = z.object({
  class_name: z.string().min(2, "Class name must have at least 2 characters"),
});

export const addStudentToClassSchema = z.object({
  student_id: z.string().uuid("Invalid student ID format"),
});

export const addActivityToClassSchema = z.object({
  title: z.string().min(3, "Title must have at least 3 characters"),
  description: z.string().min(10, "Description must have at least 10 characters"),
  delivery_date: z
    .string()
    .datetime({ message: "Delivery date must be a valid ISO date-time string" })
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const classStudentParamsSchema = z.object({
  id: z.string().uuid("Invalid class ID format"),
  student_id: z.string().uuid("Invalid student ID format"),
});
