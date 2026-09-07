import type { Student } from "../../entity/student.js";
import type { IStudentRepository } from "../../repository/IStudentRepository.js";

type GetStudentByIdInput = {
  id: string;
};

export class GetStudentByIdService {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(input: GetStudentByIdInput): Promise<Student> {
    const student = await this.studentRepository.findById(input.id);
    if (!student) {
      throw new Error(`Student with id "${input.id}" not found`);
    }
    return student;
  }
}
