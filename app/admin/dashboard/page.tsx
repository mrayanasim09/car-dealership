"use client"

import dynamic from 'next/dynamic'
const AdminDashboard = dynamic(() => import("@/components/admin/admin-dashboard").then(m => m.AdminDashboard), { ssr: false })

export default function AdminDashboardPage() {
  return (
    <AdminDashboard />
  )
}
