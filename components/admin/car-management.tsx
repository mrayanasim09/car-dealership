"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CarForm } from "@/components/admin/car-form"
import Image from "next/image"
import type { Car } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Check, X } from "lucide-react"

interface CarManagementProps {
  cars: Car[]
  setCars: (cars: Car[]) => void
}

export function CarManagement({ cars, setCars }: CarManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const { toast } = useToast()
  const [role, setRole] = useState<'viewer'|'editor'|'admin'|'super_admin'>('viewer')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/admin/me', { cache: 'no-store' })
        const data = await res.json()
        if (data?.role) setRole(data.role)
      } catch {
        setRole('viewer')
      }
    })()
  }, [])

  const handleDelete = async (carId: string) => {
    if (!(role === 'admin' || role === 'super_admin')) {
      toast({ title: "Not allowed", description: "You don't have permission to delete cars", variant: "destructive" })
      return
    }
    if (!confirm("Are you sure you want to delete this car?")) return

    try {
      const csrf = decodeURIComponent(document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '')
      const res = await fetch(`/api/admin/cars?id=${encodeURIComponent(carId)}`, {
        method: 'DELETE',
        headers: { 'x-csrf-token': csrf },
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Delete failed')
      setCars(cars.filter((car) => car.id !== carId))
      toast({
        title: "Success",
        description: "Car deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete car",
        variant: "destructive",
      })
    }
  }

  const handleApprovalToggle = async (carId: string, approved: boolean) => {
    if (!(role === 'admin' || role === 'super_admin')) {
      toast({ title: "Not allowed", description: "You don't have permission to approve cars", variant: "destructive" })
      return
    }
    try {
      const csrf = decodeURIComponent(document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '')
      const res = await fetch(`/api/admin/cars`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf },
        credentials: 'include',
        body: JSON.stringify({ id: carId, approved })
      })
      if (!res.ok) throw new Error('Update failed')
      setCars(cars.map((car) => (car.id === carId ? { ...car, approved } : car)))
      toast({
        title: "Success",
        description: `Car ${approved ? "approved" : "unapproved"} successfully`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update car approval",
        variant: "destructive",
      })
    }
  }

  const handleAddCar = () => {
    if (!(role === 'editor' || role === 'admin' || role === 'super_admin')) {
      toast({ title: "Not allowed", description: "You don't have permission to add cars", variant: "destructive" })
      return
    }
    setShowForm(true)
  }

  const handleEditCar = (car: Car) => {
    if (!(role === 'editor' || role === 'admin' || role === 'super_admin')) {
      toast({ title: "Not allowed", description: "You don't have permission to edit cars", variant: "destructive" })
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
        <Button onClick={handleAddCar} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!(role === 'editor' || role === 'admin' || role === 'super_admin')}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Car
        </Button>
      </div>

      {/* Firebase demo banner removed */}

      {showForm && (
        <CarForm
          car={editingCar || undefined}
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
            <div className="relative aspect-video">
              <Image
                src={car.images[0] || "/optimized/placeholder.webp"}
                alt={car.title}
                fill
                className="object-cover"
              />
              <Badge className={`absolute top-2 right-2 ${car.approved ? "bg-primary" : "bg-yellow-600"}`}>
                {car.approved ? "Approved" : "Pending"}
              </Badge>
            </div>

            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{car.title}</h3>
              <p className="text-2xl font-bold text-primary mb-4">{formatPrice(car.price)}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Button onClick={() => handleEditCar(car)} variant="outline" size="sm" className="border-border">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>

                <Button
                  onClick={() => handleApprovalToggle(car.id, !car.approved)}
                  variant="outline"
                  size="sm"
                  className={car.approved ? "text-yellow-600" : "text-primary"}
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

                <Button onClick={() => handleDelete(car.id)} variant="outline" size="sm" className="text-destructive" disabled={!(role === 'admin' || role === 'super_admin')}>
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
