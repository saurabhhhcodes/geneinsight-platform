"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dna, Upload, History, Settings, User, Bell, TrendingUp, FileText, Zap, Brain, Eye, Sparkles } from "lucide-react"
import Link from "next/link"
import UserSettingsModal from "@/app/components/UserSettingsModal"
import NotificationsPanel from "@/app/components/NotificationsPanel"

export default function DashboardPage() {
  // Modal states
  const [showUserSettings, setShowUserSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // User state management
  const [user, setUser] = useState({
    firstName: "User",
    lastName: "",
    email: "user@example.com",
    role: "RESEARCHER",
    avatar: "",
    lastLogin: new Date().toISOString(),
    analysisCount: 247,
    unreadNotifications: 3,
    institution: "",
    joinDate: new Date().toISOString()
  })

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Analysis Complete",
      message: "Your DNA sequence analysis for sample #247 has been completed successfully.",
      time: "2 minutes ago",
      read: false,
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      type: "info",
      title: "New Feature Available",
      message: "3D protein structure generation is now available in Enhanced Analysis.",
      time: "1 hour ago",
      read: false,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      type: "warning",
      title: "Storage Limit",
      message: "You're approaching your storage limit. Consider archiving old analyses.",
      time: "3 hours ago",
      read: false,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      type: "info",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight from 2-4 AM EST.",
      time: "1 day ago",
      read: true,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ])

  // Load user data from localStorage or API
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Try to get user data from localStorage first
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        } else {
          // Try to get from JWT token
          const token = localStorage.getItem('token')
          if (token) {
            // Decode JWT token to get user info (simplified)
            try {
              const payload = JSON.parse(atob(token.split('.')[1]))
              setUser({
                firstName: payload.firstName || "User",
                lastName: payload.lastName || "",
                email: payload.sub || payload.email || "user@example.com",
                role: payload.role || "RESEARCHER"
              })
            } catch (e) {
              console.log("Could not decode token")
            }
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    loadUserData()
  }, [])

  // Get display name
  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    } else if (user.firstName) {
      return user.firstName
    } else {
      return user.email.split('@')[0]
    }
  }

  // Get greeting name
  const getGreetingName = () => {
    if (user.firstName) {
      return user.firstName
    } else {
      return user.email.split('@')[0]
    }
  }
  const [recentAnalyses] = useState([
    {
      id: 1,
      name: "BRCA1 Gene Analysis",
      date: "2024-01-15",
      status: "completed",
      prediction: "Disease-associated",
      confidence: 0.89,
    },
    {
      id: 2,
      name: "TP53 Mutation Study",
      date: "2024-01-14",
      status: "completed",
      prediction: "Non-disease",
      confidence: 0.76,
    },
    {
      id: 3,
      name: "CFTR Gene Sequence",
      date: "2024-01-13",
      status: "processing",
      prediction: null,
      confidence: null,
    },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Dna className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">GeneInsight</span>
            </div>
            <Badge variant="secondary">Dashboard</Badge>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(true)}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {user.unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {user.unreadNotifications}
                </span>
              )}
            </Button>

            {/* User Info Display */}
            <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.firstName.charAt(0)}{user.lastName.charAt(0) || user.firstName.charAt(1)}
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{getDisplayName()}</div>
                <div className="text-gray-500">{user.role}</div>
              </div>
            </div>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserSettings(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {getGreetingName()}</h1>
          <p className="text-gray-600">Ready to analyze some genetic sequences today?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link href="/analyze">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Upload className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-lg">Basic Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Standard DNA sequence analysis</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analyze-enhanced">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-lg">Enhanced Analysis</CardTitle>
                  <Badge variant="secondary" className="text-xs">NEW</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">DNA analysis with 3D structure generation</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/visualize">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Eye className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-lg">3D Visualization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">View molecular structures in 3D</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <History className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-lg">Analysis History</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">View past analyses and results</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-orange-600" />
                  <CardTitle className="text-lg">Generate Report</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Create detailed analysis reports</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">247</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Disease-Associated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">89</div>
              <div className="text-sm text-gray-600">36% of total analyses</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">84.2%</div>
              <Progress value={84.2} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">2.3s</div>
              <div className="flex items-center text-sm text-green-600">
                <Zap className="h-4 w-4 mr-1" />
                Avg per sequence
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Recent Analyses</span>
                </CardTitle>
                <CardDescription>Your latest gene-disease association predictions</CardDescription>
              </div>
              <Link href="/history">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{analysis.name}</h4>
                      <p className="text-sm text-gray-600">{analysis.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {analysis.status === "completed" ? (
                      <>
                        <Badge variant={analysis.prediction === "Disease-associated" ? "destructive" : "secondary"}>
                          {analysis.prediction}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          {(analysis.confidence! * 100).toFixed(1)}% confidence
                        </div>
                      </>
                    ) : (
                      <Badge variant="outline">Processing...</Badge>
                    )}
                    <Link href={`/analysis/${analysis.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <UserSettingsModal
        isOpen={showUserSettings}
        onClose={() => setShowUserSettings(false)}
      />
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  )
}
