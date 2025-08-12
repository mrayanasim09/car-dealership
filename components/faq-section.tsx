"use client";
import { useState } from "react";
import { BrandName } from "@/components/brand-name";

const defaultFaqs = [
  {
    question: <span>What services does <BrandName className="inline" /> offer?</span>,
    answer: "We offer a wide range of services including vehicle sales, financing, and professional service & maintenance for all makes and models."
  },
  {
    question: <span>How can I contact <BrandName className="inline" />?</span>,
    answer: "You can contact us via phone, email, WhatsApp, or by visiting our showroom. All contact details are available on our Contact page."
  },
  {
    question: "What are your business hours?",
    answer: "Monday to Friday: 9:00 AM - 7:00 PM, Saturday: 9:00 AM - 6:00 PM, Sunday: 10:00 AM - 5:00 PM."
  },
  {
    question: "Do you offer financing options?",
    answer: "Yes, we offer competitive rates and flexible terms to fit your budget."
  },
  {
    question: "Can I schedule a test drive?",
    answer: "Absolutely! Contact us to schedule a test drive at your convenience."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <h3 className="text-2xl font-bold text-primary mb-2">Financing Available</h3>
          <p className="text-muted-foreground">We offer flexible financing options with competitive rates to help you drive away in your dream car.</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {defaultFaqs.map((faq, idx) => (
            <div key={idx} className="border border-border rounded-lg overflow-hidden bg-card">
              <button
                className="w-full text-left px-6 py-4 bg-card hover:bg-accent focus:outline-none focus:bg-accent text-lg font-medium text-foreground transition-colors touch-button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                aria-expanded={openIndex === idx}
              >
                {faq.question}
              </button>
              {openIndex === idx && (
                <div className="px-6 py-4 bg-muted text-muted-foreground border-t border-border">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

