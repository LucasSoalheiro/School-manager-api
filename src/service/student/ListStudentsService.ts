import type { IStudentRepository } from "../../repository/IStudentRepository.js";
import type { Student } from "../../entity/student.js";

export class ListStudentsService {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }
}
