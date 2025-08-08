"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { addCar, updateCar } from "@/lib/firebase"
import type { Car } from "@/lib/types"
import { toast } from "sonner"
import { Loader2, Plus, X } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().min(0),
  price: z.number().min(0),
  location: z.string().min(1, "Location is required"),
  vin: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  whatsapp: z.string().optional(),
  engine: z.string().optional(),
  transmission: z.string().optional(),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  driveType: z.string().optional(),
  fuelType: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  features: z.string().optional(),
  documents: z.string().optional(),
  approved: z.boolean().default(true),
  isInventory: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>

interface CarFormProps {
  car?: Car
  onSuccess?: () => void
  onCancel?: () => void
}

export function CarForm({ car, onSuccess, onCancel }: CarFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(car?.images || [])
  const [manualUrls, setManualUrls] = useState<string[]>([])
  const [newManualUrl, setNewManualUrl] = useState("")

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: car?.title || "",
      make: car?.make || "",
      model: car?.model || "",
      year: car?.year || new Date().getFullYear(),
      mileage: car?.mileage || 0,
      price: car?.price || 0,
      location: car?.location || "",
      vin: car?.vin || "",
      phone: car?.contact?.phone || "",
      whatsapp: car?.contact?.whatsapp || "",
      engine: car?.engine || "",
      transmission: car?.transmission || "",
      exteriorColor: car?.exteriorColor || "",
      interiorColor: car?.interiorColor || "",
      driveType: car?.driveType || "",
      fuelType: car?.fuelType || "",
      description: car?.description || "",
      features: car?.features?.join("\n") || "",
      documents: car?.documents?.map(d => `${d.name},${d.url}`).join("\n") || "",
      approved: car?.approved ?? true,
      isInventory: car?.isInventory ?? true,
      isFeatured: car?.isFeatured ?? false,
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // Combine uploaded images with manual URLs
      const allImages = [...imageUrls, ...manualUrls].filter(Boolean)
      
      // Parse features
      const features = data.features
        ? data.features.split("\n").filter(f => f.trim())
        : []

      // Parse documents
      const documents = data.documents
        ? data.documents.split("\n")
            .filter(d => d.trim())
            .map(d => {
              const [name, url] = d.split(",").map(s => s.trim())
              return { name, url }
            })
        : []

      const carData = {
        ...data,
        images: allImages,
        features,
        documents,
        contact: {
          phone: data.phone,
          whatsapp: data.whatsapp || data.phone,
        },
        rating: car?.rating || 0,
        reviews: car?.reviews || [],
        listedAt: car?.listedAt || new Date(),
        createdAt: car?.createdAt || new Date(),
      }

      if (car) {
        await updateCar(car.id, carData)
        toast.success("Car updated successfully!")
      } else {
        await addCar(carData)
        toast.success("Car added successfully!")
      }

      onSuccess?.()
    } catch (error) {
      console.error("Error saving car:", error)
      toast.error("Failed to save car. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addManualUrl = () => {
    if (newManualUrl.trim() && !manualUrls.includes(newManualUrl.trim())) {
      setManualUrls([...manualUrls, newManualUrl.trim()])
      setNewManualUrl("")
    }
  }

  const removeManualUrl = (url: string) => {
    setManualUrls(manualUrls.filter(u => u !== url))
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., 2023 Honda Civic Sport"
              />
              {form.formState.errors.title && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="location" className="text-gray-300">Location</Label>
              <Input
                id="location"
                {...form.register("location")}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., Los Angeles, CA"
              />
              {form.formState.errors.location && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.location.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="make" className="text-gray-300">Make</Label>
              <Input
                id="make"
                {...form.register("make")}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., Honda"
              />
              {form.formState.errors.make && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.make.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="model" className="text-gray-300">Model</Label>
              <Input
                id="model"
                {...form.register("model")}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., Civic"
              />
              {form.formState.errors.model && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.model.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="year" className="text-gray-300">Year</Label>
              <Input
                id="year"
                type="number"
                {...form.register("year", { valueAsNumber: true })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="2023"
              />
              {form.formState.errors.year && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.year.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="mileage" className="text-gray-300">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                {...form.register("mileage", { valueAsNumber: true })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="50000"
              />
              {form.formState.errors.mileage && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.mileage.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-gray-300">Price ($)</Label>
              <Input
                id="price"
                type="number"
                {...form.register("price", { valueAsNumber: true })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="25000"
              />
              {form.formState.errors.price && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.price.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="vin" className="text-gray-300">VIN (Optional)</Label>
              <Input
                id="vin"
                {...form.register("vin")}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="1G1AP5G29J4000001"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone</Label>
              <Input
                id="phone"
                {...form.register("phone")}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="+1 (555) 123-4567"
              />
              {form.formState.errors.phone && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="whatsapp" className="text-gray-300">WhatsApp (Optional)</Label>
              <Input
                id="whatsapp"
                {...form.register("whatsapp")}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="engine" className="text-gray-300">Engine (Optional)</Label>
              <Input
                id="engine"
                {...form.register("engine")}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="2.0L I4 Turbo"
              />
            </div>
            <div>
              <Label htmlFor="transmission" className="text-gray-300">Transmission (Optional)</Label>
              <Select onValueChange={(value) => form.setValue("transmission", value)} defaultValue={form.getValues("transmission")}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exteriorColor" className="text-gray-300">Exterior Color (Optional)</Label>
              <Input
                id="exteriorColor"
                {...form.register("exteriorColor")}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Black"
              />
            </div>
            <div>
              <Label htmlFor="interiorColor" className="text-gray-300">Interior Color (Optional)</Label>
              <Input
                id="interiorColor"
                {...form.register("interiorColor")}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Black"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="driveType" className="text-gray-300">Drive Type (Optional)</Label>
              <Select onValueChange={(value) => form.setValue("driveType", value)} defaultValue={form.getValues("driveType")}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select drive type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="FWD">Front-Wheel Drive</SelectItem>
                  <SelectItem value="RWD">Rear-Wheel Drive</SelectItem>
                  <SelectItem value="AWD">All-Wheel Drive</SelectItem>
                  <SelectItem value="4WD">Four-Wheel Drive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fuelType" className="text-gray-300">Fuel Type (Optional)</Label>
              <Select onValueChange={(value) => form.setValue("fuelType", value)} defaultValue={form.getValues("fuelType")}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="Gasoline">Gasoline</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description & Features */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Description & Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Enter detailed car description..."
              rows={4}
            />
            {form.formState.errors.description && (
              <p className="text-red-400 text-sm mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="features" className="text-gray-300">Features (Optional)</Label>
            <Textarea
              id="features"
              {...form.register("features")}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Enter each feature on a new line. Example:&#10;Bluetooth Connectivity&#10;Backup Camera&#10;Heated Seats&#10;Sunroof"
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="documents" className="text-gray-300">Documents (Optional)</Label>
            <Textarea
              id="documents"
              {...form.register("documents")}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Enter each document as `name,url` on a new line. Example:&#10;Carfax Report,https://example.com/carfax.pdf&#10;Service History,https://example.com/service.pdf"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Car Images */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Car Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload
            onImagesUploaded={setImageUrls}
            existingImages={car?.images || []}
          />
          
          {/* Manual URL Input */}
          <div className="space-y-3">
            <Label className="text-gray-300">Add Image URLs (Optional)</Label>
            <div className="flex gap-2">
              <Input
                value={newManualUrl}
                onChange={(e) => setNewManualUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
                className="bg-gray-700 border-gray-600 text-white flex-1"
              />
              <Button
                type="button"
                onClick={addManualUrl}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Display manual URLs */}
            {manualUrls.length > 0 && (
              <div className="space-y-2">
                <Label className="text-gray-300">Manual URLs:</Label>
                {manualUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                    <span className="text-gray-300 text-sm flex-1 truncate">{url}</span>
                    <Button
                      type="button"
                      onClick={() => removeManualUrl(url)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="approved"
              checked={form.watch("approved")}
              onCheckedChange={(checked) => form.setValue("approved", checked as boolean)}
            />
            <Label htmlFor="approved" className="text-gray-300">
              Approved
            </Label>
            <Badge variant="outline" className="text-gray-400 border-gray-600">
              Mark car as approved for public display.
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isInventory"
              checked={form.watch("isInventory")}
              onCheckedChange={(checked) => form.setValue("isInventory", checked as boolean)}
            />
            <Label htmlFor="isInventory" className="text-gray-300">
              Show in Inventory
            </Label>
            <Badge variant="outline" className="text-gray-400 border-gray-600">
              Display this car in the main inventory list.
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFeatured"
              checked={form.watch("isFeatured")}
              onCheckedChange={(checked) => form.setValue("isFeatured", checked as boolean)}
            />
            <Label htmlFor="isFeatured" className="text-gray-300">
              Show in Featured Vehicles
            </Label>
            <Badge variant="outline" className="text-gray-400 border-gray-600">
              Highlight this car on the homepage or featured sections.
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {car ? "Update Car" : "Add Car"}
        </Button>
      </div>
    </form>
  )
}
