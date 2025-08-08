"use client"

import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
} 
