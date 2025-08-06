import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import type { Review } from "@/lib/types"

interface ReviewManagementProps {
  reviews: Review[]
}

export function ReviewManagement({ reviews }: ReviewManagementProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No reviews yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{review.name}</CardTitle>
                    <StarRating rating={review.stars} size="sm" />
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">Car ID: {review.carId}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
