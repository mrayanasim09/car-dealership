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
import { ImageUpload } from "@/components/image-upload"
import { addCar, updateCar } from "@/lib/firebase"
import type { Car } from "@/lib/types"

interface CarFormProps {
  initialData?: Car | null;
  onSuccess: () => void;
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
  approved: z.boolean().default(true), // Default to true for new cars
  isInventory: z.boolean().default(true), // Default to true for new cars
  isFeatured: z.boolean().default(false),
})

type CarFormValues = z.infer<typeof formSchema>

export function CarForm({ initialData, onSuccess, onCancel }: CarFormProps) {
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || [])

  const form = useForm<CarFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: 0,
      price: 0,
      location: "",
      phone: "",
      approved: true, // Default to true
      isInventory: true, // Default to true
      isFeatured: false,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        year: initialData.year || new Date().getFullYear(),
        mileage: initialData.mileage || 0,
        price: initialData.price || 0,
        // features and documents need to be converted from array to string for textarea
        features: Array.isArray(initialData.features) 
          ? initialData.features.join("\n") 
          : initialData.features || "",
        documents: Array.isArray(initialData.documents) 
          ? initialData.documents.map(doc => `${doc.name},${doc.url}`).join("\n") 
          : initialData.documents || "",
      })
      setImageUrls(initialData.images || [])
    }
  }, [initialData, form])

  const onSubmit = async (values: CarFormValues) => {
    console.log("Form submitted with values:", values)
    setLoading(true)
    try {
      const carData = {
        title: values.title,
        make: values.make,
        model: values.model,
        year: values.year,
        mileage: values.mileage,
        price: values.price,
        location: values.location,
        vin: values.vin || "",
        engine: values.engine || "",
        transmission: values.transmission || "",
        exteriorColor: values.exteriorColor || "",
        interiorColor: values.interiorColor || "",
        driveType: values.driveType || "",
        fuelType: values.fuelType || "",
        description: values.description || "",
        images: imageUrls, // Use the image URLs from Cloudinary
        contact: {
          phone: values.phone || "",
          whatsapp: values.whatsapp || "",
        },
        rating: 0,
        reviews: [],
        approved: values.approved,
        listedAt: new Date(),
        isFeatured: values.isFeatured,
        isInventory: values.isInventory,
        features: values.features ? values.features.split("\n").map(f => f.trim()).filter(f => f) : [],
        documents: values.documents ? values.documents.split("\n").map(d => {
          const parts = d.split(",");
          return { name: parts[0]?.trim() || "", url: parts[1]?.trim() || "" };
        }).filter(d => d.name) : [],
      }

      console.log("Processing clean car data:", carData)

      if (initialData?.id) {
        // Update existing car
        console.log("Updating car with ID:", initialData.id)
        await updateCar(initialData.id, carData)
        toast.success("Car updated successfully!")
      } else {
        // Add new car
        console.log("Adding new car")
        await addCar(carData)
        toast.success("Car added successfully!")
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving car:", error)
      toast.error("Failed to save car. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleImagesUploaded = (urls: string[]) => {
    setImageUrls(urls)
    console.log("Images updated:", urls)
  }

  const handleImageRemove = (imageUrl: string) => {
    // For now, just remove from local state
    // In the future, you might want to delete from Cloudinary as well
    setImageUrls(prev => prev.filter(url => url !== imageUrl))
    console.log("Image removed:", imageUrl)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Information</h3>
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="title">Title</FormLabel>
                <FormControl>
                  <Input 
                    id="title"
                    placeholder="2023 Honda Civic Sport" 
                    {...field} 
                    className="text-gray-900 dark:text-gray-100"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="make">Make</FormLabel>
                  <FormControl>
                    <Input 
                      id="make"
                      placeholder="Honda" 
                      {...field} 
                      className="text-gray-900 dark:text-gray-100"
                      autoComplete="off"
                    />
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
                  <FormLabel htmlFor="model">Model</FormLabel>
                  <FormControl>
                    <Input 
                      id="model"
                      placeholder="Civic" 
                      {...field} 
                      className="text-gray-900 dark:text-gray-100"
                      autoComplete="off"
                    />
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
                  <FormLabel htmlFor="year">Year</FormLabel>
                  <FormControl>
                    <Input 
                      id="year"
                      type="number" 
                      placeholder="2023" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                      className="text-gray-900 dark:text-gray-100"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="mileage">Mileage</FormLabel>
                  <FormControl>
                    <Input 
                      id="mileage"
                      type="number" 
                      placeholder="15000" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                      className="text-gray-900 dark:text-gray-100"
                      autoComplete="off"
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
                  <FormLabel htmlFor="price">Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      id="price"
                      type="number" 
                      placeholder="25000" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                      className="text-gray-900 dark:text-gray-100"
                      autoComplete="off"
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
                  <FormLabel htmlFor="location">Location</FormLabel>
                  <FormControl>
                    <Input 
                      id="location"
                      placeholder="Los Angeles, CA" 
                      {...field} 
                      className="text-gray-900 dark:text-gray-100"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="vin">VIN (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      id="vin"
                      placeholder="1G1AP5G29J4000001" 
                      {...field} 
                      className="text-gray-900 dark:text-gray-100"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <FormControl>
                    <Input 
                      id="phone"
                      placeholder="+1 (555) 123-4567" 
                      {...field} 
                      className="text-gray-900 dark:text-gray-100"
                      autoComplete="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="whatsapp">WhatsApp (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    id="whatsapp"
                    placeholder="+1 (555) 123-4567" 
                    {...field} 
                    className="text-gray-900 dark:text-gray-100"
                    autoComplete="tel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Technical Specifications */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Technical Specifications</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="engine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="engine">Engine (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      id="engine"
                      placeholder="2.0L I4 Turbo" 
                      {...field} 
                      className="text-gray-900 dark:text-gray-100"
                      autoComplete="off"
                    />
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
                  <FormLabel>Transmission (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="exteriorColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exterior Color (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Black" {...field} className="text-gray-900 dark:text-gray-100" />
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
                  <FormLabel>Interior Color (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Black" {...field} className="text-gray-900 dark:text-gray-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="driveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drive Type (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select drive type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FWD">FWD</SelectItem>
                      <SelectItem value="RWD">RWD</SelectItem>
                      <SelectItem value="AWD">AWD</SelectItem>
                      <SelectItem value="4WD">4WD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description and Features */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Description & Features</h3>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter detailed car description..." 
                    {...field} 
                    rows={4}
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
                <FormLabel>Features (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter each feature on a new line. Example:&#10;Bluetooth Connectivity&#10;Backup Camera&#10;Heated Seats&#10;Sunroof" 
                    {...field}
                    value={field.value || ""}
                    rows={4}
                  />
                </FormControl>
                <FormDescription>Enter each feature on a new line.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="documents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documents (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter each document as `name,url` on a new line. Example:&#10;Carfax Report,https://example.com/carfax.pdf&#10;Service History,https://example.com/service.pdf"
                    {...field}
                    value={field.value || ""}
                    rows={4}
                  />
                </FormControl>
                <FormDescription>Enter each document as `name,url` on a new line.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Car Images</h3>
          <ImageUpload 
            onImagesUploaded={handleImagesUploaded}
            existingImages={imageUrls}
            onImageRemove={handleImageRemove}
            maxImages={10}
          />
        </div>

        {/* Display Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Display Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="approved"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Approved</FormLabel>
                    <FormDescription>Mark car as approved for public display.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isInventory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Show in Inventory</FormLabel>
                    <FormDescription>Display this car in the main inventory list.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Show in Featured Vehicles</FormLabel>
                    <FormDescription>Highlight this car on the homepage or featured sections.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Saving..." : initialData ? "Update Car" : "Add Car"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
