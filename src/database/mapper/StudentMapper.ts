import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { Student } from "../../entity/student.js";
import type { student_table } from "../drizzle/schemas/student.js";

export type StudentRaw = InferSelectModel<typeof student_table>;
export type StudentInsert = InferInsertModel<typeof student_table>;

export class StudentMapper {
  public static toDomain(raw: StudentRaw): Student {
    return Student.restore(
      raw.id,
      raw.email,
      raw.name,
      raw.last_name,
      raw.hashed_password,
      raw.status,
    );
  }

  public static toPersistence(student: Student): StudentInsert {
    return {
      id: student.id,
      email: student.email,
      name: student.name,
      last_name: student.last_name,
      hashed_password: student.hashed_password,
      status: student.is_active,
    };
  }
}
