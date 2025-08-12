"use client"

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { X, AlertTriangle, CheckCircle } from 'lucide-react'
// Firebase removed; keep local notifications only. Remote team alerts disabled.

interface ErrorNotification {
  id: string
  message: string
  type: 'error' | 'warning' | 'info'
  timestamp: Date
}

export function ErrorMonitor() {
  const [notifications, setNotifications] = useState<ErrorNotification[]>([])
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  // clientId removed; local notifications do not require it

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const addNotification = useCallback((notification: Omit<ErrorNotification, 'id' | 'timestamp'>) => {
    const newNotification: ErrorNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-hide each toast after 4 seconds
    setTimeout(() => removeNotification(newNotification.id), 4000)

    // Remote broadcast disabled since Firebase was removed
  }, [removeNotification])

  useEffect(() => {
    // Enable monitor only after admin login and only when notifications exist
    const adminAccess = localStorage.getItem('amtycoons-admin-access')
    const adminLoginTime = localStorage.getItem('amtycoons-admin-login-time')
    const alerts = localStorage.getItem('amtycoons-admin-alerts')
    
    if (adminAccess && adminLoginTime) {
      const loginTime = new Date(adminLoginTime)
      const now = new Date()
      const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)
      
      // Only show error monitor for 24 hours after admin login
      if (hoursSinceLogin < 24) {
        setIsAdminUser(true)
        setAlertsEnabled(alerts === 'enabled')
        setShowBanner(false)
        
        // Request notification permission for admin users
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              addNotification({
                message: 'Notifications enabled for error monitoring',
                type: 'info'
              })
            }
          })
        }
      }
    }
  }, [addNotification])

  useEffect(() => {
    if (!isAdminUser) return

    // Capture console errors
    const originalError = console.error
    const originalWarn = console.warn

    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ')
      
      addNotification({
        message: `Error: ${message}`,
        type: 'error'
      })
      
      originalError.apply(console, args)
    }

    console.warn = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ')
      
      addNotification({
        message: `Warning: ${message}`,
        type: 'warning'
      })
      
      originalWarn.apply(console, args)
    }

    // Capture unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addNotification({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        type: 'error'
      })
    }

    // Capture global errors
    const handleGlobalError = (event: ErrorEvent) => {
      addNotification({
        message: `Global Error: ${event.message}`,
        type: 'error'
      })
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleGlobalError)

    // Remote subscription disabled since Firebase was removed
    let unsubscribeAlerts: (() => void) | undefined

    return () => {
      console.error = originalError
      console.warn = originalWarn
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleGlobalError)
      if (unsubscribeAlerts) unsubscribeAlerts()
    }
  }, [addNotification, isAdminUser])

  const toggleAlerts = () => {
    const next = !alertsEnabled
    setAlertsEnabled(next)
    localStorage.setItem('amtycoons-admin-alerts', next ? 'enabled' : 'disabled')
  }

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'info':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (!isAdminUser) return null

    return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs sm:max-w-sm">
      {showBanner && (
        <div className="p-2 rounded bg-background text-foreground border border-border flex items-center justify-between">
          <span className="text-xs">Team Alerts: {alertsEnabled ? 'On' : 'Off'}</span>
          <Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-white/10 hover:bg-white/20 min-w-[60px]" onClick={toggleAlerts}>
            {alertsEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
      )}
      {notifications.length === 0 ? null : (
        <></>
      )}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg ${getNotificationStyles(notification.type)}`}
        >
          <div className="flex items-start gap-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium break-words">
                {notification.message}
              </p>
              <p className="text-xs opacity-75 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="p-1 h-auto text-current hover:bg-current hover:bg-opacity-10"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
