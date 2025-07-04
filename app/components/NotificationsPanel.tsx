"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Bell, CheckCircle, AlertCircle, Info, Trash2, Check } from "lucide-react"

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Enhanced Analysis Complete',
      message: 'Your BRCA1 gene analysis with 3D structure generation completed successfully with 85% confidence.',
      timestamp: '2 minutes ago',
      read: false,
      actionUrl: '/analyze-enhanced'
    },
    {
      id: '2',
      type: 'info',
      title: '3D Structure Generated',
      message: 'New 3D protein structure has been generated for your DNA sequence. View in enhanced analysis.',
      timestamp: '5 minutes ago',
      read: false,
      actionUrl: '/analyze-enhanced'
    },
    {
      id: '3',
      type: 'success',
      title: 'Export Feature Updated',
      message: 'New export options are now available: JSON, Report, FASTA, and 3D Visualizer.',
      timestamp: '10 minutes ago',
      read: false,
      actionUrl: '/analyze-enhanced'
    },
    {
      id: '4',
      type: 'info',
      title: 'User Settings Saved',
      message: 'Your profile and notification preferences have been updated successfully.',
      timestamp: '1 hour ago',
      read: true,
      actionUrl: '/dashboard'
    },
    {
      id: '5',
      type: 'warning',
      title: 'Low Confidence Result',
      message: 'Previous analysis completed but with lower than usual confidence (67%). Review recommended.',
      timestamp: '3 hours ago',
      read: true,
      actionUrl: '/analyze-enhanced'
    },
    {
      id: '6',
      type: 'info',
      title: 'Platform Enhancement',
      message: 'Enhanced DNA Analysis with 3D structure generation is now available on the dashboard.',
      timestamp: '1 day ago',
      read: true,
      actionUrl: '/dashboard'
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'default'
      case 'warning':
        return 'secondary'
      case 'error':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? 'border-blue-200 bg-blue-50' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {notification.timestamp}
                          </span>
                          <div className="flex items-center space-x-2">
                            {notification.actionUrl && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  markAsRead(notification.id)
                                  window.location.href = notification.actionUrl!
                                }}
                              >
                                View
                              </Button>
                            )}
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark read
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {notifications.length} total notifications
            </span>
            <Button variant="link" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
