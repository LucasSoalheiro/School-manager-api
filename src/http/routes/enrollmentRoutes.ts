import type { FastifyInstance } from "fastify";
import type { EnrollmentController } from "../controller/enrollmentController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

export async function enrollmentRoutes(
  fastify: FastifyInstance,
  options: { controller: EnrollmentController },
): Promise<void> {
  const { controller } = options;

  fastify.get(
    "/student/:student_id",
    { onRequest: [authenticate] },
    controller.getByStudent,
  );

  fastify.patch(
    "/:id/cancel",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.cancel,
  );

  fastify.patch(
    "/:id/conclude",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.conclude,
  );
}
