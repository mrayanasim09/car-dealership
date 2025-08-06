"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function SearchSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [brand, setBrand] = useState("any")
  const [maxPrice, setMaxPrice] = useState("any")
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (brand !== "any") params.set("brand", brand)
    if (maxPrice !== "any") params.set("maxPrice", maxPrice)

    router.push(`/listings?${params.toString()}`)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Search Our Inventory</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by make, model, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Brand</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Ford">Ford</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Mercedes">Mercedes</SelectItem>
                  <SelectItem value="Audi">Audi</SelectItem>
                </SelectContent>
              </Select>
              <Select value={maxPrice} onValueChange={setMaxPrice}>
                <SelectTrigger>
                  <SelectValue placeholder="Max Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Price</SelectItem>
                  <SelectItem value="15000">Under $15,000</SelectItem>
                  <SelectItem value="25000">Under $25,000</SelectItem>
                  <SelectItem value="35000">Under $35,000</SelectItem>
                  <SelectItem value="50000">Under $50,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} className="w-full mt-4 bg-red-600 hover:bg-red-700" size="lg">
              <Search className="mr-2 h-4 w-4" />
              Search Cars
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
