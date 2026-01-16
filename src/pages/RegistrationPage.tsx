import React, { useState } from 'react'
import { XClose } from '@untitled-ui/icons-react'
import logoImage from '../assets/images/Logo.png'
import backgroundImage from '../assets/images/background.png'
import { sendRegistrationOtp } from '../services/authService'
import { validateEmail } from '../utils/validation'

interface RegistrationPageProps {
  onSubmit?: (email: string) => void
  onTermsClick?: () => void
  onAlreadyHaveAccount?: () => void
  onClose?: () => void
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onSubmit,
  onTermsClick,
  onAlreadyHaveAccount,
  onClose
}) => {
  const [email, setEmail] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!acceptTerms) {
      setError('Please accept the Terms and Conditions')
      return
    }

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email')
      return
    }

    setIsLoading(true)

    try {
      const response = await sendRegistrationOtp(email.trim())
      
      if (response.status === 'success' && onSubmit) {
        // Only call onSubmit if API call was successful
        onSubmit(email.trim())
      }
    } catch (err) {
      // Error is already handled in authService with toast
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative p-4 sm:p-6 lg:p-8">
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Registration Form Modal */}
      <div 
        className="relative z-10 w-full max-w-md flex flex-col items-center justify-start overflow-hidden rounded-xl sm:rounded-2xl bg-white my-auto max-h-[95vh] overflow-y-auto shadow-[0px_3px_3px_-1.5px_rgba(10,12.67,18,0.04)]"
      >
        {/* Inner Container */}
        <div className="relative flex w-full flex-col items-center justify-start">
          {/* Header Section */}
          <div className="flex w-full flex-col items-center justify-start gap-3 sm:gap-4 self-stretch pt-4 sm:pt-6 px-4 sm:px-6">
            {/* Logo */}
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-lg">
              <img 
                src={logoImage} 
                alt="Logo" 
                className="h-full w-full object-cover"
              />
            </div>

            {/* Title */}
            <div className="flex w-full flex-col items-center justify-start gap-0.5 self-stretch">
              <div className="w-full break-words text-center text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-[#181D27]">
                Create an account
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 sm:right-3 sm:top-3 inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center overflow-hidden rounded-lg p-1.5 sm:p-2 touch-manipulation hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <div className="relative h-5 w-5 sm:h-6 sm:w-6 overflow-hidden">
              <XClose className="h-5 w-5 sm:h-6 sm:w-6 text-[#A4A7AE]" />
            </div>
          </button>

          {/* Spacer */}
          <div className="h-4 sm:h-5 w-full self-stretch" />

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex w-full flex-col items-start justify-start gap-4 sm:gap-5 self-stretch px-4 sm:px-6">
            <div className="flex w-full flex-col items-center justify-start gap-4 sm:gap-5 self-stretch rounded-xl">
              {/* Email Input */}
              <div className="flex w-full flex-col items-start justify-start gap-1.5 self-stretch">
                <div className="inline-flex items-start justify-start gap-0.5">
                  <label className="text-xs sm:text-sm font-medium leading-4 sm:leading-5 text-[#414651]">
                    Email
                  </label>
                  <span className="text-xs sm:text-sm font-medium leading-4 sm:leading-5 text-red-500">*</span>
                </div>
                <div 
                  className="inline-flex w-full items-center justify-start gap-2 self-stretch rounded-lg bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] hover:shadow-md outline outline-1 outline-[#D5D7DA] -outline-offset-1"
                >
                  <div className="flex flex-1 items-center justify-start gap-2">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 bg-transparent text-sm sm:text-base font-normal leading-5 sm:leading-6 text-[#181D27] placeholder:text-[#717680] outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="w-full text-xs sm:text-sm text-red-500">
                  {error}
                </div>
              )}

              {/* Terms and Conditions Checkbox */}
              <div className="flex w-full items-start justify-start gap-2 self-stretch">
                <div className="flex items-center justify-center pt-0.5">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-4 w-4 sm:h-4 sm:w-4 rounded border border-[#D5D7DA] touch-manipulation"
                    required
                  />
                </div>
                <label 
                  htmlFor="terms"
                  className="flex-1 break-words text-xs sm:text-sm font-medium leading-4 sm:leading-5 text-[#414651] cursor-pointer"
                >
                  I accept the{' '}
                  {onTermsClick ? (
                    <button
                      type="button"
                      onClick={onTermsClick}
                      className="text-[#6938EF] hover:underline focus:outline-none"
                    >
                      Terms and Conditions
                    </button>
                  ) : (
                    <span className="text-[#6938EF]">Terms and Conditions</span>
                  )}
                </label>
              </div>

            </div>
          </form>

          {/* Footer Section */}
          <div 
            className="inline-flex h-full w-full flex-col items-start justify-start self-stretch px-4 sm:px-6 pb-6 gap-3"
          >
            {/* Get Started Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!acceptTerms || isLoading}
              className="inline-flex w-full mt-4 items-center justify-center self-stretch overflow-hidden rounded-lg px-4 py-2.5 sm:py-2.5 touch-manipulation bg-[#6938EF] shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] outline outline-2 outline-white -outline-offset-2 gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5925DC] transition-colors"
            >
              <div className="flex items-center justify-center px-0.5">
                {isLoading ? (
                  <span className="break-words text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-white">
                    Sending...
                  </span>
                ) : (
                  <span className="break-words text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-white">
                    Get started
                  </span>
                )}
              </div>
            </button>

            {/* Already have an account Link */}
            {onAlreadyHaveAccount && (
              <div className="flex w-full items-center justify-center">
                <button
                  type="button"
                  onClick={onAlreadyHaveAccount}
                  className="break-words text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-[#5925DC] hover:underline touch-manipulation"
                >
                  Already have an account?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage

