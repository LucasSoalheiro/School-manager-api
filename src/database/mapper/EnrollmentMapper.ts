import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { Enrollment, type EnrollmentStatus } from "../../entity/enrollment.js";
import type { enrollment_table } from "../drizzle/schemas/enrollment.js";

export type EnrollmentRaw = InferSelectModel<typeof enrollment_table>;
export type EnrollmentInsert = InferInsertModel<typeof enrollment_table>;

export class EnrollmentMapper {
  public static toDomain(raw: EnrollmentRaw): Enrollment {
    return Enrollment.restore(
      raw.id,
      raw.student_id,
      raw.school_class_id,
      new Date(raw.enrolled_at),
      raw.status as EnrollmentStatus,
    );
  }

  public static toPersistence(enrollment: Enrollment): EnrollmentInsert {
    return {
      id: enrollment.id,
      student_id: enrollment.student_id,
      school_class_id: enrollment.school_class_id,
      enrolled_at: enrollment.enrolled_at,
      status: enrollment.status,
    };
  }
}
