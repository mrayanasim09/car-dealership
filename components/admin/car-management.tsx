"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CarForm } from "@/components/admin/car-form"
import { CloudinaryImage } from "@/components/cloudinary-image"
import type { Car } from "@/lib/types"
import { getAllCars, deleteCar, updateCarApproval } from "@/lib/firebase"
import { toast } from "sonner"
import { Plus, Edit, Trash2, Check, X, Eye, EyeOff, Star } from "lucide-react"

export function CarManagement() {
  const [cars, setCars] = useState<Car[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const allCars = await getAllCars()
      setCars(allCars)
    } catch (error) {
      console.error("Error fetching cars:", error)
      toast.error("Failed to fetch cars")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (carId: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return

    try {
      await deleteCar(carId)
      setCars(cars.filter((car) => car.id !== carId))
      toast.success("Car deleted successfully")
    } catch (error) {
      console.error("Error deleting car:", error)
      toast.error("Failed to delete car")
    }
  }

  const handleApprovalToggle = async (carId: string, approved: boolean) => {
    try {
      await updateCarApproval(carId, approved)
      setCars(cars.map((car) => (car.id === carId ? { ...car, approved } : car)))
      toast.success(`Car ${approved ? "approved" : "unapproved"} successfully`)
    } catch (error) {
      console.error("Error updating car approval:", error)
      toast.error("Failed to update car approval")
    }
  }

  const handleAddCar = () => {
    setShowForm(true)
    setEditingCar(null)
  }

  const handleEditCar = (car: Car) => {
    setEditingCar(car)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCar(null)
  }

  const handleCarAdded = (newCar: Car) => {
    setCars([...cars, newCar])
    setShowForm(false)
    toast.success("Car added successfully")
  }

  const handleCarUpdated = (updatedCar: Car) => {
    setCars(cars.map((car) => (car.id === updatedCar.id ? updatedCar : car)))
    setShowForm(false)
    setEditingCar(null)
    toast.success("Car updated successfully")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredCars = cars.filter(car => {
    if (filter === 'approved') return car.approved
    if (filter === 'pending') return !car.approved
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Car Inventory Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your car inventory and approvals
          </p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'approved' | 'pending')}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="all">All Cars ({cars.length})</option>
            <option value="approved">Approved ({cars.filter(c => c.approved).length})</option>
            <option value="pending">Pending ({cars.filter(c => !c.approved).length})</option>
          </select>
          
          <Button onClick={handleAddCar} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Car
          </Button>
        </div>
      </div>

      {/* Car Form Modal */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCar ? "Edit Car" : "Add New Car"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CarForm
              car={editingCar}
              onSuccess={editingCar ? handleCarUpdated : handleCarAdded}
              onCancel={handleFormClose}
            />
          </CardContent>
        </Card>
      )}

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <Card key={car.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              {/* Car Image */}
              <div className="relative mb-4">
                <CloudinaryImage
                  src={car.images[0] || "/placeholder.jpg"}
                  alt={car.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {car.isFeatured && (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge className={car.approved ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}>
                    {car.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </div>

              {/* Car Details */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{car.title}</h3>
                <p className="text-2xl font-bold text-red-600">{formatPrice(car.price)}</p>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>{car.year} • {car.mileage.toLocaleString()} mi</p>
                  <p>{car.location}</p>
                  <p>{car.make} {car.model}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleApprovalToggle(car.id, !car.approved)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {car.approved ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Unapprove
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => handleEditCar(car)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                <Button
                  onClick={() => handleDelete(car.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No cars found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter === 'all' 
              ? "Add your first car to get started" 
              : `No ${filter} cars found`}
          </p>
          {filter === 'all' && (
            <Button onClick={handleAddCar} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add First Car
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
