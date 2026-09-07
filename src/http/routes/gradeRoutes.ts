import type { FastifyInstance } from "fastify";
import type { GradeController } from "../controller/gradeController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

export async function gradeRoutes(
  fastify: FastifyInstance,
  options: { controller: GradeController },
): Promise<void> {
  const { controller } = options;

  fastify.post(
    "/assign",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.assignGrade,
  );

  fastify.post(
    "/:id/submit",
    { onRequest: [authenticate, authorize(["student"])] },
    controller.submitGrade,
  );

  fastify.patch(
    "/:id/grade",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.gradeActivity,
  );

  fastify.get(
    "/student/:student_id",
    { onRequest: [authenticate] },
    controller.getByStudent,
  );

  fastify.get(
    "/activity/:activity_id",
    { onRequest: [authenticate] },
    controller.getByActivity,
  );
}
