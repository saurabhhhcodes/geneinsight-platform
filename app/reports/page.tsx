'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Download, FileText, BarChart3, Users, Activity, TrendingUp, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { reportsAPI, mockData } from '@/lib/api'

interface ReportData {
  id: string
  name: string
  type: string
  status: 'generating' | 'completed' | 'failed'
  createdAt: string
  downloadUrl?: string
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState('')
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [reportName, setReportName] = useState('')
  const [description, setDescription] = useState('')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRawData, setIncludeRawData] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<ReportData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reportTypes = [
    { value: 'analysis_summary', label: 'Analysis Summary', icon: BarChart3, description: 'Comprehensive analysis results and statistics' },
    { value: 'user_activity', label: 'User Activity', icon: Users, description: 'User engagement and usage patterns' },
    { value: 'system_performance', label: 'System Performance', icon: Activity, description: 'System metrics and performance data' },
    { value: 'prediction_accuracy', label: 'Prediction Accuracy', icon: TrendingUp, description: 'ML model performance and accuracy metrics' },
    { value: 'custom', label: 'Custom Report', icon: FileText, description: 'Build a custom report with selected data' }
  ]

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setIsLoading(true)
      const response = await reportsAPI.getReports()

      // Ensure we always have an array
      let reportsData = []
      if (response && response.data && Array.isArray(response.data)) {
        reportsData = response.data
      } else if (Array.isArray(response)) {
        reportsData = response
      } else {
        reportsData = mockData.reports || []
      }

      setReports(reportsData)
    } catch (error) {
      console.error('Failed to load reports:', error)
      toast.error('Failed to load reports')
      setReports(mockData.reports || [])
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    if (!reportType || !reportName.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsGenerating(true)
      
      const reportData = {
        type: reportType,
        name: reportName.trim(),
        description: description.trim(),
        dateRange: {
          from: dateRange.from?.toISOString(),
          to: dateRange.to?.toISOString()
        },
        options: {
          includeCharts,
          includeRawData
        }
      }

      const response = await reportsAPI.generateReport(reportData.analysisId || '1')
      
      if (response.success) {
        toast.success('Report generation started successfully')
        setReportName('')
        setDescription('')
        setDateRange({})
        setReportType('')
        loadReports() // Refresh the reports list
      } else {
        toast.error(response.error || 'Failed to generate report')
      }
    } catch (error) {
      console.error('Report generation failed:', error)
      toast.error('Failed to generate report')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = async (reportId: string, reportName: string) => {
    try {
      await reportsAPI.exportReport(reportId, 'pdf')
      toast.success('Report downloaded successfully')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Failed to download report')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generating':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Generating</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generate Reports</h1>
          <p className="text-muted-foreground">Create detailed analysis reports and export data</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Report Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>New Report</span>
            </CardTitle>
            <CardDescription>Configure and generate a new analysis report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Report Type Selection */}
            <div className="space-y-3">
              <Label htmlFor="report-type">Report Type *</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Report Name */}
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name *</Label>
              <Input
                id="report-name"
                placeholder="Enter report name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description for the report"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "PPP") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Separator />

            {/* Report Options */}
            <div className="space-y-4">
              <Label>Report Options</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include-charts"
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="include-charts" className="text-sm font-normal">
                    Include charts and visualizations
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include-raw-data"
                    checked={includeRawData}
                    onChange={(e) => setIncludeRawData(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="include-raw-data" className="text-sm font-normal">
                    Include raw data tables
                  </Label>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGenerateReport} 
              disabled={isGenerating || !reportType || !reportName.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Your generated reports and download history</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading reports...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reports generated yet</p>
                <p className="text-sm">Create your first report using the form on the left</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{report.name}</h4>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {report.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {format(new Date(report.createdAt), 'PPp')}
                      </p>
                    </div>
                    {report.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReport(report.id, report.name)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
