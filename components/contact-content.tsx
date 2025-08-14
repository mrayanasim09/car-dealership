"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useToast } from "@/components/ui/use-toast"
import { MapPin, Mail, Clock, Send, Car, CreditCard, Wrench, Phone, MessageSquare } from "lucide-react"
import Script from 'next/script'
import { useCspNonce } from '@/hooks/use-csp-nonce'
import { CONTACT_NUMBERS, CONTACT_EMAIL, BUSINESS_NAME, BUSINESS_ADDRESS } from '@/lib/config/contact'

export function ContactContent() {
  const nonce = useCspNonce()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phone === "" || phoneRegex.test(phone.replace(/\s/g, ""))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.phone.trim() && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let recaptchaToken: string | undefined
      try {
        // @ts-expect-error recaptcha global provided by script at runtime
        if (window.grecaptcha && siteKey) {
          // @ts-expect-error recaptcha global provided by script at runtime
          recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'contact_form' })
        }
      } catch {}

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          recaptchaToken,
        })
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Failed to send message')
      }
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      })
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
      setErrors({})
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or call us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      details: [BUSINESS_NAME, BUSINESS_ADDRESS.streetAddress, `${BUSINESS_ADDRESS.addressLocality}, ${BUSINESS_ADDRESS.addressRegion} ${BUSINESS_ADDRESS.postalCode}`],
      action: "Get Directions",
      actionUrl: "https://maps.app.goo.gl/f4gvfxgLNSoqSJAaA",
    },
    // Phone cards replaced by dedicated numbers section below
    {
      icon: Mail,
      title: "Email Us",
      details: [CONTACT_EMAIL, "24/7 Email Support"],
      action: "Send Email",
      actionUrl: `mailto:${CONTACT_EMAIL}`,
    },
    // SMS card replaced by dedicated numbers section below
  ]

  const services = [
    {
      icon: Car,
      title: "Vehicle Sales",
      description: "Browse our extensive inventory of quality pre-owned vehicles.",
    },
    {
      icon: CreditCard,
      title: "Financing",
      description: "Competitive rates and flexible terms to fit your budget.",
    },
    {
      icon: Wrench,
      title: "Service & Maintenance",
      description: "Professional service for all makes and models.",
    },
  ]

  const hours = [
    { day: "Monday - Friday", time: "9:00 AM - 7:00 PM" },
    { day: "Saturday", time: "9:00 AM - 6:00 PM" },
    { day: "Sunday", time: "10:00 AM - 5:00 PM" },
  ]

  return (
    <div className="bg-background text-foreground">
      {siteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="lazyOnload"
          nonce={nonce}
        />
      ) : null}
      {/* Compact Hero */}
      <section className="relative bg-background pt-10 pb-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">Contact Us</h1>
          <p className="text-base md:text-xl mt-2 text-muted-foreground max-w-3xl mx-auto">We&apos;re here to help you find the perfect vehicle and answer any questions you may have.</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-6 md:py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon
              return (
                <Card key={index} className="text-center h-full bg-card border-border">
                  <CardContent className="p-6">
                    <IconComponent className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">{info.title}</h3>
                    <div className="space-y-1 mb-4">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <a
                      href={info.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-primary text-primary-foreground px-4 py-3 rounded hover:bg-primary/90 transition-colors touch-button"
                    >
                      {info.action}
                    </a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Phone Numbers Section - compact on mobile, unchanged on tablet/desktop */}
      <section className="py-6 md:py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">Contact Numbers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Call or text us anytime. We&apos;re here to help you find your perfect vehicle.</p>
          </div>
          {/* Mobile horizontal scroll, grid on md+ */}
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:overflow-visible">
            {CONTACT_NUMBERS.map((phone, index) => (
              <Card key={index} className="bg-card border-border min-w-[220px] snap-center md:min-w-0">
                <CardContent className="p-4 md:p-6 text-center">
                  <p className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">{phone.label}</p>
                  <div className="flex flex-col gap-2 md:flex-row md:gap-2 justify-center items-stretch">
                    <a
                      href={`tel:${phone.e164}`}
                      aria-label={`Call ${phone.label}`}
                      className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 md:px-4 md:py-3 rounded-full font-medium transition-colors touch-button md:flex-1 text-sm md:text-base"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`sms:${phone.e164}`}
                      aria-label={`Text ${phone.label}`}
                      className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 md:px-4 md:py-3 rounded-full font-medium transition-colors touch-button md:flex-1 text-sm md:text-base"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>SMS</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-6 md:py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           className={`bg-background border-border text-foreground placeholder:text-muted-foreground touch-input ${errors.name ? "border-primary" : ""}`}
                          required
                        />
                        {errors.name && (
                          <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                        )}
                      </div>
                      <div>
                         <Label htmlFor="email" className="text-foreground">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           className={`bg-background border-border text-foreground placeholder:text-muted-foreground touch-input ${errors.email ? "border-primary" : ""}`}
                          required
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                           className={`bg-background border-border text-foreground placeholder:text-muted-foreground touch-input ${errors.phone ? "border-primary" : ""}`}
                        />
                        {errors.phone && (
                          <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                      <div>
                         <Label htmlFor="subject" className="text-foreground">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                           className={`bg-background border-border text-foreground placeholder:text-muted-foreground touch-input ${errors.subject ? "border-primary" : ""}`}
                          required
                        />
                        {errors.subject && (
                          <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
                        )}
                      </div>
                    </div>

                    <div>
                       <Label htmlFor="message" className="text-foreground">Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us how we can help you..."
                         className={`bg-background border-border text-foreground placeholder:text-muted-foreground touch-input ${errors.message ? "border-primary" : ""}`}
                        required
                      />
                      {errors.message && (
                        <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                       className="w-full bg-primary hover:bg-primary/90 touch-button text-primary-foreground"
                      size="lg"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                  {siteKey ? (
                    <p className="mt-2 text-xs text-muted-foreground text-center">
                      This site is protected by reCAPTCHA and the Google
                      {' '}<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a>{' '}
                      and
                      {' '}<a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</a>{' '}apply.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            {/* Map & Hours */}
            <div className="space-y-8">
              {/* Map */}
              <div>
                 <h3 className="text-2xl font-bold text-foreground mb-4">Find Us</h3>
                 <Card className="bg-card border-border">
                  <CardContent className="p-0">
                    <div className="relative h-64 md:h-72 bg-card rounded-lg overflow-hidden">
                      <iframe
                        title="Location Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.733727670564!2d-118.088844!3d33.908600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2cfdbf7d3a0a3%3A0x0000000000000000!2s12440%20Firestone%20Blvd%20Suite%203025D%2C%20Norwalk%2C%20CA%2090650!5e0!3m2!1sen!2sus!4v1700000000000"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Business Hours */}
              <div>
                 <h3 className="text-2xl font-bold text-foreground mb-4">Business Hours</h3>
                 <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Clock className="h-5 w-5 mr-2 text-red-500" />
                      Hours of Operation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {hours.map((hour, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="font-medium text-foreground">{hour.day}</span>
                          <span className="text-muted-foreground">{hour.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From sales to service, we&apos;re your one-stop automotive destination.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card key={index} className="text-center bg-card border-border">
                  <CardContent className="p-6">
                    <IconComponent className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
