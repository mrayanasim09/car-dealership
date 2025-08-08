"use client";
import { useState } from "react";

const defaultFaqs = [
  {
    question: "What services does AM Tycoons Inc. offer?",
    answer: "We offer a wide range of services including vehicle sales, financing, and professional service & maintenance for all makes and models."
  },
  {
    question: "How can I contact AM Tycoons Inc.?",
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
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center shadow">
            <h3 className="text-2xl font-bold text-red-400 mb-2">Financing Available</h3>
            <p className="text-gray-300 mb-4">We offer flexible financing options with competitive rates to help you drive away in your dream car. Apply online or visit us to learn more!</p>
            <a href="/contact" className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">Get Financing Info</a>
          </div>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {defaultFaqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
              <button
                className="w-full text-left px-6 py-4 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 text-lg font-medium text-white transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                aria-expanded={openIndex === idx}
              >
                {faq.question}
              </button>
              {openIndex === idx && (
                <div className="px-6 py-4 bg-gray-900 text-gray-300 border-t border-gray-700">
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

