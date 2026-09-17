import type { IActivityRepository } from "../../repository/IActivityRepository.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";

type UpdateDeliveryDateInput = {
  activity_id: string;
  new_delivery_date: Date;
};

export class UpdateDeliveryDateService {
  constructor(private readonly activityRepository: IActivityRepository) {}

  async execute(input: UpdateDeliveryDateInput): Promise<void> {
    const activity = await this.activityRepository.findById(
      input.activity_id,
    );
    if (!activity) {
      throw new NotFoundError(`Activity with id "${input.activity_id}" not found`);
    }

    try {
      activity.update_delivery_date(input.new_delivery_date);
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
    await this.activityRepository.update(activity);
  }
}
