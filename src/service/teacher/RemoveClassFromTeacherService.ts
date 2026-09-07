import type { ITeacherRepository } from "../../repository/ITeacherRepository.js";

type RemoveClassFromTeacherInput = {
  teacher_id: string;
  class_id: string;
};

export class RemoveClassFromTeacherService {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(input: RemoveClassFromTeacherInput): Promise<void> {
    const teacher = await this.teacherRepository.findById(input.teacher_id);
    if (!teacher) {
      throw new Error(`Teacher with id "${input.teacher_id}" not found`);
    }

    teacher.remove_class(input.class_id);
    await this.teacherRepository.update(teacher);
  }
}
