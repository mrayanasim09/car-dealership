// app/page.tsx

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandName } from "@/components/brand-name"
// CSS animation utilities are used to avoid client boundary issues
import { FeaturedCarsSSR } from "@/components/featured-cars-ssr"
import Link from "next/link"
import { Button } from "@/components/ui/button"
// import Image from "next/image"


// Client enhancer is disabled; using SSR FeaturedCars for SEO and simplicity



export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section - tighter mobile spacing */}
      <section className="relative hero-gradient text-primary-foreground py-6 md:py-8 lg:py-12 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 lg:mb-6 leading-tight">
              Welcome to <BrandName className="inline" />
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 md:mb-6 lg:mb-8 text-red-100 max-w-3xl mx-auto px-4">
              Discover premium pre-owned vehicles, quality cars, competitive prices, exceptional service, and easy financing—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <div>
              <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100 active:scale-95 transition-transform text-base sm:text-lg px-6 md:px-8 py-3 touch-button">
                <Link href="/inventory">
                  Browse Inventory
                </Link>
              </Button>
              </div>
              <div>
              <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100 active:scale-95 transition-transform text-base sm:text-lg px-6 md:px-8 py-3 touch-button">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - tighter mobile spacing */}
      <section className="py-6 md:py-8 lg:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose <BrandName className="inline" />?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide exceptional service and quality vehicles to ensure your complete satisfaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {["Quality Vehicles","Competitive Pricing","Expert Service","Easy Contact"].map((title, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-xl border border-border card-hover">
                <div className="mx-auto mb-4 w-8 h-8 rounded-full bg-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {title === 'Quality Vehicles' && 'Carefully selected pre-owned vehicles with detailed history reports.'}
                  {title === 'Competitive Pricing' && 'Fair and transparent pricing with no hidden fees.'}
                  {title === 'Expert Service' && 'Professional team dedicated to finding your perfect vehicle.'}
                  {title === 'Easy Contact' && 'Multiple ways to reach us: Phone, SMS, WhatsApp, and Email.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars - live data */}
       <section className="py-6 md:py-8 lg:py-12 bg-background">
        <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Featured Vehicles</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Discover our handpicked selection of premium pre-owned vehicles, each thoroughly inspected and ready for your next adventure.</p>
           </div>
          {/* Hybrid: SSR list for SEO; client component will enhance on hydration */}
          <FeaturedCarsSSR />
        </div>
      </section>

      {/* Contact CTA Section - accessible contrast */}
      <section className="py-6 md:py-8 lg:py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Vehicle?
          </h2>
          <p className="max-w-2xl mx-auto mb-6 md:mb-8">
            Contact us today to discuss your needs and schedule a viewing. Our team is here to help you find the perfect vehicle.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-accent px-8 py-3 touch-button focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-foreground">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-accent px-8 py-3 touch-button focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-foreground">
              <Link href="/inventory">
                Browse Inventory
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}