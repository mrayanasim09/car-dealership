"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isFirebaseAvailable } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isFirebaseAvailable) {
        // If Firebase is not available, show a configuration message
        return
      }

      if (!user) {
        router.push("/admin/login")
      }
    }
  }, [user, loading, isFirebaseAvailable, router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isFirebaseAvailable) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Firebase Configuration Required</h2>
          <p className="text-gray-600 mb-4">
            To access the admin dashboard, you need to configure Firebase Authentication.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-left">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Steps to configure:</strong>
            </p>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Create a Firebase project</li>
              <li>2. Enable Authentication</li>
              <li>3. Add environment variables</li>
              <li>4. Create an admin user</li>
            </ol>
          </div>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
