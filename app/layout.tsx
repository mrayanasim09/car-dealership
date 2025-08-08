import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

import { Providers } from '@/components/providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'AM Tycoons Inc - Quality Pre-Owned Vehicles',
    template: '%s | AM Tycoons Inc'
  },
  description: 'Find your perfect pre-owned vehicle at AM Tycoons Inc. Quality cars, competitive prices, and exceptional service. Browse our inventory of thoroughly inspected vehicles.',
  keywords: ['pre-owned vehicles', 'used cars', 'car dealership', 'quality cars', 'AM Tycoons Inc', 'car financing', 'vehicle inspection'],
  authors: [{ name: 'AM Tycoons Inc' }],
  creator: 'AM Tycoons Inc',
  publisher: 'AM Tycoons Inc',
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
    siteName: 'AM Tycoons Inc',
    title: 'AM Tycoons Inc - Quality Pre-Owned Vehicles',
    description: 'Find your perfect pre-owned vehicle at AM Tycoons Inc. Quality cars, competitive prices, and exceptional service.',
    images: [
      {
        url: '/AMTycons_logo_transparent.png',
        width: 1200,
        height: 630,
        alt: 'AM Tycoons Inc - Quality Pre-Owned Vehicles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AM Tycoons Inc - Quality Pre-Owned Vehicles',
    description: 'Find your perfect pre-owned vehicle at AM Tycoons Inc. Quality cars, competitive prices, and exceptional service.',
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
        
        {/* Preload critical resources */}
        <link rel="preload" href="/AMTycons_logo_transparent.png" as="image" type="image/png" />
        <link rel="preload" href="/placeholder.jpg" as="image" type="image/jpeg" />
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/globals.css" as="style" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//firebasestorage.googleapis.com" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              "name": "AM Tycoons Inc",
              "description": "Quality pre-owned vehicles and exceptional service",
              "url": "https://amtycoonsinc.com",
              "logo": "https://amtycoonsinc.com/AMTycons_logo_transparent.png",
              "image": "https://amtycoonsinc.com/AMTycons_logo_transparent.png",
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
              "openingHours": "Mo-Su 09:00-18:00",
              "priceRange": "$$",
              "paymentAccepted": ["Cash", "Credit Card", "Financing"],
              "currenciesAccepted": "USD",
              "areaServed": {
                "@type": "State",
                "name": "California"
              },
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 33.9022,
                  "longitude": -118.0817
                },
                "geoRadius": "50000"
              }
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
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}