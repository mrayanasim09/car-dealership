"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, ensureFirebaseInitialized } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Ensure Firebase is initialized
        await ensureFirebaseInitialized()
        
        // Ensure auth is properly initialized
        if (!auth || typeof auth.onAuthStateChanged !== 'function') {
          console.error('Auth object is not properly initialized')
          setIsLoading(false)
          router.push("/admin/login")
          return
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            // Check if user is admin
            const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || ['admin@amtycoons.com', 'mrayanasim09@gmail.com']
            
            if (adminEmails.includes(user.email || '')) {
              setIsAuthenticated(true)
            } else {
              // User is not admin, sign them out and redirect
              auth.signOut()
              router.push("/admin/login")
            }
          } else {
            // No user, redirect to login
            router.push("/admin/login")
          }
          setIsLoading(false)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error('Error initializing auth:', error)
        setIsLoading(false)
        router.push("/admin/login")
      }
    }

    initializeAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600 dark:text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
} 