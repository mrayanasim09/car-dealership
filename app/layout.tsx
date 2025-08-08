import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers"; // Import our new wrapper
import { ErrorBoundary } from "@/components/error-boundary";
import Script from "next/script";


const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "%s | AM Tycoons Inc. - Premium Car Dealership",
    default: "AM Tycoons Inc. - Premium Car Dealership in Los Angeles",
  },
  description: "Discover premium cars at AM Tycoons Inc. Your trusted car dealership in Los Angeles.",
  metadataBase: new URL("https://amtycoons.com"),
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Discover premium cars at AM Tycoons Inc. Your trusted car dealership in Los Angeles." />
        <meta name="keywords" content="used cars, car dealership, Los Angeles, pre-owned vehicles, AM Tycoons Inc" />
        <link rel="canonical" href="https://amtycoons.com/" />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="AM Tycoons Inc. - Premium Car Dealership in Los Angeles" />
        <meta property="og:description" content="Discover premium cars at AM Tycoons Inc. Your trusted car dealership in Los Angeles." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amtycoons.com/" />
        <meta property="og:image" content="https://amtycoons.com/AMTycons_logo_transparent.png" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AM Tycoons Inc. - Premium Car Dealership in Los Angeles" />
        <meta name="twitter:description" content="Discover premium cars at AM Tycoons Inc. Your trusted car dealership in Los Angeles." />
        <meta name="twitter:image" content="https://amtycoons.com/AMTycons_logo_transparent.png" />
        {/* Structured Data: Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'AM Tycoons Inc.',
          url: 'https://amtycoons.com/',
          logo: 'https://amtycoons.com/AMTycons_logo_transparent.png',
          contactPoint: [{
            '@type': 'ContactPoint',
            telephone: '+1-424-303-0386',
            contactType: 'customer service',
            areaServed: 'US',
            availableLanguage: ['English', 'Spanish']
          }],
          sameAs: [
            'https://www.facebook.com/amtycoonsinc',
            'https://www.instagram.com/amtycoonsinc/'
          ]
        }) }} />
        {/* Structured Data: Breadcrumb (example for homepage) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://amtycoons.com/'
            }
          ]
        }) }} />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KJR6QF93LL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KJR6QF93LL');
          `}
        </Script>
        {/* Inline critical CSS for above-the-fold content */}
        <style>{`
          body { background: #fff; color: #111; margin: 0; font-family: Inter, sans-serif; }
          .navbar { background: #fff; border-bottom: 1px solid #eee; }
          .hero { padding: 4rem 0 2rem 0; text-align: center; }
          .hero h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem; }
          .hero p { font-size: 1.25rem; color: #666; margin-bottom: 2rem; }
          @media (min-width: 768px) {
            .hero h1 { font-size: 3.5rem; }
            .hero { padding: 6rem 0 3rem 0; }
          }
        `}</style>
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}