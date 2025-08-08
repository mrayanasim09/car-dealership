"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { useAuth } from "@/lib/auth-context"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Check if user is admin (you can customize this logic)
      if (user && user.email === "mrayanasim09@gmail.com") {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isAuthenticated ? (
        <AdminDashboard />
      ) : (
        <AdminLogin />
      )}
    </div>
  )
} 
