import { Email } from "../../entity/value_object/email.js";
import { Student } from "../../entity/student.js";
import type { IStudentRepository } from "../../repository/IStudentRepository.js";

type RegisterStudentInput = {
  name: string;
  last_name: string;
  email: string;
  password: string;
};

type RegisterStudentOutput = {
  id: string;
  full_name: string;
  email: string;
};

export class RegisterStudentService {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(
    input: RegisterStudentInput,
  ): Promise<RegisterStudentOutput> {
    const existing = await this.studentRepository.findByEmail(input.email);
    if (existing) {
      throw new Error("Email already in use");
    }

    const email = Email.create(input.email);
    const student = await Student.create(
      input.name,
      input.last_name,
      email,
      input.password,
    );

    await this.studentRepository.save(student);

    return {
      id: student.id,
      full_name: student.full_name,
      email: student.email,
    };
  }
}
