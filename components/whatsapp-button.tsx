"use client"

import { MessageCircle, Phone, MessageSquare, X } from "lucide-react"
import { useState } from "react"

export function WhatsAppButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const phoneNumbers = [
    { number: "+14243030386", label: "+1 424-303-0386", short: "424" },
    { number: "+13103507709", label: "+1 310-350-7709", short: "310" },
    { number: "+13109720341", label: "+1 310-972-0341", short: "310" },
    { number: "+13109048377", label: "+1 310-904-8377", short: "310" }
  ]

  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const handleSMS = (phoneNumber: string) => {
    window.open(`sms:${phoneNumber}`, '_self')
  }

  const handleWhatsApp = (phoneNumber: string) => {
    const message = encodeURIComponent("Hi! I'm interested in your car inventory. Can you help me find the perfect vehicle?")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6">
      {/* Expanded buttons */}
      <div className={`flex flex-col space-y-2 mb-3 transition-all duration-300 ease-in-out ${
        isExpanded 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}>
        {phoneNumbers.map((phone, index) => (
          <div key={index} className="flex flex-col space-y-1">
            <button
              onClick={() => handlePhoneCall(phone.number)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs font-medium min-w-[120px] md:min-w-[140px]"
              title={`Call ${phone.label}`}
              aria-label={`Call ${phone.label}`}
            >
              <Phone className="h-3 w-3 mr-2 flex-shrink-0 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Call {phone.short}</span>
              <span className="sm:hidden">Call</span>
            </button>
            
            <button
              onClick={() => handleSMS(phone.number)}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs font-medium min-w-[120px] md:min-w-[140px]"
              title={`SMS ${phone.label}`}
              aria-label={`Send SMS to ${phone.label}`}
            >
              <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0 md:h-4 md:w-4" />
              <span className="hidden sm:inline">SMS {phone.short}</span>
              <span className="sm:hidden">SMS</span>
            </button>
            
            <button
              onClick={() => handleWhatsApp(phone.number)}
              className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs font-medium min-w-[120px] md:min-w-[140px]"
              title={`WhatsApp ${phone.label}`}
              aria-label={`Send WhatsApp message to ${phone.label}`}
            >
              <MessageCircle className="h-3 w-3 mr-2 flex-shrink-0 md:h-4 md:w-4" />
              <span className="hidden sm:inline">WhatsApp {phone.short}</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
          </div>
        ))}
      </div>

      {/* Main toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`bg-red-600 hover:bg-red-700 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
          isExpanded ? 'rotate-45 bg-gray-600 hover:bg-gray-700' : ''
        }`}
        aria-label={isExpanded ? "Close contact options" : "Open contact options"}
        title={isExpanded ? "Close contact options" : "Contact us"}
      >
        {isExpanded ? (
          <X className="h-5 w-5 md:h-6 md:w-6" />
        ) : (
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
        )}
      </button>
    </div>
  )
}

