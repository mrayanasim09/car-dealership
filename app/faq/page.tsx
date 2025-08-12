import React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const faqs = [
  {
    question: "Can I reserve a car before visiting?",
    answer: "Yes, you can reserve a car by contacting us directly."
  },
  {
    question: "Do you offer test drives?",
    answer: "Absolutely! Test drives are available for all vehicles."
  },
  {
    question: "Can I trade in my old car?",
    answer: "Yes, we accept trade-ins and offer competitive valuations."
  },
  {
    question: "Do you provide financing options?",
    answer: "We offer a variety of financing options to suit your needs."
  },
  {
    question: "Are your cars inspected?",
    answer: "All vehicles undergo a comprehensive 150-point inspection."
  },
  {
    question: "Can I see the vehicle history report?",
    answer: "Yes, we provide full vehicle history reports for all cars."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, credit/debit cards, and financing."
  },
  {
    question: "Do you deliver cars?",
    answer: "Yes, we offer delivery options for your convenience."
  },
  {
    question: "What if I'm not satisfied with my purchase?",
    answer: "Customer satisfaction is our priority. Please contact us and we'll make it right."
  }
]

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
