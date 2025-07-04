"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Shield, Clock, RefreshCw } from "lucide-react"

interface OtpVerificationProps {
  email: string
  otpType: 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET'
  onVerified: (verified: boolean) => void
  onResend?: () => void
}

export default function OtpVerification({ email, otpType, onVerified, onResend }: OtpVerificationProps) {
  const [otpCode, setOtpCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [canResend, setCanResend] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setError("Please enter a 6-digit OTP code")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otpCode,
          type: otpType
        }),
      })

      const data = await response.json()

      if (response.ok && data.verified) {
        setSuccess("OTP verified successfully!")
        onVerified(true)
      } else {
        setError(data.error || "Invalid OTP code")
        if (data.remainingAttempts !== undefined) {
          setError(`${data.error}. ${data.remainingAttempts} attempts remaining.`)
        }
      }
    } catch (error) {
      setError("Failed to verify OTP. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: otpType
        }),
      })

      if (response.ok) {
        setSuccess("New OTP sent to your email!")
        setTimeLeft(600) // Reset timer
        setCanResend(false)
        setOtpCode("")
        if (onResend) onResend()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to resend OTP")
      }
    } catch (error) {
      setError("Failed to resend OTP. Please try again.")
    }
  }

  const getTitle = () => {
    switch (otpType) {
      case 'REGISTRATION':
        return 'Verify Your Registration'
      case 'LOGIN':
        return 'Login Verification'
      case 'PASSWORD_RESET':
        return 'Password Reset Verification'
      default:
        return 'Email Verification'
    }
  }

  const getDescription = () => {
    switch (otpType) {
      case 'REGISTRATION':
        return 'Please enter the 6-digit code sent to your email to complete your registration.'
      case 'LOGIN':
        return 'Please enter the 6-digit code sent to your email to complete your login.'
      case 'PASSWORD_RESET':
        return 'Please enter the 6-digit code sent to your email to reset your password.'
      default:
        return 'Please enter the 6-digit verification code sent to your email.'
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
        <CardDescription className="text-gray-600">
          {getDescription()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Email Display */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <Mail className="w-4 h-4" />
          <span>Code sent to: <strong>{email}</strong></span>
        </div>

        {/* OTP Input */}
        <div className="space-y-2">
          <label htmlFor="otp" className="text-sm font-medium text-gray-700">
            Enter 6-digit code
          </label>
          <Input
            id="otp"
            type="text"
            placeholder="000000"
            value={otpCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
              setOtpCode(value)
              setError("")
            }}
            className="text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Code expires in: <strong>{formatTime(timeLeft)}</strong></span>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Verify Button */}
        <Button
          onClick={handleVerifyOtp}
          disabled={isVerifying || otpCode.length !== 6}
          className="w-full"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>

        {/* Resend Button */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleResendOtp}
            disabled={!canResend}
            className="text-sm"
          >
            {canResend ? 'Resend Code' : `Resend in ${formatTime(timeLeft)}`}
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-500 text-center">
          Didn't receive the code? Check your spam folder or try resending.
        </div>
      </CardContent>
    </Card>
  )
}
