import type { IStudentRepository } from "../../repository/IStudentRepository.js";

type UpdateStudentNameInput = {
  id: string;
  name?: string;
  last_name?: string;
};

export class UpdateStudentNameService {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(input: UpdateStudentNameInput): Promise<void> {
    const student = await this.studentRepository.findById(input.id);
    if (!student) {
      throw new Error(`Student with id "${input.id}" not found`);
    }

    if (input.name !== undefined) {
      if (input.name.length < 3 || input.name.length > 50) {
        throw new Error("Name must be between 3 and 50 characters");
      }
      student.name = input.name;
    }

    if (input.last_name !== undefined) {
      if (input.last_name.length < 3 || input.last_name.length > 50) {
        throw new Error("Last name must be between 3 and 50 characters");
      }
      student.last_name = input.last_name;
    }

    await this.studentRepository.update(student);
  }
}
