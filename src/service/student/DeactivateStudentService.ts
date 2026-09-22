import type { IStudentRepository } from "../../repository/IStudentRepository.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";

type DeactivateStudentInput = {
  id: string;
};

export class DeactivateStudentService {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(input: DeactivateStudentInput): Promise<void> {
    const student = await this.studentRepository.findById(input.id);
    if (!student) {
      throw new NotFoundError(`Student with id "${input.id}" not found`);
    }
    if (!student.is_active) {
      throw new BadRequestError("Student is already inactive");
    }
    student.deactivate();
    await this.studentRepository.update(student);
  }
}
