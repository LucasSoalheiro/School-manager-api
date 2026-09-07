import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateSchoolClassService } from "../../service/school_class/CreateSchoolClassService.js";
import type { GetSchoolClassByIdService } from "../../service/school_class/GetSchoolClassByIdService.js";
import type { AddStudentToClassService } from "../../service/school_class/AddStudentToClassService.js";
import type { RemoveStudentFromClassService } from "../../service/school_class/RemoveStudentFromClassService.js";
import type { AddActivityToClassService } from "../../service/school_class/AddActivityToClassService.js";
import type { CloseSchoolClassService } from "../../service/school_class/CloseSchoolClassService.js";
import type { ReopenSchoolClassService } from "../../service/school_class/ReopenSchoolClassService.js";
import {
  createSchoolClassSchema,
  addStudentToClassSchema,
  addActivityToClassSchema,
  classStudentParamsSchema,
} from "../schemas/schoolClassSchemas.js";
import { uuidParamSchema } from "../schemas/studentSchemas.js";

export class SchoolClassController {
  constructor(
    private readonly createSchoolClassService: CreateSchoolClassService,
    private readonly getSchoolClassByIdService: GetSchoolClassByIdService,
    private readonly addStudentToClassService: AddStudentToClassService,
    private readonly removeStudentFromClassService: RemoveStudentFromClassService,
    private readonly addActivityToClassService: AddActivityToClassService,
    private readonly closeSchoolClassService: CloseSchoolClassService,
    private readonly reopenSchoolClassService: ReopenSchoolClassService,
  ) {}

  public create = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = createSchoolClassSchema.parse(request.body);
    const output = await this.createSchoolClassService.execute(body);
    reply.status(201).send(output);
  };

  public getById = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    const schoolClass = await this.getSchoolClassByIdService.execute({ id });
    reply.send({
      id: schoolClass.id,
      class_name: schoolClass.class_name,
      is_active: schoolClass.is_active,
      students: schoolClass.students.map((s) => ({
        id: s.id,
        name: s.full_name,
        email: s.email,
      })),
      activities: schoolClass.activities.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        created_at: a.created_at,
        delivery_date: a.delivery_date,
      })),
    });
  };

  public addStudent = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    const { student_id } = addStudentToClassSchema.parse(request.body);
    await this.addStudentToClassService.execute({ class_id: id, student_id });
    reply.send({ message: "Student added to class successfully" });
  };

  public removeStudent = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id, student_id } = classStudentParamsSchema.parse(request.params);
    await this.removeStudentFromClassService.execute({ class_id: id, student_id });
    reply.send({ message: "Student removed from class successfully" });
  };

  public addActivity = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    const body = addActivityToClassSchema.parse(request.body);
    const output = await this.addActivityToClassService.execute({
      class_id: id,
      title: body.title,
      description: body.description,
      ...(body.delivery_date !== undefined ? { delivery_date: body.delivery_date } : {}),
    });
    reply.status(201).send(output);
  };

  public close = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    await this.closeSchoolClassService.execute({ id });
    reply.send({ message: "School class closed successfully" });
  };

  public reopen = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    await this.reopenSchoolClassService.execute({ id });
    reply.send({ message: "School class reopened successfully" });
  };
}
