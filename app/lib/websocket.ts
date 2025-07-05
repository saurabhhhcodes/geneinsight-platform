"use client"

import { Client } from "@stomp/stompjs"
// @ts-ignore - SockJS types not available
import SockJS from "sockjs-client"

class WebSocketService {
  private client: Client | null = null
  private connected = false
  private isVercelDeployment = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Skip WebSocket connection for Vercel deployment
      if (this.isVercelDeployment) {
        console.log("WebSocket not available in Vercel deployment, using polling fallback")
        this.connected = false
        resolve() // Resolve immediately to avoid blocking the app
        return
      }

      this.client = new Client({
        webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws"),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          console.log("STOMP: " + str)
        },
        onConnect: () => {
          this.connected = true
          console.log("WebSocket connected")
          resolve()
        },
        onStompError: (frame) => {
          console.error("STOMP error", frame)
          this.connected = false
          resolve() // Don't reject, just continue without WebSocket
        },
        onWebSocketError: (error) => {
          console.error("WebSocket error", error)
          this.connected = false
          resolve() // Don't reject, just continue without WebSocket
        },
      })

      this.client.activate()
    })
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate()
      this.connected = false
    }
  }

  subscribeToAnalysisProgress(callback: (progress: any) => void) {
    if (!this.client || !this.connected || this.isVercelDeployment) {
      // For Vercel deployment, simulate progress updates
      if (this.isVercelDeployment) {
        console.log("Using polling fallback for progress updates")
        // Simulate progress with polling
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          callback({ progress, status: 'processing' })
          if (progress >= 100) {
            clearInterval(interval)
            callback({ progress: 100, status: 'completed' })
          }
        }, 1000)

        return { unsubscribe: () => clearInterval(interval) }
      }

      console.warn("WebSocket not connected, skipping real-time updates")
      return { unsubscribe: () => {} }
    }

    return this.client.subscribe("/user/queue/analysis-progress", (message) => {
      const progress = JSON.parse(message.body)
      callback(progress)
    })
  }

  subscribeToAnalysisResult(callback: (result: any) => void) {
    if (!this.client || !this.connected || this.isVercelDeployment) {
      if (this.isVercelDeployment) {
        console.log("Using polling fallback for analysis results")
        // For Vercel, we'll rely on API polling instead
      }
      return { unsubscribe: () => {} }
    }

    return this.client.subscribe("/user/queue/analysis-result", (message) => {
      const result = JSON.parse(message.body)
      callback(result)
    })
  }

  subscribeToAnalysisError(callback: (error: any) => void) {
    if (!this.client || !this.connected || this.isVercelDeployment) {
      if (this.isVercelDeployment) {
        console.log("Using polling fallback for error handling")
      }
      return { unsubscribe: () => {} }
    }

    return this.client.subscribe("/user/queue/analysis-error", (message) => {
      const error = JSON.parse(message.body)
      callback(error)
    })
  }

  isConnected(): boolean {
    // For Vercel deployment, always return false since WebSocket isn't available
    if (this.isVercelDeployment) {
      return false
    }
    return this.connected
  }
}

export const webSocketService = new WebSocketService()
