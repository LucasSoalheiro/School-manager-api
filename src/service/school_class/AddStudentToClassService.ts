import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";
import type { IStudentRepository } from "../../repository/IStudentRepository.js";
import type { IEnrollmentRepository } from "../../repository/IEnrollmentRepository.js";
import type { IGradeRepository } from "../../repository/IGradeRepository.js";
import { Enrollment } from "../../entity/enrollment.js";
import { Grade } from "../../entity/grade.js";
import { NotFoundError, BadRequestError, ForbiddenError } from "../../errors/AppError.js";

type AddStudentToClassInput = {
  student_id: string;
  class_id: string;
  teacher_id?: string;
};

export class AddStudentToClassService {
  constructor(
    private readonly schoolClassRepository: ISchoolClassRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async execute(input: AddStudentToClassInput): Promise<void> {
    const student = await this.studentRepository.findById(input.student_id);
    if (!student) {
      throw new NotFoundError(`Student with id "${input.student_id}" not found`);
    }
    if (!student.is_active) {
      throw new BadRequestError("Cannot enroll an inactive student");
    }

    const school_class = await this.schoolClassRepository.findById(
      input.class_id,
    );
    if (!school_class) {
      throw new NotFoundError(`Class with id "${input.class_id}" not found`);
    }
    if (input.teacher_id && school_class.teacher_id && school_class.teacher_id !== input.teacher_id) {
      throw new ForbiddenError("You can only add students to your own classes");
    }
    if (!school_class.is_active) {
      throw new BadRequestError("Cannot enroll a student in an inactive class");
    }

    const existing_enrollment =
      await this.enrollmentRepository.findByStudentAndClass(
        input.student_id,
        input.class_id,
      );
    if (existing_enrollment?.is_active) {
      throw new BadRequestError("Student is already enrolled in this class");
    }

    // Add to the aggregate and create (or reactivate) the enrollment record.
    // A cancelled enrollment cannot be inserted again because of the unique
    // (student_id, school_class_id) index, so the existing row is reused.
    school_class.add_student(student);

    await this.schoolClassRepository.update(school_class);

    if (existing_enrollment) {
      existing_enrollment.reactivate();
      await this.enrollmentRepository.update(existing_enrollment);
    } else {
      const enrollment = Enrollment.create(student, school_class);
      await this.enrollmentRepository.save(enrollment);
    }

    // Create pending Grade records for all existing activities in this class
    for (const activity of school_class.activities) {
      const existingGrade = await this.gradeRepository.findByStudentAndActivity(
        student.id,
        activity.id,
      );
      if (!existingGrade) {
        const grade = Grade.create(student, activity);
        await this.gradeRepository.save(grade);
      }
    }
  }
}
