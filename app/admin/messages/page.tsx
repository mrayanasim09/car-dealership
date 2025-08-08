import { AdminMessages } from "@/components/admin/admin-messages"
import { ProtectedRoute } from "@/components/protected-route"

export const metadata = {
  title: "Messages - AM Tycoons Admin",
  description: "Manage customer inquiries and contact form submissions",
}

export default function AdminMessagesPage() {
  return (
    <ProtectedRoute>
      <AdminMessages />
    </ProtectedRoute>
  )
} 
