'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, Send, Bot, User, Zap, Brain, Loader2 } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  analysis?: any
  context?: string
}

interface LangChainChatProps {
  context?: {
    sequence?: string
    sequence_type?: string
    analysis?: any
  }
}

export default function LangChainChat({ context }: LangChainChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI molecular analysis assistant powered by LangChain. I can help you analyze sequences, understand docking results, and provide insights about molecular structures. What would you like to explore?',
      timestamp: new Date(),
      context: 'welcome'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [langchainStatus, setLangchainStatus] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check LangChain status on component mount
    checkLangChainStatus()
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const checkLangChainStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/langchain/status')
      if (response.ok) {
        const data = await response.json()
        setLangchainStatus(data.langchain)
      }
    } catch (error) {
      console.error('Failed to check LangChain status:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/langchain/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: context || {}
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.data.response,
          timestamp: new Date(),
          analysis: data.data.analysis,
          context: data.data.conversation_context
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        context: 'error'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              LangChain AI Assistant
            </CardTitle>
            <CardDescription>
              Powered by advanced language models for molecular analysis
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {langchainStatus?.llm_available ? (
              <Badge className="bg-green-100 text-green-800">
                <Zap className="h-3 w-3 mr-1" />
                LLM Active
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800">
                Rule-based
              </Badge>
            )}
            {langchainStatus && (
              <Badge variant="outline" className="text-xs">
                {langchainStatus.device}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'assistant' && (
                      <Bot className="h-4 w-4 mt-0.5 text-purple-600" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      
                      {message.analysis && (
                        <div className="mt-2 p-2 bg-white/10 rounded text-xs">
                          <div className="font-medium">Analysis Results:</div>
                          <div>Method: {message.analysis.analysis_method}</div>
                          {message.analysis.domains && (
                            <div>Domains: {message.analysis.domains.length}</div>
                          )}
                          {message.analysis.confidence && (
                            <div>Confidence: {(message.analysis.confidence * 100).toFixed(0)}%</div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs opacity-70 mt-1">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about molecular analysis, sequences, or docking results..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {context?.sequence && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
            <div className="font-medium text-blue-800">Context:</div>
            <div className="text-blue-600">
              {context.sequence_type} sequence ({context.sequence.length} bases/residues)
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
