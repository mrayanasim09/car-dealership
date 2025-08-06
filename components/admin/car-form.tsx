import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  addCar, 
  updateCar,
  getAllCars
} from "@/lib/firebase"
import { ImageUpload } from "@/components/image-upload"
import type { Car } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CarFormProps {
  car?: Car | null;
  onSuccess: (car: Car) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  make: z.string().min(1, { message: "Make is required." }),
  model: z.string().min(1, { message: "Model is required." }),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().min(0),
  price: z.number().min(0),
  location: z.string().min(1, { message: "Location is required." }),
  vin: z.string().optional(),
  phone: z.string().min(1, { message: "Phone is required." }),
  whatsapp: z.string().optional(),
  engine: z.string().optional(),
  transmission: z.string().optional(),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  driveType: z.string().optional(),
  fuelType: z.string().optional(),
  description: z.string().optional(),
  features: z.string().optional(),
  documents: z.string().optional(),
  approved: z.boolean().default(false),
  isInventory: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

type CarFormValues = z.infer<typeof formSchema>

export function CarForm({ car, onSuccess, onCancel }: CarFormProps) {
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(car?.images || [])
  const [similarCars, setSimilarCars] = useState<Car[]>([])
  const [showSimilarCars, setShowSimilarCars] = useState(false)

  const form = useForm<CarFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: car || {
      title: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: 0,
      price: 0,
      location: "",
      phone: "",
      approved: false,
      isInventory: true,
      isFeatured: false,
    },
  })

  useEffect(() => {
    if (car) {
      form.reset({
        ...car,
        year: car.year || new Date().getFullYear(),
        mileage: car.mileage || 0,
        price: car.price || 0,
        // features and documents need to be converted from array to string for textarea
        features: Array.isArray(car.features) ? car.features.join('\n') : car.features || '',
        documents: Array.isArray(car.documents) ? car.documents.join('\n') : car.documents || '',
      })
      setImageUrls(car.images || [])
    }
  }, [car, form])

  const findSimilarCars = async (carData: CarFormValues) => {
    try {
      const allCars = await getAllCars()
      const similar = allCars
        .filter(existingCar => existingCar.id !== car?.id) // Exclude current car if editing
        .map(existingCar => ({
          car: existingCar,
          score: calculateScore(existingCar, carData)
        }))
        .filter(item => item.score > 0.3) // Only show cars with >30% similarity
        .sort((a, b) => b.score - a.score)
        .slice(0, 5) // Top 5 similar cars
        .map(item => item.car)

      setSimilarCars(similar)
      setShowSimilarCars(true)
    } catch (error) {
      console.error("Error finding similar cars:", error)
    }
  }

  const calculateScore = (car: Car, newCar: CarFormValues) => {
    let score = 0
    let totalFactors = 0

    // Same make and model (highest weight)
    if (car.make.toLowerCase() === newCar.make.toLowerCase()) {
      score += 0.4
      totalFactors += 1
    }
    if (car.model.toLowerCase() === newCar.model.toLowerCase()) {
      score += 0.4
      totalFactors += 1
    }

    // Price range (±$5,000)
    const priceDiff = Math.abs(car.price - newCar.price)
    if (priceDiff <= 5000) {
      score += 0.3
      totalFactors += 1
    }

    // Year range (±2 years)
    const yearDiff = Math.abs(car.year - newCar.year)
    if (yearDiff <= 2) {
      score += 0.2
      totalFactors += 1
    }

    // Mileage range (±20,000 miles)
    const mileageDiff = Math.abs(car.mileage - newCar.mileage)
    if (mileageDiff <= 20000) {
      score += 0.1
      totalFactors += 1
    }

    return totalFactors > 0 ? score / totalFactors : 0
  }

  const onSubmit = async (values: CarFormValues) => {
    try {
      setLoading(true)

      const carData = {
        ...values,
        images: imageUrls,
        features: values.features ? values.features.split('\n').filter(f => f.trim()) : [],
        documents: values.documents ? values.documents.split('\n').filter(d => d.trim()) : [],
        views: car?.views || 0,
        contactCount: car?.contactCount || 0,
        createdAt: car?.createdAt || new Date(),
        updatedAt: new Date(),
      }

      let result: Car

      if (car) {
        // Update existing car
        result = await updateCar(car.id, carData)
        toast.success("Car updated successfully!")
      } else {
        // Add new car
        result = await addCar(carData)
        toast.success("Car added successfully!")
        
        // Find similar cars after adding
        await findSimilarCars(values)
      }

      onSuccess(result)
    } catch (error) {
      console.error("Error saving car:", error)
      toast.error("Failed to save car")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2021 Honda Civic Sport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Honda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Civic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="2021" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="50000" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="25000" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Los Angeles, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN</FormLabel>
                  <FormControl>
                    <Input placeholder="VIN number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 555-123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 555-123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="engine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engine</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2.0L 4-Cylinder" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmission</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Automatic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exteriorColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exterior Color</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Black" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interiorColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interior Color</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Gray" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drive Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., FWD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Gasoline" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description and Features */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the car's condition, history, and any notable features..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features (one per line)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Bluetooth
Backup Camera
Heated Seats
..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    List each feature on a separate line
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documents (one per line)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Clean Title
Service Records
..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    List each document on a separate line
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <FormLabel>Images</FormLabel>
            <ImageUpload
              value={imageUrls}
              onChange={setImageUrls}
              onRemove={(url) => setImageUrls(imageUrls.filter((current) => current !== url))}
            />
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <FormLabel>Settings</FormLabel>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="approved"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Approved for public viewing</FormLabel>
                      <FormDescription>
                        Only approved cars will be visible to customers
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured car</FormLabel>
                      <FormDescription>
                        Featured cars will be highlighted on the homepage
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isInventory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Available in inventory</FormLabel>
                      <FormDescription>
                        Mark as available for purchase
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : car ? "Update Car" : "Add Car"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>

      {/* Similar Cars Section */}
      {showSimilarCars && similarCars.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🔍</span>
              Similar Cars Found
            </CardTitle>
            <p className="text-sm text-gray-600">
              These cars are similar to the one you just added. They may compete for the same customers.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarCars.map((car) => (
                <div key={car.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{car.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      Similar
                    </Badge>
                  </div>
                  <p className="text-red-600 font-bold text-sm">{formatPrice(car.price)}</p>
                  <p className="text-gray-500 text-xs">{car.year} • {car.mileage.toLocaleString()} mi</p>
                  <p className="text-gray-500 text-xs">{car.location}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm">Similarity Criteria:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Same or similar make and model</li>
                <li>• Within ±$5,000 price range</li>
                <li>• Within ±2 years of manufacture</li>
                <li>• Within ±20,000 miles</li>
                <li>• Similar features and specifications</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}