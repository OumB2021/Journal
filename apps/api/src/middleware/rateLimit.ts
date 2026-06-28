import type { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "../lib/redis.js";

const limiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl",
  points: 100, // requests
  duration: 60, // per 60s
});

export async function rateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await limiter.consume(req.ip ?? "unknown");
    next();
  } catch {
    res.status(429).json({ error: "Too many requests" });
  }
}
