import Script from 'next/script'
import { EmailAdminLogin } from "@/components/admin/email-admin-login"

export const metadata = {
  title: "Admin Login - AM Tycoons",
  description: "Admin access to manage car listings",
}

export default function AdminLoginPage() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  return (
    <>
      {siteKey ? (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`} strategy="afterInteractive" />
      ) : null}
      <EmailAdminLogin />
    </>
  )
} 
