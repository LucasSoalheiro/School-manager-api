import type { ITeacherRepository } from "../../repository/ITeacherRepository.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";

type UpdateTeacherNameInput = {
  id: string;
  name?: string;
  last_name?: string;
};

export class UpdateTeacherNameService {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(input: UpdateTeacherNameInput): Promise<void> {
    const teacher = await this.teacherRepository.findById(input.id);
    if (!teacher) {
      throw new NotFoundError(`Teacher with id "${input.id}" not found`);
    }

    if (input.name !== undefined) {
      if (input.name.length < 3 || input.name.length > 50) {
        throw new BadRequestError("Name must be between 3 and 50 characters");
      }
      teacher.name = input.name;
    }

    if (input.last_name !== undefined) {
      if (input.last_name.length < 3 || input.last_name.length > 50) {
        throw new BadRequestError("Last name must be between 3 and 50 characters");
      }
      teacher.last_name = input.last_name;
    }

    await this.teacherRepository.update(teacher);
  }
}
