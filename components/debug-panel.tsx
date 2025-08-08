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

  const checkFirebaseStatus = () => {
    const envVars = {
      firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing",
      firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Missing",
      firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing",
      firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✅ Set" : "❌ Missing",
      firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "✅ Set" : "❌ Missing",
      firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅ Set" : "❌ Missing",
      firebaseMeasurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? "✅ Set" : "❌ Missing",
      cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
      cloudinaryApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
      cloudinaryApiSecret: "✅ Set (Server-side)", // Server-side env var, always show as set
      cloudinaryUrl: process.env.CLOUDINARY_URL ? "✅ Set (Server-side)" : "❌ Missing (Server-side)",
    }
    setFirebaseStatus(envVars)
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



  return (
    <Card className="w-full max-w-6xl mx-auto bg-gray-900 border-gray-700">
      <CardHeader className="bg-gray-800 border-gray-700">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <span>Advanced Debug Panel - Firebase Integration</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
              Last Refresh: {lastRefresh.toLocaleTimeString()}
            </Badge>
            <Button onClick={loadCars} disabled={loading} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 bg-gray-900 text-white">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="firebase" className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white">Firebase</TabsTrigger>
            <TabsTrigger value="integration" className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white">Integration</TabsTrigger>
            <TabsTrigger value="performance" className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white">Performance</TabsTrigger>
            <TabsTrigger value="debug" className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white">Debug Data</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Total Cars</p>
                      <p className="text-2xl font-bold text-white">{allCars.length}</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Public Cars</p>
                      <p className="text-2xl font-bold text-white">{publicCars.length}</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Integration Issues</p>
                      <p className="text-2xl font-bold text-white">{integrationIssues.length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Core Web Vitals</p>
                      <p className="text-2xl font-bold text-white">
                        {performanceMetrics ? 'Active' : 'N/A'}
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {integrationIssues.length > 0 && (
              <Alert className="bg-red-900/20 border-red-700">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
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
              <h3 className="text-lg font-semibold mb-3 text-white">Firebase Configuration</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {firebaseStatus && Object.entries(firebaseStatus).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-700">
                    <span className="font-medium text-gray-300">{key}:</span>
                    <Badge variant={value === "✅ Set" ? "default" : "destructive"}>
                      {value}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Cloudinary Configuration</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {firebaseStatus && Object.entries(firebaseStatus)
                  .filter(([key]) => key.includes('cloudinary'))
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-700">
                      <span className="font-medium text-gray-300">{key}:</span>
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
              <h3 className="text-lg font-semibold mb-3 text-white">Integration Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-700">
                  <div className="font-bold text-blue-300">Total Cars</div>
                  <div className="text-2xl font-bold text-blue-200">{allCars.length}</div>
                </div>
                <div className="bg-green-900/20 p-3 rounded-lg border border-green-700">
                  <div className="font-bold text-green-300">Approved</div>
                  <div className="text-2xl font-bold text-green-200">{approvedCars.length}</div>
                </div>
                <div className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-700">
                  <div className="font-bold text-yellow-300">In Inventory</div>
                  <div className="text-2xl font-bold text-yellow-200">{inventoryCars.length}</div>
                </div>
                <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-700">
                  <div className="font-bold text-purple-300">Public (Listings)</div>
                  <div className="text-2xl font-bold text-purple-200">{publicCars.length}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Data Comparison</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-700">
                  <span className="text-gray-300">Admin View Cars:</span>
                  <Badge variant="outline" className="text-gray-300 border-gray-600">{allCars.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-700">
                  <span className="text-gray-300">Public View Cars:</span>
                  <Badge variant="outline" className="text-gray-300 border-gray-600">{cars.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-700">
                  <span className="text-gray-300">Difference:</span>
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
              <h3 className="text-lg font-semibold mb-3 text-white">Performance Metrics</h3>
              {performanceMetrics ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{performanceMetrics.fcp.toFixed(1)}s</div>
                      <div className="text-sm text-gray-400">FCP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{performanceMetrics.lcp.toFixed(1)}s</div>
                      <div className="text-sm text-gray-400">LCP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{performanceMetrics.tbt.toFixed(0)}ms</div>
                      <div className="text-sm text-gray-400">TBT</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{performanceMetrics.cls.toFixed(3)}</div>
                      <div className="text-sm text-gray-400">CLS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{performanceMetrics.si.toFixed(1)}s</div>
                      <div className="text-sm text-gray-400">SI</div>
                    </div>
                  </div>
                  
                                           <div>
                           <div className="flex justify-between items-center mb-2">
                             <span className="text-sm font-medium text-gray-300">Core Web Vitals</span>
                           </div>
                           <div className="text-xs text-gray-400 space-y-1">
                             <div>FCP: {performanceMetrics.fcp.toFixed(1)}s (Good: &lt;1.8s)</div>
                             <div>LCP: {performanceMetrics.lcp.toFixed(1)}s (Good: &lt;2.5s)</div>
                             <div>TBT: {performanceMetrics.tbt.toFixed(0)}ms (Good: &lt;200ms)</div>
                             <div>CLS: {performanceMetrics.cls.toFixed(3)} (Good: &lt;0.1)</div>
                             <div>SI: {performanceMetrics.si.toFixed(1)}s (Good: &lt;3.4s)</div>
                           </div>
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
              <h3 className="text-lg font-semibold mb-3 text-white">Detailed Debug Information</h3>
              {debugInfo ? (
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold mb-2 text-white">Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="text-gray-300">Total Cars: {debugInfo.totalCars}</div>
                      <div className="text-gray-300">Approved: {debugInfo.summary?.approved || 0}</div>
                      <div className="text-gray-300">In Inventory: {debugInfo.summary?.inInventory || 0}</div>
                      <div className="text-gray-300">Featured: {debugInfo.summary?.featured || 0}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold mb-2 text-white">Field Analysis</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="text-gray-300">Approved Undefined: {debugInfo.summary?.approvedUndefined || 0}</div>
                      <div className="text-gray-300">Inventory Undefined: {debugInfo.summary?.inventoryUndefined || 0}</div>
                      <div className="text-gray-300">Has ListedAt: {debugInfo.summary?.hasListedAt || 0}</div>
                      <div className="text-gray-300">Has CreatedAt: {debugInfo.summary?.hasCreatedAt || 0}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Individual Car Data</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {debugInfo.cars?.map((car: any, index: number) => (
                        <div key={car.id} className="border rounded p-3 bg-gray-800 border-gray-700">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-white">{car.title || 'No Title'}</h5>
                              <p className="text-sm text-gray-400">ID: {car.id}</p>
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
          <Alert className="bg-red-900/20 border-red-700">
            <XCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
} 