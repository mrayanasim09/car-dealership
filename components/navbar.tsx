"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { BrandName } from "@/components/brand-name"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
// ContactTopbar removed per spec

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen((v) => !v)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border" : "bg-background/80 backdrop-blur"
        }`}
        aria-label="Primary"
      >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand */}
          <div className="flex items-center gap-3 flex-1">
            <Link href="/" className="flex items-center gap-3 group" aria-label="AM Tycoons Inc. Home" onClick={closeMenu}>
              <div className="relative h-14 w-24 md:h-16 md:w-28 transition-transform duration-200 group-hover:scale-[1.02]">
                <Image src="/optimized/am-tycoons-logo.png" alt="AM Tycoons Inc. Logo" fill className="object-contain" sizes="(max-width: 768px) 120px, 160px" priority />
              </div>
              {/* Brand text - both mobile and desktop clickable */}
              <div className="leading-tight">
                <div className="text-base md:text-lg font-bold text-foreground tracking-tight"><BrandName /></div>
                <div className="text-[10px] md:text-xs text-muted-foreground">FIND YOUR PERFECT DRIVE</div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/listings" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Inventory
            </Link>
            <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Contact
            </Link>
          </div>

            {/* Theme Toggle only */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-controls="mobile-nav"
              aria-expanded={isMenuOpen}
              className="p-2 text-foreground hover:text-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        {/* Lower contact header removed */}

        {/* Mobile Menu */}
        <Dialog open={isMenuOpen} onOpenChange={(o) => (o ? setIsMenuOpen(true) : setIsMenuOpen(false))}>
          <DialogContent className="p-0 border-0 bg-transparent shadow-none">
            <div id="mobile-nav" className="md:hidden bg-background border-t border-border shadow-lg" aria-label="Mobile navigation">
              <div className="px-4 py-6 space-y-4" tabIndex={-1}>
                <Link href="/" className="block text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={closeMenu}>Home</Link>
                <Link href="/listings" className="block text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={closeMenu}>Inventory</Link>
                <Link href="/about" className="block text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={closeMenu}>About</Link>
                <Link href="/contact" className="block text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={closeMenu}>Contact</Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </nav>
      {/* Spacer to offset fixed header */}
      <div className="h-16 md:h-28" aria-hidden="true" />
    </>
  )
}