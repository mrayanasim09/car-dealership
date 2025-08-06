import { Metadata } from "next"
import { AdminLogin } from "@/components/admin/admin-login"

export const metadata: Metadata = {
  title: "Admin Login - AM Tycoons Inc.",
  description: "Secure admin login for AM Tycoons Inc. management panel",
}

export default function AdminLoginPage() {
  return <AdminLogin />
}
