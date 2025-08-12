"use client"

import { Phone, MessageCircle, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandName } from "@/components/brand-name"

export function ContactMethods() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Call",
      description: "Speak directly with our team",
      action: "Call Now",
      href: "tel:+1234567890",
      color: "bg-green-600 hover:bg-green-700",
      iconColor: "text-green-600"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      description: "Quick chat and support",
      action: "WhatsApp",
      href: "https://wa.me/1234567890",
      color: "bg-green-500 hover:bg-green-600",
      iconColor: "text-green-500"
    },
    {
      icon: MessageCircle,
      title: "SMS",
      description: "Send us a text message",
      action: "Send SMS",
      href: "sms:+1234567890",
      color: "bg-blue-600 hover:bg-blue-700",
      iconColor: "text-blue-600"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Send us an email",
      action: "Send Email",
      href: "mailto:info@amtycoons.com",
      color: "bg-red-600 hover:bg-red-700",
      iconColor: "text-red-600"
    }
  ]

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Contact <BrandName className="inline" />
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your preferred way to get in touch with us. We&apos;re here to help you find your perfect vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {contactMethods.map((method, index) => (
            <div 
              key={index} 
              className="bg-card rounded-lg p-6 border border-border hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className={`w-8 h-8 ${method.iconColor}`} />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {method.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {method.description}
                </p>
                
                <Button 
                  asChild 
                  className={`w-full ${method.color} text-white touch-button`}
                  size="lg"
                >
                  <a href={method.href} target="_blank" rel="noopener noreferrer">
                    {method.action}
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Contact Info */}
        <div className="mt-12 text-center">
          <div className="bg-red-600 text-white rounded-lg p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              Business Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
              <div>
                <p className="font-semibold">Monday - Friday</p>
                <p>9:00 AM - 6:00 PM</p>
              </div>
              <div>
                <p className="font-semibold">Saturday</p>
                <p>10:00 AM - 4:00 PM</p>
              </div>
            </div>
            <p className="mt-4 text-red-100">
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
