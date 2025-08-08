// app/page.tsx

"use client"

import { HeroSection } from "@/components/hero-section"
import { FeaturedCars } from "@/components/featured-cars"
import dynamic from "next/dynamic"
import { Suspense } from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// Lazy load heavy components for better performance
const TestimonialsSection = dynamic(
  () => import("@/components/testimonials-section").then(m => m.TestimonialsSection), 
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

const whyChooseUs = [
  {
    title: "Quality Guarantee",
    description: "Every vehicle undergoes a comprehensive 150-point inspection"
  },
  {
    title: "Best Price Promise",
    description: "We guarantee competitive pricing with no hidden fees"
  },
  {
    title: "Quick Process",
    description: "Complete your purchase in as little as 30 minutes"
  },
  {
    title: "Expert Team",
    description: "Certified mechanics and automotive professionals"
  },
  {
    title: "Wide Selection",
    description: "Hundreds of quality pre-owned vehicles in stock"
  },
  {
    title: "BBB Accredited",
    description: "Certified Dealer"
  },
  {
    title: "Quality Assured",
    description: "Your satisfaction is our priority"
  }
]

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-black">
        <Navbar />
        
        {/* Hero Section - No extra padding on mobile */}
        <section>
          <HeroSection />
        </section>
        
        {/* Featured Cars Section */}
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

        {/* Why Choose Us Section - Mobile First */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Why Choose AM Tycoons Inc.?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Experience the difference with our commitment to quality, transparency, and customer satisfaction.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {whyChooseUs.map((item, idx) => (
                <div key={idx} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 md:p-6">
                  <h3 className="font-semibold text-lg text-red-500 mb-2 md:mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials/Reviews Section - Mobile First */}
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
      </main>
      
      <Footer />
    </>
  )
}