import type { Grade } from "../entity/grade.js";

export type GradeWithDetails = {
  id: string;
  student_id: string;
  activity_id: string;
  score: number | null;
  status: string;
  submitted_at: Date | null;
  feedback: string | null;
  activity_title?: string | null;
  class_name?: string | null;
};

export interface IGradeRepository {
  save(grade: Grade): Promise<void>;
  findById(id: string): Promise<Grade | null>;
  update(grade: Grade): Promise<void>;
  findByStudentId(student_id: string): Promise<Grade[]>;
  findByStudentIdWithDetails(student_id: string): Promise<GradeWithDetails[]>;
  findByActivityId(activity_id: string): Promise<Grade[]>;
  findByTeacherId(teacher_id: string): Promise<GradeWithDetails[]>;
  findByStudentAndActivity(
    student_id: string,
    activity_id: string,
  ): Promise<Grade | null>;
}
