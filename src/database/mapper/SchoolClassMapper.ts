import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { School_class } from "../../entity/school_class.js";
import type { Student } from "../../entity/student.js";
import type { Activity } from "../../entity/activity.js";
import type { school_class_table } from "../drizzle/schemas/school_class.js";

export type SchoolClassRaw = InferSelectModel<typeof school_class_table>;
export type SchoolClassInsert = InferInsertModel<typeof school_class_table>;

export class SchoolClassMapper {
  public static toDomain(
    raw: SchoolClassRaw,
    students: Student[] = [],
    activities: Activity[] = [],
  ): School_class {
    return School_class.restore(
      raw.id,
      raw.class_name,
      students,
      activities,
      raw.status_class,
      raw.teacher_id ?? null,
    );
  }

  public static toPersistence(school_class: School_class): SchoolClassInsert {
    return {
      id: school_class.id,
      class_name: school_class.class_name,
      teacher_id: school_class.teacher_id,
      status_class: school_class.is_active,
    };
  }
}
