"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Phone, MessageSquare, MessageCircle, ChevronDown, ChevronUp } from "lucide-react"

interface ContactOption {
  number: string
  label: string
}

interface MultiContactOptionsProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "compact" | "expanded" | "dropdown"
}

const CONTACT_NUMBERS: ContactOption[] = [
  { number: "+14243030386", label: "+1 424-303-0386" },
  { number: "+13103507709", label: "+1 310-350-7709" },
  { number: "+13109720341", label: "+1 310-972-0341" },
  { number: "+13109048377", label: "+1 310-904-8377" }
]

export function MultiContactOptions({ 
  className, 
  size = "md", 
  variant = "compact" 
}: MultiContactOptionsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState(CONTACT_NUMBERS[0])

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`
  }

  const handleSMS = (number: string) => {
    window.location.href = `sms:${number}`
  }

  const handleWhatsApp = (number: string) => {
    const message = "Hi! I'm interested in your vehicles. Can you help me?"
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank")
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-3"
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        <Button
          onClick={() => handleCall(CONTACT_NUMBERS[0].number)}
          className={cn("bg-blue-600 hover:bg-blue-700", sizeClasses[size])}
        >
          <Phone className="h-4 w-4 mr-1" />
          Call
        </Button>
        <Button
          onClick={() => handleSMS(CONTACT_NUMBERS[0].number)}
          className={cn("bg-green-600 hover:bg-green-700", sizeClasses[size])}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          SMS
        </Button>
        <Button
          onClick={() => handleWhatsApp(CONTACT_NUMBERS[0].number)}
          className={cn("bg-emerald-600 hover:bg-emerald-700", sizeClasses[size])}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          WhatsApp
        </Button>
      </div>
    )
  }

  if (variant === "expanded") {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <h4 className="font-semibold text-foreground mb-3">Contact Us</h4>
          <div className="space-y-3">
            {CONTACT_NUMBERS.map((contact, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-3 w-3 text-red-600" />
                  {contact.label}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCall(contact.number)}
                    className="h-8 px-2"
                    aria-label={`Call ${contact.label}`}
                  >
                    Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSMS(contact.number)}
                    className="h-8 px-2"
                    aria-label={`SMS ${contact.label}`}
                  >
                    SMS
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Dropdown variant
  return (
    <div className={cn("relative", className)}>
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        className={cn("w-full justify-between", sizeClasses[size])}
      >
        <span>{selectedNumber.label}</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isExpanded && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-2">
            {CONTACT_NUMBERS.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-accent rounded">
                <button
                  onClick={() => {
                    setSelectedNumber(contact)
                    setIsExpanded(false)
                  }}
                  className="text-sm text-foreground hover:text-primary"
                >
                  {contact.label}
                </button>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCall(contact.number)}
                    className="h-6 w-6 p-0"
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSMS(contact.number)}
                    className="h-6 w-6 p-0"
                  >
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleWhatsApp(contact.number)}
                    className="h-6 w-6 p-0"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

