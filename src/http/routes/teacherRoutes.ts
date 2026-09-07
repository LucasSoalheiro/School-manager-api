import type { FastifyInstance } from "fastify";
import type { TeacherController } from "../controller/teacherController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

export async function teacherRoutes(
  fastify: FastifyInstance,
  options: { controller: TeacherController },
): Promise<void> {
  const { controller } = options;

  // Public endpoint
  fastify.post("/", controller.register);

  // Protected endpoints
  fastify.get(
    "/:id",
    { onRequest: [authenticate] },
    controller.getById,
  );

  fastify.patch(
    "/:id/name",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.updateName,
  );

  fastify.patch(
    "/:id/password",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.changePassword,
  );

  fastify.post(
    "/:id/classes",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.addClass,
  );

  fastify.delete(
    "/:id/classes/:class_id",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.removeClass,
  );

  fastify.patch(
    "/:id/deactivate",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.deactivate,
  );
}
