"use client"; // <-- ADD THIS LINE
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
export function Footer() {
const phoneNumbers = [
"+1 424-303-0386",
"+1 310-972-0341",
"+1 310-350-7709",
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
<div className="container mx-auto px-4 py-12">
<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
{/* Company Info */}
<div>
<Image
src="/AMTycons_logo_transparent.png"
alt="AM Tycoons Inc Logo"
width={150}
height={60}
className="h-12 w-auto mb-4 dark:brightness-0 dark:invert"
/>
<p className="text-gray-300">
Your trusted partner in finding the perfect pre-owned vehicle.
</p>
</div>

{/* Contact Info */}
<div>
<h3 className="text-lg font-semibold mb-4">Contact Us</h3>
<div className="space-y-2">
{phoneNumbers.map((number, index) => (
<div key={index} className="flex items-center space-x-2">
<Phone className="h-4 w-4" />
<button
onClick={() => handleCall(number)}
className="text-gray-300 hover:text-white transition-colors"
>
{number}
</button>
<button
onClick={() => handleWhatsApp(number)}
className="ml-2 text-green-400 hover:text-green-300 transition-colors"
>
<MessageCircle className="h-4 w-4" />
</button>
</div>
))}
</div>
</div>

{/* Quick Links */}
<div>
<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
<ul className="space-y-2">
<li>
<Link href="/" className="text-gray-300 hover:text-white transition-colors">
Home
</Link>
</li>
<li>
<Link href="/browse" className="text-gray-300 hover:text-white transition-colors">
Browse Cars
</Link>
</li>
<li>
<Link href="/about" className="text-gray-300 hover:text-white transition-colors">
About Us
</Link>
</li>
<li>
<Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
Contact
</Link>
</li>
</ul>
</div>

{/* Business Hours */}
<div>
<h3 className="text-lg font-semibold mb-4">Business Hours</h3>
<div className="space-y-2 text-gray-300">
<p>Monday - Friday: 9:00 AM - 7:00 PM</p>
<p>Saturday: 9:00 AM - 6:00 PM</p>
<p>Sunday: 10:00 AM - 5:00 PM</p>
</div>
</div>
</div>

{/* Bottom Bar */}
<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
<p>&copy; 2024 AM Tycoons Inc. All rights reserved.</p>
</div>
</div>
</footer>
);
}
