import { eq, and, inArray, notInArray } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Teacher } from "../../../entity/teacher.js";
import type { School_class } from "../../../entity/school_class.js";
import type { Student } from "../../../entity/student.js";
import type { Activity } from "../../../entity/activity.js";
import type { ITeacherRepository } from "../../../repository/ITeacherRepository.js";
import { teacher_table } from "../schemas/teacher.js";
import { school_class_table } from "../schemas/school_class.js";
import { enrollment_table } from "../schemas/enrollment.js";
import { student_table } from "../schemas/student.js";
import { activity_table } from "../schemas/activity.js";
import { TeacherMapper } from "../../mapper/TeacherMapper.js";
import { SchoolClassMapper } from "../../mapper/SchoolClassMapper.js";
import { StudentMapper } from "../../mapper/StudentMapper.js";
import { ActivityMapper } from "../../mapper/ActivityMapper.js";

export class DrizzleTeacherRepository implements ITeacherRepository {
  constructor(private readonly db: NeonHttpDatabase<any>) {}

  private async loadClassesForTeacher(
    teacherId: string,
  ): Promise<School_class[]> {
    const classRows = await this.db
      .select()
      .from(school_class_table)
      .where(eq(school_class_table.teacher_id, teacherId));

    if (classRows.length === 0) return [];

    const classIds = classRows.map((c) => c.id);

    const enrollments = await this.db
      .select()
      .from(enrollment_table)
      .where(
        and(
          inArray(enrollment_table.school_class_id, classIds),
          eq(enrollment_table.status, "active"),
        ),
      );

    const studentsById = new Map<string, Student>();
    if (enrollments.length > 0) {
      const studentIds = [...new Set(enrollments.map((e) => e.student_id))];
      const studentRows = await this.db
        .select()
        .from(student_table)
        .where(inArray(student_table.id, studentIds));
      for (const sRow of studentRows) {
        studentsById.set(sRow.id, StudentMapper.toDomain(sRow));
      }
    }

    const activityRows = await this.db
      .select()
      .from(activity_table)
      .where(inArray(activity_table.school_class_id, classIds));

    const studentsByClass = new Map<string, Student[]>();
    for (const e of enrollments) {
      const student = studentsById.get(e.student_id);
      if (student) {
        const list = studentsByClass.get(e.school_class_id) ?? [];
        list.push(student);
        studentsByClass.set(e.school_class_id, list);
      }
    }

    const activitiesByClass = new Map<string, Activity[]>();
    for (const aRow of activityRows) {
      const activity = ActivityMapper.toDomain(aRow);
      if (aRow.school_class_id) {
        const list = activitiesByClass.get(aRow.school_class_id) ?? [];
        list.push(activity);
        activitiesByClass.set(aRow.school_class_id, list);
      }
    }

    return classRows.map((c) => {
      const classStudents = studentsByClass.get(c.id) ?? [];
      const classActivities = activitiesByClass.get(c.id) ?? [];
      return SchoolClassMapper.toDomain(c, classStudents, classActivities);
    });
  }

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

    const schoolClasses = await this.loadClassesForTeacher(id);
    return TeacherMapper.toDomain(row, schoolClasses);
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    const [row] = await this.db
      .select()
      .from(teacher_table)
      .where(eq(teacher_table.email, email));
    if (!row) return null;

    const schoolClasses = await this.loadClassesForTeacher(row.id);
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
    if (rows.length === 0) return [];

    const teacherIds = rows.map((r) => r.id);
    const classRows = await this.db
      .select()
      .from(school_class_table)
      .where(inArray(school_class_table.teacher_id, teacherIds));

    const classesByTeacher = new Map<string, School_class[]>();
    for (const c of classRows) {
      if (c.teacher_id) {
        const list = classesByTeacher.get(c.teacher_id) ?? [];
        list.push(SchoolClassMapper.toDomain(c));
        classesByTeacher.set(c.teacher_id, list);
      }
    }

    return rows.map((row) => {
      const schoolClasses = classesByTeacher.get(row.id) ?? [];
      return TeacherMapper.toDomain(row, schoolClasses);
    });
  }
}
