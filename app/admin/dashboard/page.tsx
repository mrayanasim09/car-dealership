import { Metadata } from "next"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { ProtectedRoute } from "@/components/admin/protected-route"

export const metadata: Metadata = {
  title: "Admin Dashboard - AM Tycoons Inc.",
  description: "Admin dashboard for AM Tycoons Inc. dealership management",
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}

