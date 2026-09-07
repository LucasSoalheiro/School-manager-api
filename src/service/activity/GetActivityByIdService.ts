import type { Activity } from "../../entity/activity.js";
import type { IActivityRepository } from "../../repository/IActivityRepository.js";

type GetActivityByIdInput = {
  id: string;
};

export class GetActivityByIdService {
  constructor(private readonly activityRepository: IActivityRepository) {}

  async execute(input: GetActivityByIdInput): Promise<Activity> {
    const activity = await this.activityRepository.findById(input.id);
    if (!activity) {
      throw new Error(`Activity with id "${input.id}" not found`);
    }
    return activity;
  }
}
