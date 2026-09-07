import { eq, and } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Grade } from "../../../entity/grade.js";
import type { IGradeRepository } from "../../../repository/IGradeRepository.js";
import { grade_table } from "../schemas/grade.js";
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
