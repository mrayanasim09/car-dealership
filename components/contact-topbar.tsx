"use client"

import { Phone, MessageSquare } from "lucide-react"
import { CONTACT_NUMBERS } from "@/lib/config/contact"

type TopContact = { n: string; l: string }
const CONTACTS: TopContact[] = CONTACT_NUMBERS.map(c => ({ n: c.e164, l: c.label }))

export function ContactTopbar() {
  return (
    <div className="hidden md:block border-t border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 py-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CONTACTS.map(({ n, l }) => (
            <div key={n} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <a href={`tel:${n}`} aria-label={`Call ${l}`} className="text-primary hover:opacity-80">
                  <Phone className="h-4 w-4" />
                </a>
                <a href={`tel:${n}`} className="text-foreground hover:text-primary">
                  {l}
                </a>
              </div>
              <a href={`sms:${n}`} className="text-primary font-medium flex items-center gap-1" aria-label={`SMS ${l}`}>
                <MessageSquare className="h-4 w-4" />
                <span>SMS</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


