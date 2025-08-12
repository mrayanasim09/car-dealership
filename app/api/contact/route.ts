import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createRateLimitMiddleware, rateLimiters } from '@/lib/security/rate-limiter'
import { verifyRecaptcha } from '@/lib/security/recaptcha'

// Input validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address').max(100),
  phone: z.string().min(10, 'Phone number too short').max(20, 'Phone number too long'),
  message: z.string().min(10, 'Message too short').max(1000, 'Message too long'),
  carId: z.string().optional(),
  subject: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).optional(),
  recaptchaToken: z.string().optional(),
})

const guard = createRateLimitMiddleware(rateLimiters.contactForm)

// Spam detection
function detectSpam(data: Record<string, unknown>): boolean {
  const spamIndicators = [
    // Check for suspicious patterns
    /(buy|sell|loan|credit|casino|viagra|cialis)/i,
    /(http|www\.)/i,
    /(click here|visit now|limited time)/i,
    /(free|discount|offer|deal)/i,
    // Check for excessive repetition
    /(.)\1{10,}/,
    // Check for suspicious email patterns
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}.*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  ]

  const text = `${data.name} ${data.email} ${data.message}`.toLowerCase()
  
  return spamIndicators.some(pattern => pattern.test(text))
}

// Input sanitization
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove JavaScript
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000) // Limit length
}

export async function POST(request: NextRequest) {
  try {
    const blocked = await guard(request)
    if (blocked) return blocked
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

    // Parse and validate request body
    const body = await request.json()
    
    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const contactData = validationResult.data

    // Verify reCAPTCHA (v3)
    const remoteIp = request.headers.get('x-forwarded-for') || request.ip || undefined
    const recaptcha = await verifyRecaptcha(contactData.recaptchaToken, remoteIp, 'contact_form')
    if (!recaptcha.success) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed', details: recaptcha.errors, score: recaptcha.score },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(contactData.name),
      email: contactData.email.toLowerCase().trim(),
      phone: sanitizeInput(contactData.phone),
      message: sanitizeInput(contactData.message),
      carId: contactData.carId,
      subject: contactData.subject ? sanitizeInput(contactData.subject) : undefined,
      preferredContact: contactData.preferredContact
    }

    // Check for spam
    if (detectSpam(sanitizedData)) {
      console.warn('Potential spam detected from IP:', ip)
      return NextResponse.json(
        { error: 'Message appears to be spam. Please try again.' },
        { status: 400 }
      )
    }

    // Add metadata
    const contactWithMetadata = {
      ...sanitizedData,
      ip: ip,
      userAgent: request.headers.get('user-agent') || 'Unknown',
      timestamp: new Date(),
      status: 'new'
    }

    // Submit to Supabase (messages table)
    try {
      const { error } = await supabaseAdmin
        .from('messages')
        .insert({
          name: contactWithMetadata.name,
          email: contactWithMetadata.email,
          phone: contactWithMetadata.phone,
          subject: contactWithMetadata.subject || 'General Inquiry',
          message: contactWithMetadata.message,
        })
      if (error) throw error
    } catch (error) {
      console.error('Failed to submit contact form:', error)
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 201 }
    )

  } catch (error: unknown) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
