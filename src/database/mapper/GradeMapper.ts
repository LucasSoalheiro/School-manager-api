import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { Grade, type GradeStatus } from "../../entity/grade.js";
import type { grade_table } from "../drizzle/schemas/grade.js";

export type GradeRaw = InferSelectModel<typeof grade_table>;
export type GradeInsert = InferInsertModel<typeof grade_table>;

export class GradeMapper {
  public static toDomain(raw: GradeRaw): Grade {
    return Grade.restore(
      raw.id,
      raw.student_id,
      raw.activity_id,
      raw.score,
      raw.status as GradeStatus,
      raw.submitted_at ? new Date(raw.submitted_at) : null,
      raw.feedback,
    );
  }

  public static toPersistence(grade: Grade): GradeInsert {
    return {
      id: grade.id,
      student_id: grade.student_id,
      activity_id: grade.activity_id,
      score: grade.score,
      status: grade.status,
      submitted_at: grade.submitted_at,
      feedback: grade.feedback,
    };
  }
}
