"use client"

import React from 'react'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, X, Info, AlertCircle, XCircle } from 'lucide-react'
import { UserFriendlyError } from '@/lib/error-handling'
import { cn } from '@/lib/utils'

interface ErrorDisplayProps {
  error: UserFriendlyError
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
  showDetails?: boolean
}

const severityConfig = {
  low: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
    iconClassName: 'text-blue-500'
  },
  medium: {
    icon: AlertTriangle,
    className: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
    iconClassName: 'text-yellow-500'
  },
  high: {
    icon: AlertCircle,
    className: 'border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
    iconClassName: 'text-orange-500'
  },
  critical: {
    icon: XCircle,
    className: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200',
    iconClassName: 'text-red-500'
  }
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  className,
  showDetails = false 
}: ErrorDisplayProps) {
  const config = severityConfig[error.severity]
  const IconComponent = config.icon

  return (
    <Alert className={cn(
      'border-l-4 border-l-current',
      config.className,
      className
    )}>
      <div className="flex items-start gap-3">
        <IconComponent className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconClassName)} />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold mb-1">
            {error.title}
          </h4>
          
          <AlertDescription className="mb-2">
            {error.message}
          </AlertDescription>
          
          {error.suggestion && (
            <p className="text-sm opacity-90 mb-3">
              💡 {error.suggestion}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2">
            {error.retryable && onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="h-8 px-3 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </Button>
            )}
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-8 px-3 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            )}
          </div>
          
          {showDetails && error.code && (
            <details className="mt-3 text-xs opacity-75">
              <summary className="cursor-pointer hover:opacity-100">
                Error Code: {error.code}
              </summary>
              <div className="mt-2 p-2 bg-black/5 dark:bg-white/5 rounded text-xs font-mono">
                Severity: {error.severity.toUpperCase()}
                <br />
                Retryable: {error.retryable ? 'Yes' : 'No'}
              </div>
            </details>
          )}
        </div>
      </div>
    </Alert>
  )
}

// Inline error display for forms
export function InlineError({ 
  error, 
  className 
}: { 
  error: string | UserFriendlyError
  className?: string 
}) {
  if (typeof error === 'string') {
    return (
      <div className={cn('text-sm text-red-600 dark:text-red-400 mt-1', className)}>
        {error}
      </div>
    )
  }

  return (
    <div className={cn('text-sm mt-1', className)}>
      <span className="text-red-600 dark:text-red-400">
        {error.message}
      </span>
      {error.suggestion && (
        <span className="text-gray-600 dark:text-gray-400 ml-2">
          {error.suggestion}
        </span>
      )}
    </div>
  )
}

// Full-page error display
export function FullPageError({ 
  error, 
  onRetry, 
  showHomeButton = true 
}: { 
  error: UserFriendlyError
  onRetry?: () => void
  showHomeButton?: boolean
}) {
  const config = severityConfig[error.severity]
  const IconComponent = config.icon

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <IconComponent className={cn('h-16 w-16 mx-auto mb-4', config.iconClassName)} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error.message}
          </p>
          {error.suggestion && (
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
              💡 {error.suggestion}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {error.retryable && onRetry && (
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          
          {showHomeButton && (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                Go Home
              </Link>
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
          If this problem persists, please contact our support team.
        </p>
      </div>
    </div>
  )
}
