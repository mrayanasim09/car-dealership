import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ListingsContent } from "@/components/listings-content"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getAllCars } from "@/lib/firebase/server" // Switched to a server-side fetch

export default async function ListingsPage() {
  const cars = await getAllCars();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Car Inventory
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse our complete selection of quality pre-owned vehicles at AM Tycoons Inc.
        </p>
        <div className="mt-8">
            <ListingsContent initialCars={cars} />
        </div>
      </div>
      
      <Footer />
      <WhatsAppButton />
    </div>
  )
}