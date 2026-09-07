import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().min(2, "Subject name must have at least 2 characters"),
  description: z.string(),
  teacher_id: z.string().uuid("Invalid teacher ID format"),
  school_class_id: z.string().uuid("Invalid school class ID format"),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(2, "Subject name must have at least 2 characters").optional(),
  description: z.string().optional(),
});
