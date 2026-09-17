import { Activity } from "../../entity/activity.js";
import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";
import type { IActivityRepository } from "../../repository/IActivityRepository.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";

type AddActivityToClassInput = {
  class_id: string;
  title: string;
  description: string;
  delivery_date?: Date;
};

type AddActivityToClassOutput = {
  activity_id: string;
  title: string;
};

export class AddActivityToClassService {
  constructor(
    private readonly schoolClassRepository: ISchoolClassRepository,
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(
    input: AddActivityToClassInput,
  ): Promise<AddActivityToClassOutput> {
    const school_class = await this.schoolClassRepository.findById(
      input.class_id,
    );
    if (!school_class) {
      throw new NotFoundError(`Class with id "${input.class_id}" not found`);
    }
    if (!school_class.is_active) {
      throw new BadRequestError("Cannot add activities to an inactive class");
    }

    const activity = Activity.create(
      input.title,
      input.description,
      input.delivery_date,
      school_class.id,
    );

    school_class.add_activity(activity);

    await this.activityRepository.save(activity);

    return {
      activity_id: activity.id,
      title: activity.title,
    };
  }
}
