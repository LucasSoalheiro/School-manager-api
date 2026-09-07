import type { ITeacherRepository } from "../../repository/ITeacherRepository.js";

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
      throw new Error(`Teacher with id "${input.id}" not found`);
    }

    await teacher.change_password(input.current_password, input.new_password);
    await this.teacherRepository.update(teacher);
  }
}
