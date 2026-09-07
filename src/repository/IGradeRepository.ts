import type { Grade } from "../entity/grade.js";

export interface IGradeRepository {
  save(grade: Grade): Promise<void>;
  findById(id: string): Promise<Grade | null>;
  update(grade: Grade): Promise<void>;
  findByStudentId(student_id: string): Promise<Grade[]>;
  findByActivityId(activity_id: string): Promise<Grade[]>;
  findByStudentAndActivity(
    student_id: string,
    activity_id: string,
  ): Promise<Grade | null>;
}
