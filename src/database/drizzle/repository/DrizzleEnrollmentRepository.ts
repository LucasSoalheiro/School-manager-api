import { eq, and } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Enrollment } from "../../../entity/enrollment.js";
import type { IEnrollmentRepository } from "../../../repository/IEnrollmentRepository.js";
import { enrollment_table } from "../schemas/enrollment.js";
import { EnrollmentMapper } from "../../mapper/EnrollmentMapper.js";

export class DrizzleEnrollmentRepository implements IEnrollmentRepository {
  constructor(private readonly db: NeonHttpDatabase<any>) {}

  async save(enrollment: Enrollment): Promise<void> {
    const raw = EnrollmentMapper.toPersistence(enrollment);
    await this.db.insert(enrollment_table).values(raw);
  }

  async findById(id: string): Promise<Enrollment | null> {
    const [row] = await this.db
      .select()
      .from(enrollment_table)
      .where(eq(enrollment_table.id, id));
    if (!row) return null;
    return EnrollmentMapper.toDomain(row);
  }

  async update(enrollment: Enrollment): Promise<void> {
    const raw = EnrollmentMapper.toPersistence(enrollment);
    await this.db
      .update(enrollment_table)
      .set({
        status: raw.status,
        enrolled_at: raw.enrolled_at,
      })
      .where(eq(enrollment_table.id, enrollment.id));
  }

  async findByStudentId(student_id: string): Promise<Enrollment[]> {
    const rows = await this.db
      .select()
      .from(enrollment_table)
      .where(eq(enrollment_table.student_id, student_id));
    return rows.map(EnrollmentMapper.toDomain);
  }

  async findByClassId(class_id: string): Promise<Enrollment[]> {
    const rows = await this.db
      .select()
      .from(enrollment_table)
      .where(eq(enrollment_table.school_class_id, class_id));
    return rows.map(EnrollmentMapper.toDomain);
  }

  async findByStudentAndClass(
    student_id: string,
    class_id: string,
  ): Promise<Enrollment | null> {
    const [row] = await this.db
      .select()
      .from(enrollment_table)
      .where(
        and(
          eq(enrollment_table.student_id, student_id),
          eq(enrollment_table.school_class_id, class_id),
        ),
      );
    if (!row) return null;
    return EnrollmentMapper.toDomain(row);
  }
}
