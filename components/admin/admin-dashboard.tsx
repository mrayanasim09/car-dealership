"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  Users, 
  TrendingUp, 
  Phone, 
  MessageCircle, 
  MessageSquare,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  MessageSquare as MessageIcon,
  BarChart3,
  Download
} from "lucide-react"
import { getAllCars } from "@/lib/firebase"
import type { Car as CarType } from "@/lib/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    approvedCars: 0,
    pendingCars: 0,
    featuredCars: 0,
    totalViews: 0,
    totalContacts: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [showContactButtons, setShowContactButtons] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const router = useRouter()

  const phoneNumbers = [
    { number: "+14243030386", label: "+1 424-303-0386" },
    { number: "+13109720341", label: "+1 310-972-0341" }, 
    { number: "+13103507709", label: "+1 310-350-7709" },
    { number: "+13109048377", label: "+1 310-904-8377" }
  ]

  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const handleSMS = (phoneNumber: string) => {
    window.open(`sms:${phoneNumber}`, '_self')
  }

  const handleWhatsApp = (phoneNumber: string) => {
    const message = encodeURIComponent("Hi! I'm calling from the admin dashboard. Can you help me with inventory management?")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      const cars = await getAllCars()
      
      const newStats = {
        totalCars: cars.length,
        approvedCars: cars.filter(car => car.approved === true).length,
        pendingCars: cars.filter(car => car.approved === false).length,
        featuredCars: cars.filter(car => car.isFeatured === true).length,
        totalViews: cars.reduce((sum, car) => sum + (car.views || 0), 0),
        totalContacts: cars.reduce((sum, car) => sum + (car.contactCount || 0), 0)
      }
      
      setStats(newStats)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast.error("Failed to fetch dashboard stats")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  }

  // Quick Actions Handlers
  const handleAddNewCar = () => {
    router.push('/admin?tab=inventory&action=add')
    toast.success("Navigating to add new car...")
  }

  const handleViewMessages = () => {
    router.push('/admin?tab=messages')
    toast.success("Navigating to messages...")
  }

  const handleViewAnalytics = () => {
    router.push('/admin?tab=settings')
    toast.success("Navigating to settings...")
  }

  const handleSyncData = async () => {
    try {
      setSyncing(true)
      await fetchStats()
      toast.success("Data synced successfully!")
    } catch (error) {
      console.error("Error syncing data:", error)
      toast.error("Failed to sync data")
    } finally {
      setSyncing(false)
    }
  }

  const handleExportData = async () => {
    try {
      const cars = await getAllCars()
      const csvContent = generateCSV(cars)
      downloadCSV(csvContent, 'car-inventory.csv')
      toast.success("Data exported successfully!")
    } catch (error) {
      console.error("Error exporting data:", error)
      toast.error("Failed to export data")
    }
  }

  const generateCSV = (cars: CarType[]) => {
    const headers = ['ID', 'Title', 'Make', 'Model', 'Year', 'Price', 'Mileage', 'Location', 'Approved', 'Featured']
    const rows = cars.map(car => [
      car.id,
      car.title,
      car.make,
      car.model,
      car.year,
      car.price,
      car.mileage,
      car.location,
      car.approved ? 'Yes' : 'No',
      car.isFeatured ? 'Yes' : 'No'
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time overview of your car dealership
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={fetchStats}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Refresh'}
          </Button>
          <Button
            onClick={() => setShowContactButtons(!showContactButtons)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {showContactButtons ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showContactButtons ? 'Hide' : 'Show'} Contact
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Last updated: {formatTime(lastUpdated)}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalCars)}</div>
            <p className="text-xs text-muted-foreground">
              All vehicles in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Cars</CardTitle>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Live
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.approvedCars)}</div>
            <p className="text-xs text-muted-foreground">
              Available to customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Pending
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.pendingCars)}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Cars</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.featuredCars)}</div>
            <p className="text-xs text-muted-foreground">
              Highlighted vehicles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalViews)}</div>
            <p className="text-xs text-muted-foreground">
              Page views this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalContacts)}</div>
            <p className="text-xs text-muted-foreground">
              Customer inquiries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Buttons */}
      {showContactButtons && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Quick Contact Options
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Contact support team directly from the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {phoneNumbers.map((phone, index) => (
                <div key={index} className="space-y-3">
                  <div className="text-center">
                    <p className="font-medium text-sm">{phone.label}</p>
                    <p className="text-xs text-gray-500">Support Team</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={() => handlePhoneCall(phone.number)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                    <Button
                      onClick={() => handleSMS(phone.number)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      SMS
                    </Button>
                    <Button
                      onClick={() => handleWhatsApp(phone.number)}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={handleAddNewCar}
              className="w-full" 
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Car
            </Button>
            <Button 
              onClick={handleViewMessages}
              className="w-full" 
              variant="outline"
            >
              <MessageIcon className="h-4 w-4 mr-2" />
              View Messages
            </Button>
            <Button 
              onClick={handleViewAnalytics}
              className="w-full" 
              variant="outline"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Settings
            </Button>
            <Button 
              onClick={handleSyncData}
              disabled={syncing}
              className="w-full" 
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Data'}
            </Button>
          </div>
          
          {/* Additional Actions */}
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={handleExportData}
                className="w-full" 
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button 
                onClick={() => window.open('/admin?tab=settings', '_blank')}
                className="w-full" 
                variant="outline"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
