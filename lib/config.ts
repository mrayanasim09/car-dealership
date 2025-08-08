// Security configuration for admin portal
export const config = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '30m',
  },
  
  // Password Hashing
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  },
  
  // Admin Credentials (in production, use database)
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@amtycoons.com',
    passwordHash: process.env.ADMIN_PASSWORD_HASH || '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqQKqK',
  },
  
  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-this-in-production',
    cookieSecret: process.env.COOKIE_SECRET || 'your-cookie-secret-change-this-in-production',
    maxAge: 30 * 60 * 1000, // 30 minutes
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'),
  },
  
  // 2FA Configuration
  twoFactor: {
    enabled: process.env.ENABLE_2FA === 'true',
    secret: process.env.TOTP_SECRET || 'your-totp-secret-change-this-in-production',
  },
  
  // Environment
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
}
