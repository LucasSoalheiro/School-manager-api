import type { FastifyInstance } from "fastify";
import type { StudentController } from "../controller/studentController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

export default async function studentRoutes(
  fastify: FastifyInstance,
  options: { controller: StudentController },
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
    { onRequest: [authenticate] },
    controller.updateName,
  );

  fastify.patch(
    "/:id/password",
    { onRequest: [authenticate] },
    controller.changePassword,
  );

  fastify.patch(
    "/:id/activate",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.activate,
  );

  fastify.patch(
    "/:id/deactivate",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.deactivate,
  );
}
