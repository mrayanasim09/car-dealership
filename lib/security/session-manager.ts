import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
// import NodeCache from 'node-cache'
import { createStore } from './session-store'
import crypto from 'crypto'

// Pluggable session store (Redis if USE_REDIS=1 and REDIS_URL set, else in-memory)
// const memoryFallback = new NodeCache({ stdTTL: 24 * 60 * 60 }) // 24 hours (unused)
let kvStorePromise: Promise<import('./session-store').KeyValueStore> | null = null
async function getStore() {
  if (!kvStorePromise) kvStorePromise = createStore()
  return kvStorePromise
}

export interface SessionData {
  adminId: string
  email: string
  role: string
  sessionId: string
  deviceInfo: {
    userAgent: string
    ip: string
    fingerprint: string
  }
  createdAt: Date
  lastAccessedAt: Date
  twoFactorVerified: boolean
  permissions: string[]
  isTemporary?: boolean // For sessions pending 2FA
}

export interface SessionOptions {
  maxAge?: number // in milliseconds
  requireTwoFactor?: boolean
  maxConcurrentSessions?: number
  refreshThreshold?: number // Refresh token if expires within this time (ms)
}

export class SessionManager {
  private static readonly JWT_SECRET = (() => {
    const v = process.env.JWT_SECRET
    if (!v) {
      throw new Error('[SessionManager] Missing JWT_SECRET')
    }
    return v
  })()
  private static readonly REFRESH_SECRET = (() => {
    const v = process.env.REFRESH_JWT_SECRET || process.env.SESSION_SECRET
    if (!v) {
      throw new Error('[SessionManager] Missing REFRESH_JWT_SECRET/SESSION_SECRET')
    }
    return v
  })()
  private static readonly DEFAULT_MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours
  private static readonly REFRESH_THRESHOLD = 60 * 60 * 1000 // 1 hour

