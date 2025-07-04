"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dna, Search, Filter, Download, Eye, Trash2, Calendar, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPrediction, setFilterPrediction] = useState("all")

  const analyses = [
    {
      id: 1,
      name: "BRCA1 Gene Analysis",
      date: "2024-01-15",
      time: "14:30",
      status: "completed",
      prediction: "Disease-associated",
      confidence: 0.89,
      length: 5592,
      processingTime: "2.3s",
    },
    {
      id: 2,
      name: "TP53 Mutation Study",
      date: "2024-01-14",
      time: "09:15",
      status: "completed",
      prediction: "Non-disease",
      confidence: 0.76,
      length: 1182,
      processingTime: "1.8s",
    },
    {
      id: 3,
      name: "CFTR Gene Sequence",
      date: "2024-01-13",
      time: "16:45",
      status: "completed",
      prediction: "Disease-associated",
      confidence: 0.92,
      length: 4443,
      processingTime: "3.1s",
    },
    {
      id: 4,
      name: "APOE Variant Analysis",
      date: "2024-01-12",
      time: "11:20",
      status: "completed",
      prediction: "Non-disease",
      confidence: 0.68,
      length: 1083,
      processingTime: "1.5s",
    },
    {
      id: 5,
      name: "MTHFR Gene Study",
      date: "2024-01-11",
      time: "13:55",
      status: "failed",
      prediction: null,
      confidence: null,
      length: 2156,
      processingTime: null,
    },
    {
      id: 6,
      name: "ALDH2 Sequence",
      date: "2024-01-10",
      time: "10:30",
      status: "completed",
      prediction: "Disease-associated",
      confidence: 0.84,
      length: 1551,
      processingTime: "2.0s",
    },
  ]

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch = analysis.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || analysis.status === filterStatus
    const matchesPrediction = filterPrediction === "all" || analysis.prediction === filterPrediction
    return matchesSearch && matchesStatus && matchesPrediction
  })

  const stats = {
    total: analyses.length,
    completed: analyses.filter((a) => a.status === "completed").length,
    diseaseAssociated: analyses.filter((a) => a.prediction === "Disease-associated").length,
    avgConfidence:
      analyses.filter((a) => a.confidence).reduce((sum, a) => sum + a.confidence!, 0) /
      analyses.filter((a) => a.confidence).length,
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
            <Badge variant="secondary">Analysis History</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export All
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis History</h1>
            <p className="text-gray-600">View and manage your past gene sequence analyses</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">All time</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600">
                  {((stats.completed / stats.total) * 100).toFixed(1)}% success rate
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Disease-Associated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.diseaseAssociated}</div>
                <div className="text-sm text-gray-600">
                  {((stats.diseaseAssociated / stats.completed) * 100).toFixed(1)}% of completed
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{(stats.avgConfidence * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Prediction accuracy</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search analyses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prediction</label>
                  <Select value={filterPrediction} onValueChange={setFilterPrediction}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Predictions</SelectItem>
                      <SelectItem value="Disease-associated">Disease-associated</SelectItem>
                      <SelectItem value="Non-disease">Non-disease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Analysis Results</span>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {filteredAnalyses.length} of {analyses.length} analyses
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Analysis Name</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prediction</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Length</TableHead>
                      <TableHead>Processing Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnalyses.map((analysis) => (
                      <TableRow key={analysis.id}>
                        <TableCell className="font-medium">{analysis.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            <span>{analysis.date}</span>
                            <span className="text-gray-500">{analysis.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              analysis.status === "completed"
                                ? "default"
                                : analysis.status === "processing"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {analysis.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {analysis.prediction ? (
                            <Badge variant={analysis.prediction === "Disease-associated" ? "destructive" : "secondary"}>
                              {analysis.prediction}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {analysis.confidence ? (
                            <span className="font-medium">{(analysis.confidence * 100).toFixed(1)}%</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{analysis.length.toLocaleString()} bp</span>
                        </TableCell>
                        <TableCell>
                          {analysis.processingTime ? (
                            <span className="text-sm">{analysis.processingTime}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link href={`/analysis/${analysis.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
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
        </div>
      </div>
    </div>
  )
}
