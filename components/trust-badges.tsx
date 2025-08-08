"use client"

import { Shield, Award, Clock, Users, Star, CheckCircle } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "BBB Accredited",
      description: "A+ Rating",
      color: "text-blue-400"
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "150-Point Inspection",
      color: "text-green-400"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Always Available",
      color: "text-yellow-400"
    },
    {
      icon: Users,
      title: "1000+ Customers",
      description: "Satisfied Clients",
      color: "text-purple-400"
    },
    {
      icon: Star,
      title: "5-Star Rating",
      description: "Excellent Service",
      color: "text-orange-400"
    },
    {
      icon: CheckCircle,
      title: "Financing Available",
      description: "Easy Approval",
      color: "text-red-400"
    }
  ]

  return (
    <section className="py-8 md:py-12 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Why Trust AM Tycoons Inc?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We're committed to providing the best car buying experience with transparency and quality
            </p>
          </div>

          {/* Trust Badges Grid - Mobile First */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {badges.map((badge, index) => {
              const IconComponent = badge.icon
              return (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 text-center hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 transform hover:scale-105"
                  role="listitem"
                  aria-label={`${badge.title}: ${badge.description}`}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 md:mb-4 rounded-full bg-gray-700 flex items-center justify-center ${badge.color}`}>
                    <IconComponent className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-white mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400">
                    {badge.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Additional Trust Indicators - Mobile Optimized */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Testimonial */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <div>
                  <p className="text-gray-300 text-sm md:text-base mb-3">
                    "AM Tycoons made buying my car so easy! Great prices and excellent service. Highly recommend!"
                  </p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm ml-2">- John D.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Stats */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Our Numbers</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Years in Business</span>
                  <span className="text-white font-semibold">10+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Vehicles Sold</span>
                  <span className="text-white font-semibold">2,500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Customer Rating</span>
                  <span className="text-white font-semibold">4.9/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Response Time</span>
                  <span className="text-white font-semibold">&lt; 5 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action - Mobile Optimized */}
          <div className="mt-8 md:mt-12 text-center">
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
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

