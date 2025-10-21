"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import { BrandName } from "@/components/brand-name"
import { LayoutDashboard, Car, LogOut, Menu, X, Home } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Car Management", href: "/admin/dashboard", icon: Car },
  ]

  const handleLogout = async () => {
    try {
      // Stateless logout handled server-side; clear any local flags
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground touch-pan-y lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-background/50" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-background shadow-lg border-r border-border overflow-y-auto overscroll-contain">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              {/* Logo Image - Same as navbar for consistency */}
              <div className="relative w-12 h-8">
                <Image
                  src="/optimized/am-tycoons-logo.webp"
                  alt="AM Tycoons Inc. Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="48px"
                />
              </div>
              <div className="hidden sm:block">
                 <div className="text-sm font-bold text-foreground"><BrandName /></div>
                 <div className="text-xs text-muted-foreground">FIND YOUR PERFECT DRIVE</div>
              </div>
            </div>
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
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
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
         <div className="hidden lg:block lg:col-start-1 lg:row-span-full lg:w-64">
          <div className="flex flex-col h-full bg-background text-foreground shadow-lg border-r border-border">
          <div className="flex items-center px-6 py-4 border-b border-border">
            <div className="flex items-center space-x-3">
              {/* Logo Image - Same as navbar for consistency */}
              <div className="relative w-16 h-10">
                <Image
                  src="/optimized/am-tycoons-logo.webp"
                  alt="AM Tycoons Inc. Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="64px"
                />
              </div>
              <div>
                 <div className="text-sm font-bold text-foreground"><BrandName /></div>
                 <div className="text-xs text-muted-foreground">FIND YOUR PERFECT DRIVE</div>
              </div>
            </div>
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
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
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

           <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                 <span className="text-primary-foreground text-sm font-medium">{user?.email?.[0]?.toUpperCase() || "A"}</span>
              </div>
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user?.email || "Admin"}</p>
                 <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>

            <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <span className="text-xs text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
               <Button onClick={() => router.push("/")} variant="outline" size="sm" className="w-full justify-start bg-transparent border-border text-muted-foreground">
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Button>
               <Button
                onClick={handleLogout}
                 variant="outline"
                size="sm"
                 className="w-full justify-start text-primary bg-transparent border-border hover:bg-primary/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                 Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-0 lg:col-start-2">
        {/* Top bar - improved mobile UX, sticky and larger touch targets */}
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-sm border-b border-border lg:hidden sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <Button onClick={() => setSidebarOpen(true)} variant="ghost" size="lg" className="h-11 w-11 p-0">
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-base font-semibold truncate">Admin</h1>
            <div className="flex items-center space-x-1">
              <ThemeToggle />
              <Button onClick={handleLogout} variant="ghost" size="lg" className="h-11 w-11 p-0">
                <LogOut className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content - mobile-first scrolling */}
        <main className="min-h-screen p-4 sm:p-6 bg-background max-w-7xl mx-auto lg:max-w-none lg:mx-0 lg:px-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
