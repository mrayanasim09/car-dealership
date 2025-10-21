"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
}

// Predefined responses for common car dealership questions
const AUTO_RESPONSES: { [key: string]: string } = {
  'hours': 'Our hours are Monday-Friday 9AM-7PM, Saturday 9AM-6PM, Sunday 11AM-5PM. You can also browse our inventory online anytime!',
  'financing': 'We offer competitive financing options with approved credit. Our finance team works with multiple lenders to get you the best rates. Contact us at (424) 303-0386 to discuss your options.',
  'warranty': 'All our vehicles come with a comprehensive inspection report. Extended warranties are available for most vehicles. Contact our sales team for specific warranty details.',
  'trade': 'Yes, we accept trade-ins! We can provide a trade-in estimate based on your vehicle\'s condition, mileage, and market value. Bring your car in for a free appraisal.',
  'appointment': 'You can schedule a viewing for today by calling us at (424) 303-0386 or texting any of our contact numbers. We\'re also available via SMS for quick questions.',
  'inventory': 'Our inventory is updated daily. You can browse all available vehicles on our listings page. If you\'re looking for something specific, let us know and we\'ll help you find it!',
  'location': 'We\'re located in Los Angeles, CA. Contact us at (424) 303-0386 for our exact address and directions.',
  'contact': 'You can reach us at:\n• Primary: (424) 303-0386\n• Secondary: (310) 350-7709\n• Sales Team: (310) 972-0341\n• Customer Service: (310) 904-8377\nAll numbers support both calls and SMS!',
  'price': 'Our prices are competitive and we\'re open to negotiation. All vehicles are priced based on market value, condition, and mileage. Contact us to discuss pricing for any specific vehicle.',
  'inspection': 'All our vehicles undergo a thorough multi-point inspection. We provide detailed inspection reports and vehicle history when available. Your satisfaction and safety are our priorities.'
}

// Function to find the best response based on keywords
function findResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Check for common keywords and return appropriate responses
  if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('closed')) {
    return AUTO_RESPONSES.hours
  }
  if (lowerMessage.includes('financ') || lowerMessage.includes('loan') || lowerMessage.includes('credit')) {
    return AUTO_RESPONSES.financing
  }
  if (lowerMessage.includes('warrant') || lowerMessage.includes('guarantee')) {
    return AUTO_RESPONSES.warranty
  }
  if (lowerMessage.includes('trade') || lowerMessage.includes('trade-in')) {
    return AUTO_RESPONSES.trade
  }
  if (lowerMessage.includes('appointment') || lowerMessage.includes('viewing') || lowerMessage.includes('schedule') || lowerMessage.includes('visit')) {
    return AUTO_RESPONSES.appointment
  }
  if (lowerMessage.includes('inventory') || lowerMessage.includes('cars available') || lowerMessage.includes('selection')) {
    return AUTO_RESPONSES.inventory
  }
  if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
    return AUTO_RESPONSES.location
  }
  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('number') || lowerMessage.includes('call')) {
    return AUTO_RESPONSES.contact
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive') || lowerMessage.includes('cheap')) {
    return AUTO_RESPONSES.price
  }
  if (lowerMessage.includes('inspect') || lowerMessage.includes('condition') || lowerMessage.includes('history')) {
    return AUTO_RESPONSES.inspection
  }
  
  // Default response
  return "Thanks for your question! I'm here to help with information about our vehicles, financing, hours, and more. For specific vehicle details or to schedule a viewing, please call us at (424) 303-0386. Our team can provide personalized assistance with your car buying needs!"
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm here to help you with questions about our vehicles, financing, scheduling viewings, and more. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Simulate bot typing delay
  const sendBotResponse = (response: string) => {
    setIsTyping(true)
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now().toString(),
        content: response,
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isBot: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Get bot response
    const response = findResponse(newMessage)
    sendBotResponse(response)

    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container')
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }, [messages])

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4 z-50 md:bottom-4 pb-[env(safe-area-inset-bottom)]">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          size="lg"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="sr-only">Open chat</span>
        </Button>
        
        {/* Pulse animation for attention */}
        <div className="absolute -top-1 -right-1">
          <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse">
            AI
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-4 pb-[env(safe-area-inset-bottom)]">
      <Card className={`w-80 h-96 ${isMinimized ? 'h-12' : 'h-96'} transition-all duration-300 shadow-xl border-2`}>
        <CardHeader className="p-3 bg-red-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <CardTitle className="text-sm font-medium">AM Tycoons Assistant</CardTitle>
                <p className="text-xs opacity-90">Usually replies instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-red-700"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-white hover:bg-red-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages */}
            <div 
              id="messages-container"
              className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.isBot
                        ? 'bg-card text-foreground border border-border'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 opacity-70 ${message.isBot ? 'text-muted-foreground' : 'text-red-100'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-lg p-2 text-sm">
                    <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 text-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                For immediate assistance, call <a href="tel:+14243030386" className="text-red-600 hover:underline">(424) 303-0386</a>
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
