import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

interface RateLimitResult {
  success: boolean;
  message?: string;
  remaining?: number;
}

/**
 * Check if an action is rate limited
 * @param action The action to check (e.g., 'login', 'signup')
 * @param identifier The identifier to rate limit (e.g., email, IP)
 * @param maxAttempts Maximum number of attempts allowed
 * @param windowMs Time window in milliseconds
 * @returns A promise that resolves to a RateLimitResult
 */
export async function checkRateLimit(
  action: string,
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): Promise<RateLimitResult> {
  try {
    // If Redis is not configured, allow all requests
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return { success: true, remaining: maxAttempts };
    }

    const key = `ratelimit:${action}:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Add the current timestamp to the list and get all attempts in the window
    await redis.zadd(key, { score: now, member: now.toString() });
    const attempts = await redis.zcount(key, windowStart, '+inf');

    // Remove old entries outside the window
    await redis.zremrangebyscore(key, 0, windowStart);

    // Set expiry on the key to clean up
    await redis.expire(key, Math.ceil(windowMs / 1000));

    const remaining = Math.max(0, maxAttempts - attempts);

    if (attempts >= maxAttempts) {
      return {
        success: false,
        message: `Too many ${action} attempts. Please try again later.`,
        remaining: 0,
      };
    }

    return { success: true, remaining };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // In case of error, allow the request to proceed
    return { success: true };
  }
}
