"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const phoneNumber = [
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
  const whatsappUrl = `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};


const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AM Tycoons Inc</h3>
            <p className="text-muted-foreground">
              Your trusted partner for finding the perfect vehicle.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-muted-foreground hover:text-primary">
                  Listings
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="text-muted-foreground">
              <p>123 Car Dealer Street</p>
              <p>Cityville, CA 90210</p>
              <p>Email: info@amtycoonsinc.com</p>
              {phoneNumber.map((number, index) => (
                 <div key={index}>
                 <a
                   href="#"
                   onClick={(e) => {
                     e.preventDefault();
                     handleCall(number);
                   }}
                   className="text-gray-400 hover:text-white block"
                 >
                   Phone: {number}
                 </a>
                 <a
                   href="#"
                   onClick={(e) => {
                     e.preventDefault();
                     handleWhatsApp(number);
                   }}
                   className="text-gray-400 hover:text-white block"
                 >
                   WhatsApp: {number}
                 </a>
               </div>
              ))}
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <FaFacebookF size={24} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <FaLinkedinIn size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-muted-foreground">
          <p>&copy; 2023 AM Tycoons Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;