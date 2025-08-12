"use client"

import { Card, CardContent } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"

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
    score: 95,
    text: "Professional service from start to finish. They really know their cars and helped me make an informed decision. Highly recommend!",
    location: "San Diego, CA"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    rating: 5,
    score: 95,
    text: "Honest pricing and no hidden fees. They really care about customer satisfaction. Highly recommend AM Tycoons Inc.!",
    location: "Orange County, CA"
  },
  {
    id: 4,
    name: "David Thompson",
    rating: 5,
    score: 95,
    text: "Found my dream car here! The quality inspection process gave me confidence in my purchase. Great team!",
    location: "Riverside, CA"
  },
  {
    id: 5,
    name: "Lisa Wang",
    rating: 5,
    score: 95,
    text: "Excellent customer service and a great selection of vehicles. The financing options made it easy to get the car I wanted.",
    location: "Ventura, CA"
  },
  {
    id: 6,
    name: "James Wilson",
    rating: 5,
    score: 95,
    text: "Trustworthy dealership with quality vehicles. The quality inspection process gives me peace of mind. Will definitely return!",
    location: "San Bernardino, CA"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say about their experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <StarRating rating={testimonial.rating} size="sm" interactive={false} />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Score</div>
                    <div className="text-lg font-bold text-foreground">{testimonial.score}</div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
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

