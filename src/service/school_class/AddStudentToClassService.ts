import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";
import type { IStudentRepository } from "../../repository/IStudentRepository.js";
import type { IEnrollmentRepository } from "../../repository/IEnrollmentRepository.js";
import { Enrollment } from "../../entity/enrollment.js";

type AddStudentToClassInput = {
  student_id: string;
  class_id: string;
};

export class AddStudentToClassService {
  constructor(
    private readonly schoolClassRepository: ISchoolClassRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(input: AddStudentToClassInput): Promise<void> {
    const student = await this.studentRepository.findById(input.student_id);
    if (!student) {
      throw new Error(`Student with id "${input.student_id}" not found`);
    }

    const school_class = await this.schoolClassRepository.findById(
      input.class_id,
    );
    if (!school_class) {
      throw new Error(`Class with id "${input.class_id}" not found`);
    }

    const existing_enrollment =
      await this.enrollmentRepository.findByStudentAndClass(
        input.student_id,
        input.class_id,
      );
    if (existing_enrollment?.is_active) {
      throw new Error("Student is already enrolled in this class");
    }

    // Add to the aggregate and create the enrollment record
    school_class.add_student(student);
    const enrollment = Enrollment.create(student, school_class);

    await this.schoolClassRepository.update(school_class);
    await this.enrollmentRepository.save(enrollment);
  }
}
