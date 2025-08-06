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
window.location.href = tel:${number.replace(/\s/g, '')};
};
const handleWhatsApp = (number: string) => {
const message = "Hi! I'm interested in your vehicles. Can you help me?";
window.open(https://wa.me/${number.replace(/\s/g, '')}?text=${encodeURIComponent(message)}, "_blank");
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
