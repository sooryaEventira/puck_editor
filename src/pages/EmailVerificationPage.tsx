import React, { useState, useRef, useEffect } from 'react'
import logoImage from '../assets/images/Logo.png'

interface EmailVerificationPageProps {
  email: string
  onVerify?: (code: string) => void
  onResendCode?: () => void
  isLoading?: boolean
  error?: string | null
  onCodeChange?: () => void
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({
  email,
  onVerify,
  onResendCode,
  isLoading = false,
  error = null,
  onCodeChange
}) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Auto-verify when all 6 digits are entered
  useEffect(() => {
    const codeString = code.join('')
    const isComplete = code.every(digit => digit !== '')
    if (codeString.length === 6 && isComplete && !isLoading && onVerify) {
      // Small delay to allow the last digit to be visible
      const timer = setTimeout(() => {
        onVerify(codeString)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [code, isLoading, onVerify])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Clear error when user starts typing
    if (onCodeChange && value) {
      onCodeChange()
    }

    // Auto-advance to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Only accept 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('')
      const newCode = [...code]
      digits.forEach((digit, index) => {
        if (index < 6) {
          newCode[index] = digit
        }
      })
      setCode(newCode)
      
      // Focus the last input or verify if all filled
      if (digits.length === 6) {
        inputRefs.current[5]?.focus()
      } else {
        inputRefs.current[digits.length]?.focus()
      }
    }
  }

  const handleVerify = () => {
    const codeString = code.join('')
    if (codeString.length === 6 && onVerify) {
      onVerify(codeString)
    }
  }

  const isCodeComplete = code.every(digit => digit !== '')

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md flex flex-col items-center justify-start gap-6 sm:gap-8">
        {/* Logo */}
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-lg">
          <img 
            src={logoImage} 
            alt="Logo" 
            className="h-full w-full object-cover"
          />
        </div>

        {/* Heading */}
        <div className="flex w-full flex-col items-center justify-start gap-2">
          <h1 className="text-xl sm:text-2xl font-semibold leading-7 sm:leading-8 text-[#181D27] text-center">
            Verify your email address
          </h1>
        </div>

        {/* Description */}
        <div className="flex w-full flex-col items-center justify-start gap-4">
          <p className="text-sm sm:text-base font-normal leading-5 sm:leading-6 text-[#414651] text-center max-w-md">
            We emailed you a six-digit code to <strong className="font-semibold text-[#181D27]">{email}</strong>. Enter the code below to confirm your email address.
          </p>
        </div>

        {/* OTP Input Fields */}
        <div className="flex w-full flex-col items-center justify-start gap-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold rounded-lg border border-[#D5D7DA] bg-white focus:border-[#6938EF] focus:outline-none focus:ring-2 focus:ring-[#6938EF]/20 transition-colors"
                placeholder="-"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Instruction Text */}
        <div className="flex w-full flex-col items-center justify-start">
          <p className="text-xs sm:text-sm font-normal leading-4 sm:leading-5 text-[#535862] text-center">
            Make sure to keep this window open while check your inbox
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex w-full items-center justify-start self-stretch">
            <p className="text-xs sm:text-sm font-normal leading-4 sm:leading-5 text-red-500 text-center">
              {error}
            </p>
          </div>
        )}

        {/* Verify Button */}
        <div className="flex w-full flex-col items-center justify-start gap-4 mt-2">
          <button
            type="button"
            onClick={handleVerify}
            disabled={!isCodeComplete || isLoading}
            className="inline-flex w-full items-center justify-center self-stretch overflow-hidden rounded-lg px-4 py-2.5 sm:py-3 touch-manipulation bg-[#6938EF] shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5925DC] transition-colors"
          >
            <span className="break-words text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-white">
              {isLoading ? 'Verifying...' : 'Verify'}
            </span>
          </button>

          {/* Resend Code Link */}
          {onResendCode && (
            <div className="flex w-full items-center justify-center">
              <button
                type="button"
                onClick={onResendCode}
                className="break-words text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-[#5925DC] hover:underline touch-manipulation"
              >
                Didn't receive the code? Resend
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationPage

