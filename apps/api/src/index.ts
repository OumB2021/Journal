import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { env } from "./config/env.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { postsRouter } from "./routes/posts.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(clerkMiddleware()); // attaches auth to every request
app.use(rateLimit);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/posts", requireAuth, postsRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});
