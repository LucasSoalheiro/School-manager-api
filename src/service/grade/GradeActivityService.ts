import type { IGradeRepository } from "../../repository/IGradeRepository.js";
import type { IActivityRepository } from "../../repository/IActivityRepository.js";
import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";
import { NotFoundError, BadRequestError, ForbiddenError } from "../../errors/AppError.js";

type GradeActivityInput = {
  grade_id: string;
  teacher_id?: string;
  /** Score from 0 to 10 */
  score: number;
  feedback?: string;
};

export class GradeActivityService {
  constructor(
    private readonly gradeRepository: IGradeRepository,
    private readonly activityRepository: IActivityRepository,
    private readonly schoolClassRepository: ISchoolClassRepository,
  ) {}

  async execute(input: GradeActivityInput): Promise<void> {
    const grade = await this.gradeRepository.findById(input.grade_id);
    if (!grade) {
      throw new NotFoundError(`Grade with id "${input.grade_id}" not found`);
    }

    if (input.teacher_id) {
      const activity = await this.activityRepository.findById(grade.activity_id);
      if (activity?.school_class_id) {
        const school_class = await this.schoolClassRepository.findById(activity.school_class_id);
        if (school_class?.teacher_id && school_class.teacher_id !== input.teacher_id) {
          throw new ForbiddenError("You can only grade activities for your own classes");
        }
      }
    }

    try {
      grade.grade(input.score, input.feedback);
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
    await this.gradeRepository.update(grade);
  }
}
