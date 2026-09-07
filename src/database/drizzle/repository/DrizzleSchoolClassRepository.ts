import { eq, inArray, and } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { School_class } from "../../../entity/school_class.js";
import type { ISchoolClassRepository } from "../../../repository/ISchoolClassRepository.js";
import { school_class_table } from "../schemas/school_class.js";
import { enrollment_table } from "../schemas/enrollment.js";
import { student_table } from "../schemas/student.js";
import { activity_table } from "../schemas/activity.js";
import { SchoolClassMapper } from "../../mapper/SchoolClassMapper.js";
import { StudentMapper } from "../../mapper/StudentMapper.js";
import { ActivityMapper } from "../../mapper/ActivityMapper.js";
import type { Student } from "../../../entity/student.js";
import type { Activity } from "../../../entity/activity.js";

export class DrizzleSchoolClassRepository implements ISchoolClassRepository {
  constructor(private readonly db: NeonHttpDatabase<any>) {}

  private async loadClassRelations(
    classId: string,
  ): Promise<{ students: Student[]; activities: Activity[] }> {
    const enrollments = await this.db
      .select()
      .from(enrollment_table)
      .where(
        and(
          eq(enrollment_table.school_class_id, classId),
          eq(enrollment_table.status, "active"),
        ),
      );

    let students: Student[] = [];
    if (enrollments.length > 0) {
      const studentIds = enrollments.map((e) => e.student_id);
      const studentRows = await this.db
        .select()
        .from(student_table)
        .where(inArray(student_table.id, studentIds));
      students = studentRows.map(StudentMapper.toDomain);
    }

    const activityRows = await this.db
      .select()
      .from(activity_table)
      .where(eq(activity_table.school_class_id, classId));
    const activities = activityRows.map(ActivityMapper.toDomain);

    return { students, activities };
  }

  async save(school_class: School_class): Promise<void> {
    const raw = SchoolClassMapper.toPersistence(school_class);
    await this.db.insert(school_class_table).values(raw);
  }

  async findById(id: string): Promise<School_class | null> {
    const [row] = await this.db
      .select()
      .from(school_class_table)
      .where(eq(school_class_table.id, id));
    if (!row) return null;

    const { students, activities } = await this.loadClassRelations(id);
    return SchoolClassMapper.toDomain(row, students, activities);
  }

  async update(school_class: School_class): Promise<void> {
    const raw = SchoolClassMapper.toPersistence(school_class);
    await this.db
      .update(school_class_table)
      .set({
        class_name: raw.class_name,
        status_class: raw.status_class,
        teacher_id: raw.teacher_id,
      })
      .where(eq(school_class_table.id, school_class.id));
  }

  async findAll(): Promise<School_class[]> {
    const rows = await this.db.select().from(school_class_table);
    const classes: School_class[] = [];
    for (const row of rows) {
      const { students, activities } = await this.loadClassRelations(row.id);
      classes.push(SchoolClassMapper.toDomain(row, students, activities));
    }
    return classes;
  }

  async findByTeacherId(teacher_id: string): Promise<School_class[]> {
    const rows = await this.db
      .select()
      .from(school_class_table)
      .where(eq(school_class_table.teacher_id, teacher_id));

    const classes: School_class[] = [];
    for (const row of rows) {
      const { students, activities } = await this.loadClassRelations(row.id);
      classes.push(SchoolClassMapper.toDomain(row, students, activities));
    }
    return classes;
  }
}
