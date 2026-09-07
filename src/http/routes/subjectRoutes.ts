import type { FastifyInstance } from "fastify";
import type { SubjectController } from "../controller/subjectController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

export async function subjectRoutes(
  fastify: FastifyInstance,
  options: { controller: SubjectController },
): Promise<void> {
  const { controller } = options;

  fastify.post(
    "/",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.create,
  );

  fastify.put(
    "/:id",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.update,
  );

  fastify.get(
    "/class/:class_id",
    { onRequest: [authenticate] },
    controller.getByClass,
  );
}
