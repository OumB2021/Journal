import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

// Supabase's transaction pooler (port 6543) does NOT support prepared
// statements — without prepare:false you get "prepared statement already
// exists" errors in production. Harmless on direct/session connections too.
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
export { schema };
export * from "./schema";
