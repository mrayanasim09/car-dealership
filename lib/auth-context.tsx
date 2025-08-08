"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged, getIdToken } from "firebase/auth"
import { auth, isFirebaseAvailable, getFirebaseStatus } from "./firebase"
import Cookies from 'js-cookie'

interface AuthContextType {
  user: User | null
  loading: boolean
  isFirebaseAvailable: boolean
  firebaseStatus: any
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirebaseAvailable: false,
  firebaseStatus: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseAvailable, setFirebaseAvailable] = useState(false)
  const [firebaseStatus, setFirebaseStatus] = useState(getFirebaseStatus())

  useEffect(() => {
    // Check Firebase status
    const available = isFirebaseAvailable()
    const status = getFirebaseStatus()

    setFirebaseAvailable(available)
    setFirebaseStatus(status)

    if (!available || !auth) {
      console.log("🔥 Firebase Auth not available, using demo mode")
      setLoading(false)
      return
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("🔥 Auth state changed:", user ? "logged in" : "logged out")
        setUser(user)
        
        // If user is logged in, get the token and store it in a cookie
        if (user) {
          try {
            const token = await getIdToken(user)
            // Set cookie with token that expires in 7 days
            Cookies.set('firebase-auth-token', token, { expires: 7, secure: true, sameSite: 'strict' })
          } catch (error) {
            console.error("Error getting auth token:", error)
          }
        } else {
          // Remove the cookie when user logs out
          Cookies.remove('firebase-auth-token')
        }
        
        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error("❌ Error setting up auth state listener:", error)
      setLoading(false)
      setFirebaseAvailable(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isFirebaseAvailable: firebaseAvailable, firebaseStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

