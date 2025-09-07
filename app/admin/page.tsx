"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dna,
  Users,
  Database,
  Brain,
  Upload,
  Settings,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
} from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)

  const systemStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalAnalyses: 15634,
    todayAnalyses: 127,
    modelAccuracy: 94.2,
    systemUptime: 99.8,
  }

  const recentUsers = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      email: "s.chen@university.edu",
      role: "Researcher",
      joinDate: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Prof. Michael Rodriguez",
      email: "m.rodriguez@institute.org",
      role: "Admin",
      joinDate: "2024-01-14",
      status: "active",
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      email: "e.watson@hospital.com",
      role: "Clinician",
      joinDate: "2024-01-13",
      status: "pending",
    },
    {
      id: 4,
      name: "James Liu",
      email: "j.liu@biotech.com",
      role: "Industry",
      joinDate: "2024-01-12",
      status: "active",
    },
  ]

  const modelMetrics = {
    accuracy: 94.2,
    precision: 91.8,
    recall: 89.5,
    f1Score: 90.6,
    lastTrained: "2024-01-10",
    trainingDataSize: 50000,
  }

  const handleStartTraining = () => {
    setIsTraining(true)
    setTrainingProgress(0)

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + 10
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Dna className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">GeneInsight</span>
            </Link>
            <Badge variant="destructive">Admin Panel</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, monitor system performance, and train ML models</p>
          </div>

          {/* System Overview */}
          <div className="grid md:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.2% this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{systemStats.activeUsers}</div>
                <div className="text-sm text-gray-600">
                  {((systemStats.activeUsers / systemStats.totalUsers) * 100).toFixed(1)}% active
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{systemStats.totalAnalyses.toLocaleString()}</div>
                <div className="text-sm text-gray-600">All time</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Today&apos;s Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{systemStats.todayAnalyses}</div>
                <div className="text-sm text-gray-600">+15% vs yesterday</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Model Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{systemStats.modelAccuracy}%</div>
                <Progress value={systemStats.modelAccuracy} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">System Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{systemStats.systemUptime}%</div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Operational
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="models">ML Models</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="system">System Health</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>User Management</span>
                      </CardTitle>
                      <CardDescription>Manage user accounts and permissions</CardDescription>
                    </div>
                    <Button>
                      <Users className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === "Admin" ? "destructive" : "secondary"}>{user.role}</Badge>
                            </TableCell>
                            <TableCell>{user.joinDate}</TableCell>
                            <TableCell>
                              <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="models" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>Model Performance</span>
                    </CardTitle>
                    <CardDescription>Current ML model metrics and performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{modelMetrics.accuracy}%</div>
                        <div className="text-sm text-gray-600">Accuracy</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{modelMetrics.precision}%</div>
                        <div className="text-sm text-gray-600">Precision</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{modelMetrics.recall}%</div>
                        <div className="text-sm text-gray-600">Recall</div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{modelMetrics.f1Score}%</div>
                        <div className="text-sm text-gray-600">F1 Score</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Last Trained:</span>
                        <span className="font-medium">{modelMetrics.lastTrained}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Training Data Size:</span>
                        <span className="font-medium">{modelMetrics.trainingDataSize.toLocaleString()} samples</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="h-5 w-5" />
                      <span>Model Training</span>
                    </CardTitle>
                    <CardDescription>Upload new training data and retrain models</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="trainingFile">Training Dataset</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Drop CSV file here or click to browse</p>
                        <Button variant="outline" className="mt-2 bg-transparent" size="sm">
                          Choose File
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modelName">Model Name</Label>
                      <Input id="modelName" placeholder="e.g., BRCA_Model_v2" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the training dataset and model improvements..."
                      />
                    </div>

                    {isTraining ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Training Progress</span>
                          <span>{trainingProgress}%</span>
                        </div>
                        <Progress value={trainingProgress} />
                        <div className="flex items-center text-sm text-blue-600">
                          <Clock className="h-4 w-4 mr-1" />
                          Estimated time remaining: {Math.max(0, 10 - Math.floor(trainingProgress / 10))} minutes
                        </div>
                      </div>
                    ) : (
                      <Button onClick={handleStartTraining} className="w-full">
                        <Brain className="mr-2 h-4 w-4" />
                        Start Training
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Usage Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                        <p>Analytics Chart Placeholder</p>
                        <p className="text-sm">Daily analysis volume over time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Analysis Types</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">BRCA Gene Analysis</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">TP53 Mutation Study</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                        </div>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CFTR Gene Sequence</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "58%" }}></div>
                        </div>
                        <span className="text-sm font-medium">58%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">APOE Variant Analysis</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: "43%" }}></div>
                        </div>
                        <span className="text-sm font-medium">43%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="system" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <span>System Health</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Database</span>
                      </div>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>ML Service</span>
                      </div>
                      <Badge variant="default">Running</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span>3D Visualization</span>
                      </div>
                      <Badge variant="secondary">Warning</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>API Gateway</span>
                      </div>
                      <Badge variant="default">Operational</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      <div className="text-green-600">
                        [2024-01-15 14:30:15] INFO: Analysis completed for user_id: 1247
                      </div>
                      <div className="text-blue-600">
                        [2024-01-15 14:29:45] INFO: New user registered: s.chen@university.edu
                      </div>
                      <div className="text-yellow-600">[2024-01-15 14:28:30] WARN: High memory usage detected: 85%</div>
                      <div className="text-green-600">
                        [2024-01-15 14:27:12] INFO: Model prediction completed: confidence 0.89
                      </div>
                      <div className="text-blue-600">
                        [2024-01-15 14:26:55] INFO: 3D visualization rendered for sequence_id: 5592
                      </div>
                      <div className="text-green-600">
                        [2024-01-15 14:25:33] INFO: Database backup completed successfully
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export Logs
                      </Button>
                      <Button variant="outline" size="sm">
                        Clear Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
