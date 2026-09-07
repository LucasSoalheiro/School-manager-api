import type { FastifyInstance } from "fastify";
import type { ActivityController } from "../controller/activityController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

export async function activityRoutes(
  fastify: FastifyInstance,
  options: { controller: ActivityController },
): Promise<void> {
  const { controller } = options;

  fastify.get(
    "/:id",
    { onRequest: [authenticate] },
    controller.getById,
  );

  fastify.patch(
    "/:id/delivery-date",
    { onRequest: [authenticate, authorize(["teacher"])] },
    controller.updateDeliveryDate,
  );
}
