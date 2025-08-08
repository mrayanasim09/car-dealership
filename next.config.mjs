/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  // Security configuration
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: isDevelopment 
              ? [
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com",
                  "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
                  "font-src 'self' https://fonts.gstatic.com",
                  "img-src 'self' data: https: blob:",
                  "connect-src 'self' https://*.googleapis.com https://www.google-analytics.com",
                  "frame-src 'self' https://www.google.com https://maps.google.com https://am-tycoon.firebaseapp.com",
                  "object-src 'none'",
                  "base-uri 'self'",
                  "form-action 'self'"
                ].join('; ')
              : [
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com",
                  "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
                  "font-src 'self' https://fonts.gstatic.com",
                  "img-src 'self' data: https: blob:",
                  "connect-src 'self' https://*.googleapis.com https://www.google-analytics.com",
                  "frame-src 'self' https://www.google.com https://maps.google.com https://am-tycoon.firebaseapp.com",
                  "object-src 'none'",
                  "base-uri 'self'",
                  "form-action 'self'"
                ].join('; '),
          },
        ],
      },
      // Additional headers for admin routes
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      // Performance headers for API routes
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
      // Performance headers for static assets
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Performance headers for images
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Enhanced image optimization
  images: {
    domains: ['res.cloudinary.com', 'firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'react-hook-form', 'zod'],
  },

  // Redirects for security
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
    ]
  },

  // Rewrites for API protection
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: '/api/admin/:path*',
      },
    ]
  },

  // Enhanced compiler options for performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  output: 'standalone',
  swcMinify: true,

  // Temporarily disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Performance optimizations
  generateEtags: false,
  
  // Bundle analyzer (optional)
  ...(process.env.ANALYZE === 'true' && withBundleAnalyzer({})),
}

export default nextConfig