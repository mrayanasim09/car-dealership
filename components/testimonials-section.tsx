"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    text: "Amazing experience! The team at AM Tycoons Inc. helped me find the perfect car within my budget. The process was smooth and transparent.",
    location: "Los Angeles, CA"
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    text: "Professional service from start to finish. They really know their cars and helped me make an informed decision. Highly recommend!",
    location: "San Diego, CA"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    rating: 5,
    text: "Honest pricing and no hidden fees. They really care about customer satisfaction. Highly recommend AM Tycoons Inc.!",
    location: "Orange County, CA"
  },
  {
    id: 4,
    name: "David Thompson",
    rating: 5,
    text: "Found my dream car here! The quality inspection process gave me confidence in my purchase. Great team!",
    location: "Riverside, CA"
  },
  {
    id: 5,
    name: "Lisa Wang",
    rating: 5,
    text: "Excellent customer service and a great selection of vehicles. The financing options made it easy to get the car I wanted.",
    location: "Ventura, CA"
  },
  {
    id: 6,
    name: "James Wilson",
    rating: 5,
    text: "Trustworthy dealership with quality vehicles. The warranty coverage gives me peace of mind. Will definitely return!",
    location: "San Bernardino, CA"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience with AM Tycoons Inc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

