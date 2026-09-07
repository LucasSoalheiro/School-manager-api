import type { Teacher } from "../../entity/teacher.js";
import type { ITeacherRepository } from "../../repository/ITeacherRepository.js";

type GetTeacherByIdInput = {
  id: string;
};

export class GetTeacherByIdService {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(input: GetTeacherByIdInput): Promise<Teacher> {
    const teacher = await this.teacherRepository.findById(input.id);
    if (!teacher) {
      throw new Error(`Teacher with id "${input.id}" not found`);
    }
    return teacher;
  }
}
