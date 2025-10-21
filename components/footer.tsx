"use client"

import Link from "next/link"
import Image from "next/image"
import { BrandName } from "@/components/brand-name"
import { Phone, MessageCircle } from "lucide-react"
import { Mail, MapPin } from "lucide-react"
import { CONTACT_NUMBERS, CONTACT_EMAIL, BUSINESS_ADDRESS } from "@/lib/config/contact"
 
const phoneNumbers = CONTACT_NUMBERS

export function Footer() {
  return (
    <footer className="bg-background text-foreground border-t border-border" aria-labelledby="site-footer">
      <div className="container mx-auto px-4 py-10">
        <h2 id="site-footer" className="sr-only">Footer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col items-center group" aria-label="AM Tycoons Inc. Home">
              <div className="relative h-48 w-80 mb-2">
                <Image src="/optimized/am-tycoons-logo.webp" alt="AM Tycoons Inc. Logo" fill className="object-contain" sizes="320px" />
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold group-hover:text-primary transition-colors"><BrandName /></div>
                <div className="text-[10px] md:text-base text-muted-foreground">FIND YOUR PERFECT DRIVE</div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in finding the perfect pre-owned vehicle. Quality cars, transparent pricing, exceptional service.
            </p>
          </div>

          {/* Contact & Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-1" aria-hidden="true" />
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium text-foreground">Our Location</div>
                   <div><BrandName className="inline" /></div>
                   <div>{BUSINESS_ADDRESS.streetAddress}</div>
                   <div>{`${BUSINESS_ADDRESS.addressLocality}, ${BUSINESS_ADDRESS.addressRegion} ${BUSINESS_ADDRESS.postalCode}`}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                <a className="text-sm text-muted-foreground hover:text-primary whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded flex items-center" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </div>
            </div>
          </div>

          {/* Quick Links (exclude privacy/terms here as they are in the bottom bar) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-foreground/80 hover:text-primary">Home</Link></li>
              <li><Link href="/about" className="text-foreground/80 hover:text-primary">About Us</Link></li>
              <li><Link href="/listings" className="text-foreground/80 hover:text-primary">Inventory</Link></li>
              <li><Link href="/contact" className="text-foreground/80 hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Hours</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <div>
                <div className="font-medium text-foreground">Monday - Friday</div>
                <div>9:00 AM - 7:00 PM</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Saturday</div>
                <div>9:00 AM - 6:00 PM</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Sunday</div>
                <div>10:00 AM - 5:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-6 pt-6">
          {/* Phone Numbers - Horizontal on larger screens */}
          <div className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
              {phoneNumbers.map(({ e164, label }) => (
                <div key={e164} className="flex flex-wrap items-center gap-2 border border-border rounded-xl p-2.5 bg-card/60">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm font-semibold truncate">{label}</span>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0 w-full sm:w-auto justify-start sm:justify-end">
                    <a
                      href={`tel:${e164}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                      aria-label={`Call ${label}`}
                    >
                      <Phone className="h-4 w-4" />
                      <span className="text-xs font-medium">Call</span>
                    </a>
                    <a
                      href={`sms:${e164}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-accent text-foreground hover:bg-accent/80 transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                      aria-label={`SMS ${label}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">SMS</span>
                    </a>
                    <a
                      href={`https://wa.me/${e164}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-600"
                      aria-label={`WhatsApp ${label}`}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      <span className="text-xs font-medium">WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 <BrandName className="inline" /> All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary">Terms & Conditions</Link>
              <Link href="/sitemap.xml" className="text-muted-foreground hover:text-primary">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
