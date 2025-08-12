// Environment configuration with validation for production
export const env = {
  // Vercel Configuration
  vercel: {
    analytics: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
    speedInsights: process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID,
  },
  // Authentication & Security
  auth: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET!,
    nextAuthUrl: process.env.NEXTAUTH_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    sessionSecret: process.env.SESSION_SECRET!,
    encryptionKey: process.env.ENCRYPTION_KEY!,
  },
  // Admin Configuration
  admin: {
    emails: process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS,
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL!,
    defaultPassword: process.env.DEFAULT_ADMIN_PASSWORD!,
  },
  // Vercel Blob Configuration
  blob: {
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  },
  // Push Notifications (disabled)
  push: {
    vapidPublicKey: undefined,
    vapidPrivateKey: undefined,
    vapidSubject: undefined,
  },
  // Database & Storage
  database: {
    url: process.env.DATABASE_URL,
    apiKey: process.env.DATABASE_API_KEY,
  },
  // External Services
  services: {
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      apiSecret: process.env.CLOUDINARY_API_SECRET!,
    },
    email: {
      provider: process.env.EMAIL_PROVIDER || 'resend',
      apiKey: process.env.EMAIL_API_KEY!,
      fromEmail: process.env.FROM_EMAIL!,
    },
    recaptcha: {
      // Site key is public and safe to expose on the client
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      // Secret key must remain server-side only
      secretKey: process.env.RECAPTCHA_SECRET_KEY,
    },
  },
  // Security & Rate Limiting
  security: {
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    corsOrigin: process.env.CORS_ORIGIN || 'https://your-domain.vercel.app',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
  },
  // Monitoring & Analytics
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  },
  // Feature Flags
  features: {
    enablePushNotifications: false,
    enableTwoFactorAuth: true,
    enableAnalytics: false,
    enableChatbot: process.env.ENABLE_CHATBOT === 'true',
    enableReviews: process.env.ENABLE_REVIEWS === 'true',
  },
} as const

// Environment validation
export function validateEnvironment() {
  const requiredVars = [
    'JWT_SECRET',
    'SESSION_SECRET',
    'ENCRYPTION_KEY',
    'BLOB_READ_WRITE_TOKEN',
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

export default env
