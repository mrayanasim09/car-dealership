import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutContent } from "@/components/about-content"

import { Metadata } from 'next'
import Script from 'next/script'
import { headers } from 'next/headers'
import { BUSINESS_NAME, BUSINESS_ADDRESS } from '@/lib/config/contact'

// Optimize caching and performance
export const revalidate = 3600 // 1 hour
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'About Us - AM Tycoons Inc',
  description: 'Learn about AM Tycoons Inc, your trusted partner for quality pre-owned vehicles since 2009. 15+ years of excellence serving Southern California.',
  keywords: 'about AM Tycoons, used car dealership, pre-owned vehicles, Southern California, 15 years experience',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About AM Tycoons Inc - 15+ Years of Excellence',
    description: 'Your trusted partner for quality pre-owned vehicles since 2009',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AboutPage() {
  const nonce = headers().get('x-nonce') || undefined
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Script
        id="about-org-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: BUSINESS_NAME,
            url: 'https://amtycoonsinc.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: BUSINESS_ADDRESS.streetAddress,
              addressLocality: BUSINESS_ADDRESS.addressLocality,
              addressRegion: BUSINESS_ADDRESS.addressRegion,
              postalCode: BUSINESS_ADDRESS.postalCode,
              addressCountry: 'US'
            },
          }).replaceAll('<', '\\u003c').replaceAll('</script', '<\\/script'),
        }}
      />
      <AboutContent />
      <Footer />
    </div>
  )
}

