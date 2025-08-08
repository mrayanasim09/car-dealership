import { AdminAnalytics } from "@/components/admin/admin-analytics"
import { ProtectedRoute } from "@/components/protected-route"

export const metadata = {
  title: "Analytics - AM Tycoons Admin",
  description: "View detailed analytics and insights for your car dealership",
}

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute>
      <AdminAnalytics />
    </ProtectedRoute>
  )
} 
