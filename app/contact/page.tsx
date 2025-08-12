"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ContactContent } from "@/components/contact-content"
import { ErrorBoundary } from "@/components/error-boundary"

export default function ContactPage() {
  const breadcrumbItems = [
    { label: "Contact" }
  ]

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <Navbar />
      <Breadcrumb items={breadcrumbItems} />
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <ErrorBoundary>
          <ContactContent />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}

