"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CarForm } from "@/components/admin/car-form"
import { CloudinaryImage } from "@/components/cloudinary-image"
import type { Car } from "@/lib/types"
import { deleteCar, updateCarApproval } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Check, X } from "lucide-react"

interface CarManagementProps {
  cars: Car[]
  setCars: (cars: Car[]) => void
}

export function CarManagement({ cars, setCars }: CarManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const { isFirebaseAvailable } = useAuth()
  const { toast } = useToast()

  const handleDelete = async (carId: string) => {
    if (!isFirebaseAvailable) {
      toast({
        title: "Demo Mode",
        description: "Car deletion requires Firebase configuration",
        variant: "destructive",
      })
      return
    }

    if (!confirm("Are you sure you want to delete this car?")) return

    try {
      await deleteCar(carId)
      setCars(cars.filter((car) => car.id !== carId))
      toast({
        title: "Success",
        description: "Car deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete car",
        variant: "destructive",
      })
    }
  }

  const handleApprovalToggle = async (carId: string, approved: boolean) => {
    if (!isFirebaseAvailable) {
      toast({
        title: "Demo Mode",
        description: "Car approval requires Firebase configuration",
        variant: "destructive",
      })
      return
    }

    try {
      await updateCarApproval(carId, approved)
      setCars(cars.map((car) => (car.id === carId ? { ...car, approved } : car)))
      toast({
        title: "Success",
        description: `Car ${approved ? "approved" : "unapproved"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update car approval",
        variant: "destructive",
      })
    }
  }

  const handleAddCar = () => {
    if (!isFirebaseAvailable) {
      toast({
        title: "Demo Mode",
        description: "Adding cars requires Firebase configuration",
        variant: "destructive",
      })
      return
    }
    setShowForm(true)
  }

  const handleEditCar = (car: Car) => {
    if (!isFirebaseAvailable) {
      toast({
        title: "Demo Mode",
        description: "Editing cars requires Firebase configuration",
        variant: "destructive",
      })
      return
    }
    setEditingCar(car)
    setShowForm(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Car Inventory</h2>
        <Button onClick={handleAddCar} className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Car
        </Button>
      </div>

      {!isFirebaseAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> You're viewing sample data with Cloudinary images. Configure Firebase to manage
            real car listings.
          </p>
        </div>
      )}

      {showForm && (
        <CarForm
          initialData={editingCar}
          onSuccess={() => {
            setShowForm(false)
            setEditingCar(null)
            // Refresh the cars list
            window.location.reload()
          }}
          onCancel={() => {
            setShowForm(false)
            setEditingCar(null)
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <div className="relative">
              <CloudinaryImage
                src={car.images[0] || "/placeholder.svg?height=200&width=300"}
                alt={car.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                crop="fill"
              />
              <Badge className={`absolute top-2 right-2 ${car.approved ? "bg-green-600" : "bg-yellow-600"}`}>
                {car.approved ? "Approved" : "Pending"}
              </Badge>
            </div>

            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{car.title}</h3>
              <p className="text-2xl font-bold text-red-600 mb-4">{formatPrice(car.price)}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Button onClick={() => handleEditCar(car)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>

                <Button
                  onClick={() => handleApprovalToggle(car.id, !car.approved)}
                  variant="outline"
                  size="sm"
                  className={car.approved ? "text-yellow-600" : "text-green-600"}
                >
                  {car.approved ? (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Unapprove
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </>
                  )}
                </Button>

                <Button onClick={() => handleDelete(car.id)} variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
