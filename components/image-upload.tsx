"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload, Image as ImageIcon, Link } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadProps {
  carId?: string
  existingImages?: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ 
  carId, 
  existingImages = [], 
  onImagesChange, 
  maxImages = 10 
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`)
        return false
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`)
        return false
      }
      
      return true
    })

    if (validFiles.length === 0) return

    if (images.length + validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    
    try {
      // Create temporary URLs for preview
      const newImageUrls = validFiles.map(file => URL.createObjectURL(file))
      toast.success(`Added ${newImageUrls.length} images for preview`)
      
      const updatedImages = [...images, ...newImageUrls]
      setImages(updatedImages)
      onImagesChange(updatedImages)
      
    } catch (error) {
      console.error('Error processing images:', error)
      toast.error('Failed to process images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async (imageUrl: string, index: number) => {
    try {
      // Revoke object URL for temporary images
      if (imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl)
      }
      
      const updatedImages = images.filter((_, i) => i !== index)
      setImages(updatedImages)
      onImagesChange(updatedImages)
      toast.success('Image removed successfully')
      
    } catch (error) {
      console.error('Error removing image:', error)
      toast.error('Failed to remove image')
    }
  }

  const handleAddUrl = () => {
    const url = urlInput.trim()
    
    if (!url) {
      toast.error('Please enter a valid image URL')
      return
    }

    // Basic URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      toast.error('Please enter a valid URL starting with http:// or https://')
      return
    }

    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    const updatedImages = [...images, url]
    setImages(updatedImages)
    onImagesChange(updatedImages)
    setUrlInput('')
    toast.success('Image URL added successfully')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        Car Images ({images.length}/{maxImages})
      </Label>
      
      {/* URL Input Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Link className="h-4 w-4" />
          Add Cloudinary Image URLs
        </Label>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/car-images/your-image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddUrl()
              }
            }}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddUrl}
            disabled={!urlInput.trim() || images.length >= maxImages}
          >
            Add URL
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Paste your Cloudinary image URLs here. Press Enter or click "Add URL" to add.
        </p>
      </div>

      {/* Upload Area for Local Files (Preview Only) */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="space-y-2">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              disabled={uploading || images.length >= maxImages}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Processing...' : 'Choose Images for Preview'}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Or drag and drop images here for preview
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, GIF up to 10MB each (preview only)
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={`Car image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder.svg' // Fallback image
                  }}
                />
              </div>
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(imageUrl, index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              
              {/* Image index */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload your images to Cloudinary first</li>
          <li>• Copy the Cloudinary URL and paste it in the URL field above</li>
          <li>• You can also drag & drop local images for preview</li>
          <li>• Maximum {maxImages} images allowed per car</li>
        </ul>
      </div>
    </div>
  )
}

