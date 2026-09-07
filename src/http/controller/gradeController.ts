import type { FastifyReply, FastifyRequest } from "fastify";
import type { AssignGradeService } from "../../service/grade/AssignGradeService.js";
import type { SubmitGradeService } from "../../service/grade/SubmitGradeService.js";
import type { GradeActivityService } from "../../service/grade/GradeActivityService.js";
import type { GetGradesByStudentService } from "../../service/grade/GetGradesByStudentService.js";
import type { GetGradesByActivityService } from "../../service/grade/GetGradesByActivityService.js";
import {
  assignGradeSchema,
  gradeActivitySchema,
} from "../schemas/gradeSchemas.js";
import { uuidParamSchema } from "../schemas/studentSchemas.js";
import { z } from "zod";

export class GradeController {
  constructor(
    private readonly assignGradeService: AssignGradeService,
    private readonly submitGradeService: SubmitGradeService,
    private readonly gradeActivityService: GradeActivityService,
    private readonly getGradesByStudentService: GetGradesByStudentService,
    private readonly getGradesByActivityService: GetGradesByActivityService,
  ) {}

  public assignGrade = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = assignGradeSchema.parse(request.body);
    const output = await this.assignGradeService.execute(body);
    reply.status(201).send(output);
  };

  public submitGrade = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    await this.submitGradeService.execute({ grade_id: id });
    reply.send({ message: "Grade submitted successfully" });
  };

  public gradeActivity = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    const { score, feedback } = gradeActivitySchema.parse(request.body);
    await this.gradeActivityService.execute({
      grade_id: id,
      score,
      ...(feedback !== undefined ? { feedback } : {}),
    });
    reply.send({ message: "Grade scored successfully" });
  };

  public getByStudent = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { student_id } = z
      .object({ student_id: z.string().uuid() })
      .parse(request.params);
    const grades = await this.getGradesByStudentService.execute({ student_id });
    reply.send(
      grades.map((g) => ({
        id: g.id,
        student_id: g.student_id,
        activity_id: g.activity_id,
        score: g.score,
        status: g.status,
        submitted_at: g.submitted_at,
        feedback: g.feedback,
      })),
    );
  };

  public getByActivity = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { activity_id } = z
      .object({ activity_id: z.string().uuid() })
      .parse(request.params);
    const grades = await this.getGradesByActivityService.execute({ activity_id });
    reply.send(
      grades.map((g) => ({
        id: g.id,
        student_id: g.student_id,
        activity_id: g.activity_id,
        score: g.score,
        status: g.status,
        submitted_at: g.submitted_at,
        feedback: g.feedback,
      })),
    );
  };
}
