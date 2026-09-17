import type { ITeacherRepository } from "../../repository/ITeacherRepository.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";

type ChangeTeacherPasswordInput = {
  id: string;
  current_password: string;
  new_password: string;
};

export class ChangeTeacherPasswordService {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(input: ChangeTeacherPasswordInput): Promise<void> {
    const teacher = await this.teacherRepository.findById(input.id);
    if (!teacher) {
      throw new NotFoundError(`Teacher with id "${input.id}" not found`);
    }

    try {
      await teacher.change_password(input.current_password, input.new_password);
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
    await this.teacherRepository.update(teacher);
  }
}
