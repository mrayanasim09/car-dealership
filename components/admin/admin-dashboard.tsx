"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CarManagement } from "@/components/admin/car-management"
import { ReviewManagement } from "@/components/admin/review-management"
import { DebugPanel } from "@/components/debug-panel"
import { useAuth } from "@/lib/auth-context"
import { signOut } from "firebase/auth"
import { auth, getFirebaseStatus, isFirestoreAvailable } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import type { Car, Review } from "@/lib/types"
import { getAllCars, getReviews } from "@/lib/firebase"
import { LogOut, CarIcon, MessageSquare, BarChart3, AlertTriangle, CheckCircle, XCircle, Bug } from "lucide-react"

export function AdminDashboard() {
  const { user, isFirebaseAvailable } = useAuth()
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [firebaseStatus, setFirebaseStatus] = useState(getFirebaseStatus())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsData, reviewsData] = await Promise.all([getAllCars().catch(() => []), getReviews().catch(() => [])])
        setCars(carsData)
        setReviews(reviewsData)
        setFirebaseStatus(getFirebaseStatus())
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      if (auth && isFirebaseAvailable) {
        await signOut(auth)
      }
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      router.push("/")
    }
  }

  const stats = {
    totalCars: cars.length,
    approvedCars: cars.filter((car) => car.approved).length,
    pendingCars: cars.filter((car) => !car.approved).length,
    totalReviews: reviews.length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.email || "Demo User"}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                {isFirebaseAvailable ? "Logout" : "Back to Home"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Firebase Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Firebase App</p>
                  <p className="text-xs text-gray-500">Core initialization</p>
                </div>
                {firebaseStatus.app ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Authentication</p>
                  <p className="text-xs text-gray-500">User login system</p>
                </div>
                {firebaseStatus.auth ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Firestore</p>
                  <p className="text-xs text-gray-500">Database storage</p>
                </div>
                {firebaseStatus.firestore ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Storage</p>
                  <p className="text-xs text-gray-500">File uploads</p>
                </div>
                {firebaseStatus.storage ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Message */}
        {!isFirestoreAvailable() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Firestore Setup Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You're currently viewing demo data with Cloudinary images. To enable full functionality:
                </p>
                <ol className="text-sm text-yellow-700 mt-2 ml-4 list-decimal">
                  <li>Go to your Firebase Console</li>
                  <li>Navigate to Firestore Database</li>
                  <li>Click "Create database"</li>
                  <li>Choose "Start in test mode" for now</li>
                  <li>Select a location and create</li>
                </ol>
                {firebaseStatus.error && (
                  <p className="text-xs text-yellow-600 mt-2 font-mono bg-yellow-100 p-2 rounded">
                    Error: {firebaseStatus.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
              <CarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCars}</div>
              <p className="text-xs text-muted-foreground">{isFirestoreAvailable() ? "From Firestore" : "Demo data"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Cars</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approvedCars}</div>
              <p className="text-xs text-muted-foreground">Ready for display</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <BarChart3 className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingCars}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <p className="text-xs text-muted-foreground">Customer feedback</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="cars" className="space-y-4">
          <TabsList>
            <TabsTrigger value="cars">Car Management</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="debug">Debug</TabsTrigger>
          </TabsList>

          <TabsContent value="cars">
            <CarManagement cars={cars} setCars={setCars} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewManagement reviews={reviews} />
          </TabsContent>

          <TabsContent value="debug">
            <DebugPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 
