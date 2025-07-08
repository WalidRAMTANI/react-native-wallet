import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "10 s"), // 10 requests per 10 seconds
  analytics: true,
});

export default ratelimiter;