"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Cookie } from 'lucide-react'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('amtycoons-cookie-consent')
    const consentDate = localStorage.getItem('amtycoons-cookie-date')
    
    if (!consent) {
      setIsVisible(true)
    } else if (consent === 'declined' && consentDate) {
      // Show again after 30 days if declined
      const declinedDate = new Date(consentDate)
      const now = new Date()
      const daysSinceDeclined = (now.getTime() - declinedDate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceDeclined >= 30) {
        setIsVisible(true)
      }
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('amtycoons-cookie-consent', 'accepted')
    localStorage.setItem('amtycoons-cookie-date', new Date().toISOString())
    setIsVisible(false)
  }

  const declineCookies = () => {
    localStorage.setItem('amtycoons-cookie-consent', 'declined')
    localStorage.setItem('amtycoons-cookie-date', new Date().toISOString())
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
          <div className="flex items-start gap-3 flex-1 min-w-0 pr-2">
            <Cookie className="h-6 w-6 text-red-600 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                AM Tycoons Inc. Cookie Policy
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-normal break-words max-w-full">
                We use essential cookies for site functionality, analytics to improve your car browsing experience, 
                and marketing cookies to show relevant vehicle offers. Your data helps us provide better service.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full lg:w-auto lg:ml-6 justify-end flex-none">
            <Button
              onClick={acceptCookies}
              size="sm"
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-4 py-3 touch-button"
            >
              Accept All
            </Button>
            <Button
              onClick={declineCookies}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none text-xs px-4 py-3 border-border text-foreground hover:bg-accent touch-button"
            >
              Decline
            </Button>
            <Button
              onClick={declineCookies}
              variant="ghost"
              size="sm"
              className="p-3 text-muted-foreground hover:text-foreground touch-target"
              aria-label="Close cookie notice"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
