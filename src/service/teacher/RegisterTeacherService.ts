import { Email } from "../../entity/value_object/email.js";
import { Teacher } from "../../entity/teacher.js";
import type { ITeacherRepository } from "../../repository/ITeacherRepository.js";

type RegisterTeacherInput = {
  name: string;
  last_name: string;
  email: string;
  password: string;
};

type RegisterTeacherOutput = {
  id: string;
  full_name: string;
  email: string;
};

export class RegisterTeacherService {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(
    input: RegisterTeacherInput,
  ): Promise<RegisterTeacherOutput> {
    const existing = await this.teacherRepository.findByEmail(input.email);
    if (existing) {
      throw new Error("Email already in use");
    }

    const email = Email.create(input.email);
    const teacher = await Teacher.create(
      input.name,
      input.last_name,
      email,
      input.password,
    );

    await this.teacherRepository.save(teacher);

    return {
      id: teacher.id,
      full_name: teacher.full_name,
      email: teacher.email,
    };
  }
}
