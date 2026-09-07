import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Student } from "../../../entity/student.js";
import type { IStudentRepository } from "../../../repository/IStudentRepository.js";
import { student_table } from "../schemas/student.js";
import { StudentMapper } from "../../mapper/StudentMapper.js";

export class DrizzleStudentRepository implements IStudentRepository {
  constructor(private readonly db: NeonHttpDatabase<any>) {}

  async save(student: Student): Promise<void> {
    const raw = StudentMapper.toPersistence(student);
    await this.db.insert(student_table).values(raw);
  }

  async findById(id: string): Promise<Student | null> {
    const [row] = await this.db
      .select()
      .from(student_table)
      .where(eq(student_table.id, id));
    if (!row) return null;
    return StudentMapper.toDomain(row);
  }

  async findByEmail(email: string): Promise<Student | null> {
    const [row] = await this.db
      .select()
      .from(student_table)
      .where(eq(student_table.email, email));
    if (!row) return null;
    return StudentMapper.toDomain(row);
  }

  async update(student: Student): Promise<void> {
    const raw = StudentMapper.toPersistence(student);
    await this.db
      .update(student_table)
      .set({
        email: raw.email,
        name: raw.name,
        last_name: raw.last_name,
        hashed_password: raw.hashed_password,
        status: raw.status,
      })
      .where(eq(student_table.id, student.id));
  }

  async findAll(): Promise<Student[]> {
    const rows = await this.db.select().from(student_table);
    return rows.map(StudentMapper.toDomain);
  }
}
