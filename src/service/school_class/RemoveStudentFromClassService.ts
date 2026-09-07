import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";
import type { IEnrollmentRepository } from "../../repository/IEnrollmentRepository.js";

type RemoveStudentFromClassInput = {
  student_id: string;
  class_id: string;
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
      throw new Error(`Class with id "${input.class_id}" not found`);
    }

    const enrollment = await this.enrollmentRepository.findByStudentAndClass(
      input.student_id,
      input.class_id,
    );
    if (!enrollment || !enrollment.is_active) {
      throw new Error("Student is not actively enrolled in this class");
    }

    school_class.remove_student(input.student_id);
    enrollment.cancel();

    await this.schoolClassRepository.update(school_class);
    await this.enrollmentRepository.update(enrollment);
  }
}
