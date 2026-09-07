import type { FastifyReply, FastifyRequest } from "fastify";

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
    reply.status(401).send({
      error: "Unauthorized",
      message: "Invalid or missing JWT token",
    });
  }
}

export function authorize(roles: Array<"student" | "teacher">) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user || !roles.includes(request.user.role)) {
      reply.status(403).send({
        error: "Forbidden",
        message: "Access denied for your user role",
      });
    }
  };
}
