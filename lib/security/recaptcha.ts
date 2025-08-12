import env from '@/lib/config/env'

type RecaptchaVerifyResponse = {
  success: boolean
  challenge_ts?: string
  hostname?: string
  score?: number
  action?: string
  'error-codes'?: string[]
}

export type RecaptchaCheck = {
  success: boolean
  score?: number
  action?: string
  errors?: string[]
}

/**
 * Verify a reCAPTCHA v3 token using Google's verification endpoint.
 */
export async function verifyRecaptcha(
  token: string | undefined,
  remoteIp?: string,
  expectedAction?: string,
  minScore: number = 0.5,
): Promise<RecaptchaCheck> {
  try {
    if (!env.services.recaptcha.secretKey) {
      // If reCAPTCHA is not configured, skip verification to avoid blocking login
      // Recommended: set NEXT_PUBLIC_RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY to enable
      return { success: true, score: 1 }
    }
    if (!token) {
      return { success: false, errors: ['missing-token'] }
    }

    const params = new URLSearchParams()
    params.set('secret', env.services.recaptcha.secretKey as string)
    params.set('response', token)
    if (remoteIp) params.set('remoteip', remoteIp)

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      // ReCAPTCHA endpoint is external; no cache
      cache: 'no-store',
    })
    const data = (await res.json()) as RecaptchaVerifyResponse

    if (!data.success) {
      return { success: false, errors: data['error-codes'] }
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      return { success: false, score: data.score, action: data.action, errors: ['action-mismatch'] }
    }

    if (typeof data.score === 'number' && data.score < minScore) {
      return { success: false, score: data.score, action: data.action, errors: ['low-score'] }
    }

    return { success: true, score: data.score, action: data.action }
  } catch (error) {
    console.error('verifyRecaptcha error:', error)
    return { success: false, errors: ['verify-failed'] }
  }
}


