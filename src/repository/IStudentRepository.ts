import type { Student } from "../entity/student.js";

export interface IStudentRepository {
  save(student: Student): Promise<void>;
  findById(id: string): Promise<Student | null>;
  findByEmail(email: string): Promise<Student | null>;
  update(student: Student): Promise<void>;
  findAll(): Promise<Student[]>;
}
