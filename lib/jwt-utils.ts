import jwt from 'jsonwebtoken'
import { env } from './config/env'
import crypto from 'crypto'
import { createStore } from './security/session-store'
import type { AdminPermissions } from '@/lib/types'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  permissions: AdminPermissions
  twoFactorVerified?: boolean
  sessionId: string
  iat?: number
  exp?: number
}

export interface TokenValidationResult {
  isValid: boolean
  payload?: JWTPayload
  error?: string
}

export class JWTManager {
  private static instance: JWTManager
  private readonly secret: string
  private readonly refreshSecret: string
  private readonly accessTokenExpiry = '15m' // 15 minutes
  private readonly refreshTokenExpiry = '7d' // 7 days
  private storePromise: Promise<import('./security/session-store').KeyValueStore> | null = null

  private constructor() {
    this.secret = env.auth.jwtSecret
    this.refreshSecret = env.auth.sessionSecret
  }

  static getInstance(): JWTManager {
    if (!JWTManager.instance) {
      JWTManager.instance = new JWTManager()
    }
    return JWTManager.instance
  }

  private async getStore() {
    if (!this.storePromise) this.storePromise = createStore()
    return this.storePromise
  }

  // Generate access token
  generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    const jti = crypto.randomUUID()
    return jwt.sign({ ...payload, jti }, this.secret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'am-tycoons-inc',
      audience: 'car-dealership-users'
    })
  }

  // Generate refresh token
  generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    const jti = crypto.randomUUID()
    return jwt.sign({ ...payload, jti }, this.refreshSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'am-tycoons-inc',
      audience: 'car-dealership-refresh'
    })
  }

  // Verify access token
  verifyAccessToken(token: string): TokenValidationResult {
    try {
      const payload = jwt.verify(token, this.secret, {
        issuer: 'am-tycoons-inc',
        audience: 'car-dealership-users'
      }) as JWTPayload

      return {
        isValid: true,
        payload
      }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid token'
      }
    }
  }

  // Verify refresh token
  verifyRefreshToken(token: string): TokenValidationResult {
    try {
      const payload = jwt.verify(token, this.refreshSecret, {
        issuer: 'am-tycoons-inc',
        audience: 'car-dealership-refresh'
      }) as JWTPayload

      return {
        isValid: true,
        payload
      }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid refresh token'
      }
    }
  }

  // Refresh access token using refresh token
  refreshAccessToken(refreshToken: string): { accessToken: string; newRefreshToken?: string } | null {
    const refreshResult = this.verifyRefreshToken(refreshToken)
    
    if (!refreshResult.isValid || !refreshResult.payload) {
      return null
    }

    const { payload } = refreshResult
    
    // Generate new access token
    const accessToken = this.generateAccessToken(payload)
    
    // Generate new refresh token if current one is close to expiry
    const tokenExp = payload.exp || 0
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = tokenExp - now
    
    // If refresh token expires in less than 1 day, generate a new one
    if (timeUntilExpiry < 86400) {
      const newRefreshToken = this.generateRefreshToken(payload)
      return { accessToken, newRefreshToken }
    }
    
    return { accessToken }
  }

  // Decode token without verification (for debugging)
  decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload
    } catch {
      return null
    }
  }

  // Generate session ID
  generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Create token pair (access + refresh)
  createTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp' | 'sessionId'>): {
    accessToken: string
    refreshToken: string
    sessionId: string
  } {
    const sessionId = this.generateSessionId()
    const tokenPayload = { ...payload, sessionId }
    
    return {
      accessToken: this.generateAccessToken(tokenPayload),
      refreshToken: this.generateRefreshToken(tokenPayload),
      sessionId
    }
  }

  // Blacklist token (for logout)
  blacklistToken(token: string, expiry: number): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Token blacklisted until ${new Date(expiry * 1000)}`)
    }
    // TODO: Wire this to Redis set with expiry when USE_REDIS=1
  }

  async blacklistJti(jti: string, expUnixSeconds: number): Promise<void> {
    const store = await this.getStore()
    const ttl = Math.max(1, expUnixSeconds - Math.floor(Date.now() / 1000))
    await store.set(`blacklist:${jti}`, true, ttl)
  }

  async isJtiBlacklisted(jti?: string): Promise<boolean> {
    if (!jti) return false
    const store = await this.getStore()
    const v = await store.get<boolean>(`blacklist:${jti}`)
    return Boolean(v)
  }

  // Check if token is blacklisted
  isTokenBlacklisted(): boolean {
    // TODO: Implement proper token blacklist checking
    return false
  }
}

export const jwtManager = JWTManager.getInstance()
