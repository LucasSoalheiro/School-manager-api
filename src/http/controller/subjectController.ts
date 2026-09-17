import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateSubjectService } from "../../service/subject/CreateSubjectService.js";
import type { UpdateSubjectService } from "../../service/subject/UpdateSubjectService.js";
import type { GetSubjectsByClassService } from "../../service/subject/GetSubjectsByClassService.js";
import {
  createSubjectSchema,
  updateSubjectSchema,
} from "../schemas/subjectSchemas.js";
import { uuidParamSchema } from "../schemas/studentSchemas.js";
import { z } from "zod";

export class SubjectController {
  constructor(
    private readonly createSubjectService: CreateSubjectService,
    private readonly updateSubjectService: UpdateSubjectService,
    private readonly getSubjectsByClassService: GetSubjectsByClassService,
  ) {}

  public create = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = createSubjectSchema.parse(request.body);
    const output = await this.createSubjectService.execute({
      name: body.name,
      description: body.description,
      teacher_id: body.teacher_id,
      class_id: body.school_class_id,
    });
    reply.status(201).send(output);
  };

  public update = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    const body = updateSubjectSchema.parse(request.body);
    await this.updateSubjectService.execute({
      id,
      teacher_id: request.user.id,
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
    });
    reply.send({ message: "Subject updated successfully" });
  };

  public getByClass = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { class_id } = z
      .object({ class_id: z.string().uuid() })
      .parse(request.params);
    const subjects = await this.getSubjectsByClassService.execute({ class_id });
    reply.send(
      subjects.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        teacher_id: s.teacher_id,
        school_class_id: s.school_class_id,
      })),
    );
  };
}
