import { env } from "node:process";


enum Node_env {
  dev = "dev",
  prod = "prod",
}

export function loadConfig(): {
  node_env: string;
  port: number;
  salt_rounds: number;
  database_url: string;
  jwt_secret: string;
} {
  if (env.NODE_ENV == null) {
    throw new Error("NODE_ENV not found in environment");
  }
  if (!Object.values(Node_env).includes(env.NODE_ENV as Node_env)) {
    throw new Error("NODE_ENV has to be 'dev' or 'prod'");
  }

  if (env.PORT == null) {
    throw new Error("PORT not found in environment");
  }

  const portNumber = parseInt(env.PORT, 10);
  if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
    throw new Error("PORT must be a valid number between 1 and 65535");
  }

  if (env.SALT_ROUNDS == null) {
    throw new Error("SALT_ROUNDS not found in environment");
  }

  if (env.DATABASE_URL == null) {
    throw new Error(
      "DATABASE_URL is totally necessary to the application, certify that is in the environment",
    );
  }

  if (env.JWT_SECRET == null) {
    throw new Error(
      "JWT_SECRET is totally necessary to the application"
    );
  }

  return {
    node_env: env.NODE_ENV,
    port: parseInt(env.PORT),
    salt_rounds: parseInt(env.SALT_ROUNDS),
    database_url: env.DATABASE_URL,
    jwt_secret: env.JWT_SECRET,
  };
}
