"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  MapPin, 
  Clock, 
  Shield, 
  X,
  AlertTriangle,
  Wifi
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { formatDistanceToNow } from 'date-fns'

interface SessionInfo {
  sessionId: string
  deviceInfo: {
    userAgent: string
    ip: string
    fingerprint: string
  }
  createdAt: string
  lastAccessedAt: string
  isCurrentSession: boolean
}

interface SessionStats {
  totalSessions: number
  activeSessions: number
  temporarySessions: number
}

export function SessionManagement() {
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load session data
  const loadSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/sessions')
      if (!response.ok) throw new Error('Failed to load sessions')
      
      const data = await response.json()
      setSessions(data.sessions || [])
      setStats(data.stats || null)
    } catch {
      toast({
        title: "Error",
        description: "Failed to load session information",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Terminate a specific session
  const terminateSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to terminate this session?')) return

    try {
      const response = await fetch('/api/admin/sessions/terminate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '') },
        body: JSON.stringify({ sessionId })
      })

      if (!response.ok) throw new Error('Failed to terminate session')

      toast({
        title: "Session Terminated",
        description: "The session has been successfully terminated",
        duration: 3000
      })

      loadSessions() // Reload sessions
    } catch {
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive"
      })
    }
  }

  // Terminate all other sessions
  const terminateAllOthers = async () => {
    if (!confirm('This will log you out of all other devices. Continue?')) return

    try {
      const response = await fetch('/api/admin/sessions/terminate-others', {
        method: 'POST',
        headers: { 'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '') }
      })

      if (!response.ok) throw new Error('Failed to terminate other sessions')

      toast({
        title: "Other Sessions Terminated",
        description: "All other sessions have been terminated",
        duration: 3000
      })

      loadSessions() // Reload sessions
    } catch {
      toast({
        title: "Error",
        description: "Failed to terminate other sessions",
        variant: "destructive"
      })
    }
  }

  // Get device icon based on user agent
  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase()
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="h-4 w-4" />
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet className="h-4 w-4" />
    }
    return <Monitor className="h-4 w-4" />
  }

  // Get device name from user agent
  const getDeviceName = (userAgent: string) => {
    const ua = userAgent.toLowerCase()
    if (ua.includes('chrome')) return 'Chrome Browser'
    if (ua.includes('firefox')) return 'Firefox Browser'
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari Browser'
    if (ua.includes('edge')) return 'Edge Browser'
    if (ua.includes('android')) return 'Android Device'
    if (ua.includes('iphone')) return 'iPhone'
    if (ua.includes('ipad')) return 'iPad'
    if (ua.includes('windows')) return 'Windows PC'
    if (ua.includes('mac')) return 'Mac Computer'
    if (ua.includes('linux')) return 'Linux System'
    return 'Unknown Device'
  }

  // Get location info (simplified)
  const getLocationInfo = (ip: string) => {
    if (ip === 'unknown' || ip.includes('127.0.0.1') || ip.includes('localhost')) {
      return 'Local Network'
    }
    // In a real app, you'd use a geolocation service
    return `IP: ${ip}`
  }

  useEffect(() => {
    loadSessions()
    // Refresh every 30 seconds
    const interval = setInterval(loadSessions, 30000)
    return () => clearInterval(interval)
  }, [loadSessions])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span className="ml-2">Loading sessions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Session Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{stats.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold">{stats.activeSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending 2FA</p>
                  <p className="text-2xl font-bold">{stats.temporarySessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Session Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          {sessions.length > 1 && (
            <Button
              onClick={terminateAllOthers}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Terminate Others
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {sessions.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No active sessions found. This might indicate a problem with session tracking.
              </AlertDescription>
            </Alert>
          ) : (
            sessions.map((session) => (
              <div
                key={session.sessionId}
                className={`border rounded-lg p-4 ${
                  session.isCurrentSession 
                    ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                    : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-accent rounded-lg">
                      {getDeviceIcon(session.deviceInfo.userAgent)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {getDeviceName(session.deviceInfo.userAgent)}
                        </h3>
                        {session.isCurrentSession && (
                          <Badge variant="default" className="bg-green-600">
                            Current Session
                          </Badge>
                        )}

                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{getLocationInfo(session.deviceInfo.ip)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            Last active {formatDistanceToNow(new Date(session.lastAccessedAt), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Session ID: {session.sessionId.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!session.isCurrentSession && (
                    <Button
                      onClick={() => terminateSession(session.sessionId)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Security Notes */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Tips:</strong> Regularly review your active sessions and terminate any that you don&apos;t recognize. 
          If you see suspicious activity, change your password immediately.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export function UserManagement() {
  const createAdmin = async (form: FormData) => {
    const email = String(form.get('email') || '').trim().toLowerCase()
    const password = String(form.get('password') || '')
    const role = String(form.get('role') || 'viewer')
    if (!email || !password) {
      alert('Email and password are required')
      return
    }
    const res = await fetch('/api/admin/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data?.error || 'Failed to create admin')
    } else {
      alert('Admin created')
      ;(document.getElementById('create-admin-form') as HTMLFormElement)?.reset()
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Create Admin</h3>
          <form id="create-admin-form" action={async (formData) => createAdmin(formData)} className="space-y-3">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email</label>
              <input name="email" type="email" className="w-full bg-background border border-border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Password</label>
              <input name="password" type="password" className="w-full bg-background border border-border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Role</label>
              <select name="role" defaultValue="viewer" className="w-full bg-background border border-border rounded px-3 py-2">
                <option value="admin">Admin (create/edit/approve/feature)</option>
                <option value="editor">Editor (edit/moderate)</option>
                <option value="viewer">Viewer (read-only)</option>
                <option value="super_admin">Super Admin (full)</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground rounded px-3 py-2">Create</button>
          </form>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Notes</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>All admins use email-code MFA on first login per device.</li>
            <li>Images use Vercel Blob; DB/Auth uses Supabase; emails via Resend.</li>
            <li>Roles map to permissions server-side; super_admin can manage users.</li>
          </ul>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Manage Admins</h3>
        <AdminList />
      </div>
    </div>
  )
}

function AdminList() {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<Array<{id: string; email: string; role: string; isActive: boolean; lastLogin: string | null}>>([])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users/list', { cache: 'no-store' })
      const data = await res.json()
      if (res.ok) setUsers(data.users || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const updateUser = async (id: string, payload: Partial<{ role: string; isActive: boolean; password: string }>) => {
    const res = await fetch('/api/admin/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...payload })
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data?.error || 'Update failed')
    } else {
      await loadUsers()
    }
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this admin?')) return
    const res = await fetch('/api/admin/users/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data?.error || 'Delete failed')
    } else {
      await loadUsers()
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b border-border">
            <th className="py-2 pr-3">Email</th>
            <th className="py-2 pr-3">Role</th>
            <th className="py-2 pr-3">Active</th>
            <th className="py-2 pr-3">Last Login</th>
            <th className="py-2 pr-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b border-border">
              <td className="py-2 pr-3 text-foreground break-words">{u.email}</td>
              <td className="py-2 pr-3">
                <select
                  className="bg-background border border-border rounded px-2 py-1"
                  value={u.role}
                  onChange={(e) => updateUser(u.id, { role: e.target.value })}
                >
                  <option value="super_admin">super_admin</option>
                  <option value="admin">admin</option>
                  <option value="editor">editor</option>
                  <option value="viewer">viewer</option>
                </select>
              </td>
              <td className="py-2 pr-3">
                <input
                  type="checkbox"
                  checked={u.isActive}
                  onChange={(e) => updateUser(u.id, { isActive: e.target.checked })}
                />
              </td>
              <td className="py-2 pr-3 text-muted-foreground">{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : '-'}</td>
              <td className="py-2 pr-3">
                <button className="text-red-600 hover:underline" onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!loading && users.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-muted-foreground">No admins found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
