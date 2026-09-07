import type { Subject } from "../entity/subject.js";

export interface ISubjectRepository {
  save(subject: Subject): Promise<void>;
  findById(id: string): Promise<Subject | null>;
  update(subject: Subject): Promise<void>;
  findByClassId(class_id: string): Promise<Subject[]>;
  findByTeacherId(teacher_id: string): Promise<Subject[]>;
}
