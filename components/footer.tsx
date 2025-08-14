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
            <Link href="/" className="flex items-center gap-3 group" aria-label="AM Tycoons Inc. Home">
              <div className="relative h-10 w-16">
                <Image src="/optimized/am-tycoons-logo.webp" alt="AM Tycoons Inc. Logo" fill className="object-contain" sizes="64px" />
              </div>
              <div>
                <div className="text-lg font-bold group-hover:text-primary transition-colors"><BrandName /></div>
                <div className="text-xs text-muted-foreground">FIND YOUR PERFECT DRIVE</div>
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
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                <a className="text-sm text-muted-foreground hover:text-primary whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 pt-2">
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
                    </div>
                  </div>
                ))}
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
