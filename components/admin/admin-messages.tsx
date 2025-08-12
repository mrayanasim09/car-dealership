"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MessageSquare, Trash2, CheckCircle, Clock, User } from "lucide-react"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: Date
  read: boolean
}

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/admin/messages', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Failed to load messages')
        type RawMessage = { id: string; name: string; email: string; phone?: string; subject?: string; message: string; read?: boolean; created_at?: string }
        const normalized: ContactMessage[] = (json.messages || []).map((m: RawMessage) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone || '',
          subject: m.subject || 'General Inquiry',
          message: m.message,
          read: !!m.read,
          createdAt: m.created_at ? new Date(m.created_at) : new Date(),
        }))
        setMessages(normalized)
      } catch (e) {
        console.error("Error fetching messages", e)
        toast({ title: 'Error', description: 'Failed to load messages', variant: 'destructive' })
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [toast])

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const res = await fetch('/api/admin/messages', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)?.[1] ?? '') }, body: JSON.stringify({ id: messageId, read: true }) })
      if (!res.ok) throw new Error('Failed')
      setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)))
      toast({
        title: "Success",
        description: "Message marked as read",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(messageId)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      setMessages(messages.filter((msg) => msg.id !== messageId))
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null)
      }
      toast({
        title: "Success",
        description: "Message deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    }
  }

  const unreadCount = messages.filter((msg) => !msg.read).length

  const renderDetail = () => {
    if (!selectedMessage) {
      return (
        <Card className="mobile-card">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center text-foreground/60">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-foreground/30" />
              <p>Select a message to view details</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {selectedMessage.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{selectedMessage.subject}</p>
            </div>
            <div className="flex space-x-2">
              {!selectedMessage.read && (
                <Button onClick={() => handleMarkAsRead(selectedMessage.id)} variant="outline" size="sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Read
                </Button>
              )}
              <Button
                onClick={() => handleDelete(selectedMessage.id)}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                {selectedMessage.email}
              </a>
            </div>
            {selectedMessage.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                  {selectedMessage.phone}
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Received on {selectedMessage.createdAt.toLocaleString()}</span>
          </div>
          <div>
            <h4 className="font-medium mb-2">Message:</h4>
            <div className="bg-muted p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => {
                window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Reply via Email
            </Button>
            {selectedMessage.phone && (
              <Button onClick={() => { window.location.href = `tel:${selectedMessage.phone}` }} variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Customer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Messages</h1>
            <p className="text-foreground/70">Manage customer inquiries and contact form submissions</p>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {unreadCount} unread
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Inbox ({messages.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="p-6 text-center text-foreground/60">No messages yet</div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border-b cursor-pointer hover:bg-card/60 ${
                          selectedMessage?.id === message.id ? "bg-primary/5 border-primary/30" : ""
                        } ${!message.read ? "bg-primary/10" : ""}`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-sm">{message.name}</h4>
                              {!message.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                            </div>
                            <p className="text-sm text-foreground/70 truncate">{message.subject}</p>
                             <p className="text-xs text-foreground/60 mt-1">
                               {message.createdAt.toLocaleDateString()}
                             </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">{renderDetail()}</div>
        </div>
    </div>
  )
}
