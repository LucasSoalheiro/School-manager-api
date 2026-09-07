import type { Enrollment } from "../entity/enrollment.js";

export interface IEnrollmentRepository {
  save(enrollment: Enrollment): Promise<void>;
  findById(id: string): Promise<Enrollment | null>;
  update(enrollment: Enrollment): Promise<void>;
  findByStudentId(student_id: string): Promise<Enrollment[]>;
  findByClassId(class_id: string): Promise<Enrollment[]>;
  findByStudentAndClass(
    student_id: string,
    class_id: string,
  ): Promise<Enrollment | null>;
}
