import Fastify, {
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";
import { ZodError } from "zod";
import { drizzle } from "drizzle-orm/neon-http";
import { loadConfig } from "./config/env.js";
import { registerRoutes } from "./http/routes/index.js";
import { AppError } from "./errors/AppError.js";

const config = loadConfig();
const fastify = Fastify({ logger: config.node_env === "dev" });

async function main(): Promise<void> {
  // Security Plugins
  await fastify.register(helmet, { contentSecurityPolicy: false });
  await fastify.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
  await fastify.register(jwt, {
    secret: config.jwt_secret,
  });

  // Global Error Handler
  fastify.setErrorHandler((error: any, _request, reply) => {
    if (error instanceof ZodError) {
      reply.status(400).send({
        error: "Validation Error",
        message: "Validation failed for request data",
        issues: error.issues,
      });
      return;
    }

    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
      });
      return;
    }

    fastify.log.error(error);
    reply.status(error.statusCode || 500).send({
      error: error.name || "Internal Server Error",
      message: error.message || "An unexpected error occurred",
    });
  });

  // Database Connection
  const db = drizzle(config.database_url);

  // Health check route
  fastify.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: "School Management API is running cleanly!" });
  });

  // Register All HTTP Routes
  await registerRoutes(fastify, db);

  await fastify.listen({ port: config.port, host: "0.0.0.0" });
}

main().catch((err) => {
  fastify.log.error(err);
  console.log(err);
  process.exit(1);
});
