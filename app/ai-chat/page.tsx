'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Zap, MessageCircle, Activity, Database, Target, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import LangChainChat from '@/components/langchain-chat'

export default function AIChatPage() {
  const [langchainStatus, setLangchainStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkLangChainStatus()
  }, [])

  const checkLangChainStatus = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://6d441999-17f0-47ac-94c8-e10957d4469c-00-1aa6zmzvlz1jf.pike.replit.dev'
      const response = await fetch(`${apiUrl}/langchain/status`)
      if (response.ok) {
        const data = await response.json()
        setLangchainStatus(data)
      }
    } catch (error) {
      console.error('Failed to check LangChain status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI Chat Assistant</h1>
                  <p className="text-sm text-gray-600">Powered by LangChain</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <Badge variant="outline">Loading...</Badge>
              ) : langchainStatus?.langchain?.llm_available ? (
                <Badge className="bg-green-100 text-green-800">
                  <Zap className="h-3 w-3 mr-1" />
                  LLM Active
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">
                  Rule-based
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <LangChainChat />
          </div>

          {/* Status and Information Panel */}
          <div className="space-y-6">
            {/* LangChain Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Checking status...</p>
                  </div>
                ) : langchainStatus ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">LLM Status</span>
                      <Badge className={langchainStatus.langchain?.llm_available ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {langchainStatus.langchain?.llm_available ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Model</span>
                      <span className="text-sm text-gray-600">
                        {langchainStatus.langchain?.model_name || langchainStatus.performance?.model_info?.name || 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Device</span>
                      <Badge variant="outline" className="text-xs">
                        {langchainStatus.performance?.device || langchainStatus.langchain?.device || 'Unknown'}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Chains</span>
                      <span className="text-sm text-gray-600">
                        {langchainStatus.langchain?.chains_count || langchainStatus.langchain?.chains_initialized || 0}
                      </span>
                    </div>
                    
                    {langchainStatus.capabilities && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium mb-2">Capabilities</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(langchainStatus.capabilities).map(([key, value]) => (
                            value && (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key.replace('_', ' ')}
                              </Badge>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Unable to fetch status</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Analyze Sequence
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Molecular Docking
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Brain className="h-4 w-4 mr-2" />
                    Structure Prediction
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sample Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sample Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 rounded">
                    &quot;Analyze this protein sequence: MKWVTFISLLFLFSSAYS...&quot;
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    &quot;What does a binding affinity of -9.2 kcal/mol mean?&quot;
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    &quot;Explain the significance of kinase domains&quot;
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    &quot;How do I interpret docking results?&quot;
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Natural language processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Molecular analysis insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Conversational memory</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Context-aware responses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs">Rule-based fallback</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
