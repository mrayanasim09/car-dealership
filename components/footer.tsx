"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, MessageCircle, Clock, Mail } from "lucide-react";

export function Footer() {
  const phoneNumbers = [
    "+1 424-303-0386",
    "+1 310-350-7709",
    "+1 310-972-0341",
    "+1 310-904-8377"
  ];

  const handleCall = (number: string) => {
    window.location.href = `tel:${number.replace(/\s/g, '')}`;
  };

  const handleWhatsApp = (number: string) => {
    const message = "Hi! I'm interested in your vehicles. Can you help me?";
    window.open(`https://wa.me/${number.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Mobile-First Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Company Info - Full Width on Mobile */}
          <div className="lg:col-span-1 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start mb-6">
              <div className="relative mb-4">
                {/* Logo Image - Same as navbar for consistency */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative w-20 h-16 md:w-16 md:h-12">
                    <Image
                      src="/AMTycons_logo_transparent.png"
                      alt="AM Tycoons Inc. Logo"
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 80px, 64px"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xl md:text-lg font-bold text-white">AM TYCOONS INC.</div>
                    <div className="text-sm md:text-xs text-gray-300">FIND YOUR PERFECT DRIVE</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm md:text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              Your trusted partner in finding the perfect pre-owned vehicle. 
              Quality cars, transparent pricing, exceptional service.
            </p>
          </div>

          {/* Contact Info - Mobile Optimized */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">Call Us</h3>
            <div className="space-y-3">
              {phoneNumbers.map((number, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <button
                      onClick={() => handleCall(number)}
                      className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                    >
                      {number}
                    </button>
                  </div>
                  <button
                    onClick={() => handleWhatsApp(number)}
                    className="text-green-400 hover:text-green-300 transition-colors flex items-center space-x-1"
                    aria-label={`WhatsApp ${number}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">WhatsApp</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Address Info - Mobile Optimized */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">Our Location</h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center md:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                <MapPin className="h-4 w-4 text-red-400 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p className="font-semibold text-white">AM Tycoons Inc</p>
                  <p>12440 Firestone Blvd, Suite 3025D</p>
                  <p>Norwalk, CA 90650</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center md:items-start space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                <Mail className="h-4 w-4 text-red-400 flex-shrink-0" />
                <a
                  href="mailto:info@amtycoons.com"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  info@amtycoons.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links - Mobile Optimized */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm block py-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-gray-300 hover:text-white transition-colors text-sm block py-1">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm block py-1">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours - Mobile Optimized */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">Business Hours</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex flex-col sm:flex-row items-center md:items-start space-y-2 sm:space-y-0 sm:space-x-2">
                <Clock className="h-4 w-4 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Monday - Friday</p>
                  <p>9:00 AM - 7:00 PM</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center md:items-start space-y-2 sm:space-y-0 sm:space-x-2">
                <Clock className="h-4 w-4 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Saturday</p>
                  <p>9:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center md:items-start space-y-2 sm:space-y-0 sm:space-x-2">
                <Clock className="h-4 w-4 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Sunday</p>
                  <p>10:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Mobile Optimized */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            &copy; 2024 AM Tycoons Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
