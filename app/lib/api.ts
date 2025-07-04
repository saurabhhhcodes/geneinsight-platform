"use client"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()

      if (!response.ok) {
        return { error: data.message || data.error || "An error occurred" }
      }

      return { data }
    } else {
      const text = await response.text()

      if (!response.ok) {
        return { error: text || "An error occurred" }
      }

      return { data: text as any }
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    return this.handleResponse(response)
  }

  async register(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    institution: string
    role: string
  }): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    return this.handleResponse(response)
  }

  // Sequence Analysis
  async analyzeSequence(data: { name: string; sequenceData: string; type?: string }): Promise<ApiResponse<{ sequenceId: number; status: string }>> {
    const response = await fetch(`${API_BASE_URL}/api/sequences/analyze`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    return this.handleResponse(response)
  }

  // Simple sequence analysis (no authentication required)
  async analyzeSequenceSimple(sequence: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/api/sequences/analyze/simple`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sequence }),
    })

    return this.handleResponse(response)
  }

  async uploadSequenceFile(file: File, name: string): Promise<ApiResponse<{ sequenceId: number; status: string }>> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", name)

    const token = localStorage.getItem("authToken")
    const response = await fetch(`${API_BASE_URL}/sequences/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    return this.handleResponse(response)
  }

  async getSequenceHistory(params?: {
    page?: number
    size?: number
    search?: string
    status?: string
    prediction?: string
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`${API_BASE_URL}/sequences/history?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse(response)
  }

  async getSequenceById(id: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/sequences/${id}`, {
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse(response)
  }

  async deleteSequence(id: number): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`${API_BASE_URL}/sequences/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse(response)
  }

  async downloadSequence(id: number): Promise<void> {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`${API_BASE_URL}/sequences/${id}/download`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `sequence_${id}.fasta`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }

  // Admin APIs
  async getDashboardStats(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse(response)
  }

  // Report APIs
  async getReports(): Promise<ApiResponse<any[]>> {
    // Use test endpoint for now
    const response = await fetch(`${API_BASE_URL}/reports/test`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse(response)
  }

  async generateReport(reportData: any): Promise<ApiResponse<any>> {
    // Use test endpoint for now
    const response = await fetch(`${API_BASE_URL}/reports/test/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    })

    return this.handleResponse(response)
  }

  async downloadReport(reportId: string, reportName: string): Promise<void> {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${reportName}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else {
      throw new Error('Failed to download report')
    }
  }

  async getReportStatus(reportId: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse(response)
  }

  async getAllUsers(params?: {
    page?: number
    size?: number
    search?: string
    role?: string
    status?: string
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`${API_BASE_URL}/admin/users?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse(response)
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/status?isActive=${isActive}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse(response)
  }

  async trainModel(file: File, modelName: string, description?: string): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("modelName", modelName)
    if (description) {
      formData.append("description", description)
    }

    const token = localStorage.getItem("authToken")
    const response = await fetch(`${API_BASE_URL}/admin/model/train`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    return this.handleResponse(response)
  }

  async getModelMetrics(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/admin/model/metrics`, {
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse(response)
  }

  async getSystemHealth(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/admin/system/health`, {
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse(response)
  }

  // OTP Authentication APIs
  async sendOtp(email: string, type: 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET'): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, type }),
    })

    return this.handleResponse(response)
  }

  async verifyOtp(email: string, otpCode: string, type: 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET'): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otpCode, type }),
    })

    return this.handleResponse(response)
  }

  async registerWithOtp(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    institution: string
    role: string
  }): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/auth/register-with-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    return this.handleResponse(response)
  }

  async completeRegistration(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    institution: string
    role: string
  }, otpCode: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/auth/complete-registration?otpCode=${otpCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    return this.handleResponse(response)
  }

  // 3D Structure Generation APIs
  async generate3DStructure(sequence: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/sequences/generate-3d-structure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sequence }),
    })

    return this.handleResponse(response)
  }

  async analyzeWithStructure(sequence: string, include3D: boolean = false): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/sequences/analyze-with-structure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sequence, include3D }),
    })

    return this.handleResponse(response)
  }
}

const apiService = new ApiService()

export default apiService
