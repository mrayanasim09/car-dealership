"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CarForm } from "@/components/admin/car-form"
import Image from "next/image"
import type { Car } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Check, X, GripVertical, Save } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface CarManagementProps {
  cars: Car[]
  setCars: (cars: Car[]) => void
}

interface SortableCarItemProps {
  car: Car
  onEdit: (car: Car) => void
  onDelete: (carId: string) => void
  onApprovalToggle: (carId: string, approved: boolean) => void
  onSoldToggle: (carId: string, sold: boolean) => void
  role: 'viewer' | 'editor' | 'admin' | 'super_admin'
}

function SortableCarItem({ 
  car, onEdit, onDelete, onApprovalToggle, onSoldToggle, role 
}: SortableCarItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: car.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={`overflow-hidden ${isDragging ? 'shadow-lg ring-2 ring-primary' : ''}`}
    >
      <div className="relative aspect-video">
        <Image
          src={car.images[0] || "/optimized/placeholder.webp"}
          alt={car.title}
          fill
          className="object-cover"
        />
        <Badge className={`absolute top-2 right-2 ${car.approved ? "bg-primary" : ""}`} variant={car.approved ? undefined : "warning"}>
          {car.approved ? "Approved" : "Pending"}
        </Badge>
        {car.sold && (
          <Badge className="absolute top-2 left-2 bg-red-600 text-white">
            SOLD
          </Badge>
        )}
        {/* Drag handle - mobile optimized with improved touch handling */}
        <div 
          {...attributes} 
          {...listeners}
          className="drag-handle absolute top-2 left-2 bg-white/90 hover:bg-white rounded p-2 cursor-grab active:cursor-grabbing shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center border border-gray-300"
          style={{ touchAction: 'none' }}
          onTouchStart={(e) => {
            // Only prevent default if this is the initial touch
            if (e.touches.length === 1) {
              e.preventDefault()
            }
          }}
          title="Drag to reorder"
        >
          <GripVertical className="h-5 w-5 text-gray-600" />
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2">{car.title}</h3>
        <p className="text-2xl font-bold text-primary mb-4">{formatPrice(car.price)}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button onClick={() => onEdit(car)} variant="outline" size="sm" className="border-border min-h-[44px] touch-manipulation">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>

          <Button
            onClick={() => onApprovalToggle(car.id, !car.approved)}
            variant="outline"
            size="sm"
            className={`min-h-[44px] touch-manipulation ${car.approved ? "text-yellow-600" : "text-primary"}`}
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

          <Button 
            onClick={() => onSoldToggle(car.id, !car.sold)} 
            variant="outline" 
            size="sm" 
            className={`min-h-[44px] touch-manipulation ${car.sold ? "text-green-600" : "text-primary"}`}
          >
            {car.sold ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Mark as Available
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-1" />
                Mark as Sold
              </>
            )}
          </Button>

          <Button onClick={() => onDelete(car.id)} variant="outline" size="sm" className="text-destructive min-h-[44px] touch-manipulation" disabled={!(role === 'admin' || role === 'super_admin')}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function CarManagement({ cars, setCars }: CarManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const { toast } = useToast()
  const [role, setRole] = useState<'viewer'|'editor'|'admin'|'super_admin'>('viewer')
  const [localCars, setLocalCars] = useState<Car[]>(cars)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced distance for better mobile responsiveness
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

  // Update local cars when props change
  useEffect(() => {
    setLocalCars(cars)
  }, [cars])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = localCars.findIndex(car => car.id === active.id)
      const newIndex = localCars.findIndex(car => car.id === over.id)
      
      const newCars = arrayMove(localCars, oldIndex, newIndex)
      setLocalCars(newCars)
      setHasUnsavedChanges(true)
    }
  }

  const handleSaveOrder = async () => {
    if (!(role === 'editor' || role === 'admin' || role === 'super_admin')) {
      toast({ title: "Not allowed", description: "You don't have permission to reorder cars", variant: "destructive" })
      return
    }

    try {
      const csrf = decodeURIComponent(document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '')
      const carOrders = localCars.map((car, index) => ({
        id: car.id,
        displayOrder: index + 1
      }))

      const res = await fetch('/api/admin/cars/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf },
        credentials: 'include',
        body: JSON.stringify({ carOrders })
      })

      if (!res.ok) throw new Error('Reorder failed')
      
      // Update the parent state
      setCars(localCars)
      setHasUnsavedChanges(false)
      
      toast({
        title: "Success",
        description: "Car order saved successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to save car order",
        variant: "destructive",
      })
    }
  }

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

  const handleSoldToggle = async (carId: string, sold: boolean) => {
    if (!(role === 'admin' || role === 'super_admin')) {
      toast({ title: "Not allowed", description: "You don't have permission to mark cars as sold", variant: "destructive" })
      return
    }
    try {
      const csrf = decodeURIComponent(document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '')
      const res = await fetch(`/api/admin/cars`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf },
        credentials: 'include',
        body: JSON.stringify({ 
          id: carId, 
          sold, 
          soldAt: sold ? new Date().toISOString() : null 
        })
      })
      if (!res.ok) throw new Error('Update failed')
      setCars(cars.map((car) => (car.id === carId ? { 
        ...car, 
        sold, 
        soldAt: sold ? new Date() : null 
      } : car)))
      toast({
        title: "Success",
        description: `Car ${sold ? "marked as sold" : "marked as available"} successfully`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update car sold status",
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

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold">Car Inventory</h2>
          <p className="text-sm text-muted-foreground mt-1">Touch and drag the grip handle (⋮⋮) to reorder cars</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {hasUnsavedChanges && (
            <Button 
              onClick={handleSaveOrder} 
              className="bg-green-600 hover:bg-green-700 text-white min-h-[44px] touch-manipulation"
              disabled={!(role === 'editor' || role === 'admin' || role === 'super_admin')}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Order
            </Button>
          )}
          <Button onClick={handleAddCar} className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px] touch-manipulation" disabled={!(role === 'editor' || role === 'admin' || role === 'super_admin')}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Car
          </Button>
        </div>
      </div>

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={localCars.map(car => car.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-8">
            {localCars.map((car) => (
              <SortableCarItem
                key={car.id}
                car={car}
                onEdit={handleEditCar}
                onDelete={handleDelete}
                onApprovalToggle={handleApprovalToggle}
                onSoldToggle={handleSoldToggle}
                role={role}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
