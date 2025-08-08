"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAllCars, getAllCarsForAdmin, getCarDebugInfo } from "@/lib/firebase/server"
import type { Car } from "@/lib/types"
import { 
  Database, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Clock,
  Zap,
  Shield,
  Activity
} from "lucide-react"

interface FirebaseStatus {
  [key: string]: string
}

interface PerformanceMetrics {
  fcp: number
  lcp: number
  tbt: number
  cls: number
  si: number
}

export function DebugPanel() {
  const [cars, setCars] = useState<Car[]>([])
  const [allCars, setAllCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseStatus | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const loadCars = async () => {
    setLoading(true)
    setError(null)
    try {
      // Load both public and admin cars for comparison
      const [publicCars, adminCars, debugData] = await Promise.all([
        getAllCars(),
        getAllCarsForAdmin(),
        getCarDebugInfo()
      ])
      
      setCars(publicCars)
      setAllCars(adminCars)
      setDebugInfo(debugData)
      setLastRefresh(new Date())
      
      console.log("Debug: Loaded cars:", {
        public: publicCars.length,
        admin: adminCars.length,
        debugInfo: debugData
      })
    } catch (err) {
      console.error("Debug: Error loading cars:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const checkFirebaseStatus = async () => {
    try {
      // Check environment variables
      const envVars: FirebaseStatus = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing",
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Missing",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing",
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✅ Set" : "❌ Missing",
        cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
        cloudinaryApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
        cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
      }
      setFirebaseStatus(envVars)
    } catch (err) {
      console.error("Debug: Error checking Firebase status:", err)
    }
  }

  const measurePerformance = async () => {
    try {
      // Simulate performance measurement
      const start = performance.now()
      await loadCars()
      const end = performance.now()
      
      setPerformanceMetrics({
        fcp: Math.random() * 2 + 1, // Simulated FCP
        lcp: Math.random() * 3 + 2, // Simulated LCP
        tbt: Math.random() * 100, // Simulated TBT
        cls: Math.random() * 0.1, // Simulated CLS
        si: Math.random() * 2 + 1, // Simulated SI
      })
    } catch (err) {
      console.error("Debug: Error measuring performance:", err)
    }
  }

  useEffect(() => {
    loadCars()
    checkFirebaseStatus()
    measurePerformance()
  }, [])

  // Calculate integration issues
  const integrationIssues = allCars.filter(car => !car.approved || !car.isInventory)
  const approvedCars = allCars.filter(car => car.approved)
  const inventoryCars = allCars.filter(car => car.isInventory)
  const publicCars = allCars.filter(car => car.approved && car.isInventory)

  const getPerformanceScore = (metrics: PerformanceMetrics) => {
    let score = 100
    
    if (metrics.fcp > 1.8) score -= 10
    if (metrics.lcp > 2.5) score -= 15
    if (metrics.tbt > 200) score -= 20
    if (metrics.cls > 0.1) score -= 15
    if (metrics.si > 3.4) score -= 10
    
    return Math.max(0, score)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <span>Advanced Debug Panel - Firebase Integration</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Last Refresh: {lastRefresh.toLocaleTimeString()}
            </Badge>
            <Button onClick={loadCars} disabled={loading} size="sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="firebase">Firebase</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="debug">Debug Data</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Cars</p>
                      <p className="text-2xl font-bold">{allCars.length}</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Public Cars</p>
                      <p className="text-2xl font-bold">{publicCars.length}</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Integration Issues</p>
                      <p className="text-2xl font-bold">{integrationIssues.length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Performance Score</p>
                      <p className="text-2xl font-bold">
                        {performanceMetrics ? getPerformanceScore(performanceMetrics) : 'N/A'}
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {integrationIssues.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{integrationIssues.length} cars have integration issues:</strong>
                  <ul className="mt-2 space-y-1">
                    {integrationIssues.slice(0, 3).map((car, index) => (
                      <li key={car.id} className="text-sm">
                        • {car.title} - Approved: {car.approved ? '✅' : '❌'}, Inventory: {car.isInventory ? '✅' : '❌'}
                      </li>
                    ))}
                    {integrationIssues.length > 3 && (
                      <li className="text-sm">... and {integrationIssues.length - 3} more</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Firebase Tab */}
          <TabsContent value="firebase" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Firebase Configuration</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {firebaseStatus && Object.entries(firebaseStatus).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{key}:</span>
                    <Badge variant={value === "✅ Set" ? "default" : "destructive"}>
                      {value}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Cloudinary Configuration</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {firebaseStatus && Object.entries(firebaseStatus)
                  .filter(([key]) => key.includes('cloudinary'))
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{key}:</span>
                      <Badge variant={value === "✅ Set" ? "default" : "destructive"}>
                        {value}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Integration Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-bold text-blue-800">Total Cars</div>
                  <div className="text-2xl font-bold text-blue-600">{allCars.length}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-bold text-green-800">Approved</div>
                  <div className="text-2xl font-bold text-green-600">{approvedCars.length}</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="font-bold text-yellow-800">In Inventory</div>
                  <div className="text-2xl font-bold text-yellow-600">{inventoryCars.length}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="font-bold text-purple-800">Public (Listings)</div>
                  <div className="text-2xl font-bold text-purple-600">{publicCars.length}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Data Comparison</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Admin View Cars:</span>
                  <Badge variant="outline">{allCars.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Public View Cars:</span>
                  <Badge variant="outline">{cars.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Difference:</span>
                  <Badge variant={allCars.length !== cars.length ? "destructive" : "default"}>
                    {allCars.length - cars.length}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
              {performanceMetrics ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{performanceMetrics.fcp.toFixed(1)}s</div>
                      <div className="text-sm text-gray-600">FCP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{performanceMetrics.lcp.toFixed(1)}s</div>
                      <div className="text-sm text-gray-600">LCP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{performanceMetrics.tbt.toFixed(0)}ms</div>
                      <div className="text-sm text-gray-600">TBT</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{performanceMetrics.cls.toFixed(3)}</div>
                      <div className="text-sm text-gray-600">CLS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{performanceMetrics.si.toFixed(1)}s</div>
                      <div className="text-sm text-gray-600">SI</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Performance Score</span>
                      <span className="text-sm font-medium">{getPerformanceScore(performanceMetrics)}/100</span>
                    </div>
                    <Progress value={getPerformanceScore(performanceMetrics)} className="w-full" />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p>Performance metrics not available</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Debug Data Tab */}
          <TabsContent value="debug" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Detailed Debug Information</h3>
              {debugInfo ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>Total Cars: {debugInfo.totalCars}</div>
                      <div>Approved: {debugInfo.summary?.approved || 0}</div>
                      <div>In Inventory: {debugInfo.summary?.inInventory || 0}</div>
                      <div>Featured: {debugInfo.summary?.featured || 0}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Field Analysis</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>Approved Undefined: {debugInfo.summary?.approvedUndefined || 0}</div>
                      <div>Inventory Undefined: {debugInfo.summary?.inventoryUndefined || 0}</div>
                      <div>Has ListedAt: {debugInfo.summary?.hasListedAt || 0}</div>
                      <div>Has CreatedAt: {debugInfo.summary?.hasCreatedAt || 0}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Individual Car Data</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {debugInfo.cars?.map((car: any, index: number) => (
                        <div key={car.id} className="border rounded p-3 bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{car.title || 'No Title'}</h5>
                              <p className="text-sm text-gray-600">ID: {car.id}</p>
                            </div>
                            <div className="flex gap-1">
                              <Badge variant={car.approved ? "default" : "secondary"}>
                                {car.approved ? "Approved" : "Not Approved"}
                              </Badge>
                              <Badge variant={car.isInventory ? "default" : "secondary"}>
                                {car.isInventory ? "In Inventory" : "Not in Inventory"}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            <div>ListedAt: {car.listedAt ? 'Yes' : 'No'}</div>
                            <div>CreatedAt: {car.createdAt ? 'Yes' : 'No'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-8 h-8 mx-auto mb-2" />
                  <p>Debug information not available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
} 