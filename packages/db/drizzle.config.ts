import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Read this package's local .env (migration-time credentials)
config();

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: (() => {
      const url = process.env.DIRECT_URL;
      if (!url) throw new Error("DIRECT_URL must be set for migrations");
      return url;
    })(),
  },
});
