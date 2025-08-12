import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Input validation schema
const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
  type: z.enum(['verification', 'reset']).default('verification')
})

// Rate limiting for email sending
const emailRateLimit = new Map<string, { count: number; lastSent: number }>()
const MAX_EMAILS_PER_HOUR = 10
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    const rateLimit = emailRateLimit.get(clientIP) || { count: 0, lastSent: 0 }
    
    // Reset counter if window has passed
    if (now - rateLimit.lastSent > RATE_LIMIT_WINDOW) {
      rateLimit.count = 0
    }
    
    if (rateLimit.count >= MAX_EMAILS_PER_HOUR) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      }, { status: 429 })
    }

    const body = await request.json()

    const validationResult = emailSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { email, code, type } = validationResult.data

    // Update rate limit
    rateLimit.count++
    rateLimit.lastSent = now
    emailRateLimit.set(clientIP, rateLimit)

    // Send email using production service
    const emailSent = await sendEmail(email, code, type)

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Verification email sent successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send email'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Send email API error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

// Production email sending function
async function sendEmail(email: string, code: string, type: string): Promise<boolean> {
  try {
    // Check if we have email service credentials
    const emailService = process.env.EMAIL_SERVICE || 'console'
    
    switch (emailService) {
      case 'resend':
        return await sendWithResend(email, code, type)
      case 'sendgrid':
        return await sendWithSendGrid(email, code, type)
      case 'nodemailer':
        return await sendWithNodemailer(email, code, type)
      default:
        // Fallback to console logging for development
        return await sendToConsole(email, code, type)
    }
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return false
  }
}

// Send with Resend (recommended for production)
async function sendWithResend(email: string, code: string, type: string): Promise<boolean> {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('⚠️  RESEND_API_KEY not set, falling back to console')
      return await sendToConsole(email, code, type)
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'noreply@amtycoonsinc.com',
        to: email,
        subject: `AM Tycoons Inc. - ${type === 'verification' ? 'Email Verification' : 'Password Reset'}`,
        html: generateEmailHTML(code, type),
        text: generateEmailText(code, type)
      })
    })

    if (response.ok) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ Email sent via Resend to: ${email}`)
      }
      return true
    }

    const error = await response.text()
    console.error('❌ Resend API error:', error)
    return false
  } catch (error) {
    console.error('❌ Resend error:', error)
    return false
  }
}

// Send with SendGrid
async function sendWithSendGrid(email: string, code: string, type: string): Promise<boolean> {
  try {
    const apiKey = process.env.SENDGRID_API_KEY
    if (!apiKey) {
      console.warn('⚠️  SENDGRID_API_KEY not set, falling back to console')
      return await sendToConsole(email, code, type)
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: process.env.FROM_EMAIL || 'noreply@amtycoonsinc.com' },
        subject: `AM Tycoons Inc. - ${type === 'verification' ? 'Email Verification' : 'Password Reset'}`,
        content: [
          { type: 'text/plain', value: generateEmailText(code, type) },
          { type: 'text/html', value: generateEmailHTML(code, type) }
        ]
      })
    })

    if (response.ok) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ Email sent via SendGrid to: ${email}`)
      }
      return true
    }

    const error = await response.text()
    console.error('❌ SendGrid API error:', error)
    return false
  } catch (error) {
    console.error('❌ SendGrid error:', error)
    return false
  }
}

// Send with Nodemailer (for custom SMTP)
async function sendWithNodemailer(email: string, code: string, type: string): Promise<boolean> {
  try {
    // This would require nodemailer package and SMTP configuration
    // For now, fall back to console
    console.warn('⚠️  Nodemailer not configured, falling back to console')
    return await sendToConsole(email, code, type)
  } catch (error) {
    console.error('❌ Nodemailer error:', error)
    return false
  }
}

// Console logging for development/testing
async function sendToConsole(email: string, code: string, type: string): Promise<boolean> {
  const emailContent = `
📧 AM Tycoons Inc. - ${type === 'verification' ? 'Email Verification' : 'Password Reset'}

🔐 Your verification code is: ${code}

⏰ This code will expire in 10 minutes.

⚠️  If you didn't request this code, please ignore this email.

Best regards,
AM Tycoons Inc. Team
  `

  if (process.env.NODE_ENV !== 'production') {
    console.log(`📧 Sending ${type} email to: ${email}`)
    console.log(`📧 Email content:\n${emailContent}`)
    console.log(`🔗 In production, this would be sent via email service`)
  }
  
  return true
}

// Generate HTML email content
function generateEmailHTML(code: string, type: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AM Tycoons Inc. - ${type === 'verification' ? 'Email Verification' : 'Password Reset'}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .code { font-size: 32px; font-weight: bold; color: #dc2626; text-align: center; padding: 20px; background: white; border: 2px solid #dc2626; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AM Tycoons Inc.</h1>
      <h2>${type === 'verification' ? 'Email Verification' : 'Password Reset'}</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your verification code is:</p>
      <div class="code">${code}</div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <p>Best regards,<br>AM Tycoons Inc. Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `
}

// Generate plain text email content
function generateEmailText(code: string, type: string): string {
  return `
AM Tycoons Inc. - ${type === 'verification' ? 'Email Verification' : 'Password Reset'}

Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
AM Tycoons Inc. Team
  `
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
