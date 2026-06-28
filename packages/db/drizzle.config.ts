import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Read this package's local .env (migration-time credentials)
config();

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL!,
  },
});
