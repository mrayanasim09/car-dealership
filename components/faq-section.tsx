"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const faqs = [
  {
    question: "Can I reserve a car before visiting?",
    answer: "Yes! You can reserve any vehicle by calling us or sending a WhatsApp message. We'll hold the car for 24 hours while you arrange your visit. A small refundable deposit may be required for high-demand vehicles."
  },
  {
    question: "Do you offer test drives?",
    answer: "Absolutely! We encourage test drives for all our vehicles. Just bring a valid driver's license and we'll get you behind the wheel. Test drives are available during business hours and can be scheduled in advance."
  },
  {
    question: "Can I trade in my old car?",
    answer: "Yes, we accept trade-ins! We'll evaluate your current vehicle and provide a fair market value that can be applied toward your purchase. Our team will inspect your car and give you an instant quote."
  },
  {
    question: "Do you provide financing options?",
    answer: "We work with multiple financing partners to help you get the best rates. Whether you have excellent credit or are rebuilding your credit history, we'll help you find a financing solution that works for your budget."
  },
  {
    question: "Are your cars inspected?",
    answer: "Every vehicle undergoes a comprehensive multi-point inspection before being listed. We provide detailed inspection reports and vehicle history for complete transparency. All cars come with our quality guarantee."
  },
  {
    question: "Can I see the vehicle history report?",
    answer: "Absolutely! We provide complete vehicle history reports for all our cars. This includes accident history, service records, previous ownership, and more. Transparency is important to us."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, certified checks, bank transfers, and financing through our approved lenders. For your security, we don't accept personal checks for vehicle purchases."
  },
  {
    question: "Do you deliver cars?",
    answer: "Yes, we offer delivery services within the Los Angeles area for a small fee. For customers outside our delivery zone, we can help arrange transportation or you can pick up the vehicle at our location."
  },
  {
    question: "What if I'm not satisfied with my purchase?",
    answer: "Customer satisfaction is our priority. While all sales are final, we stand behind our vehicles. If you experience any issues covered under warranty, we'll work with you to resolve them quickly."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Got questions? We've got answers! Here are the most common questions our customers ask.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-red-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still have questions? We're here to help 24/7!
          </p>
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Call us:</span>
              <a href="tel:+14243030386" className="text-red-600 hover:text-red-700">+1 424-303-0386</a>
              <span>•</span>
              <a href="tel:+13109720341" className="text-red-600 hover:text-red-700">+1 310-972-0341</a>
              <span>•</span>
              <a href="tel:+13103507709" className="text-red-600 hover:text-red-700">+1 310-350-7709</a>
              <span>•</span>
              <a href="tel:+13109048377" className="text-red-600 hover:text-red-700">+1 310-904-8377</a>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+14243030386"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Call Primary: +1 424-303-0386
              </a>
              <a
                href="https://wa.me/14243030386"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

