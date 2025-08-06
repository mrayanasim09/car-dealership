// app/page.tsx

"use client"

import { HeroSection } from "@/components/hero-section"
import { FeaturedCars } from "@/components/featured-cars"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { ContactContent } from "@/components/contact-content"
import { TrustBadges } from "@/components/trust-badges"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section>
        <HeroSection />
      </section>
      <section>
        <FeaturedCars />
      </section>
      <section>
        <TrustBadges />
      </section>
      <section>
        <TestimonialsSection />
      </section>
      <section>
        <FAQSection />
      </section>
      <section>
        <ContactContent />
      </section>
    </main>
  )
}