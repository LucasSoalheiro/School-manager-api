import type { FastifyReply, FastifyRequest } from "fastify";
import type { RegisterTeacherService } from "../../service/teacher/RegisterTeacherService.js";
import type { GetTeacherByIdService } from "../../service/teacher/GetTeacherByIdService.js";
import type { UpdateTeacherNameService } from "../../service/teacher/UpdateTeacherNameService.js";
import type { ChangeTeacherPasswordService } from "../../service/teacher/ChangeTeacherPasswordService.js";
import type { AddClassToTeacherService } from "../../service/teacher/AddClassToTeacherService.js";
import type { RemoveClassFromTeacherService } from "../../service/teacher/RemoveClassFromTeacherService.js";
import type { DeactivateTeacherService } from "../../service/teacher/DeactivateTeacherService.js";
import {
  registerTeacherSchema,
  updateTeacherNameSchema,
  changeTeacherPasswordSchema,
  addClassToTeacherSchema,
  teacherClassParamsSchema,
} from "../schemas/teacherSchemas.js";
import { uuidParamSchema } from "../schemas/studentSchemas.js";
import { ForbiddenError } from "../../errors/AppError.js";

export class TeacherController {
  constructor(
    private readonly registerTeacherService: RegisterTeacherService,
    private readonly getTeacherByIdService: GetTeacherByIdService,
    private readonly updateTeacherNameService: UpdateTeacherNameService,
    private readonly changeTeacherPasswordService: ChangeTeacherPasswordService,
    private readonly addClassToTeacherService: AddClassToTeacherService,
    private readonly removeClassFromTeacherService: RemoveClassFromTeacherService,
    private readonly deactivateTeacherService: DeactivateTeacherService,
  ) {}

  public register = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = registerTeacherSchema.parse(request.body);
    const output = await this.registerTeacherService.execute(body);
    reply.status(201).send(output);
  };

  public getById = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    const teacher = await this.getTeacherByIdService.execute({ id });
    reply.send({
      id: teacher.id,
      email: teacher.email,
      name: teacher.name,
      last_name: teacher.last_name,
      full_name: teacher.full_name,
      is_active: teacher.is_active,
      school_classes: teacher.school_classes.map((sc) => ({
        id: sc.id,
        class_name: sc.class_name,
        is_active: sc.is_active,
      })),
    });
  };

  public updateName = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    if (request.user.id !== id) {
      throw new ForbiddenError("You can only update your own data");
    }
    const body = updateTeacherNameSchema.parse(request.body);
    await this.updateTeacherNameService.execute({ id, ...body });
    reply.send({ message: "Teacher name updated successfully" });
  };

  public changePassword = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    if (request.user.id !== id) {
      throw new ForbiddenError("You can only change your own password");
    }
    const body = changeTeacherPasswordSchema.parse(request.body);
    await this.changeTeacherPasswordService.execute({ id, ...body });
    reply.send({ message: "Teacher password updated successfully" });
  };

  public addClass = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    if (request.user.id !== id) {
      throw new ForbiddenError("You can only manage your own classes");
    }
    const { class_id } = addClassToTeacherSchema.parse(request.body);
    await this.addClassToTeacherService.execute({ teacher_id: id, class_id });
    reply.send({ message: "Class assigned to teacher successfully" });
  };

  public removeClass = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id, class_id } = teacherClassParamsSchema.parse(request.params);
    if (request.user.id !== id) {
      throw new ForbiddenError("You can only manage your own classes");
    }
    await this.removeClassFromTeacherService.execute({ teacher_id: id, class_id });
    reply.send({ message: "Class removed from teacher successfully" });
  };

  public deactivate = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    if (request.user.id !== id) {
      throw new ForbiddenError("You can only deactivate your own account");
    }
    await this.deactivateTeacherService.execute({ id });
    reply.send({ message: "Teacher deactivated successfully" });
  };
}
