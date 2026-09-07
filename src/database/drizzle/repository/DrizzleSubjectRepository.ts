import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Subject } from "../../../entity/subject.js";
import type { ISubjectRepository } from "../../../repository/ISubjectRepository.js";
import { subject_table } from "../schemas/subject.js";
import { SubjectMapper } from "../../mapper/SubjectMapper.js";

export class DrizzleSubjectRepository implements ISubjectRepository {
  constructor(private readonly db: NeonHttpDatabase<any>) {}

  async save(subject: Subject): Promise<void> {
    const raw = SubjectMapper.toPersistence(subject);
    await this.db.insert(subject_table).values(raw);
  }

  async findById(id: string): Promise<Subject | null> {
    const [row] = await this.db
      .select()
      .from(subject_table)
      .where(eq(subject_table.id, id));
    if (!row) return null;
    return SubjectMapper.toDomain(row);
  }

  async update(subject: Subject): Promise<void> {
    const raw = SubjectMapper.toPersistence(subject);
    await this.db
      .update(subject_table)
      .set({
        name: raw.name,
        description: raw.description,
        teacher_id: raw.teacher_id,
        school_class_id: raw.school_class_id,
      })
      .where(eq(subject_table.id, subject.id));
  }

  async findByClassId(class_id: string): Promise<Subject[]> {
    const rows = await this.db
      .select()
      .from(subject_table)
      .where(eq(subject_table.school_class_id, class_id));
    return rows.map(SubjectMapper.toDomain);
  }

  async findByTeacherId(teacher_id: string): Promise<Subject[]> {
    const rows = await this.db
      .select()
      .from(subject_table)
      .where(eq(subject_table.teacher_id, teacher_id));
    return rows.map(SubjectMapper.toDomain);
  }
}
