"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
// type import kept for reference of shape; not used directly
// import type { LoginResult } from "@/lib/simple-admin-auth"
import Image from "next/image"
import { Mail, Lock, Shield, ArrowLeft, RefreshCw } from "lucide-react"

export function EmailAdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'login' | 'verification'>('login')
  const [currentEmail, setCurrentEmail] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let recaptchaToken: string | undefined
      try {
        // @ts-expect-error recaptcha global provided by script at runtime
        if (window.grecaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
          // @ts-expect-error recaptcha global provided by script at runtime
          recaptchaToken = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'admin_login' })
        }
      } catch {}

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)

      const start = await fetch('/api/admin/login-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '') },
        credentials: 'include',
        body: JSON.stringify({ email, password, recaptchaToken }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      const result = await start.json().catch(() => ({} as unknown)) as { success?: boolean; requiresEmailVerification?: boolean; trusted?: boolean; message?: string; error?: string }

      if (start.ok && result?.success) {
        if (result.trusted || result.requiresEmailVerification) {
          setCurrentEmail(email)
          setStep('verification')
          if (!result.trusted) {
            toast({ title: 'Verification Required', description: 'Please check your email for the verification code.', duration: 5000 })
          }
          return
        }
        // Fallback: treat as verification path
        setCurrentEmail(email)
        setStep('verification')
        return
      }
      toast({ title: 'Login Failed', description: result?.error || result?.message || 'Invalid credentials or blocked by rate limit', variant: 'destructive' })
    } catch (err) {
      toast({
        title: "Error",
        description: (err instanceof Error && err.name === 'AbortError') ? 'Request timed out. Please try again.' : 'An unexpected error occurred. Please try again.',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const verify = await fetch('/api/admin/login-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '')
        },
        credentials: 'include',
        body: JSON.stringify({ email: currentEmail, code: verificationCode })
      })
      const result = await verify.json().catch(() => ({} as unknown)) as { success?: boolean; error?: string }

      if (verify.ok && result.success) {
        toast({
          title: "Verification Successful",
          description: "Welcome to the admin dashboard!",
        })
        // Ensure a hard navigation so new httpOnly cookies are applied to the next request/middleware
        try {
          router.replace("/admin/dashboard")
        } catch {}
        if (typeof window !== 'undefined') {
          window.location.href = "/admin/dashboard"
        }
      } else {
        const message = result.error || 'Invalid or expired code'
        // Auto-resend in cases where the server indicates no/expired code
        if (/No verification code|expired/i.test(message)) {
          try {
            await handleResendCode()
            toast({ title: 'New Code Sent', description: 'We sent you a new 6-digit code. Please check your email.' })
          } catch {}
        }
        toast({ title: "Verification Failed", description: message, variant: "destructive" })
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If already verified (short-lived flag), auto-redirect away from login
  useEffect(() => {
    try {
      const hasFlag = typeof document !== 'undefined' && document.cookie.includes('am_tycoons_admin_verified=1')
      if (hasFlag) {
        router.replace('/admin/dashboard')
      }
    } catch {}
  }, [router])

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/login-resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '') },
        credentials: 'include',
        body: JSON.stringify({ email: currentEmail })
      })
      const result = await res.json()
      if (result.success) {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email.",
        })
      } else {
        toast({
          title: "Failed to Resend",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to resend verification code.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const goBackToLogin = () => {
    setStep('login')
    setVerificationCode("")
    setCurrentEmail("")
  }

    if (step === 'verification') {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Image
              src="/optimized/am-tycoons-logo.webp"
              alt="AM Tycoons INC Logo"
              width={150}
              height={60}
              className="h-12 w-auto mx-auto mb-4"
            />
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                We&apos;ve sent a 6-digit verification code to <strong>{currentEmail}</strong>. 
                Please enter the code below to complete your login.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleVerification} className="space-y-4">
              <div>
                <Label htmlFor="verification-code">Verification Code</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center font-mono text-lg tracking-wider"
                    maxLength={6}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBackToLogin}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>
              </div>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Didn&apos;t receive the code? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-red-600 hover:underline"
                >
                  request a new one
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Image
            src="/optimized/am-tycoons-logo.webp"
            alt="AM Tycoons INC Logo"
            width={150}
            height={60}
            className="h-12 w-auto mx-auto mb-4"
          />
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Login
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Secure email-based authentication
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@amtycoonsinc.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              You&apos;ll receive a verification code via email
            </p>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-sm"
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
