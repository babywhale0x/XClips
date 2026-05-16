const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const LIMIT = 5; // 5 requests
const WINDOW_MS = 60 * 1000; // per 1 minute

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - userData.lastReset > WINDOW_MS) {
    userData.count = 1;
    userData.lastReset = now;
  } else {
    userData.count++;
  }

  rateLimitMap.set(ip, userData);

  return userData.count <= LIMIT;
}
