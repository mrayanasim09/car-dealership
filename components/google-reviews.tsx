"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { StarRating } from '@/components/star-rating'
import { Star, MapPin } from 'lucide-react'
import Image from 'next/image'

interface GoogleReview {
  author_name: string
  rating: number
  relative_time_description: string
  text: string
  profile_photo_url?: string
  author_url?: string
}

interface GoogleReviewsProps {
  placeId?: string
  maxReviews?: number
}

export function GoogleReviews({ placeId = "ChIJN1t_tDeuEmsRUsoyG83frY4", maxReviews = 6 }: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<GoogleReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        
        // For demo purposes, using mock data since Google Places API requires API key
        // In production, you would make an API call to Google Places API
        const mockReviews: GoogleReview[] = [
          {
            author_name: "Sarah Johnson",
            rating: 5,
            relative_time_description: "2 weeks ago",
            text: "Amazing experience! The team at AM Tycoons Inc. helped me find the perfect car within my budget. The process was smooth and transparent.",
            profile_photo_url: "https://via.placeholder.com/40"
          },
          {
            author_name: "Michael Chen",
            rating: 5,
            relative_time_description: "1 month ago",
            text: "Professional service from start to finish. They really know their cars and helped me make an informed decision. Highly recommend!",
            profile_photo_url: "https://via.placeholder.com/40"
          },
          {
            author_name: "Emily Rodriguez",
            rating: 5,
            relative_time_description: "3 weeks ago",
            text: "Honest pricing and no hidden fees. They really care about customer satisfaction. Highly recommend AM Tycoons Inc.!",
            profile_photo_url: "https://via.placeholder.com/40"
          },
          {
            author_name: "David Thompson",
            rating: 5,
            relative_time_description: "1 month ago",
            text: "Found my dream car here! The quality inspection process gave me confidence in my purchase. Great team!",
            profile_photo_url: "https://via.placeholder.com/40"
          },
          {
            author_name: "Lisa Wang",
            rating: 5,
            relative_time_description: "2 months ago",
            text: "Excellent customer service and a great selection of vehicles. The financing options made it easy to get the car I wanted.",
            profile_photo_url: "https://via.placeholder.com/40"
          },
          {
            author_name: "James Wilson",
            rating: 5,
            relative_time_description: "1 month ago",
            text: "Trustworthy dealership with quality vehicles. The quality inspection process gives me peace of mind. Will definitely return!",
            profile_photo_url: "https://via.placeholder.com/40"
          }
        ]

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setReviews(mockReviews.slice(0, maxReviews))
        setAverageRating(5.0) // Mock average rating
        setTotalReviews(156) // Mock total reviews
        setError(null)
      } catch (err) {
        setError('Failed to load reviews')
        console.error('Error fetching Google reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [placeId, maxReviews])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Google Reviews
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Loading...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mr-3"></div>
                  <div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Google Reviews
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Google Reviews
        </h2>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Star className="h-6 w-6 text-yellow-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{averageRating}</span>
          <span className="text-gray-600 dark:text-gray-300">({totalReviews} reviews)</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          See what our customers say about us on Google
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={review.profile_photo_url || "https://via.placeholder.com/40"}
                    alt={review.author_name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {review.author_name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <StarRating rating={review.rating} size="sm" interactive={false} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {review.relative_time_description}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <a
          href="https://www.google.com/maps/place/AM+Tycoons+Inc/@33.9022,-118.0817,15z/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          <MapPin className="h-4 w-4" />
          <span>View All Reviews on Google</span>
        </a>
      </div>
    </div>
  )
}
