import { defineConfig } from "drizzle-kit";
import { loadEnvFile, env } from "node:process"
loadEnvFile("./.env")
export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/drizzle/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
