import type { IStudentRepository } from "../../repository/IStudentRepository.js";

type ChangeStudentPasswordInput = {
  id: string;
  current_password: string;
  new_password: string;
};

export class ChangeStudentPasswordService {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(input: ChangeStudentPasswordInput): Promise<void> {
    const student = await this.studentRepository.findById(input.id);
    if (!student) {
      throw new Error(`Student with id "${input.id}" not found`);
    }

    await student.change_password(input.current_password, input.new_password);
    await this.studentRepository.update(student);
  }
}
