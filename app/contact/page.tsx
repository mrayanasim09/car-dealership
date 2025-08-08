"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ContactContent } from "@/components/contact-content"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { FAQSection } from "@/components/faq-section"
import { ErrorBoundary } from "@/components/error-boundary"

export default function ContactPage() {
  const breadcrumbItems = [
    { label: "Contact" }
  ]

  return (
    <div className="min-h-screen bg-black" suppressHydrationWarning>
      <Navbar />
      <Breadcrumb items={breadcrumbItems} />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <ErrorBoundary>
          <ContactContent />
        </ErrorBoundary>
        <ErrorBoundary>
          <FAQSection />
        </ErrorBoundary>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  )
}

