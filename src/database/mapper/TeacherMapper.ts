import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { Teacher } from "../../entity/teacher.js";
import type { School_class } from "../../entity/school_class.js";
import type { teacher_table } from "../drizzle/schemas/teacher.js";

export type TeacherRaw = InferSelectModel<typeof teacher_table>;
export type TeacherInsert = InferInsertModel<typeof teacher_table>;

export class TeacherMapper {
  public static toDomain(
    raw: TeacherRaw,
    school_classes: School_class[] = [],
  ): Teacher {
    return Teacher.restore(
      raw.id,
      raw.email,
      raw.name,
      raw.last_name,
      raw.hashed_password,
      raw.status,
      school_classes,
    );
  }

  public static toPersistence(teacher: Teacher): TeacherInsert {
    return {
      id: teacher.id,
      email: teacher.email,
      name: teacher.name,
      last_name: teacher.last_name,
      hashed_password: teacher.hashed_password,
      status: teacher.is_active,
    };
  }
}
