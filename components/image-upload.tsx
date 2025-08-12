"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
  onImagesUploaded: (urls: string[]) => void
  existingImages?: string[]
  onImageRemove?: (imageUrl: string) => void
  maxImages?: number
  className?: string
}

export function ImageUpload({ 
  onImagesUploaded, 
  existingImages = [], 
  onImageRemove,
  maxImages = 25,
  className = ""
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadToBlob = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/blob/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    const result = await response.json()
    return result.url
  }

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files')
      return
    }

    if (uploadedImages.length + imageFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = imageFiles.map(async (file, index) => {
        const url = await uploadToBlob(file)
        setUploadProgress(((index + 1) / imageFiles.length) * 100)
        return url
      })

      const newUrls = await Promise.all(uploadPromises)
      const allImages = [...uploadedImages, ...newUrls]
      
      setUploadedImages(allImages)
      onImagesUploaded(allImages)
      
      toast.success(`${imageFiles.length} image(s) uploaded successfully!`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [uploadedImages, maxImages, onImagesUploaded])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files)
    }
  }, [handleUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files)
    }
  }, [handleUpload])

  const handleImageRemove = useCallback((imageUrl: string) => {
    const newImages = uploadedImages.filter(url => url !== imageUrl)
    setUploadedImages(newImages)
    onImagesUploaded(newImages)
    onImageRemove?.(imageUrl)
    toast.success('Image removed')
  }, [uploadedImages, onImagesUploaded, onImageRemove])

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading images...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Existing Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <div key={index} className="relative group aspect-square">
              <Image
                src={imageUrl}
                alt={`Car image ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg" />
              <button
                type="button"
                onClick={() => handleImageRemove(imageUrl)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Image {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {uploadedImages.length < maxImages && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                <ImageIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Drop images here or click to upload
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF up to 10MB each
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {uploadedImages.length} of {maxImages} images uploaded
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileInput}
              disabled={uploading}
              className="mt-4"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </div>
      )}

      {/* Max Images Warning */}
      {uploadedImages.length >= maxImages && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            Maximum {maxImages} images reached. Remove some images to upload more.
          </span>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Supported formats: PNG, JPG, GIF</p>
        <p>• Maximum file size: 10MB per image</p>
        <p>• Maximum images: {maxImages}</p>
        <p>• Drag and drop or click to select files</p>
      </div>
    </div>
  )
}

