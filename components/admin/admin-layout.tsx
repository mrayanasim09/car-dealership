"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Image from "next/image"
import { LayoutDashboard, Car, MessageSquare, BarChart3, LogOut, Menu, X, Home } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isFirebaseAvailable } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Car Management", href: "/admin", icon: Car },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ]

  const handleLogout = async () => {
    try {
      if (auth && isFirebaseAvailable) {
        await signOut(auth)
      }
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AM%20Tycons-aZkudvf4oBnJ4CYO7p0guxqN0i4SE1.png"
              alt="AM Tycoons Logo"
              width={120}
              height={48}
              className="h-8 w-auto"
            />
            <Button onClick={() => setSidebarOpen(false)} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? "bg-red-100 text-red-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="flex flex-col h-full bg-white shadow-lg">
          <div className="flex items-center px-6 py-4 border-b">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AM%20Tycons-aZkudvf4oBnJ4CYO7p0guxqN0i4SE1.png"
              alt="AM Tycoons Logo"
              width={150}
              height={60}
              className="h-10 w-auto"
            />
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? "bg-red-100 text-red-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user?.email?.[0]?.toUpperCase() || "A"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.email || "Demo User"}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={() => router.push("/")} variant="outline" size="sm" className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isFirebaseAvailable ? "Logout" : "Exit Admin"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Button onClick={() => setSidebarOpen(true)} variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
