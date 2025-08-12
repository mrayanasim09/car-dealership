"use client"

import { Shield, Award } from "lucide-react"
import { BrandName } from "@/components/brand-name"

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Your satisfaction is our priority",
      color: "text-green-400"
    },
    {
      icon: Award,
      title: "Score",
      description: "95",
      color: "text-blue-400"
    }
  ]

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Why Trust <BrandName className="inline" />?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We&apos;re committed to providing the best car buying experience with transparency and quality
            </p>
          </div>

          {/* Trust Badges Grid - Mobile First */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto">
            {badges.map((badge, index) => {
              const IconComponent = badge.icon
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 md:p-8 text-center hover:bg-accent hover:border-primary/20 transition-all duration-300 transform hover:scale-105 touch-card"
                  role="listitem"
                  aria-label={`${badge.title}: ${badge.description}`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 md:mb-6 rounded-full bg-muted flex items-center justify-center ${badge.color}`}>
                    <IconComponent className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    {badge.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Additional Trust Indicators - Mobile Optimized */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Testimonial */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-lg">J</span>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm md:text-base mb-3">
                    &quot;AM Tycoons made buying my car so easy! Great prices and excellent service. Highly recommend!&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-muted-foreground text-sm ml-2">- John D.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Our Numbers</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Years in Business</span>
                  <span className="text-foreground font-semibold">10+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Vehicles Sold</span>
                  <span className="text-foreground font-semibold">2,500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Customer Rating</span>
                  <span className="text-foreground font-semibold">4.9/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Response Time</span>
                  <span className="text-foreground font-semibold">&lt; 5 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action - Mobile Optimized */}
          <div className="mt-8 md:mt-12 text-center">
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                Ready to Find Your Perfect Vehicle?
              </h3>
              <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                Join thousands of satisfied customers who found their dream car with us
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/inventory"
                  className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                  aria-label="Browse our vehicle inventory"
                >
                  Browse Inventory
                </a>
                <a
                  href="tel:+14243030386"
                  className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-6 py-3 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                  aria-label="Call us at 424-303-0386"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

