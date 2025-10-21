"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'


interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('amtycoons-cookie-consent')
    if (!consent) {
      setShowBanner(true)
    } else {
      try {
        const savedPreferences = JSON.parse(consent)
        setPreferences(savedPreferences)
        applyCookiePreferences(savedPreferences)
      } catch {
        setShowBanner(true)
      }
    }
  }, [])

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Apply analytics cookies
    if (prefs.analytics) {
      // Enable Google Analytics
      if (!window.gtag) {
        const gtagFn = function(...args: unknown[]) {
          // Initialize gtag queue if it doesn't exist
          if (!gtagFn.q) {
            gtagFn.q = []
          }
          gtagFn.q.push(args)
        }
        gtagFn.q = [] as unknown[]
        window.gtag = gtagFn
      }
    } else {
      // Disable Google Analytics
      window.gtag = function() {}
    }

    // Apply marketing cookies
    if (prefs.marketing) {
      // Enable marketing tracking
      localStorage.setItem('amtycoons-marketing-enabled', 'true')
    } else {
      localStorage.removeItem('amtycoons-marketing-enabled')
    }

    // Apply functional cookies
    if (prefs.functional) {
      // Enable enhanced functionality
      localStorage.setItem('amtycoons-functional-enabled', 'true')
    } else {
      localStorage.removeItem('amtycoons-functional-enabled')
    }
  }

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    
    setPreferences(allAccepted)
    localStorage.setItem('amtycoons-cookie-consent', JSON.stringify(allAccepted))
    applyCookiePreferences(allAccepted)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const minimal: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    
    setPreferences(minimal)
    localStorage.setItem('amtycoons-cookie-consent', JSON.stringify(minimal))
    applyCookiePreferences(minimal)
    setShowBanner(false)
  }

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">
              We use cookies to enhance your experience
            </h3>
            <p className="text-sm text-muted-foreground">
              We use cookies and similar technologies to help personalize content, provide social media features, 
              and analyze our traffic. We also share information about your use of our site with our social media, 
              advertising, and analytics partners.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectAll}
            >
              Reject All
            </Button>
            <Button
              size="sm"
              onClick={handleAcceptAll}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
