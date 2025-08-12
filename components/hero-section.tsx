"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BrandName } from "@/components/brand-name"
import { Car, Phone, MessageCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[60vh] md:min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background overflow-hidden">
      {/* Background Image with Mobile Optimization */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/optimized/placeholder.webp"
          alt="Car dealership background"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="absolute inset-0 bg-background/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Main Heading - Mobile First */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 md:mb-4 leading-tight">
            Welcome to <BrandName className="inline" />
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 mb-5 md:mb-6 max-w-3xl mx-auto leading-relaxed">
            Discover premium pre-owned vehicles, quality cars, competitive prices, exceptional service, and easy financing—all in one place.
          </p>

          {/* CTA Buttons - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-5 md:mb-8">
            <Link href="/inventory">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-button"
                aria-label="Browse our vehicle inventory"
              >
                <Car className="w-5 h-5 mr-2" aria-hidden="true" />
                Browse Inventory
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-card text-primary hover:bg-card/90 px-8 py-4 text-lg font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-button"
                aria-label="Contact us for assistance"
              >
                <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Feature Icons - Mobile Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto mb-8 md:mb-12">
            <div className="flex items-center justify-center space-x-3 bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center" aria-hidden="true" />
              <div className="text-left">
                <h3 className="text-primary-foreground font-semibold text-sm md:text-base">Quality Vehicles</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">Thoroughly inspected and certified pre-owned cars</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center" aria-hidden="true" />
              <div className="text-left">
                <h3 className="text-primary-foreground font-semibold text-sm md:text-base">Competitive Pricing</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">Best value for your money with transparent pricing</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center" aria-hidden="true" />
              <div className="text-left">
                <h3 className="text-primary-foreground font-semibold text-sm md:text-base">Expert Service</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">Professional team dedicated to your satisfaction</p>
              </div>
            </div>
          </div>

          {/* Trust Indicators - Mobile Optimized */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-muted-foreground text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2" aria-hidden="true"></div>
              <span>BBB Accredited</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2" aria-hidden="true"></div>
              <span>Financing Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2" aria-hidden="true"></div>
              <span>Free Carfax Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Contact Button - Mobile Optimized */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <Link href="https://wa.me/14243030386?text=Hi! I'm interested in your vehicles. Can you help me?" target="_blank" rel="noopener noreferrer">
          <Button 
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            aria-label="Contact us on WhatsApp"
          >
            <MessageCircle className="w-6 h-6" aria-hidden="true" />
          </Button>
        </Link>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
