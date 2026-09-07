import type { ITeacherRepository } from "../../repository/ITeacherRepository.js";

type DeactivateTeacherInput = {
  id: string;
};

export class DeactivateTeacherService {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(input: DeactivateTeacherInput): Promise<void> {
    const teacher = await this.teacherRepository.findById(input.id);
    if (!teacher) {
      throw new Error(`Teacher with id "${input.id}" not found`);
    }
    if (!teacher.is_active) {
      throw new Error("Teacher is already inactive");
    }
    teacher.deactivate();
    await this.teacherRepository.update(teacher);
  }
}
