import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";
import type { IEnrollmentRepository } from "../../repository/IEnrollmentRepository.js";
import { NotFoundError, BadRequestError, ForbiddenError } from "../../errors/AppError.js";

type RemoveStudentFromClassInput = {
  student_id: string;
  class_id: string;
  teacher_id?: string;
};

export class RemoveStudentFromClassService {
  constructor(
    private readonly schoolClassRepository: ISchoolClassRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(input: RemoveStudentFromClassInput): Promise<void> {
    const school_class = await this.schoolClassRepository.findById(
      input.class_id,
    );
    if (!school_class) {
      throw new NotFoundError(`Class with id "${input.class_id}" not found`);
    }
    if (input.teacher_id && school_class.teacher_id && school_class.teacher_id !== input.teacher_id) {
      throw new ForbiddenError("You can only remove students from your own classes");
    }

    const enrollment = await this.enrollmentRepository.findByStudentAndClass(
      input.student_id,
      input.class_id,
    );
    if (!enrollment || !enrollment.is_active) {
      throw new BadRequestError("Student is not actively enrolled in this class");
    }

    school_class.remove_student(input.student_id);
    enrollment.cancel();

    await this.schoolClassRepository.update(school_class);
    await this.enrollmentRepository.update(enrollment);
  }
}
