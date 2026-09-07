import type { FastifyInstance } from "fastify";
import type { AuthController } from "../controller/authController.js";

export async function authRoutes(
  fastify: FastifyInstance,
  options: { controller: AuthController },
): Promise<void> {
  const { controller } = options;

  fastify.post("/login/student", controller.studentLogin);
  fastify.post("/login/teacher", controller.teacherLogin);
}
