"use client"

import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }

    // In production, you could send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo })

    this.setState({
      error,
      errorInfo
    })
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We&apos;re sorry, but something unexpected happened. Please try again.
              </p>
            </div>

            <Alert className="mb-6">
              <AlertDescription>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left">
                    <summary className="cursor-pointer font-medium mb-2">
                      Error Details (Development)
                    </summary>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </details>
                )}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button onClick={this.resetError} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    setError(error)
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by hook:', error)
    }
  }, [])

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, resetError }
}

// Higher-order component for wrapping components with error handling
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
