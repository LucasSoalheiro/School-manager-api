import { defineConfig } from "drizzle-kit";
import { env } from "node:process"
export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/drizzle/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
