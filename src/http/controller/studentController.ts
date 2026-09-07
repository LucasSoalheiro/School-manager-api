import type { FastifyReply, FastifyRequest } from "fastify";
import type { RegisterStudentService } from "../../service/student/RegisterStudentService.js";
import type { GetStudentByIdService } from "../../service/student/GetStudentByIdService.js";
import type { UpdateStudentNameService } from "../../service/student/UpdateStudentNameService.js";
import type { ChangeStudentPasswordService } from "../../service/student/ChangeStudentPasswordService.js";
import type { ActivateStudentService } from "../../service/student/ActivateStudentService.js";
import type { DeactivateStudentService } from "../../service/student/DeactivateStudentService.js";
import {
  registerStudentSchema,
  updateStudentNameSchema,
  changeStudentPasswordSchema,
  uuidParamSchema,
} from "../schemas/studentSchemas.js";

export class StudentController {
  constructor(
    private readonly registerStudentService: RegisterStudentService,
    private readonly getStudentByIdService: GetStudentByIdService,
    private readonly updateStudentNameService: UpdateStudentNameService,
    private readonly changeStudentPasswordService: ChangeStudentPasswordService,
    private readonly activateStudentService: ActivateStudentService,
    private readonly deactivateStudentService: DeactivateStudentService,
  ) {}

  public register = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = registerStudentSchema.parse(request.body);
    const output = await this.registerStudentService.execute(body);
    reply.status(201).send(output);
  };

  public getById = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    const student = await this.getStudentByIdService.execute({ id });
    reply.send({
      id: student.id,
      email: student.email,
      name: student.name,
      last_name: student.last_name,
      full_name: student.full_name,
      is_active: student.is_active,
    });
  };

  public updateName = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    const { name } = updateStudentNameSchema.parse(request.body);
    await this.updateStudentNameService.execute({ id, name });
    reply.send({ message: "Student name updated successfully" });
  };

  public changePassword = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    const body = changeStudentPasswordSchema.parse(request.body);
    await this.changeStudentPasswordService.execute({ id, ...body });
    reply.send({ message: "Student password updated successfully" });
  };

  public activate = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    await this.activateStudentService.execute({ id });
    reply.send({ message: "Student activated successfully" });
  };

  public deactivate = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    await this.deactivateStudentService.execute({ id });
    reply.send({ message: "Student deactivated successfully" });
  };
}
