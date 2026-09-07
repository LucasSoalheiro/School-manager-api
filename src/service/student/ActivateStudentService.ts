import type { IStudentRepository } from "../../repository/IStudentRepository.js";

type ActivateStudentInput = {
  id: string;
};

export class ActivateStudentService {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(input: ActivateStudentInput): Promise<void> {
    const student = await this.studentRepository.findById(input.id);
    if (!student) {
      throw new Error(`Student with id "${input.id}" not found`);
    }
    if (student.is_active) {
      throw new Error("Student is already active");
    }
    student.activate();
    await this.studentRepository.update(student);
  }
}
