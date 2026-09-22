import type { ITeacherRepository } from "../../repository/ITeacherRepository.js";
import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";

type AddClassToTeacherInput = {
  teacher_id: string;
  class_id: string;
};

export class AddClassToTeacherService {
  constructor(
    private readonly teacherRepository: ITeacherRepository,
    private readonly schoolClassRepository: ISchoolClassRepository,
  ) {}

  async execute(input: AddClassToTeacherInput): Promise<void> {
    const teacher = await this.teacherRepository.findById(input.teacher_id);
    if (!teacher) {
      throw new NotFoundError(`Teacher with id "${input.teacher_id}" not found`);
    }
    if (!teacher.is_active) {
      throw new BadRequestError("Cannot assign a class to an inactive teacher");
    }

    const school_class = await this.schoolClassRepository.findById(
      input.class_id,
    );
    if (!school_class) {
      throw new NotFoundError(`Class with id "${input.class_id}" not found`);
    }
    if (!school_class.is_active) {
      throw new BadRequestError("Cannot assign an inactive class to a teacher");
    }

    teacher.add_class(school_class);
    await this.teacherRepository.update(teacher);
  }
}
