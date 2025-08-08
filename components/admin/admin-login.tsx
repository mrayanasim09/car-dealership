"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

export function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { isFirebaseAvailable } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFirebaseAvailable || !auth) {
      toast({
        title: "Configuration Error",
        description: "Firebase Authentication is not configured. Please set up Firebase first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      // Redirect to admin dashboard after successful login
      router.push("/admin/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isFirebaseAvailable) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Image
              src="/AmTyconsINC.png"
              alt="AM Tycoons INC Logo"
              width={150}
              height={60}
              className="h-12 w-auto mx-auto mb-4"
            />
            <CardTitle>Firebase Configuration Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Firebase Authentication is not configured. Please set up Firebase to enable admin login.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Image
            src="/AmTyconsINC.png"
            alt="AM Tycoons INC Logo"
            width={150}
            height={60}
            className="h-12 w-auto mx-auto mb-4"
          />
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 
