"use client"

import { Phone, MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import { CONTACT_NUMBERS } from "@/lib/config/contact"

export function StickyContactBar() {
  const contacts: { n: string; l: string }[] = CONTACT_NUMBERS.map(c => ({ n: c.e164, l: c.label }))

  const call = (num: string) => {
    window.location.href = `tel:${num}`
  }

  const sms = (num: string) => {
    window.location.href = `sms:${num}`
  }

  // Hide on car detail pages (prevent overlap with floating CTA)
  const pathname = usePathname()
  const isCarDetail = pathname?.startsWith('/car/')
  if (isCarDetail) return null

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-5xl mx-auto px-4 py-2 space-y-2">
        {contacts.map(({ n, l }) => (
          <div key={n} className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <Phone className="h-4 w-4 text-red-600" aria-hidden="true" />
              <button
                onClick={() => call(n)}
                aria-label={`Call ${l}`}
                className="text-foreground truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded"
              >
                {l}
              </button>
            </div>
            <div className="flex gap-2 w-full xs:w-auto justify-start xs:justify-end">
              <button
                onClick={() => call(n)}
                aria-label={`Call ${l}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <Phone className="h-4 w-4" />
                <span className="text-xs font-medium">Call</span>
              </button>
              <button
                onClick={() => sms(n)}
                aria-label={`SMS ${l}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-foreground min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs font-medium">SMS</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


