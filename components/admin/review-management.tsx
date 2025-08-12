import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import type { Review } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ReviewManagementProps {
  reviews?: Review[]
}

interface AdminReview extends Review {
  id: string
  carId?: string
  approved?: boolean
  created_at?: string
}

export function ReviewManagement({ reviews = [] }: ReviewManagementProps) {
  const [items, setItems] = useState<AdminReview[]>(reviews as AdminReview[])
  const { toast } = useToast()

  useEffect(() => {
    if (reviews.length === 0) {
      ;(async () => {
        try {
          const res = await fetch('/api/admin/reviews', { cache: 'no-store' })
          const data = await res.json()
          setItems((data?.reviews || []) as AdminReview[])
        } catch {
          setItems([])
        }
      })()
    }
  }, [reviews])

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '') },
        body: JSON.stringify({ id, approved })
      })
      if (!res.ok) throw new Error('Failed')
      setItems(prev => prev.map(r => r.id === id ? { ...r, approved } : r))
      toast({ title: 'Success', description: `Review ${approved ? 'approved' : 'unapproved'}` })
    } catch {
      toast({ title: 'Error', description: 'Failed to update review', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      setItems(prev => prev.filter(r => r.id !== id))
      toast({ title: 'Deleted', description: 'Review deleted' })
    } catch {
      toast({ title: 'Error', description: 'Failed to delete review', variant: 'destructive' })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>

      {items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-foreground/60">No reviews yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">{review.name}</CardTitle>
                    <StarRating rating={review.stars} size="sm" />
                  </div>
                  <span className="text-sm text-foreground/60">
                    {review.createdAt instanceof Date 
                      ? review.createdAt.toLocaleDateString()
                      : new Date((review.createdAt as Record<string, unknown>)?.seconds as number * 1000).toLocaleDateString()
                    }
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{review.comment}</p>
                <p className="text-sm text-foreground/60 mt-2">Car ID: {review.carId}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="min-h-[44px]" onClick={() => handleApprove(review.id!, !(review as AdminReview).approved)}>
                    {(review as AdminReview).approved ? 'Unapprove' : 'Approve'}
                  </Button>
                  <Button variant="outline" size="sm" className="text-primary min-h-[44px]" onClick={() => handleDelete(review.id!)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
