"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Link, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Image as ImageIcon
} from "lucide-react"
import { toast } from "sonner"

export function CloudinaryInstructions() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const steps = [
    {
      number: 1,
      title: "Upload to Cloudinary",
      description: "Go to your Cloudinary dashboard and upload your car images",
      action: "Visit Cloudinary",
      url: "https://cloudinary.com/console",
      icon: Upload
    },
    {
      number: 2,
      title: "Copy Image URL",
      description: "After upload, copy the secure URL from the Cloudinary dashboard",
      action: "Copy Example URL",
      text: "https://res.cloudinary.com/doifsytuh/image/upload/v1234567890/car-images/your-image.jpg",
      icon: Link
    },
    {
      number: 3,
      title: "Paste in Admin Portal",
      description: "Paste the URL in the image URL field in the car form",
      action: "Copy Placeholder",
      text: "https://res.cloudinary.com/doifsytuh/image/upload/v1234567890/car-images/your-image.jpg",
      icon: ImageIcon
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          How to Add Car Images with Cloudinary
        </CardTitle>
        <CardDescription>
          Follow these steps to add images to your car listings using Cloudinary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="flex-shrink-0">
              <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                {step.number}
              </Badge>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <step.icon className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">{step.title}</h4>
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
              {step.url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(step.url, '_blank')}
                  className="flex items-center gap-2"
                >
                  {step.action}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
              {step.text && (
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 overflow-x-auto">
                    {step.text}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(step.text!, step.number)}
                    className="flex items-center gap-1"
                  >
                    {copiedStep === step.number ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Important Notes:</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Use the "Secure URL" from Cloudinary (starts with https://)</li>
                <li>• Images will be automatically optimized and resized</li>
                <li>• You can add up to 10 images per car</li>
                <li>• Supported formats: JPG, PNG, GIF, WebP</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 