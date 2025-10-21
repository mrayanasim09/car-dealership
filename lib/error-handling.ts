// Comprehensive error handling system for AM Tycoons Inc.
export interface UserFriendlyError {
  title: string
  message: string
  suggestion: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  code?: string
  retryable: boolean
}

export interface ErrorContext {
  action: string
  component?: string
  userId?: string
  timestamp: Date
  userAgent?: string
  ip?: string
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorLog: Array<{ error: Error; context: ErrorContext; timestamp: Date }> = []

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // Convert technical errors to user-friendly messages
  toUserFriendlyError(error: Error): UserFriendlyError {
    const errorMessage = error.message.toLowerCase()
    const errorName = error.name.toLowerCase()

    // Authentication errors
    if (errorMessage.includes('unauthorized') || errorMessage.includes('auth') || errorName.includes('auth')) {
      return {
        title: 'Access Denied',
        message: 'You don\'t have permission to perform this action.',
        suggestion: 'Please log in with an account that has the required permissions.',
        severity: 'medium',
        code: 'AUTH_ERROR',
        retryable: false
      }
    }

    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('timeout')) {
      return {
        title: 'Connection Problem',
        message: 'We\'re having trouble connecting to our servers.',
        suggestion: 'Please check your internet connection and try again.',
        severity: 'medium',
        code: 'NETWORK_ERROR',
        retryable: true
      }
    }

    // Validation errors
    if (errorMessage.includes('validation') || errorMessage.includes('invalid') || errorMessage.includes('required')) {
      return {
        title: 'Invalid Information',
        message: 'Some of the information you provided is incorrect.',
        suggestion: 'Please review your input and try again.',
        severity: 'low',
        code: 'VALIDATION_ERROR',
        retryable: true
      }
    }

    // Server errors
    if (errorMessage.includes('server') || errorMessage.includes('500') || errorMessage.includes('internal')) {
      return {
        title: 'Server Error',
        message: 'We\'re experiencing technical difficulties.',
        suggestion: 'Please try again in a few minutes. If the problem persists, contact support.',
        severity: 'high',
        code: 'SERVER_ERROR',
        retryable: true
      }
    }

    // Rate limiting errors
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
      return {
        title: 'Too Many Requests',
        message: 'You\'ve made too many requests in a short time.',
        suggestion: 'Please wait a moment before trying again.',
        severity: 'medium',
        code: 'RATE_LIMIT_ERROR',
        retryable: true
      }
    }

    // File upload errors
    if (errorMessage.includes('file') || errorMessage.includes('upload') || errorMessage.includes('size')) {
      return {
        title: 'File Upload Error',
        message: 'There was a problem uploading your file.',
        suggestion: 'Please ensure your file is under 10MB and try again.',
        severity: 'low',
        code: 'FILE_ERROR',
        retryable: true
      }
    }

    // Database errors
    if (errorMessage.includes('database') || errorMessage.includes('db') || errorMessage.includes('sql')) {
      return {
        title: 'Data Error',
        message: 'We\'re having trouble accessing our data.',
        suggestion: 'Please try again. If the problem persists, contact support.',
        severity: 'high',
        code: 'DATABASE_ERROR',
        retryable: true
      }
    }

    // Default error
    return {
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred.',
      suggestion: 'Please try again. If the problem persists, contact our support team.',
      severity: 'medium',
      code: 'UNKNOWN_ERROR',
      retryable: true
    }
  }

  // Log error with context
  logError(error: Error, context?: Partial<ErrorContext>): void {
    const errorContext: ErrorContext = {
      action: context?.action || 'unknown',
      component: context?.component,
      userId: context?.userId,
      timestamp: new Date(),
      userAgent: context?.userAgent,
      ip: context?.ip
    }

    this.errorLog.push({ error, context: errorContext, timestamp: new Date() })

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService()
    }

    // Keep only last 100 errors in memory
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100)
    }
  }

  // Get recent errors for debugging
  getRecentErrors(limit?: number): Array<{ error: Error; context: ErrorContext; timestamp: Date }> {
    if (limit === undefined) {
      return this.errorLog.slice(-100) // Return all errors (up to 100)
    }
    return this.errorLog.slice(-limit)
  }

  // Clear error log
  clearErrorLog(): void {
    this.errorLog = []
  }

  // Send error to external service (implement based on your error reporting service)
  private sendToErrorService(): void {
    // Example: Sentry, LogRocket, etc.
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry.captureException(error, { extra: context })
    }
  }

  // Handle specific error types
  handleApiError(status: number, message?: string): UserFriendlyError {
    switch (status) {
      case 400:
        return {
          title: 'Bad Request',
          message: 'The information you sent is not valid.',
          suggestion: 'Please check your input and try again.',
          severity: 'low',
          code: 'BAD_REQUEST',
          retryable: true
        }
      case 401:
        return {
          title: 'Not Authorized',
          message: 'You need to be logged in to perform this action.',
          suggestion: 'Please log in and try again.',
          severity: 'medium',
          code: 'UNAUTHORIZED',
          retryable: false
        }
      case 403:
        return {
          title: 'Access Forbidden',
          message: 'You don\'t have permission to access this resource.',
          suggestion: 'Contact an administrator if you believe this is an error.',
          severity: 'medium',
          code: 'FORBIDDEN',
          retryable: false
        }
      case 404:
        return {
          title: 'Not Found',
          message: 'The resource you\'re looking for doesn\'t exist.',
          suggestion: 'Check the URL or navigate back to the main page.',
          severity: 'low',
          code: 'NOT_FOUND',
          retryable: false
        }
      case 429:
        return {
          title: 'Too Many Requests',
          message: 'You\'ve made too many requests recently.',
          suggestion: 'Please wait a moment before trying again.',
          severity: 'medium',
          code: 'RATE_LIMITED',
          retryable: true
        }
      case 500:
        return {
          title: 'Server Error',
          message: 'Our servers are experiencing issues.',
          suggestion: 'Please try again in a few minutes.',
          severity: 'high',
          code: 'SERVER_ERROR',
          retryable: true
        }
      case 503:
        return {
          title: 'Service Unavailable',
          message: 'Our service is temporarily unavailable.',
          suggestion: 'Please try again later.',
          severity: 'high',
          code: 'SERVICE_UNAVAILABLE',
          retryable: true
        }
      default:
        return {
          title: 'Request Failed',
          message: message || 'Your request could not be completed.',
          suggestion: 'Please try again or contact support if the problem persists.',
          severity: 'medium',
          code: `HTTP_${status}`,
          retryable: true
        }
    }
  }
}

export const errorHandler = ErrorHandler.getInstance()

// Utility functions for common error scenarios
export const createUserFriendlyError = (error: Error): UserFriendlyError => {
  return errorHandler.toUserFriendlyError(error)
}

export const logError = (error: Error, context?: Partial<ErrorContext>): void => {
  errorHandler.logError(error, context)
}

export const handleApiError = (status: number, message?: string): UserFriendlyError => {
  return errorHandler.handleApiError(status, message)
}
