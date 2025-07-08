import ratelimiter from "../config/upstash.js";

const ratelimit = async (req, res, next) => {
  try {
    const result = await ratelimiter.limit("my-rate-limit");

    if (!result.success) {
      return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 

export default ratelimit;