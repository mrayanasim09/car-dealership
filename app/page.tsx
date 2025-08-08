// app/page.tsx

"use client"

import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { SearchSection } from "@/components/search-section"
import { TrustBadges } from "@/components/trust-badges"
import { LoadingSpinner } from "@/components/loading-spinner"
import dynamic from "next/dynamic"

// Lazy load heavy components for better performance
const FeaturedCars = dynamic(
  () => import("@/components/featured-cars").then(m => ({ default: m.FeaturedCars })),
  { 
    ssr: false,
    loading: () => (
      <div className="py-8 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Featured Vehicles
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover our handpicked selection of premium vehicles
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse">
                <div className="aspect-video bg-gray-700 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)

const TestimonialsSection = dynamic(
  () => import("@/components/testimonials-section").then(m => ({ default: m.TestimonialsSection })),
  { 
    ssr: false,
    loading: () => (
      <div className="py-12 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about their experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)

// Lazy load WhatsApp button
const WhatsAppButton = dynamic(
  () => import("@/components/whatsapp-button").then(m => ({ default: m.WhatsAppButton })),
  { ssr: false }
)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section - Critical above the fold */}
      <HeroSection />
      
      {/* Search Section - Critical above the fold */}
      <SearchSection />
      
      {/* Trust Badges - Important for conversion */}
      <TrustBadges />
      
      {/* Featured Cars Section - Lazy loaded */}
      <section className="py-8 md:py-16 bg-gray-900">
        <Suspense fallback={
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Featured Vehicles
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Discover our handpicked selection of premium vehicles
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse">
                  <div className="aspect-video bg-gray-700 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }>
          <FeaturedCars />
        </Suspense>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose AM Tycoons Inc?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We're committed to providing exceptional service and quality vehicles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quality Assurance</h3>
              <p className="text-gray-300">Every vehicle undergoes thorough inspection and quality checks</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Competitive Pricing</h3>
              <p className="text-gray-300">Best prices guaranteed with flexible financing options</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-300">Round-the-clock customer support and assistance</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section - Lazy loaded */}
      <Suspense fallback={
        <div className="py-12 md:py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                What Our Customers Say
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our satisfied customers have to say about their experience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-700 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }>
        <TestimonialsSection />
      </Suspense>
      
      <Footer />
      <WhatsAppButton />
    </div>
  )
}