import type { FastifyReply, FastifyRequest } from "fastify";
import type { CancelEnrollmentService } from "../../service/enrollment/CancelEnrollmentService.js";
import type { ConcludeEnrollmentService } from "../../service/enrollment/ConcludeEnrollmentService.js";
import type { GetEnrollmentsByStudentService } from "../../service/enrollment/GetEnrollmentsByStudentService.js";
import { uuidParamSchema } from "../schemas/studentSchemas.js";
import { z } from "zod";

export class EnrollmentController {
  constructor(
    private readonly cancelEnrollmentService: CancelEnrollmentService,
    private readonly concludeEnrollmentService: ConcludeEnrollmentService,
    private readonly getEnrollmentsByStudentService: GetEnrollmentsByStudentService,
  ) {}

  public getByStudent = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { student_id } = z
      .object({ student_id: z.string().uuid() })
      .parse(request.params);
    const enrollments = await this.getEnrollmentsByStudentService.execute({
      student_id,
    });
    reply.send(
      enrollments.map((e) => ({
        id: e.id,
        student_id: e.student_id,
        school_class_id: e.school_class_id,
        enrolled_at: e.enrolled_at,
        status: e.status,
        is_active: e.is_active,
      })),
    );
  };

  public cancel = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    await this.cancelEnrollmentService.execute({ enrollment_id: id });
    reply.send({ message: "Enrollment cancelled successfully" });
  };

  public conclude = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    await this.concludeEnrollmentService.execute({ enrollment_id: id });
    reply.send({ message: "Enrollment concluded successfully" });
  };
}
