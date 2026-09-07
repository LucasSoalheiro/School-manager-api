import type { Teacher } from "../entity/teacher.js";

export interface ITeacherRepository {
  save(teacher: Teacher): Promise<void>;
  findById(id: string): Promise<Teacher | null>;
  findByEmail(email: string): Promise<Teacher | null>;
  update(teacher: Teacher): Promise<void>;
  findAll(): Promise<Teacher[]>;
}
