import type { School_class } from "../entity/school_class.js";

export interface ISchoolClassRepository {
  save(school_class: School_class): Promise<void>;
  findById(id: string): Promise<School_class | null>;
  update(school_class: School_class): Promise<void>;
  findAll(): Promise<School_class[]>;
  findByTeacherId(teacher_id: string): Promise<School_class[]>;
}
