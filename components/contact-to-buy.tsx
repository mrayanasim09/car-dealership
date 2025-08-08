"use client"

import { Phone, MessageCircle, Calendar, Heart, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import type { Car } from "@/lib/types"

interface ContactToBuyProps {
  car: Car
  variant?: "card" | "inline" | "floating"
}

export function ContactToBuy({ car, variant = "card" }: ContactToBuyProps) {
  const [isInterested, setIsInterested] = useState(false)
  
  const phoneNumbers = [
    { number: "+14243030386", label: "+1 424-303-0386" },
    { number: "+13103507709", label: "+1 310-350-7709" },
    { number: "+13109720341", label: "+1 310-972-0341" },
    { number: "+13109048377", label: "+1 310-904-8377" }
  ]

  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const handleSMS = (phoneNumber: string) => {
    window.open(`sms:${phoneNumber}`, '_self')
  }

  const handleWhatsApp = (phoneNumber: string) => {
    const message = encodeURIComponent(
      `Hi! I&apos;m interested in purchasing the ${car.title} (${car.year}) listed for ${formatPrice(car.price)}. Can we discuss the details?`
    )
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  const handleScheduleViewing = (phoneNumber: string) => {
    const message = encodeURIComponent(
      `Hi! I&apos;d like to schedule a viewing for the ${car.title} (${car.year}). When would be a good time?`
    )
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (variant === "inline") {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={() => handlePhoneCall(phoneNumbers[0].number)}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[44px]"
        >
          <Phone className="h-4 w-4 mr-2" />
          Call Now
        </Button>
        <Button 
          onClick={() => handleWhatsApp(phoneNumbers[0].number)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[44px]"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
      </div>
    )
  }

  if (variant === "floating") {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 z-40 shadow-lg">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(car.price)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{car.title}</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={() => handlePhoneCall(phoneNumbers[0].number)}
              className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px]"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Call Now</span>
              <span className="sm:hidden">Call</span>
            </Button>
            <Button 
              onClick={() => handleWhatsApp(phoneNumbers[0].number)}
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px]"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">Chat</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Interested in this vehicle?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get in touch with us to learn more or schedule a viewing.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => handlePhoneCall(phoneNumbers[0].number)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call to Buy Now - {phoneNumbers[0].label}
            </Button>
            <Button 
              onClick={() => handleWhatsApp(phoneNumbers[0].number)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>

          {/* Phone Numbers Display */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Contact Numbers:</h4>
            {phoneNumbers.map((phone, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">{phone.label}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handlePhoneCall(phoneNumbers[0].number)}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Call
                  </Button>
                  <Button
                    onClick={() => handleSMS(phoneNumbers[0].number)}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    SMS
                  </Button>
                  <Button
                    onClick={() => handleWhatsApp(phoneNumbers[0].number)}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => handleScheduleViewing(phoneNumbers[0].number)}
              className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Viewing
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

