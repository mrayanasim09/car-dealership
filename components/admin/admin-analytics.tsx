"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  Car, 
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  MessageSquare
} from "lucide-react"
import { toast } from "sonner"

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  totalCars: number
  approvedCars: number
  totalRevenue: number
  inquiries: number
  conversionRate: number
  avgTimeOnSite: number
  topPerformingCars: Array<{
    id: string
    title: string
    views: number
    inquiries: number
  }>
  monthlyStats: Array<{
    month: string
    views: number
    inquiries: number
    revenue: number
  }>
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics: AnalyticsData = {
      pageViews: 1247,
      uniqueVisitors: 892,
      totalCars: 24,
      approvedCars: 18,
      totalRevenue: 125000,
      inquiries: 156,
      conversionRate: 12.5,
      avgTimeOnSite: 4.2,
      topPerformingCars: [
        { id: "1", title: "2021 Honda Civic Sport", views: 245, inquiries: 18 },
        { id: "2", title: "2022 BMW 3 Series", views: 198, inquiries: 12 },
        { id: "3", title: "2020 Toyota Camry", views: 167, inquiries: 9 },
        { id: "4", title: "2021 Ford F-150", views: 134, inquiries: 7 },
        { id: "5", title: "2022 Mercedes C-Class", views: 98, inquiries: 5 }
      ],
      monthlyStats: [
        { month: "Jan", views: 1200, inquiries: 45, revenue: 25000 },
        { month: "Feb", views: 1350, inquiries: 52, revenue: 28000 },
        { month: "Mar", views: 1100, inquiries: 38, revenue: 22000 },
        { month: "Apr", views: 1400, inquiries: 58, revenue: 30000 },
        { month: "May", views: 1600, inquiries: 65, revenue: 35000 },
        { month: "Jun", views: 1800, inquiries: 72, revenue: 40000 }
      ]
    }
    
    setAnalytics(mockAnalytics)
    setLoading(false)
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No analytics data available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Analytics will appear here once you have data
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Performance metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.pageViews)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.uniqueVisitors)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +8.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.inquiries)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +15.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +22.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Conversion</span>
                <span className="text-2xl font-bold text-green-600">{analytics.conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${analytics.conversionRate}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Avg. Time on Site:</span>
                  <span className="ml-2 font-medium">{analytics.avgTimeOnSite} min</span>
                </div>
                <div>
                  <span className="text-gray-600">Bounce Rate:</span>
                  <span className="ml-2 font-medium">32.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Cars</span>
                <span className="font-medium">{analytics.totalCars}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Approved</span>
                <span className="font-medium text-green-600">{analytics.approvedCars}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending</span>
                <span className="font-medium text-yellow-600">{analytics.totalCars - analytics.approvedCars}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>Approval Rate</span>
                  <span className="font-medium">
                    {Math.round((analytics.approvedCars / analytics.totalCars) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Cars */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Cars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topPerformingCars.map((car, index) => (
              <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-red-600">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{car.title}</h4>
                    <p className="text-sm text-gray-600">{formatNumber(car.views)} views</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{car.inquiries} inquiries</div>
                  <div className="text-sm text-gray-600">
                    {Math.round((car.inquiries / car.views) * 100)}% conversion
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.monthlyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{stat.month}</h4>
                    <p className="text-sm text-gray-600">{formatNumber(stat.views)} views</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{stat.inquiries} inquiries</div>
                  <div className="text-sm text-green-600">{formatCurrency(stat.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
