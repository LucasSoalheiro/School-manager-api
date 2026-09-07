import type { Activity } from "../entity/activity.js";

export interface IActivityRepository {
  save(activity: Activity): Promise<void>;
  findById(id: string): Promise<Activity | null>;
  update(activity: Activity): Promise<void>;
  findByClassId(class_id: string): Promise<Activity[]>;
}
