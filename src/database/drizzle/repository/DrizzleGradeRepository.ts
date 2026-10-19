import { eq, and } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Grade } from "../../../entity/grade.js";
import type { IGradeRepository, GradeWithDetails } from "../../../repository/IGradeRepository.js";
import { grade_table } from "../schemas/grade.js";
import { activity_table } from "../schemas/activity.js";
import { school_class_table } from "../schemas/school_class.js";
import { GradeMapper } from "../../mapper/GradeMapper.js";

export class DrizzleGradeRepository implements IGradeRepository {
  constructor(private readonly db: NeonHttpDatabase<any>) {}

  async save(grade: Grade): Promise<void> {
    const raw = GradeMapper.toPersistence(grade);
    await this.db.insert(grade_table).values(raw);
  }

  async findById(id: string): Promise<Grade | null> {
    const [row] = await this.db
      .select()
      .from(grade_table)
      .where(eq(grade_table.id, id));
    if (!row) return null;
    return GradeMapper.toDomain(row);
  }

  async update(grade: Grade): Promise<void> {
    const raw = GradeMapper.toPersistence(grade);
    await this.db
      .update(grade_table)
      .set({
        score: raw.score,
        status: raw.status,
        submitted_at: raw.submitted_at,
        feedback: raw.feedback,
      })
      .where(eq(grade_table.id, grade.id));
  }

  async findByStudentId(student_id: string): Promise<Grade[]> {
    const rows = await this.db
      .select()
      .from(grade_table)
      .where(eq(grade_table.student_id, student_id));
    return rows.map(GradeMapper.toDomain);
  }

  async findByStudentIdWithDetails(
    student_id: string,
  ): Promise<GradeWithDetails[]> {
    const rows = await this.db
      .select({
        id: grade_table.id,
        student_id: grade_table.student_id,
        activity_id: grade_table.activity_id,
        score: grade_table.score,
        status: grade_table.status,
        submitted_at: grade_table.submitted_at,
        feedback: grade_table.feedback,
        activity_title: activity_table.title,
        class_name: school_class_table.class_name,
      })
      .from(grade_table)
      .leftJoin(activity_table, eq(grade_table.activity_id, activity_table.id))
      .leftJoin(
        school_class_table,
        eq(activity_table.school_class_id, school_class_table.id),
      )
      .where(eq(grade_table.student_id, student_id));

    return rows.map((r) => ({
      id: r.id,
      student_id: r.student_id,
      activity_id: r.activity_id,
      score: r.score,
      status: r.status,
      submitted_at: r.submitted_at,
      feedback: r.feedback,
      activity_title: r.activity_title ?? null,
      class_name: r.class_name ?? null,
    }));
  }

  async findByActivityId(activity_id: string): Promise<Grade[]> {
    const rows = await this.db
      .select()
      .from(grade_table)
      .where(eq(grade_table.activity_id, activity_id));
    return rows.map(GradeMapper.toDomain);
  }

  async findByStudentAndActivity(
    student_id: string,
    activity_id: string,
  ): Promise<Grade | null> {
    const [row] = await this.db
      .select()
      .from(grade_table)
      .where(
        and(
          eq(grade_table.student_id, student_id),
          eq(grade_table.activity_id, activity_id),
        ),
      );
    if (!row) return null;
    return GradeMapper.toDomain(row);
  }
}
