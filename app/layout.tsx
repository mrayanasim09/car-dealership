import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AM Tycoons Inc - Quality Pre-Owned Vehicles',
  description: 'Find your perfect pre-owned vehicle at AM Tycoons Inc. Quality cars, competitive prices, and exceptional service in Southern California.',
  keywords: 'used cars, pre-owned vehicles, car dealership, Southern California, AM Tycoons',
  authors: [{ name: 'AM Tycoons Inc' }],
  creator: 'AM Tycoons Inc',
  publisher: 'AM Tycoons Inc',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://am-tycoon-q6z4bba87-mrayanasim09s-projects.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AM Tycoons Inc - Quality Pre-Owned Vehicles',
    description: 'Find your perfect pre-owned vehicle at AM Tycoons Inc. Quality cars, competitive prices, and exceptional service in Southern California.',
    url: 'https://am-tycoon-q6z4bba87-mrayanasim09s-projects.vercel.app',
    siteName: 'AM Tycoons Inc',
    images: [
      {
        url: '/AMTycons_logo_transparent.png',
        width: 1200,
        height: 630,
        alt: 'AM Tycoons Inc Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AM Tycoons Inc - Quality Pre-Owned Vehicles',
    description: 'Find your perfect pre-owned vehicle at AM Tycoons Inc. Quality cars, competitive prices, and exceptional service in Southern California.',
    images: ['/AMTycons_logo_transparent.png'],
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/AMTycons_logo_transparent.png" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              "name": "AM Tycoons Inc",
              "description": "Quality pre-owned vehicles in Southern California",
              "url": "https://am-tycoon-q6z4bba87-mrayanasim09s-projects.vercel.app",
              "logo": "https://am-tycoon-q6z4bba87-mrayanasim09s-projects.vercel.app/AMTycons_logo_transparent.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "12440 Firestone Blvd, Suite 3025D",
                "addressLocality": "Norwalk",
                "addressRegion": "CA",
                "postalCode": "90650",
                "addressCountry": "US"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-424-303-0386",
                "contactType": "customer service",
                "areaServed": "US",
                "availableLanguage": "English"
              },
              "openingHours": "Mo-Su 00:00-23:59",
              "priceRange": "$$",
              "sameAs": [
                "https://www.facebook.com/amtycoonsinc",
                "https://www.instagram.com/amtycoonsinc"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}