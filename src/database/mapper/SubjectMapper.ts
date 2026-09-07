import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { Subject } from "../../entity/subject.js";
import type { subject_table } from "../drizzle/schemas/subject.js";

export type SubjectRaw = InferSelectModel<typeof subject_table>;
export type SubjectInsert = InferInsertModel<typeof subject_table>;

export class SubjectMapper {
  public static toDomain(raw: SubjectRaw): Subject {
    return Subject.restore(
      raw.id,
      raw.name,
      raw.description,
      raw.teacher_id,
      raw.school_class_id,
    );
  }

  public static toPersistence(subject: Subject): SubjectInsert {
    return {
      id: subject.id,
      name: subject.name,
      description: subject.description,
      teacher_id: subject.teacher_id,
      school_class_id: subject.school_class_id,
    };
  }
}
