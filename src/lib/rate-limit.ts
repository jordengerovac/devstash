import { Ratelimit, type Duration } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

function getRedis(): Redis | null {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env
  if (!url || !token) return null
  return new Redis({ url, token })
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() ?? "unknown"
}

interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

export async function rateLimit(
  key: string,
  requests: number,
  window: Duration
): Promise<RateLimitResult> {
  const redis = getRedis()
  // Fail open: if Upstash is not configured, allow all requests
  if (!redis) return { success: true, remaining: requests, reset: 0 }

  try {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, window),
    })
    return await limiter.limit(key)
  } catch {
    // Fail open: if Upstash is unreachable, allow the request
    return { success: true, remaining: requests, reset: 0 }
  }
}

export function rateLimitErrorMessage(reset: number): string {
  const seconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
  const minutes = Math.ceil(seconds / 60)
  return minutes <= 1
    ? "Too many attempts. Please try again in a minute."
    : `Too many attempts. Please try again in ${minutes} minutes.`
}

export function tooManyRequestsResponse(reset: number): NextResponse {
  const seconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
  return NextResponse.json(
    { error: rateLimitErrorMessage(reset) },
    { status: 429, headers: { "Retry-After": String(seconds) } }
  )
}
