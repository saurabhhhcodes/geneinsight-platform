"use client"

import { Client } from "@stomp/stompjs"
// @ts-ignore - SockJS types not available
import SockJS from "sockjs-client"

class WebSocketService {
  private client: Client | null = null
  private connected = false

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
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
          reject(new Error("WebSocket connection failed"))
        },
        onWebSocketError: (error) => {
          console.error("WebSocket error", error)
          reject(error)
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
    if (!this.client || !this.connected) {
      console.warn("WebSocket not connected, cannot subscribe to analysis progress")
      return { unsubscribe: () => {} } // Return a dummy subscription
    }

    return this.client.subscribe("/user/queue/analysis-progress", (message) => {
      const progress = JSON.parse(message.body)
      callback(progress)
    })
  }

  subscribeToAnalysisResult(callback: (result: any) => void) {
    if (!this.client || !this.connected) {
      console.warn("WebSocket not connected, cannot subscribe to analysis result")
      return { unsubscribe: () => {} } // Return a dummy subscription
    }

    return this.client.subscribe("/user/queue/analysis-result", (message) => {
      const result = JSON.parse(message.body)
      callback(result)
    })
  }

  subscribeToAnalysisError(callback: (error: any) => void) {
    if (!this.client || !this.connected) {
      console.warn("WebSocket not connected, cannot subscribe to analysis error")
      return { unsubscribe: () => {} } // Return a dummy subscription
    }

    return this.client.subscribe("/user/queue/analysis-error", (message) => {
      const error = JSON.parse(message.body)
      callback(error)
    })
  }

  isConnected(): boolean {
    return this.connected
  }
}

export const webSocketService = new WebSocketService()
