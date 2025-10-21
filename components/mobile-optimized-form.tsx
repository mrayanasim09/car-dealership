"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, User, Car, MessageSquare, Send } from "lucide-react"

interface MobileOptimizedFormProps {
  className?: string
  onSubmit?: (data: FormData) => void
  variant?: "contact" | "inquiry" | "test-drive"
}

interface FormData {
  name: string
  email: string
  phone: string
  message: string
  preferredContact: string
  vehicleInterest?: string
  testDriveDate?: string
  agreeToTerms: boolean
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
  preferredContact?: string
  vehicleInterest?: string
  testDriveDate?: string
  agreeToTerms?: string
}

export function MobileOptimizedForm({ 
  className = "",
  onSubmit,
  variant = "contact"
}: MobileOptimizedFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredContact: "phone",
    vehicleInterest: "",
    testDriveDate: "",
    agreeToTerms: false
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.message.trim()) newErrors.message = "Message is required"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit?.(formData)
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        preferredContact: "phone",
        vehicleInterest: "",
        testDriveDate: "",
        agreeToTerms: false
      })
      setErrors({})
    }
  }

  const getFormTitle = () => {
    switch (variant) {
      case "inquiry": return "Vehicle Inquiry"
      case "test-drive": return "Schedule Test Drive"
      default: return "Contact Us"
    }
  }

  const getFormDescription = () => {
    switch (variant) {
      case "inquiry": return "Tell us about the vehicle you're looking for"
      case "test-drive": return "Book your test drive appointment"
      default: return "Get in touch with our team"
    }
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{getFormTitle()}</h2>
        <p className="text-gray-600">{getFormDescription()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your full name"
            className={`min-h-[48px] text-base ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
            autoComplete="name"
            autoFocus
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email"
            className={`min-h-[48px] text-base ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
            autoComplete="email"
            inputMode="email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Enter your phone number"
            className={`min-h-[48px] text-base ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
            autoComplete="tel"
            inputMode="tel"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        {/* Vehicle Interest (for inquiry/test-drive) */}
        {(variant === "inquiry" || variant === "test-drive") && (
          <div className="space-y-2">
            <Label htmlFor="vehicleInterest" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehicle of Interest
            </Label>
            <Input
              id="vehicleInterest"
              type="text"
              value={formData.vehicleInterest}
              onChange={(e) => handleInputChange("vehicleInterest", e.target.value)}
              placeholder="e.g., Toyota Camry 2020, BMW 3 Series"
              className="min-h-[48px] text-base"
              autoComplete="off"
            />
          </div>
        )}

        {/* Test Drive Date (for test-drive) */}
        {variant === "test-drive" && (
          <div className="space-y-2">
            <Label htmlFor="testDriveDate" className="text-sm font-medium text-gray-700">
              Preferred Test Drive Date
            </Label>
            <Input
              id="testDriveDate"
              type="date"
              value={formData.testDriveDate}
              onChange={(e) => handleInputChange("testDriveDate", e.target.value)}
              className="min-h-[48px] text-base"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}

        {/* Preferred Contact Method */}
        <div className="space-y-2">
          <Label htmlFor="preferredContact" className="text-sm font-medium text-gray-700">
            Preferred Contact Method
          </Label>
          <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange("preferredContact", value)}>
            <SelectTrigger className="min-h-[48px] text-base">
              <SelectValue placeholder="Select contact method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Phone Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Message *
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder={variant === "inquiry" ? "Tell us about the vehicle you&apos;re looking for..." : 
                        variant === "test-drive" ? "Any specific requirements for your test drive?" :
                        "How can we help you today?"}
            className={`min-h-[80px] text-base resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : ''}`}
            rows={4}
          />
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
        </div>

        {/* Terms Agreement */}
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed">
              I agree to the{" "}
              <a href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
              </a>
              *
            </Label>
          </div>
          {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full min-h-[56px] text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          aria-label="Submit form"
        >
          <Send className="mr-2 h-5 w-5" />
          {variant === "inquiry" ? "Send Inquiry" : 
           variant === "test-drive" ? "Schedule Test Drive Today" : 
           "Send Message"}
        </Button>

        {/* Form Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>We&apos;ll respond within 24 hours</p>
          <p className="mt-1">* Required fields</p>
        </div>
      </form>
    </div>
  )
}
