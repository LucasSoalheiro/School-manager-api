import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError, ForbiddenError } from "../../errors/AppError.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; email: string; role: "student" | "teacher" };
    user: { id: string; email: string; role: "student" | "teacher" };
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw new UnauthorizedError("Invalid or missing JWT token");
  }
}

export function authorize(roles: Array<"student" | "teacher">) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (reply.sent) return;
    if (!request.user || !roles.includes(request.user.role)) {
      throw new ForbiddenError("Access denied for your user role");
    }
  };
}
