"use client"

import { MessageCircle, Phone, MessageSquare } from "lucide-react"
import { useState } from "react"

export function WhatsAppButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  
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
    const message = encodeURIComponent("Hi! I'm interested in your car inventory. Can you help me find the perfect vehicle?")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded buttons */}
      <div className={`flex flex-col space-y-2 mb-3 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {phoneNumbers.map((phone, index) => (
          <div key={index} className="flex flex-col space-y-1">
            <button
              onClick={() => handlePhoneCall(phone.number)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs"
              title={`Call ${phone.label}`}
            >
              <Phone className="h-4 w-4 mr-1" />
              <span className="font-medium">Call {phone.label.split('-')[2]}</span>
            </button>
            
            <button
              onClick={() => handleSMS(phone.number)}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs"
              title={`SMS ${phone.label}`}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="font-medium">SMS {phone.label.split('-')[2]}</span>
            </button>
            
            <button
              onClick={() => handleWhatsApp(phone.number)}
              className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs"
              title={`WhatsApp ${phone.label}`}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="font-medium">WhatsApp {phone.label.split('-')[2]}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Main toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
          isExpanded ? 'rotate-45' : ''
        }`}
        aria-label="Toggle contact options"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  )
}

