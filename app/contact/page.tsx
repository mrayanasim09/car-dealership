"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ContactContent } from "@/components/contact-content"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { FAQSection } from "@/components/faq-section"

export default function ContactPage() {
  const breadcrumbItems = [
    { label: "Contact" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact AM Tycoons Inc.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get in touch with us today. We're here to help you find your perfect vehicle and answer any questions you may have.
          </p>
        </div>

        <ContactContent />
      </div>

      <WhatsAppButton />
      <Footer />
    </div>
  )
}

