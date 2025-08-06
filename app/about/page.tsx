"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { AboutContent } from "@/components/about-content"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { TestimonialsSection } from "@/components/testimonials-section"
import { TrustBadges } from "@/components/trust-badges"

export default function AboutPage() {
  const breadcrumbItems = [
    { label: "About" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About AM Tycoons Inc.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our story, mission, and commitment to providing quality vehicles and exceptional service to our customers.
          </p>
        </div>

        <AboutContent />
      </div>

      <WhatsAppButton />
      <Footer />
    </div>
  )
}

