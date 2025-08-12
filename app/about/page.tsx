import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutContent } from "@/components/about-content"

import { Metadata } from 'next'

// Optimize caching and performance
export const revalidate = 3600 // 1 hour
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'About Us - AM Tycoons Inc',
  description: 'Learn about AM Tycoons Inc, your trusted partner for quality pre-owned vehicles since 2009. 15+ years of excellence serving Southern California.',
  keywords: 'about AM Tycoons, used car dealership, pre-owned vehicles, Southern California, 15 years experience',
  openGraph: {
    title: 'About AM Tycoons Inc - 15+ Years of Excellence',
    description: 'Your trusted partner for quality pre-owned vehicles since 2009',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <AboutContent />
      <Footer />
    </div>
  )
}

