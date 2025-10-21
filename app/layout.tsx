import type { Metadata } from 'next'
import Script from 'next/script'
import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { CookieConsent } from '@/components/cookie-consent'
import { ErrorMonitor } from '@/components/error-monitor'
import { AccessibilityAudit } from '@/components/accessibility-audit'

import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: {
    default: 'AM Tycoons Inc. - Premium Pre-Owned Vehicles',
    template: '%s | AM Tycoons Inc.'
  },
  description: 'Discover premium pre-owned vehicles at AM Tycoons Inc. Quality cars, competitive pricing, exceptional service, and easy financing—all in one place.',
  keywords: ['pre-owned vehicles', 'used cars', 'car dealership', 'AM Tycoons', 'quality cars', 'competitive pricing', 'financing'],
  authors: [{ name: 'AM Tycoons Inc.' }],
  creator: 'AM Tycoons Inc.',
  publisher: 'AM Tycoons Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://amtycoonsinc.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://amtycoonsinc.com',
    title: 'AM Tycoons Inc. - Premium Pre-Owned Vehicles',
    description: 'Discover premium pre-owned vehicles at AM Tycoons Inc. Quality cars, competitive pricing, exceptional service, and easy financing.',
    siteName: 'AM Tycoons Inc.',
    images: [
      { url: 'https://amtycoonsinc.com/optimized/am-tycoons-logo.png?v=4', width: 1200, height: 630, alt: 'AM Tycoons Inc. Logo' },
      { url: 'https://amtycoonsinc.com/optimized/am-tycoons-logo.webp?v=1', width: 1200, height: 630, alt: 'AM Tycoons Inc. Logo (WebP)' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AM Tycoons Inc. - Premium Pre-Owned Vehicles',
    description: 'Discover premium pre-owned vehicles at AM Tycoons Inc. Quality cars, competitive pricing, exceptional service, and easy financing.',
    images: ['https://amtycoonsinc.com/optimized/am-tycoons-logo.png?v=4'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = headers().get('x-nonce') || undefined
  return (
    <html lang="en" className="light" suppressHydrationWarning>
    <Script id="theme-script" strategy="beforeInteractive" nonce={nonce}>{`
      (function() {
        try {
          var storageKey = 'am-tycoons-theme';
          var stored = localStorage.getItem(storageKey);
          var resolved = (stored === 'dark' || stored === 'light') ? stored : 'light';
          if (!stored) {
            localStorage.setItem(storageKey, resolved);
          }
          var d = document.documentElement;
          d.classList.remove('light', 'dark', 'system');
          d.classList.add(resolved);
        } catch (e) {}
      })();
    `}</Script>
      <head>
        {nonce ? <meta name="csp-nonce" content={nonce} /> : null}
        {/* Google tag (gtag.js) - load lazily to keep main thread free */}
        <Script
          id="gtag-src"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Y6M86V6MKQ"
          strategy="lazyOnload"
          nonce={nonce}
        />
        <Script id="gtag-init" strategy="lazyOnload" nonce={nonce}>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y6M86V6MKQ');
          `}
        </Script>
        {/* DNS prefetch (trimmed) */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Preload critical resources (logo preload removed to avoid large PNG on critical path) */}
        <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AM Tycoons" />
        
        {/* Viewport optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Cache control handled via next.config headers */}
      </head>
      <body className={inter.className}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-3 py-2 rounded">Skip to content</a>
        <Providers>
          <main id="main">{children}</main>
        </Providers>
        {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID && <Analytics />}
        {process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS === '1' && <SpeedInsights />}
        <CookieConsent />
        <ErrorMonitor />
        <AccessibilityAudit />
        {/* AI Chatbot is now gated and mounted from Providers after idle */}
      </body>
    </html>
  )
}