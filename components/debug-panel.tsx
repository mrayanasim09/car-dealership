"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Alert, AlertDescription } from "@/components/ui/alert"
// Firebase removed; debug panel data source will be adjusted later
import { 
  Database, 
  Eye, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Clock,
  Zap
} from "lucide-react"

interface PerformanceMetrics {
  fcp: number
  lcp: number
  tbt: number
  cls: number
  si: number
}

type SummaryCar = {
  id: string
  title: string
  approved: boolean
  is_inventory: boolean
  listed_at?: string | null
}

type MinimalCar = {
  id: string
  title: string
  approved: boolean
  isInventory: boolean
}

export function DebugPanel() {
  const [cars, setCars] = useState<MinimalCar[]>([])
  const [allCars, setAllCars] = useState<MinimalCar[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [firebaseStatus, setFirebaseStatus] = useState<Record<string, string> | null>(null)
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const loadCars = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/debug/summary', { cache: 'no-store' })
      if (!res.ok) throw new Error(`summary ${res.status}`)
      const data = await res.json()
      setDebugInfo(data)
      // Map sample cars from server response shape if present
      const sample: SummaryCar[] = Array.isArray(data.samples) ? (data.samples as SummaryCar[]) : []
      const minimal: MinimalCar[] = sample.map((s) => ({
        id: s.id,
        title: s.title ?? '',
        approved: Boolean(s.approved),
        isInventory: Boolean(s.is_inventory),
      }))
      setAllCars(minimal)
      setCars(minimal.filter((c) => c.approved && c.isInventory))
      setLastRefresh(new Date())
    } catch (err) {
      console.error("Debug: Error loading cars:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const checkFirebaseStatus = () => {
    const envVars = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
      blobToken: process.env.BLOB_READ_WRITE_TOKEN ? "Configured (server)" : "Missing (server)",
      resendConfigured: process.env.RESEND_API_KEY ? "Set" : "Missing",
    }
    setFirebaseStatus(envVars)
  }

  useEffect(() => {
    loadCars()
    checkFirebaseStatus()
    
    const measurePerformance = async () => {
      try {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
        const paint = performance.getEntriesByType('paint')
        const fcpEntry = paint.find((p) => p.name === 'first-contentful-paint')
        const fcp = fcpEntry ? fcpEntry.startTime / 1000 : nav ? nav.responseEnd / 1000 : 0
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
        const lastLcp = lcpEntries.length ? lcpEntries[lcpEntries.length - 1].startTime / 1000 : 0
        const tbt = Math.max(0, nav ? nav.loadEventEnd - nav.responseEnd : 0)
        const cls = 0
        const si = 0
        setPerformanceMetrics({ fcp, lcp: lastLcp, tbt, cls, si })
      } catch (err) {
        console.error("Debug: Error measuring performance:", err)
      }
    }
    
    measurePerformance()
  }, [])

  // Calculate integration issues
  const integrationIssues = allCars.filter(car => !car.approved || !car.isInventory)
  const approvedCars = allCars.filter(car => car.approved)
  const inventoryCars = allCars.filter(car => car.isInventory)
  const publicCars = allCars.filter(car => car.approved && car.isInventory)



  return (
    <Card className="w-full max-w-6xl mx-auto bg-card border-border">
      <CardHeader className="bg-card border-border">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-foreground gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <span className="text-sm sm:text-base">Advanced Debug Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-muted-foreground border-border hidden sm:inline">
              Last Refresh: {lastRefresh.toLocaleTimeString()}
            </Badge>
            <Button onClick={loadCars} disabled={loading} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 bg-background text-foreground">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-card border-border gap-1">
            <TabsTrigger value="overview" className="text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="firebase" className="text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">Config</TabsTrigger>
            <TabsTrigger value="integration" className="text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">Integration</TabsTrigger>
            <TabsTrigger value="performance" className="text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">Performance</TabsTrigger>
            <TabsTrigger value="debug" className="text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">Debug Data</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Cars</p>
                      <p className="text-2xl font-bold text-foreground">{allCars.length}</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Public Cars</p>
                      <p className="text-2xl font-bold text-foreground">{publicCars.length}</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Integration Issues</p>
                      <p className="text-2xl font-bold text-foreground">{integrationIssues.length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Core Web Vitals</p>
                      <p className="text-2xl font-bold text-foreground">
                        {performanceMetrics ? 'Active' : 'N/A'}
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {integrationIssues.length > 0 && (
              <Alert className="bg-destructive/10 border-destructive">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  <strong>{integrationIssues.length} cars have integration issues:</strong>
                  <ul className="mt-2 space-y-1">
                    {integrationIssues.slice(0, 3).map((car) => (
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

          {/* Config Tab */}
          <TabsContent value="firebase" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Core Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {firebaseStatus && Object.entries(firebaseStatus).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-card rounded border border-border">
                    <span className="font-medium text-muted-foreground">{key}:</span>
                    <Badge variant={value === "Set" || value.includes("Configured") ? "default" : value.includes("optional") ? "secondary" : "destructive"}>
                      {value}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Storage</h3>
              <div className="mb-4 p-3 bg-accent border border-border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  🔒 <strong>Security Note:</strong> The Blob token is intentionally hidden from the client for security. 
                  This is normal and correct behavior.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                {firebaseStatus && Object.entries(firebaseStatus)
                  .filter(([key]) => key.includes('blobToken'))
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-card rounded border border-border">
                      <span className="font-medium text-muted-foreground">{key}:</span>
                      <Badge variant={value.includes("Configured") ? "default" : value.includes("Not set") ? "secondary" : "destructive"}>
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
              <h3 className="text-lg font-semibold mb-3 text-foreground">Integration Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-sm">
                <div className="bg-card p-3 rounded-lg border border-border">
                  <div className="font-bold text-muted-foreground">Total Cars</div>
                  <div className="text-2xl font-bold text-foreground">{allCars.length}</div>
                </div>
                <div className="bg-card p-3 rounded-lg border border-border">
                  <div className="font-bold text-muted-foreground">Approved</div>
                  <div className="text-2xl font-bold text-foreground">{approvedCars.length}</div>
                </div>
                <div className="bg-card p-3 rounded-lg border border-border">
                  <div className="font-bold text-muted-foreground">In Inventory</div>
                  <div className="text-2xl font-bold text-foreground">{inventoryCars.length}</div>
                </div>
                <div className="bg-card p-3 rounded-lg border border-border">
                  <div className="font-bold text-muted-foreground">Public (Listings)</div>
                  <div className="text-2xl font-bold text-foreground">{publicCars.length}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Data Comparison</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-card rounded border border-border">
                  <span className="text-muted-foreground">Admin View Cars:</span>
                  <Badge variant="outline" className="text-muted-foreground border-border">{allCars.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded border border-border">
                  <span className="text-muted-foreground">Public View Cars:</span>
                  <Badge variant="outline" className="text-muted-foreground border-border">{cars.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded border border-border">
                  <span className="text-muted-foreground">Difference:</span>
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
              <h3 className="text-lg font-semibold mb-3 text-foreground">Performance Metrics</h3>
              {performanceMetrics ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{performanceMetrics.fcp.toFixed(1)}s</div>
                      <div className="text-sm text-muted-foreground">FCP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{performanceMetrics.lcp.toFixed(1)}s</div>
                      <div className="text-sm text-muted-foreground">LCP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{performanceMetrics.tbt.toFixed(0)}ms</div>
                      <div className="text-sm text-muted-foreground">TBT</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{performanceMetrics.cls.toFixed(3)}</div>
                      <div className="text-sm text-muted-foreground">CLS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{performanceMetrics.si.toFixed(1)}s</div>
                      <div className="text-sm text-muted-foreground">SI</div>
                    </div>
                  </div>
                  
                                           <div>
                           <div className="flex justify-between items-center mb-2">
                             <span className="text-sm font-medium text-muted-foreground">Core Web Vitals</span>
                           </div>
                             <div className="text-xs text-muted-foreground space-y-1">
                             <div>FCP: {performanceMetrics.fcp.toFixed(1)}s (Good: &lt;1.8s)</div>
                             <div>LCP: {performanceMetrics.lcp.toFixed(1)}s (Good: &lt;2.5s)</div>
                             <div>TBT: {performanceMetrics.tbt.toFixed(0)}ms (Good: &lt;200ms)</div>
                             <div>CLS: {performanceMetrics.cls.toFixed(3)} (Good: &lt;0.1)</div>
                             <div>SI: {performanceMetrics.si.toFixed(1)}s (Good: &lt;3.4s)</div>
                           </div>
                         </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p>Performance metrics not available</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Debug Data Tab */}
          <TabsContent value="debug" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Detailed Debug Information</h3>
              {debugInfo ? (
                <div className="space-y-4">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2 text-foreground">Summary</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="text-muted-foreground">Total Cars: {debugInfo.totalCars as number}</div>
                      <div className="text-muted-foreground">Approved: {(debugInfo.summary as Record<string, unknown>)?.approved as number || 0}</div>
                      <div className="text-muted-foreground">In Inventory: {(debugInfo.summary as Record<string, unknown>)?.inInventory as number || 0}</div>
                      <div className="text-muted-foreground">Featured: {(debugInfo.summary as Record<string, unknown>)?.featured as number || 0}</div>
                    </div>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2 text-foreground">Field Analysis</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="text-muted-foreground">Approved Undefined: {(debugInfo.summary as Record<string, unknown>)?.approvedUndefined as number || 0}</div>
                      <div className="text-muted-foreground">Inventory Undefined: {(debugInfo.summary as Record<string, unknown>)?.inventoryUndefined as number || 0}</div>
                      <div className="text-muted-foreground">Has ListedAt: {(debugInfo.summary as Record<string, unknown>)?.hasListedAt as number || 0}</div>
                      <div className="text-muted-foreground">Has CreatedAt: {(debugInfo.summary as Record<string, unknown>)?.hasCreatedAt as number || 0}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Individual Car Data</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto overflow-x-auto">
                                              {(debugInfo.cars as Record<string, unknown>[])?.map((car: Record<string, unknown>) => (
                          <div key={car.id as string} className="border rounded p-3 bg-card border-border">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-foreground truncate">{car.title as string || 'No Title'}</h5>
                                <p className="text-sm text-muted-foreground">ID: {car.id as string}</p>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant={(car.approved as boolean) ? "default" : "secondary"} className="text-xs">
                                  {(car.approved as boolean) ? "Approved" : "Not Approved"}
                                </Badge>
                                <Badge variant={(car.isInventory as boolean) ? "default" : "secondary"} className="text-xs">
                                  {(car.isInventory as boolean) ? "In Inventory" : "Not in Inventory"}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground grid grid-cols-2 gap-2">
                              <div>ListedAt: {(car.listedAt as unknown) ? 'Yes' : 'No'}</div>
                              <div>CreatedAt: {(car.createdAt as unknown) ? 'Yes' : 'No'}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-8 h-8 mx-auto mb-2" />
                  <p>Debug information not available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert className="bg-destructive/10 border-destructive">
            <XCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
} 