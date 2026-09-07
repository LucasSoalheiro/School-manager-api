import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { Activity } from "../../entity/activity.js";
import type { activity_table } from "../drizzle/schemas/activity.js";

export type ActivityRaw = InferSelectModel<typeof activity_table>;
export type ActivityInsert = InferInsertModel<typeof activity_table>;

export class ActivityMapper {
  public static toDomain(raw: ActivityRaw): Activity {
    return Activity.restore(
      raw.id,
      raw.title,
      raw.description,
      new Date(raw.created_at),
      raw.delivery_date ? new Date(raw.delivery_date) : undefined,
      raw.school_class_id ?? undefined,
    );
  }

  public static toPersistence(activity: Activity): ActivityInsert {
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      created_at: activity.created_at,
      delivery_date: activity.delivery_date ?? null,
      school_class_id: activity.school_class_id ?? null,
    };
  }
}
