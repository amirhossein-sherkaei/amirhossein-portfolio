type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const requests = new Map<string, RateLimitEntry>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

export function checkRateLimit(ip: string) {
  const now = Date.now();
  const existing = requests.get(ip);

  if (!existing || existing.resetAt <= now) {
    requests.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return {
      allowed: true,
      retryAfter: Math.ceil(WINDOW_MS / 1000),
    };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  requests.set(ip, existing);

  return {
    allowed: true,
    retryAfter: Math.ceil((existing.resetAt - now) / 1000),
  };
}