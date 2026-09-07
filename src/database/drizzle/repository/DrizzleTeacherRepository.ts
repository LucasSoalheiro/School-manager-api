import { eq, and, inArray, notInArray } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Teacher } from "../../../entity/teacher.js";
import type { ITeacherRepository } from "../../../repository/ITeacherRepository.js";
import { teacher_table } from "../schemas/teacher.js";
import { school_class_table } from "../schemas/school_class.js";
import { TeacherMapper } from "../../mapper/TeacherMapper.js";
import { SchoolClassMapper } from "../../mapper/SchoolClassMapper.js";

export class DrizzleTeacherRepository implements ITeacherRepository {
  constructor(private readonly db: NeonHttpDatabase<any>) {}

  async save(teacher: Teacher): Promise<void> {
    const raw = TeacherMapper.toPersistence(teacher);
    await this.db.insert(teacher_table).values(raw);

    const classIds = teacher.school_classes.map((c) => c.id);
    if (classIds.length > 0) {
      await this.db
        .update(school_class_table)
        .set({ teacher_id: teacher.id })
        .where(inArray(school_class_table.id, classIds));
    }
  }

  async findById(id: string): Promise<Teacher | null> {
    const [row] = await this.db
      .select()
      .from(teacher_table)
      .where(eq(teacher_table.id, id));
    if (!row) return null;

    const classRows = await this.db
      .select()
      .from(school_class_table)
      .where(eq(school_class_table.teacher_id, id));

    const schoolClasses = classRows.map((c) => SchoolClassMapper.toDomain(c));
    return TeacherMapper.toDomain(row, schoolClasses);
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    const [row] = await this.db
      .select()
      .from(teacher_table)
      .where(eq(teacher_table.email, email));
    if (!row) return null;

    const classRows = await this.db
      .select()
      .from(school_class_table)
      .where(eq(school_class_table.teacher_id, row.id));

    const schoolClasses = classRows.map((c) => SchoolClassMapper.toDomain(c));
    return TeacherMapper.toDomain(row, schoolClasses);
  }

  async update(teacher: Teacher): Promise<void> {
    const raw = TeacherMapper.toPersistence(teacher);
    await this.db
      .update(teacher_table)
      .set({
        email: raw.email,
        name: raw.name,
        last_name: raw.last_name,
        hashed_password: raw.hashed_password,
        status: raw.status,
      })
      .where(eq(teacher_table.id, teacher.id));

    const classIds = teacher.school_classes.map((c) => c.id);
    if (classIds.length > 0) {
      await this.db
        .update(school_class_table)
        .set({ teacher_id: teacher.id })
        .where(inArray(school_class_table.id, classIds));

      await this.db
        .update(school_class_table)
        .set({ teacher_id: null })
        .where(
          and(
            eq(school_class_table.teacher_id, teacher.id),
            notInArray(school_class_table.id, classIds),
          ),
        );
    } else {
      await this.db
        .update(school_class_table)
        .set({ teacher_id: null })
        .where(eq(school_class_table.teacher_id, teacher.id));
    }
  }

  async findAll(): Promise<Teacher[]> {
    const rows = await this.db.select().from(teacher_table);
    const teachers: Teacher[] = [];

    for (const row of rows) {
      const classRows = await this.db
        .select()
        .from(school_class_table)
        .where(eq(school_class_table.teacher_id, row.id));
      const schoolClasses = classRows.map((c) => SchoolClassMapper.toDomain(c));
      teachers.push(TeacherMapper.toDomain(row, schoolClasses));
    }

    return teachers;
  }
}
