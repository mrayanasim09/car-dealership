// JWT utilities - temporarily disabled as admin portal uses Firebase authentication
// import jwt from 'jsonwebtoken'
// import { config } from './config'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  permissions: string[]
  iat?: number
  exp?: number
}

export class JWTManager {
  private static instance: JWTManager

  static getInstance(): JWTManager {
    if (!JWTManager.instance) {
      JWTManager.instance = new JWTManager()
    }
    return JWTManager.instance
  }

  generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    throw new Error('JWT authentication is disabled - using Firebase authentication')
  }

  verifyToken(token: string): JWTPayload {
    throw new Error('JWT authentication is disabled - using Firebase authentication')
  }

  refreshToken(token: string): string {
    throw new Error('JWT authentication is disabled - using Firebase authentication')
  }

  decodeToken(token: string): JWTPayload | null {
    return null
  }
}

export const jwtManager = JWTManager.getInstance()