  // Create a new session
  static async createSession(
    adminData: {
      id: string
      email: string
      role: string
      permissions?: string[]
    },
    request: NextRequest,
    options: SessionOptions = {}
  ): Promise<{
    sessionToken: string
    refreshToken: string
    sessionId: string
    expiresAt: Date
  }> {
    const sessionId = this.generateSessionId()
    const deviceInfo = this.extractDeviceInfo(request)
    const now = new Date()
    const maxAge = options.maxAge || this.DEFAULT_MAX_AGE
    const expiresAt = new Date(now.getTime() + maxAge)

    const sessionData: SessionData = {
      adminId: adminData.id,
      email: adminData.email,
      role: adminData.role,
      sessionId,
      deviceInfo,
      createdAt: now,
      lastAccessedAt: now,
      twoFactorVerified: !options.requireTwoFactor,
      permissions: adminData.permissions || [],
      isTemporary: options.requireTwoFactor || false
    }

    // Handle concurrent session limits
    if (options.maxConcurrentSessions) {
      await this.enforceConcurrentSessionLimit(
        adminData.id, 
        options.maxConcurrentSessions
      )
    }

    // Store session
    const store = await getStore()
    await store.set(`session:${sessionId}`, sessionData, Math.ceil(maxAge / 1000))

    // Create JWT tokens
    const tokenPayload = {
      sessionId,
      adminId: adminData.id,
      email: adminData.email,
      role: adminData.role,
      twoFactorVerified: sessionData.twoFactorVerified,
      iat: Math.floor(now.getTime() / 1000),
      exp: Math.floor(expiresAt.getTime() / 1000)
    }

    const sessionToken = jwt.sign(tokenPayload, this.JWT_SECRET)
    const refreshToken = jwt.sign(
      { sessionId, adminId: adminData.id, type: 'refresh' },
      this.REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    return {
      sessionToken,
      refreshToken,
      sessionId,
      expiresAt
    }
  }

  // Verify and get session data
  static async verifySession(sessionToken: string): Promise<SessionData | null> {
    try {
      const decoded = jwt.verify(sessionToken, this.JWT_SECRET) as jwt.JwtPayload & { sessionId: string }
      const store = await getStore()
      const sessionData = await store.get<SessionData>(`session:${decoded.sessionId}`)

      if (!sessionData) {
        return null
      }

      // Update last accessed time
      sessionData.lastAccessedAt = new Date()
      await store.set(`session:${decoded.sessionId}`, sessionData)

      return sessionData
    } catch (error) {
      console.error('Session verification failed:', error)
      return null
    }
  }

  // Refresh session token
  static async refreshSession(refreshToken: string): Promise<{
    sessionToken: string
    refreshToken: string
    expiresAt: Date
  } | null> {
    try {
      const decoded = jwt.verify(refreshToken, this.REFRESH_SECRET) as jwt.JwtPayload & { sessionId: string; adminId: string; type: string }
      
      if (decoded.type !== 'refresh') {
        return null
      }

      const store = await getStore()
      const sessionData = await store.get<SessionData>(`session:${decoded.sessionId}`)
      if (!sessionData) {
        return null
      }

      // Create new tokens
      const now = new Date()
      const expiresAt = new Date(now.getTime() + this.DEFAULT_MAX_AGE)

      const tokenPayload = {
        sessionId: sessionData.sessionId,
        adminId: sessionData.adminId,
        email: sessionData.email,
        role: sessionData.role,
        twoFactorVerified: sessionData.twoFactorVerified,
        iat: Math.floor(now.getTime() / 1000),
        exp: Math.floor(expiresAt.getTime() / 1000)
      }

      const sessionToken = jwt.sign(tokenPayload, this.JWT_SECRET)
      const newRefreshToken = jwt.sign(
        { sessionId: sessionData.sessionId, adminId: sessionData.adminId, type: 'refresh' },
        this.REFRESH_SECRET,
        { expiresIn: '7d' }
      )

      // Update session
      sessionData.lastAccessedAt = now
      await store.set(`session:${sessionData.sessionId}`, sessionData)

      return {
        sessionToken,
        refreshToken: newRefreshToken,
        expiresAt
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      return null
    }
  }

  // Mark session as 2FA verified
  static async verify2FA(sessionId: string): Promise<boolean> {
    const store = await getStore()
    const sessionData = await store.get<SessionData>(`session:${sessionId}`)
    if (!sessionData) {
      return false
    }

    sessionData.twoFactorVerified = true
    sessionData.isTemporary = false
    sessionData.lastAccessedAt = new Date()
    await store.set(`session:${sessionId}`, sessionData)
    return true
  }

  // Invalidate a specific session
  static async invalidateSession(sessionId: string): Promise<void> {
    const store = await getStore()
    await store.del(`session:${sessionId}`)
  }

  // Invalidate all sessions for an admin
  static async invalidateAllSessions(adminId: string): Promise<void> {
    const store = await getStore()
    const allKeys = await store.keys('session:')
    
    for (const _key of allKeys) {
      const session = await store.get<SessionData>(_key)
      if (session && session.adminId === adminId) {
        await store.del(_key)
      }
    }
  }

  // Get all active sessions for an admin
  static async getAdminSessions(adminId: string): Promise<SessionData[]> {
    const store = await getStore()
    const allKeys = await store.keys('session:')
    const sessions: SessionData[] = []
    
    for (const _key of allKeys) {
      const session = await store.get<SessionData>(_key)
      if (session && session.adminId === adminId) {
        sessions.push(session)
      }
    }
    
    return sessions.sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime())
  }

  // Check if session needs refresh
  static needsRefresh(sessionToken: string): boolean {
    try {
      const decoded = jwt.decode(sessionToken) as jwt.JwtPayload & { exp?: number }
      if (!decoded || !decoded.exp) return true
      
      const expiresAt = decoded.exp * 1000
      const now = Date.now()
      
      return (expiresAt - now) < this.REFRESH_THRESHOLD
    } catch {
      return true
    }
  }

  // Extract device information for fingerprinting
  private static extractDeviceInfo(request: NextRequest): SessionData['deviceInfo'] {
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Create a device fingerprint
    const fingerprint = crypto
      .createHash('sha256')
      .update(`${userAgent}-${ip}`)
      .digest('hex')
      .slice(0, 16)

    return {
      userAgent,
      ip,
      fingerprint
    }
  }

  // Generate secure session ID
  private static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  // Enforce concurrent session limits
  private static async enforceConcurrentSessionLimit(
    adminId: string,
    maxSessions: number
  ): Promise<void> {
    const sessions = await this.getAdminSessions(adminId)
    
    if (sessions.length >= maxSessions) {
      // Remove oldest sessions
      const sessionsToRemove = sessions
        .slice(maxSessions - 1) // Keep space for new session
        .map(s => s.sessionId)
      
      const store = await getStore()
      for (const sessionId of sessionsToRemove) {
        await store.del(`session:${sessionId}`)
      }
    }
  }

  // Clean up expired sessions (run periodically)
  static cleanupExpiredSessions(): void {
    // This method is not used in production; could be adapted to use SCAN metrics
    let cleanedCount = 0
    
    // Placeholder for session cleanup logic
    // In production, this would iterate through actual sessions
    cleanedCount = 0
    
    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired sessions`)
    }
  }

  // Get session statistics
  static getSessionStats(): {
    totalSessions: number
    activeSessions: number
    temporarySessions: number
    adminCounts: Record<string, number>
  } {
    const stats = {
      totalSessions: 0,
      activeSessions: 0,
      temporarySessions: 0,
      adminCounts: {} as Record<string, number>
    }
    
    // Placeholder for session statistics logic
    // In production, this would iterate through actual sessions
    stats.activeSessions = 0
    stats.temporarySessions = 0
    
    return stats
  }
}

// Helper function to create secure cookies
export function createSecureCookie(name: string, value: string, maxAge: number = 24 * 60 * 60 * 1000): string {
  const expires = new Date(Date.now() + maxAge).toUTCString()
  
  return [
    `${name}=${value}`,
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    `Max-Age=${Math.floor(maxAge / 1000)}`,
    `Expires=${expires}`,
    'Path=/'
  ].join('; ')
}

// Helper to clear cookies
export function clearCookie(name: string): string {
  return `${name}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`
}
