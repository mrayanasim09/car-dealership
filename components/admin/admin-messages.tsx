"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar,
  Search,
  Filter,
  Reply,
  Archive,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  carId?: string
  carTitle?: string
  timestamp: Date
  status: 'new' | 'read' | 'replied' | 'archived'
  priority: 'low' | 'medium' | 'high'
}

export function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Mock data for demonstration
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 555-123-4567",
        subject: "Inquiry about Honda Civic",
        message: "Hi, I'm interested in the 2021 Honda Civic. Is it still available?",
        carId: "honda-civic-2021",
        carTitle: "2021 Honda Civic Sport",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: "new",
        priority: "high"
      },
      {
        id: "2",
        name: "Sarah Smith",
        email: "sarah@example.com",
        phone: "+1 555-987-6543",
        subject: "Financing Question",
        message: "What financing options do you have for the BMW 3 Series?",
        carId: "bmw-3-series",
        carTitle: "2022 BMW 3 Series",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        status: "read",
        priority: "medium"
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+1 555-456-7890",
        subject: "Trade-in Value",
        message: "I have a 2019 Toyota Camry to trade in. What's the process?",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        status: "replied",
        priority: "low"
      }
    ]
    
    setMessages(mockMessages)
    setLoading(false)
  }, [])

  const handleReply = (messageId: string) => {
    toast.success("Reply feature coming soon!")
  }

  const handleArchive = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'archived' as const } : msg
    ))
    toast.success("Message archived")
  }

  const handleDelete = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId))
    toast.success("Message deleted")
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || message.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'read': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'replied': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{messages.length}</p>
                <p className="text-sm text-gray-600">Total Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{messages.filter(m => m.status === 'new').length}</p>
                <p className="text-sm text-gray-600">New Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{messages.filter(m => m.status === 'replied').length}</p>
                <p className="text-sm text-gray-600">Replied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{messages.filter(m => m.priority === 'high').length}</p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{message.name}</h3>
                    <Badge className={getStatusColor(message.status)}>
                      {message.status}
                    </Badge>
                    <Badge className={getPriorityColor(message.priority)}>
                      {message.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{message.email}</p>
                  <p className="text-sm text-gray-600 mb-2">{message.phone}</p>
                  <h4 className="font-medium mb-2">{message.subject}</h4>
                  {message.carTitle && (
                    <p className="text-sm text-blue-600 mb-2">
                      Re: {message.carTitle}
                    </p>
                  )}
                  <p className="text-gray-700 dark:text-gray-300">{message.message}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    onClick={() => handleReply(message.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button
                    onClick={() => handleArchive(message.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                  <Button
                    onClick={() => handleDelete(message.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{message.timestamp.toLocaleString()}</span>
                <div className="flex items-center gap-4">
                  <a href={`mailto:${message.email}`} className="flex items-center gap-1 hover:text-blue-600">
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                  <a href={`tel:${message.phone}`} className="flex items-center gap-1 hover:text-green-600">
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No messages found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search criteria" 
                : "No messages have been received yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
