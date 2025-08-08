"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    score: 95,
    text: "Amazing experience! The team at AM Tycoons Inc. helped me find the perfect car within my budget. The process was smooth and transparent.",
    location: "Los Angeles, CA"
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    score: 92,
    text: "Professional service from start to finish. They really know their cars and helped me make an informed decision. Highly recommend!",
    location: "San Diego, CA"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    rating: 5,
    score: 98,
    text: "Honest pricing and no hidden fees. They really care about customer satisfaction. Highly recommend AM Tycoons Inc.!",
    location: "Orange County, CA"
  },
  {
    id: 4,
    name: "David Thompson",
    rating: 5,
    score: 89,
    text: "Found my dream car here! The quality inspection process gave me confidence in my purchase. Great team!",
    location: "Riverside, CA"
  },
  {
    id: 5,
    name: "Lisa Wang",
    rating: 5,
    score: 96,
    text: "Excellent customer service and a great selection of vehicles. The financing options made it easy to get the car I wanted.",
    location: "Ventura, CA"
  },
  {
    id: 6,
    name: "James Wilson",
    rating: 5,
    score: 91,
    text: "Trustworthy dealership with quality vehicles. The quality inspection process gives me peace of mind. Will definitely return!",
    location: "San Bernardino, CA"
  }
]

export function TestimonialsSection() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Score</div>
                  <div className="text-lg font-bold text-green-400">{testimonial.score}</div>
                </div>
              </div>
              <p className="text-gray-300">
                &quot;{testimonial.text}&quot;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

