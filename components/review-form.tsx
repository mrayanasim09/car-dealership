"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarRating } from "@/components/star-rating"
import { addReview, isFirebaseAvailable } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  carId: string
}

export function ReviewForm({ carId }: ReviewFormProps) {
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !comment.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (!isFirebaseAvailable()) {
      toast({
        title: "Demo Mode",
        description: "Review submission requires Firebase configuration",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addReview({
        carId,
        name: name.trim(),
        comment: comment.trim(),
        stars: rating,
        createdAt: new Date(),
      })

      toast({
        title: "Success",
        description: "Your review has been submitted!",
      })

      setName("")
      setComment("")
      setRating(5)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
      <h3 className="text-lg font-medium">Leave a Review</h3>

      {!isFirebaseAvailable() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> Review submission requires Firebase configuration.
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <Label>Rating</Label>
        <StarRating rating={rating} interactive onRatingChange={setRating} />
      </div>

      <div>
        <Label htmlFor="comment">Your Review</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this car..."
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting || !isFirebaseAvailable()} className="bg-red-600 hover:bg-red-700">
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
