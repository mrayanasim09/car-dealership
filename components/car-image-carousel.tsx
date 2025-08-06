"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { CloudinaryImage } from "@/components/cloudinary-image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface CarImageCarouselProps {
  images: string[]
  carTitle: string
}

export function CarImageCarousel({ images, carTitle }: CarImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <CloudinaryImage
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${carTitle} - Image ${currentIndex + 1}`}
            width={800}
            height={500}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100">
                <Maximize2 className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full h-[80vh]">
              <div className="relative h-full">
                <CloudinaryImage
                  src={images[currentIndex] || "/placeholder.svg"}
                  alt={`${carTitle} - Image ${currentIndex + 1}`}
                  width={1200}
                  height={800}
                  className="w-full h-full object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-red-500 ring-2 ring-red-200'
                  : 'border-gray-300 dark:border-gray-600 hover:border-red-300'
              }`}
            >
              <CloudinaryImage
                src={image}
                alt={`${carTitle} - Thumbnail ${index + 1}`}
                width={80}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

