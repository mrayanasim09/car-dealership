import { NextRequest, NextResponse } from 'next/server'
import NodeCache from 'node-cache'
import { createStore } from './session-store'

// In-memory cache for rate limiting (in production, use Redis)
const cache = new NodeCache({ stdTTL: 3600 }) // 1 hour TTL
let storePromise: Promise<import('./session-store').KeyValueStore> | null = null
async function getStore() {
  if (!storePromise) storePromise = createStore()
  return storePromise
}

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxAttempts: number // Maximum attempts in the window
  blockDurationMs?: number // How long to block after exceeding limit
  skipOnSuccess?: boolean // Reset counter on successful attempts
}

interface RateLimitEntry {
  count: number
  firstAttempt: number
  blocked?: boolean
  blockedUntil?: number
}

export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = {
      blockDurationMs: config.windowMs * 2, // Default: 2x window time
      skipOnSuccess: false,
      ...config
    }
  }

  // Get client identifier (IP + User Agent for better uniqueness)
  private getClientId(request: NextRequest): string {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    return `${ip}-${Buffer.from(userAgent).toString('base64').slice(0, 20)}`
  }

  // Check if request should be allowed
  async isAllowed(request: NextRequest, identifier?: string): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
    blocked?: boolean
  }> {
    const clientId = identifier || this.getClientId(request)
    const now = Date.now()
    
    const key = `rate_limit:${clientId}`
    const useRedis = process.env.USE_REDIS === '1' && !!process.env.REDIS_URL
    const store = useRedis ? await getStore() : null
    let entry: RateLimitEntry = (useRedis ? await store!.get<RateLimitEntry>(key) : cache.get(key)) || {
      count: 0,
      firstAttempt: now
    }

    // Check if currently blocked
    if (entry.blocked && entry.blockedUntil && now < entry.blockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockedUntil,
        blocked: true
      }
    }

    // Reset if window has passed
    if (now - entry.firstAttempt > this.config.windowMs) {
      entry = {
        count: 1,
        firstAttempt: now,
        blocked: false
      }
    } else {
      entry.count++
    }

    // Check if limit exceeded
    if (entry.count > this.config.maxAttempts) {
      entry.blocked = true
      entry.blockedUntil = now + (this.config.blockDurationMs || this.config.windowMs)
      
      if (useRedis) await store!.set(key, entry, Math.ceil((this.config.blockDurationMs || this.config.windowMs) / 1000))
      else cache.set(key, entry, Math.ceil((this.config.blockDurationMs || this.config.windowMs) / 1000))
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockedUntil,
        blocked: true
      }
    }

    // Update cache
    if (useRedis) await store!.set(key, entry, Math.ceil(this.config.windowMs / 1000))
    else cache.set(key, entry, Math.ceil(this.config.windowMs / 1000))

    return {
      allowed: true,
      remaining: this.config.maxAttempts - entry.count,
      resetTime: entry.firstAttempt + this.config.windowMs
    }
  }

  // Record successful attempt (reset counter if configured)
  async recordSuccess(request: NextRequest, identifier?: string): Promise<void> {
    if (!this.config.skipOnSuccess) return

    const clientId = identifier || this.getClientId(request)
    const key = `rate_limit:${clientId}`
    const useRedis = process.env.USE_REDIS === '1' && !!process.env.REDIS_URL
    if (useRedis) {
      const store = await getStore()
      await store.del(key)
    } else {
      cache.del(key)
    }
  }

  // Manual block for security events
  async blockClient(request: NextRequest, durationMs: number, identifier?: string): Promise<void> {
    const clientId = identifier || this.getClientId(request)
    const now = Date.now()
    
    const entry: RateLimitEntry = {
      count: this.config.maxAttempts + 1,
      firstAttempt: now,
      blocked: true,
      blockedUntil: now + durationMs
    }

    const useRedis = process.env.USE_REDIS === '1' && !!process.env.REDIS_URL
    const key = `rate_limit:${clientId}`
    if (useRedis) {
      const store = await getStore()
      await store.set(key, entry, Math.ceil(durationMs / 1000))
    } else {
      cache.set(key, entry, Math.ceil(durationMs / 1000))
    }
  }

  // Get current status without incrementing
  async getStatus(request: NextRequest, identifier?: string): Promise<{
    count: number
    remaining: number
    resetTime: number
    blocked: boolean
  }> {
    const clientId = identifier || this.getClientId(request)
    const key = `rate_limit:${clientId}`
    const useRedis = process.env.USE_REDIS === '1' && !!process.env.REDIS_URL
    const store = useRedis ? await getStore() : null
    const entry: RateLimitEntry = (useRedis ? await store!.get<RateLimitEntry>(key) : cache.get(key)) || {
      count: 0,
      firstAttempt: Date.now()
    }

    const now = Date.now()
    const isBlocked = entry.blocked && entry.blockedUntil && now < entry.blockedUntil

    return {
      count: entry.count,
      remaining: Math.max(0, this.config.maxAttempts - entry.count),
      resetTime: entry.firstAttempt + this.config.windowMs,
      blocked: isBlocked || false
    }
  }
}

// Predefined rate limiters for different endpoints
export const rateLimiters = {
  // Very strict for admin login attempts
  adminLogin: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 3,
    blockDurationMs: 60 * 60 * 1000, // 1 hour block
    skipOnSuccess: true
  }),

  // Strict for 2FA attempts
  twoFA: new RateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxAttempts: 3,
    blockDurationMs: 30 * 60 * 1000, // 30 minutes block
    skipOnSuccess: true
  }),

  // General API rate limiting
  api: new RateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    maxAttempts: 60,
    blockDurationMs: 5 * 60 * 1000 // 5 minutes block
  }),

  // Contact form submissions
  contactForm: new RateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxAttempts: 3,
    blockDurationMs: 30 * 60 * 1000 // 30 minutes block
  }),

  // Password reset attempts
  passwordReset: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3,
    blockDurationMs: 24 * 60 * 60 * 1000 // 24 hours block
  })
}

// Helper function to create rate limit middleware
export function createRateLimitMiddleware(limiter: RateLimiter) {
  return async (request: NextRequest) => {
    const result = await limiter.isAllowed(request)
    
    if (!result.allowed) {
      const response = NextResponse.json(
        { 
          error: 'Too many requests',
          message: result.blocked 
            ? 'You have been temporarily blocked due to too many failed attempts'
            : 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          blocked: result.blocked
        },
        { status: result.blocked ? 429 : 429 }
      )

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', limiter['config'].maxAttempts.toString())
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
      response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
      
      if (result.blocked) {
        response.headers.set('X-RateLimit-Blocked', 'true')
      }

      return response
    }

    return null // Allow request to proceed
  }
}
