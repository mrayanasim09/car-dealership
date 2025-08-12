"use client"

import { Phone, MessageCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import type { Car } from "@/lib/types"

interface ContactToBuyProps {
  car: Car
  variant?: "card" | "inline" | "floating"
}

export function ContactToBuy({ car, variant = "card" }: ContactToBuyProps) {
  
  // Prefer per-car contact info only. If not provided, hide phone-based CTAs entirely
  const dynamicPhone = car?.contact?.phone && String(car.contact.phone).trim() ? String(car.contact.phone).trim() : null
  const phoneNumbers = dynamicPhone ? [{ number: dynamicPhone, label: dynamicPhone, type: "Listing" }] : []

  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const handleSMS = (phoneNumber: string) => {
    window.open(`sms:${phoneNumber}`, '_self')
  }

  const handleScheduleViewing = (phoneNumber: string) => {
    const message = encodeURIComponent(
      `Hi! I'd like to schedule a viewing for the ${car.title} (${car.year}). When would be a good time?`
    )
    // Use SMS with body prefilled (works on most devices)
    window.open(`sms:${phoneNumber}?&body=${message}`, '_self')
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
        {phoneNumbers.length > 0 ? (
          <>
            <Button 
              onClick={() => handlePhoneCall(phoneNumbers[0].number)}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[44px]"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
            <Button 
              onClick={() => handleSMS(phoneNumbers[0].number)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[44px]"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              SMS
            </Button>
          </>
        ) : (
          <Button asChild className="flex-1 bg-card border border-border hover:bg-accent text-foreground min-h-[44px]">
            <a href="/contact">Contact Us</a>
          </Button>
        )}
      </div>
    )
  }

  if (variant === "floating") {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 z-40 shadow-lg pb-[env(safe-area-inset-bottom)]">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(car.price)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{car.title}</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {phoneNumbers.length > 0 ? (
              <>
                <Button 
                  onClick={() => handlePhoneCall(phoneNumbers[0].number)}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px]"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Call Now</span>
                  <span className="sm:hidden">Call</span>
                </Button>
                <Button 
                  onClick={() => handleSMS(phoneNumbers[0].number)}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px]"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">SMS</span>
                  <span className="sm:hidden">Text</span>
                </Button>
              </>
            ) : (
              <Button asChild className="flex-1 sm:flex-none bg-card border border-border hover:bg-accent text-foreground min-h-[44px]">
                <a href="/contact">Contact Us</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Compact card: remove duplicate phone numbers; keep a single CTA and schedule viewing
  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-4 space-y-3">
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground">Interested in this vehicle?</h3>
          <p className="text-sm text-muted-foreground">Contact us to learn more or schedule a viewing.</p>
          {phoneNumbers.length > 0 && phoneNumbers[0]?.label && (
            <p className="text-sm text-foreground mt-1">Phone: {phoneNumbers[0].label}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {phoneNumbers.length > 0 && (
            <Button 
              onClick={() => handleScheduleViewing(phoneNumbers[0].number)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground touch-button"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Viewing
            </Button>
          )}
          <Button asChild className="w-full bg-card border border-border hover:bg-accent text-foreground touch-button">
            <a href="/contact">Contact Us</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

