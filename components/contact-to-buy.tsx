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
    { number: "+13109720341", label: "+1 310-972-0341" }, 
    { number: "+13103507709", label: "+1 310-350-7709" },
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
      `Hi! I'm interested in purchasing the ${car.title} (${car.year}) listed for ${formatPrice(car.price)}. Can we discuss the details?`
    )
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  const handleScheduleViewing = (phoneNumber: string) => {
    const message = encodeURIComponent(
      `Hi! I'd like to schedule a viewing for the ${car.title} (${car.year}). When would be a good time?`
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
    <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
      <CardContent className="p-4 sm:p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
            Ready to Buy This Car?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Contact us directly to purchase or get more information
          </p>
        </div>

        {/* All Phone Numbers */}
        <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Call us 24/7:</p>
          <div className="flex flex-wrap gap-1 sm:gap-2 text-xs">
            {phoneNumbers.map((phone, index) => (
              <span key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                {phone.label}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {/* Contact buttons for each phone number - Mobile Optimized */}
          {phoneNumbers.map((phone, index) => (
            <div key={index} className="grid grid-cols-3 gap-2">
              <Button 
                onClick={() => handlePhoneCall(phone.number)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm py-3 min-h-[44px]"
              >
                <Phone className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Call</span>
                <span className="sm:hidden">📞</span>
              </Button>
              <Button 
                onClick={() => handleSMS(phone.number)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm py-3 min-h-[44px]"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">SMS</span>
                <span className="sm:hidden">💬</span>
              </Button>
              <Button 
                onClick={() => handleWhatsApp(phone.number)}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm py-3 min-h-[44px]"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">WhatsApp</span>
                <span className="sm:hidden">📱</span>
              </Button>
            </div>
          ))}

          <Button 
            onClick={() => handleScheduleViewing(phoneNumbers[0].number)}
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-300 py-3 min-h-[44px]"
          >
            <Calendar className="h-5 w-5 mr-3" />
            Schedule a Viewing
          </Button>

          <Button 
            onClick={() => setIsInterested(!isInterested)}
            variant="ghost"
            className={`w-full transition-all duration-300 min-h-[44px] ${
              isInterested 
                ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20' 
                : 'text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400'
            }`}
          >
            <Heart className={`h-4 w-4 mr-2 ${isInterested ? 'fill-current' : ''}`} />
            {isInterested ? 'Added to Favorites' : 'Save to Favorites'}
          </Button>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 text-center">
            💡 <strong>Quick Response:</strong> We typically respond within 15 minutes during business hours
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

