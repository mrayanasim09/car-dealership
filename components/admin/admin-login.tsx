"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Script from "next/script"

export function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      let recaptchaToken: string | undefined
      try {
        // reCAPTCHA v3 execution when available
        // @ts-expect-error recaptcha global provided by script at runtime
        if (window.grecaptcha && siteKey) {
          // @ts-expect-error recaptcha global provided by script at runtime
          recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'admin_login' })
        }
      } catch {}

      const res = await fetch('/api/admin/login-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '') },
        credentials: 'include',
        body: JSON.stringify({ email, password, recaptchaToken })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Login failed')
      
      // Set admin access for error monitoring
      localStorage.setItem('amtycoons-admin-access', 'true')
      localStorage.setItem('amtycoons-admin-login-time', new Date().toISOString())
      
      toast({
        title: "Success",
        description: data?.requiresEmailVerification ? 'Verification code sent to your email' : 'Logged in successfully',
      })
      // Redirect to admin dashboard after successful login
      if (data?.requiresEmailVerification) {
        router.push('/admin/login')
      } else {
        router.push("/admin/dashboard")
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Firebase removed; always show standard login form

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {siteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="lazyOnload"
        />
      ) : null}
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Image
            src="/optimized/am-tycoons-logo.webp"
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
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            {siteKey ? (
              <p className="mt-2 text-xs text-muted-foreground text-center">
                This site is protected by reCAPTCHA and the Google
                {' '}<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a>{' '}
                and
                {' '}<a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</a>{' '}apply.
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 
