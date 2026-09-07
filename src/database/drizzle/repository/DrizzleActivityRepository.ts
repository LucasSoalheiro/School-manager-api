import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Activity } from "../../../entity/activity.js";
import type { IActivityRepository } from "../../../repository/IActivityRepository.js";
import { activity_table } from "../schemas/activity.js";
import { ActivityMapper } from "../../mapper/ActivityMapper.js";

export class DrizzleActivityRepository implements IActivityRepository {
  constructor(private readonly db: NeonHttpDatabase<any>) {}

  async save(activity: Activity): Promise<void> {
    const raw = ActivityMapper.toPersistence(activity);
    await this.db.insert(activity_table).values(raw);
  }

  async findById(id: string): Promise<Activity | null> {
    const [row] = await this.db
      .select()
      .from(activity_table)
      .where(eq(activity_table.id, id));
    if (!row) return null;
    return ActivityMapper.toDomain(row);
  }

  async update(activity: Activity): Promise<void> {
    const raw = ActivityMapper.toPersistence(activity);
    await this.db
      .update(activity_table)
      .set({
        title: raw.title,
        description: raw.description,
        delivery_date: raw.delivery_date,
        school_class_id: raw.school_class_id,
      })
      .where(eq(activity_table.id, activity.id));
  }

  async findByClassId(class_id: string): Promise<Activity[]> {
    const rows = await this.db
      .select()
      .from(activity_table)
      .where(eq(activity_table.school_class_id, class_id));
    return rows.map(ActivityMapper.toDomain);
  }
}
