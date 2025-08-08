"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminLayout } from "@/components/admin/admin-layout"
import { getAnalytics } from "@/lib/firebase"
import { BarChart3, TrendingUp, DollarSign, Eye, MessageSquare, Calendar, Star } from "lucide-react"

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalViews: 12450,
    totalInquiries: 234,
    averageRating: 4.7,
    totalRevenue: 450000,
    monthlyData: [
      { month: "Jan", sales: 12, revenue: 45000, inquiries: 28 },
      { month: "Feb", sales: 15, revenue: 52000, inquiries: 32 },
      { month: "Mar", sales: 18, revenue: 68000, inquiries: 41 },
      { month: "Apr", sales: 22, revenue: 78000, inquiries: 38 },
      { month: "May", sales: 19, revenue: 65000, inquiries: 45 },
      { month: "Jun", sales: 25, revenue: 89000, inquiries: 52 },
    ],
    topCars: [
      { make: "Honda", model: "Civic", views: 1250, inquiries: 45 },
      { make: "Toyota", model: "Camry", views: 1100, inquiries: 38 },
      { make: "Ford", model: "F-150", views: 980, inquiries: 42 },
      { make: "BMW", model: "3 Series", views: 850, inquiries: 28 },
    ],
    recentActivity: [
      { type: "inquiry", message: "New inquiry for 2021 Honda Civic", time: "2 hours ago" },
      { type: "review", message: "5-star review for 2019 Toyota Camry", time: "4 hours ago" },
      { type: "sale", message: "2020 Ford F-150 marked as sold", time: "6 hours ago" },
      { type: "listing", message: "New car added: 2022 Audi A4", time: "1 day ago" },
    ],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics()
        if (data) {
          setAnalytics(data)
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const stats = [
    {
      title: "Total Views",
      value: analytics.totalViews.toLocaleString(),
      change: "+12.5%",
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Inquiries",
      value: analytics.totalInquiries.toString(),
      change: "+8.2%",
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      title: "Average Rating",
      value: analytics.averageRating.toString(),
      change: "+0.3",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      title: "Revenue (YTD)",
      value: `$${(analytics.totalRevenue / 1000).toFixed(0)}K`,
      change: "+15.3%",
      icon: DollarSign,
      color: "text-red-600",
    },
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your dealership's performance and insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Monthly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.monthlyData.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-blue-600">{month.sales} sales</span>
                          <span className="text-green-600">${(month.revenue / 1000).toFixed(0)}K</span>
                          <span className="text-orange-600">{month.inquiries} inquiries</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Cars */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Top Performing Cars
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topCars.map((car, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {car.make} {car.model}
                          </p>
                          <p className="text-sm text-gray-500">{car.views} views</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">{car.inquiries} inquiries</p>
                          <p className="text-xs text-gray-500">
                            {((car.inquiries / car.views) * 100).toFixed(1)}% conversion
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">3.2%</div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">2.4 min</div>
                    <p className="text-sm text-gray-600">Avg. Time on Site</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">68%</div>
                    <p className="text-sm text-gray-600">Return Visitors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "inquiry"
                            ? "bg-blue-500"
                            : activity.type === "review"
                              ? "bg-yellow-500"
                              : activity.type === "sale"
                                ? "bg-green-500"
                                : "bg-purple-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
