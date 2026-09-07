import type { FastifyReply, FastifyRequest } from "fastify";
import type { IStudentRepository } from "../../repository/IStudentRepository.js";
import type { ITeacherRepository } from "../../repository/ITeacherRepository.js";
import { Password } from "../../entity/value_object/password.js";
import { loginSchema } from "../schemas/authSchemas.js";

export class AuthController {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly teacherRepository: ITeacherRepository,
  ) {}

  public studentLogin = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { email, password } = loginSchema.parse(request.body);

    const student = await this.studentRepository.findByEmail(email);
    if (!student) {
      reply.status(401).send({ error: "Unauthorized", message: "Invalid email or password" });
      return;
    }

    if (!student.is_active) {
      reply.status(403).send({ error: "Forbidden", message: "Account is inactive" });
      return;
    }

    const isMatch = await Password.compare(password, student.hashed_password);
    if (!isMatch) {
      reply.status(401).send({ error: "Unauthorized", message: "Invalid email or password" });
      return;
    }

    const token = request.server.jwt.sign({
      id: student.id,
      email: student.email,
      role: "student",
    });

    reply.send({
      user: {
        id: student.id,
        name: student.full_name,
        email: student.email,
        role: "student",
      },
      token,
    });
  };

  public teacherLogin = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { email, password } = loginSchema.parse(request.body);

    const teacher = await this.teacherRepository.findByEmail(email);
    if (!teacher) {
      reply.status(401).send({ error: "Unauthorized", message: "Invalid email or password" });
      return;
    }

    if (!teacher.is_active) {
      reply.status(403).send({ error: "Forbidden", message: "Account is inactive" });
      return;
    }

    const isMatch = await Password.compare(password, teacher.hashed_password);
    if (!isMatch) {
      reply.status(401).send({ error: "Unauthorized", message: "Invalid email or password" });
      return;
    }

    const token = request.server.jwt.sign({
      id: teacher.id,
      email: teacher.email,
      role: "teacher",
    });

    reply.send({
      user: {
        id: teacher.id,
        name: teacher.full_name,
        email: teacher.email,
        role: "teacher",
      },
      token,
    });
  };
}
