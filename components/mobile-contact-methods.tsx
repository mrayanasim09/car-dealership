"use client"

import { Phone, MessageCircle, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CONTACT_NUMBERS } from "@/lib/config/contact"

interface MobileContactMethodsProps {
  className?: string
  showLabels?: boolean
  variant?: "default" | "compact" | "expanded"
}

export function MobileContactMethods({ 
  className = "",
  showLabels = true,
  variant = "default"
}: MobileContactMethodsProps) {
  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const handleSMS = (phoneNumber: string) => {
    window.open(`sms:${phoneNumber}`, '_self')
  }

  const handleWhatsApp = (phoneNumber: string) => {
    const message = encodeURIComponent("Hi! I'm interested in your car inventory. Can you help me find the perfect vehicle?")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank', 'noopener,noreferrer')
  }

  const handleEmail = () => {
    window.open('mailto:info@amtycoonsinc.com', '_self')
  }

  const handleDirections = () => {
    window.open('https://maps.google.com/?q=AM+Tycoons+Inc+Los+Angeles+CA', '_blank', 'noopener,noreferrer')
  }

  const variantClasses = {
    default: "grid grid-cols-2 gap-3 p-4",
    compact: "flex flex-wrap gap-2 p-2",
    expanded: "grid grid-cols-1 gap-4 p-6"
  }

  const buttonSizes = {
    default: "h-12 px-4 text-sm",
    compact: "h-10 px-3 text-xs",
    expanded: "h-16 px-6 text-base"
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border ${variantClasses[variant]} ${className}`}>
      {/* Phone Call - Primary Action */}
      <Button
        onClick={() => handlePhoneCall(CONTACT_NUMBERS[0].e164)}
        className={`${buttonSizes[variant]} bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 min-h-[44px]`}
        aria-label={`Call ${CONTACT_NUMBERS[0].label}`}
      >
        <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
        {showLabels && "Call Now"}
      </Button>

      {/* WhatsApp - Secondary Action */}
      <Button
        onClick={() => handleWhatsApp(CONTACT_NUMBERS[0].e164)}
        className={`${buttonSizes[variant]} bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 min-h-[44px]`}
        aria-label={`Send WhatsApp message to ${CONTACT_NUMBERS[0].label}`}
      >
        <MessageCircle className="mr-2 h-4 w-4 flex-shrink-0" />
        {showLabels && "WhatsApp"}
      </Button>

      {/* SMS - Alternative Contact */}
      <Button
        onClick={() => handleSMS(CONTACT_NUMBERS[0].e164)}
        className={`${buttonSizes[variant]} bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 min-h-[44px]`}
        aria-label={`Send SMS to ${CONTACT_NUMBERS[0].label}`}
      >
        <MessageCircle className="mr-2 h-4 w-4 flex-shrink-0" />
        {showLabels && "SMS"}
      </Button>

      {/* Email - Additional Contact */}
      <Button
        onClick={handleEmail}
        className={`${buttonSizes[variant]} bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 min-h-[44px]`}
        aria-label="Send email to info@amtycoonsinc.com"
      >
        <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
        {showLabels && "Email"}
      </Button>

      {/* Directions - Location */}
      <Button
        onClick={handleDirections}
        className={`${buttonSizes[variant]} bg-gray-600 hover:bg-gray-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 min-h-[44px]`}
        aria-label="Get directions to AM Tycoons Inc"
      >
        <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
        {showLabels && "Directions"}
      </Button>

      {/* Quick Contact Info */}
      <div className="col-span-2 text-center text-sm text-gray-600 mt-2">
        <p className="font-medium">Available 24/7</p>
        <p className="text-xs">Tap any button above to contact us instantly</p>
      </div>
    </div>
  )
}
