import type { ITeacherRepository } from "../../repository/ITeacherRepository.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";

type ActivateTeacherInput = {
  id: string;
};

export class ActivateTeacherService {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(input: ActivateTeacherInput): Promise<void> {
    const teacher = await this.teacherRepository.findById(input.id);
    if (!teacher) {
      throw new NotFoundError(`Teacher with id "${input.id}" not found`);
    }
    if (teacher.is_active) {
      throw new BadRequestError("Teacher is already active");
    }
    teacher.activate();
    await this.teacherRepository.update(teacher);
  }
}
