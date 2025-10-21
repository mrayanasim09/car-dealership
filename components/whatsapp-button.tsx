"use client"

import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WhatsAppButtonProps {
  phoneNumber: string
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function WhatsAppButton({ 
  phoneNumber, 
  className = "",
  variant = "default",
  size = "md"
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const message = "Hi! I'm interested in learning more about your vehicles."
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-base",
    lg: "h-14 px-6 text-lg"
  }

  const variantClasses = {
    default: "bg-green-600 hover:bg-green-700 text-white border-green-600",
    outline: "bg-transparent hover:bg-green-50 text-green-700 border-green-600 hover:text-green-800",
    ghost: "bg-transparent hover:bg-green-50 text-green-700 hover:text-green-800"
  }

  return (
    <Button
      onClick={handleClick}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className} font-semibold shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95`}
      aria-label={`Contact via WhatsApp at ${phoneNumber}`}
    >
      <Phone className="mr-2 h-4 w-4" data-testid="phone-icon" />
      WhatsApp
    </Button>
  )
}

