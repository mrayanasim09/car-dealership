"use client"

import { BlobTest } from "@/components/blob-test"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TestBlobPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin Dashboard
            </Button>
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">🧪 Vercel Blob Integration Test</CardTitle>
              <CardDescription>
                Test the image upload, display, and delete functionality with Vercel Blob storage.
                This page helps you verify that your Blob store is properly configured.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    📋 Prerequisites:
                  </h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Vercel Blob store created in your Vercel dashboard</li>
                    <li>• <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">BLOB_READ_WRITE_TOKEN</code> environment variable set</li>
                    <li>• Project deployed to Vercel (for production testing)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    ⚠️ Important Notes:
                  </h3>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Test with small images first (under 10MB)</li>
                    <li>• Supported formats: JPG, PNG, GIF, WebP</li>
                    <li>• Images are stored in the <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">car-images/</code> folder</li>
                    <li>• Each upload gets a unique random suffix</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Component */}
        <BlobTest />
      </div>
    </div>
  )
}
