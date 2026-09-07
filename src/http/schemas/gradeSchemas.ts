import { z } from "zod";

export const assignGradeSchema = z.object({
  student_id: z.string().uuid("Invalid student ID format"),
  activity_id: z.string().uuid("Invalid activity ID format"),
});

export const gradeActivitySchema = z.object({
  score: z.number().min(0, "Score cannot be negative").max(10, "Score cannot exceed 10"),
  feedback: z.string().optional(),
});
