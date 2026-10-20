import { Activity } from "../../entity/activity.js";
import { Grade } from "../../entity/grade.js";
import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";
import type { IActivityRepository } from "../../repository/IActivityRepository.js";
import type { IEnrollmentRepository } from "../../repository/IEnrollmentRepository.js";
import type { IStudentRepository } from "../../repository/IStudentRepository.js";
import type { IGradeRepository } from "../../repository/IGradeRepository.js";
import { NotFoundError, BadRequestError, ForbiddenError } from "../../errors/AppError.js";

type AddActivityToClassInput = {
  class_id: string;
  title: string;
  description: string;
  delivery_date?: Date;
  teacher_id?: string;
};

type AddActivityToClassOutput = {
  activity_id: string;
  title: string;
};

export class AddActivityToClassService {
  constructor(
    private readonly schoolClassRepository: ISchoolClassRepository,
    private readonly activityRepository: IActivityRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly gradeRepository: IGradeRepository,
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
    if (input.teacher_id && school_class.teacher_id && school_class.teacher_id !== input.teacher_id) {
      throw new ForbiddenError("You can only add activities to your own classes");
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

    const enrollments = await this.enrollmentRepository.findByClassId(school_class.id);
    for (const enrollment of enrollments) {
      if (enrollment.is_active) {
        const student = await this.studentRepository.findById(enrollment.student_id);
        if (student && student.is_active) {
          const grade = Grade.create(student, activity);
          await this.gradeRepository.save(grade);
        }
      }
    }

    return {
      activity_id: activity.id,
      title: activity.title,
    };
  }
}
