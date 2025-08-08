"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Header */}
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo and Brand Name - Mobile First */}
          <Link href="/" className="flex items-center space-x-3" onClick={closeMenu} aria-label="AM Tycoons Inc. Home">
            <div className="flex items-center space-x-3">
              {/* Logo Image - Larger on Mobile */}
              <div className="relative w-16 h-12 md:w-12 md:h-8">
                <Image
                  src="/AMTycons_logo_transparent.png"
                  alt="AM Tycoons Inc. Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 64px, 48px"
                />
              </div>
              {/* Brand Name - Always Visible */}
              <div className="flex flex-col">
                <div className="text-lg md:text-sm font-bold text-gray-900 dark:text-white">AM TYCOONS INC.</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">FIND YOUR PERFECT DRIVE</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            <Link 
              href="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
              role="menuitem"
              aria-label="Home page"
            >
              Home
            </Link>
            <Link 
              href="/inventory" 
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
              role="menuitem"
              aria-label="Vehicle inventory"
            >
              Inventory
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
              role="menuitem"
              aria-label="About AM Tycoons Inc."
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
              role="menuitem"
              aria-label="Contact us"
            >
              Contact
            </Link>
          </div>

          {/* Right side - Theme toggle and mobile menu button */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Mobile Menu Button - 3 Horizontal Bars */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMenu}
              className="md:hidden p-2 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <div className="flex flex-col space-y-1" aria-hidden="true">
                  <div className="w-6 h-0.5 bg-gray-700 dark:bg-gray-300 rounded"></div>
                  <div className="w-6 h-0.5 bg-gray-700 dark:bg-gray-300 rounded"></div>
                  <div className="w-6 h-0.5 bg-gray-700 dark:bg-gray-300 rounded"></div>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Full Screen Overlay */}
        {isMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" 
            onClick={closeMenu}
            role="presentation"
          >
            <div 
              className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {/* Logo in Mobile Menu */}
                    <div className="relative w-12 h-8">
                      <Image
                        src="/AMTycons_logo_transparent.png"
                        alt="AM Tycoons Inc. Logo"
                        fill
                        className="object-contain"
                        priority
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">AM TYCOONS INC.</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">FIND YOUR PERFECT DRIVE</div>
                    </div>
                  </div>
                  <Button 
                    onClick={closeMenu} 
                    variant="ghost" 
                    size="sm"
                    aria-label="Close navigation menu"
                    className="focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex-1 p-6" role="menu">
                  <div className="space-y-4">
                    <Link 
                      href="/" 
                      className="block px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" 
                      onClick={closeMenu}
                      role="menuitem"
                      aria-label="Home page"
                    >
                      Home
                    </Link>
                    <Link 
                      href="/inventory" 
                      className="block px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" 
                      onClick={closeMenu}
                      role="menuitem"
                      aria-label="Vehicle inventory"
                    >
                      Inventory
                    </Link>
                    <Link 
                      href="/about" 
                      className="block px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" 
                      onClick={closeMenu}
                      role="menuitem"
                      aria-label="About AM Tycoons Inc."
                    >
                      About
                    </Link>
                    <Link 
                      href="/contact" 
                      className="block px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" 
                      onClick={closeMenu}
                      role="menuitem"
                      aria-label="Contact us"
                    >
                      Contact
                    </Link>
                  </div>
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AM Tycoons Inc.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Find Your Perfect Drive
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}