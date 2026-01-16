import React, { useState } from 'react'
import { XClose } from '@untitled-ui/icons-react'
import { SocialButton } from '../components/ui/untitled'
import logoImage from '../assets/images/Logo.png'
import backgroundImage from '../assets/images/background.png'

interface LoginPageProps {
  onSubmit?: (email: string, password: string) => void
  onForgotPassword?: () => void
  onGoogleSignIn?: () => void
  onMicrosoftSignIn?: () => void
  onMagicLinkSignIn?: () => void
  onNavigateToRegistration?: () => void
}

const LoginPage: React.FC<LoginPageProps> = ({
  onSubmit,
  onForgotPassword,
  onGoogleSignIn,
  onMicrosoftSignIn,
  onMagicLinkSignIn,
  onNavigateToRegistration
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      return
    }
    
    if (onSubmit) {
      setIsLoading(true)
      try {
        await onSubmit(email, password)
      } catch (error) {
        // Error handling is done in App.tsx
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative p-4 sm:p-6 lg:p-8">
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/50 " />

      {/* Login Form Modal */}
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

            {/* Title and Subtitle */}
            <div className="flex w-full flex-col items-center justify-start gap-0.5 self-stretch">
              <div className="w-full break-words text-center text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-[#181D27]">
                Log in to your account
              </div>
              <div className="w-full break-words text-center text-xs sm:text-sm font-normal leading-4 sm:leading-5 text-[#535862]">
                Welcome back! Please enter your details.
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => {}}
            className="absolute right-2 top-2 sm:right-3 sm:top-3 inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center overflow-hidden rounded-lg p-1.5 sm:p-2 touch-manipulation"
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
              {/* Input Fields */}
              <div className="flex w-full flex-col items-start justify-start gap-3 sm:gap-4 self-stretch">
                {/* Email Input */}
                <div className="flex w-full flex-col items-start justify-start gap-1.5 self-stretch">
                  <div className="inline-flex items-start justify-start gap-0.5">
                    <label className="text-xs sm:text-sm font-medium leading-4 sm:leading-5 text-[#414651]">
                      Email
                    </label>
                    <span className="text-xs sm:text-sm font-medium leading-4 sm:leading-5 text-red-500">*</span> 
                  </div>
                  <div 
                    className="inline-flex w-full items-center justify-start gap-2 self-stretch rounded-lg bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] outline outline-1 outline-[#D5D7DA] -outline-offset-1"
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

                {/* Password Input */}
                <div className="flex w-full flex-col items-start justify-start gap-1.5 self-stretch">
                  <div className="inline-flex items-start justify-start gap-0.5">
                    <label className="text-xs sm:text-sm font-medium leading-4 sm:leading-5 text-[#414651]">
                      Password
                    </label>
                    <span className="text-xs sm:text-sm font-medium leading-4 sm:leading-5 text-red-500">*</span>
                  </div>
                  <div 
                    className="inline-flex w-full items-center justify-start gap-2 self-stretch rounded-lg bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] outline outline-1 outline-[#D5D7DA] -outline-offset-1"
                  >
                    <div className="flex flex-1 items-center justify-start gap-2">
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="flex-1 bg-transparent text-sm sm:text-base font-normal leading-5 sm:leading-6 text-[#181D27] placeholder:text-[#717680] outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-2 sm:gap-0 self-stretch">
                <div className="flex items-start justify-start gap-2">
                  <div className="flex items-center justify-center pt-0.5">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 sm:h-4 sm:w-4 rounded border border-[#D5D7DA] touch-manipulation"
                    />
                  </div>
                  <div className="inline-flex flex-col items-start justify-start">
                    <div className="self-stretch break-words text-xs sm:text-sm font-medium leading-4 sm:leading-5 text-[#414651]">
                      Remember for 30 days
                    </div>
                  </div>
                </div>
                {onForgotPassword && (
                  <div className="flex items-center justify-center overflow-hidden">
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="flex items-center justify-center gap-1 touch-manipulation"
                    >
                      <span className="break-words text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-[#5925DC]">
                        Forgot password
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Footer Section */}
          <div 
            className="inline-flex h-full w-full flex-col items-start justify-start self-stretch px-4 sm:px-6 pb-6 gap-3"
          >
            {/* Sign In Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!email.trim() || !password.trim() || isLoading}
              className="inline-flex w-full mt-4 items-center justify-center self-stretch overflow-hidden rounded-lg px-4 py-2.5 sm:py-2.5 touch-manipulation bg-[#6938EF] shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] outline outline-2 outline-white -outline-offset-2 gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5925DC] transition-colors"
            >
              <div className="flex items-center justify-center px-0.5">
                {isLoading ? (
                  <span className="break-words text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-white">
                    Signing in...
                  </span>
                ) : (
                  <span className="break-words text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-white">
                    Sign in
                  </span>
                )}
              </div>
            </button>

            {/* Google Sign In */}
            <SocialButton
              provider="google"
              onClick={onGoogleSignIn}
              size="lg"
            />

            {/* Microsoft Sign In */}
            <SocialButton
              provider="microsoft"
              onClick={onMicrosoftSignIn}
              size="lg"
            />

            {/* Magic Link Sign In */}
            <SocialButton
              provider="magic-link"
              onClick={onMagicLinkSignIn}
              size="lg"
            />

            {/* Navigate to Registration */}
            {onNavigateToRegistration && (
              <div className="flex w-full items-center justify-center mt-2">
                <button
                  type="button"
                  onClick={onNavigateToRegistration}
                  className="break-words text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-[#5925DC] hover:underline touch-manipulation"
                >
                  Don't have an account? Create one
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

