"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import Script from 'next/script'
import { useCspNonce } from '@/hooks/use-csp-nonce'
import { BUSINESS_NAME, BUSINESS_ADDRESS, CONTACT_NUMBERS, CONTACT_EMAIL } from '@/lib/config/contact'
import { ContactContent } from "@/components/contact-content"
import { ErrorBoundary } from "@/components/error-boundary"

export default function ContactPage() {
  const nonce = useCspNonce()
  const breadcrumbItems = [
    { label: "Contact" }
  ]

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <Navbar />
      <Breadcrumb items={breadcrumbItems} />
      <Script
        id="contact-local-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: BUSINESS_NAME,
            email: CONTACT_EMAIL,
            address: {
              '@type': 'PostalAddress',
              streetAddress: BUSINESS_ADDRESS.streetAddress,
              addressLocality: BUSINESS_ADDRESS.addressLocality,
              addressRegion: BUSINESS_ADDRESS.addressRegion,
              postalCode: BUSINESS_ADDRESS.postalCode,
              addressCountry: 'US'
            },
            telephone: CONTACT_NUMBERS.map(n => n.e164),
          }).replaceAll('<', '\\u003c').replaceAll('</script', '<\\/script'),
        }}
      />
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <ErrorBoundary>
          <ContactContent />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}

