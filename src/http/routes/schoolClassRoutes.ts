import type { FastifyInstance } from "fastify";
import type { SchoolClassController } from "../controller/schoolClassController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

export async function schoolClassRoutes(
  fastify: FastifyInstance,
  options: { controller: SchoolClassController },
): Promise<void> {
  const { controller } = options;

  fastify.post(
    "/",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.create,
  );

  fastify.get(
    "/:id",
    { onRequest: [authenticate] },
    controller.getById,
  );

  fastify.post(
    "/:id/students",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.addStudent,
  );

  fastify.delete(
    "/:id/students/:student_id",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.removeStudent,
  );

  fastify.post(
    "/:id/activities",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.addActivity,
  );

  fastify.patch(
    "/:id/close",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.close,
  );

  fastify.patch(
    "/:id/reopen",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.reopen,
  );
}
