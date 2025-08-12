"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CheckCircle, XCircle, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export function BlobTest() {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<{
    upload: boolean | null
    display: boolean | null
    delete: boolean | null
  }>({
    upload: null,
    display: null,
    delete: null
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setTestResults({ upload: null, display: null, delete: null })

    try {
      // Test 1: Upload
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
      setUploadedUrl(result.url)
      setTestResults(prev => ({ ...prev, upload: true }))
      toast.success('Upload test passed')

      // Test 2: Display (check if image loads)
      const img = new window.Image()
      img.onload = () => {
        setTestResults(prev => ({ ...prev, display: true }))
        toast.success('Display test passed')
      }
      img.onerror = () => {
        setTestResults(prev => ({ ...prev, display: false }))
        toast.error('Display test failed')
      }
      img.src = result.url

    } catch (error) {
      console.error('Test error:', error)
      setTestResults(prev => ({ ...prev, upload: false }))
      toast.error(`Upload test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!uploadedUrl) return

    try {
      const response = await fetch('/api/blob/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: uploadedUrl }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Delete failed')
      }

      setTestResults(prev => ({ ...prev, delete: true }))
      setUploadedUrl(null)
      toast.success('Delete test passed')
    } catch (error) {
      console.error('Delete error:', error)
      setTestResults(prev => ({ ...prev, delete: false }))
      toast.error(`Delete test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <div className="w-4 h-4 bg-gray-300 rounded-full" />
    if (status) return <CheckCircle className="w-4 h-4 text-green-500" />
    return <XCircle className="w-4 h-4 text-red-500" />
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Vercel Blob Integration Test
        </CardTitle>
        <CardDescription>
          Test the image upload, display, and delete functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Test */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Test Image</Label>
          <div className="flex items-center gap-2">
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {getStatusIcon(testResults.upload)}
          </div>
        </div>

        {/* Display Test */}
        {uploadedUrl && (
          <div className="space-y-2">
            <Label>Display Test</Label>
            <div className="flex items-center gap-2">
              <div className="relative w-20 h-20 border rounded-lg overflow-hidden">
                <Image
                  src={uploadedUrl}
                  alt="Test image"
                  fill
                  className="object-cover"
                  onLoad={() => setTestResults(prev => ({ ...prev, display: true }))}
                  onError={() => setTestResults(prev => ({ ...prev, display: false }))}
                />
              </div>
              {getStatusIcon(testResults.display)}
            </div>
          </div>
        )}

        {/* Delete Test */}
        {uploadedUrl && (
          <div className="space-y-2">
            <Label>Delete Test</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={uploading}
              >
                Delete Image
              </Button>
              {getStatusIcon(testResults.delete)}
            </div>
          </div>
        )}

        {/* Results Summary */}
        {Object.values(testResults).some(result => result !== null) && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-2">Test Results:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span>Upload:</span>
                {getStatusIcon(testResults.upload)}
                {testResults.upload === true && <span className="text-green-600">Success</span>}
                {testResults.upload === false && <span className="text-red-600">Failed</span>}
              </div>
              <div className="flex items-center gap-2">
                <span>Display:</span>
                {getStatusIcon(testResults.display)}
                {testResults.display === true && <span className="text-green-600">Success</span>}
                {testResults.display === false && <span className="text-red-600">Failed</span>}
              </div>
              <div className="flex items-center gap-2">
                <span>Delete:</span>
                {getStatusIcon(testResults.delete)}
                {testResults.delete === true && <span className="text-green-600">Success</span>}
                {testResults.delete === false && <span className="text-red-600">Failed</span>}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">How to Test:</h4>
          <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>1. Select an image file (JPG, PNG, etc.)</li>
            <li>2. Wait for upload to complete</li>
            <li>3. Verify the image displays correctly</li>
            <li>4. Test deletion (optional)</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
} 
