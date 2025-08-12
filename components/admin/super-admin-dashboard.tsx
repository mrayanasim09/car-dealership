"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
type AdminUser = {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  permissions: string[]
  lastLogin: Date
}
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  Trash2, 
  Edit, 
  Eye, 
  Crown,
  LogOut,
  BarChart3
} from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminManagementProps {
  currentUser: AdminUser
}

export function SuperAdminDashboard({ currentUser }: AdminManagementProps) {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Form states for creating/editing admin
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "viewer" as "admin" | "editor" | "viewer" | "super_admin",
    permissions: [] as string[]
  })

  // Available permissions
  const availablePermissions = [
    { id: "view_dashboard", label: "View Dashboard", description: "Access to main dashboard" },
    { id: "view_cars", label: "View Cars", description: "View car listings" },
    { id: "manage_cars", label: "Manage Cars", description: "Add, edit, delete cars" },
    { id: "view_reviews", label: "View Reviews", description: "View customer reviews" },
    { id: "manage_reviews", label: "Manage Reviews", description: "Approve, delete reviews" },
    { id: "view_analytics", label: "View Analytics", description: "Access to analytics data" },
    { id: "manage_admins", label: "Manage Admins", description: "Create and manage other admins" },
    { id: "manage_settings", label: "Manage Settings", description: "Change system settings" }
  ]

  // Load admins on component mount
  useEffect(() => {
    loadAdmins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAdmins = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/users/list', { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        setAdmins(data.users)
      } else {
        throw new Error(data.error || 'Failed to load users')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load admins",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAdmin = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '') },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          permissions: formData.permissions
        })
      })
      const data = await res.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Admin user created successfully"
        })
        setShowCreateDialog(false)
        setFormData({ email: "", password: "", role: "viewer", permissions: [] })
        loadAdmins()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create admin",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditAdmin = (admin: AdminUser) => {
    setSelectedAdmin(admin)
    setFormData({
      email: admin.email,
      password: "",
      role: admin.role,
      permissions: admin.permissions
    })
    setShowEditDialog(true)
  }

  const handleUpdateAdmin = async () => {
    if (!selectedAdmin) return

    setIsLoading(true)
    try {
      const payload: Record<string, unknown> = { id: selectedAdmin.id }
      if (formData.role) payload.role = formData.role
      if (formData.permissions) payload.permissions = formData.permissions
      if (formData.password) payload.password = formData.password
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '') },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to update')
      toast({
        title: "Success",
        description: "Admin user updated successfully"
      })
      setShowEditDialog(false)
      setSelectedAdmin(null)
      loadAdmins()
    } catch {
      toast({
        title: "Error",
        description: "Failed to update admin",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this admin user?")) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '') },
        body: JSON.stringify({ id: adminId })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to delete')
      toast({
        title: "Success",
        description: "Admin user deleted successfully"
      })
      loadAdmins()
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete admin",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
          // Server cookie cleared via API
          fetch('/api/admin/logout', { method: 'POST' })
    router.push("/admin/login")
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-600"
      case "admin":
        return "bg-red-600"
      case "editor":
        return "bg-blue-600"
      case "viewer":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Crown className="h-4 w-4" />
      case "admin":
        return <Shield className="h-4 w-4" />
      case "editor":
        return <Edit className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Crown className="h-6 w-6 text-purple-600" />
                Super Admin Dashboard
              </h1>
              <Badge variant="default" className="bg-purple-600">
                Super Admin
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">
                Welcome, {currentUser.email}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Admin Management
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{admins.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active admin users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
                  <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">
                    Full system access
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Regular Admins</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {admins.filter(a => a.role === "admin").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Management access
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Editors</CardTitle>
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {admins.filter(a => a.role === "editor").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Content management
                  </p>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                As a Super Admin, you have complete control over the system. You can create new admin users, 
                assign roles and permissions, and manage all aspects of the car dealership platform.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Admin Management</h2>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create New Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Admin User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="admin@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: "admin" | "editor" | "viewer") => 
                          setFormData({ ...formData, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Permissions</Label>
                      <div className="space-y-2 mt-2">
                        {availablePermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={formData.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    permissions: [...formData.permissions, permission.id]
                                  })
                                } else {
                                  setFormData({
                                    ...formData,
                                    permissions: formData.permissions.filter(p => p !== permission.id)
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={permission.id} className="text-sm">
                              {permission.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateAdmin}
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating..." : "Create Admin"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {admins.map((admin) => (
                <Card key={admin.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(admin.role)}
                          <Badge className={getRoleBadgeColor(admin.role)}>
                            {admin.role.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-medium">{admin.email}</h3>
                           <p className="text-sm text-muted-foreground">
                            Last login: {admin.lastLogin.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAdmin(admin)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAdmin(admin.id)}
                          disabled={admin.role === "super_admin"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Permissions: {admin.permissions.join(', ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  System settings and configuration options will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Admin Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "editor" | "viewer") => 
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateAdmin}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Admin"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
