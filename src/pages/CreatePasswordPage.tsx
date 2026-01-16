import React, { useState } from 'react'
import { Eye, EyeOff } from '@untitled-ui/icons-react'
import logoImage from '../assets/images/Logo.png'
import { validatePassword } from '../utils/validation'

interface CreatePasswordPageProps {
  onSubmit?: (password: string) => void
  isLoading?: boolean
  error?: string | null
  onPasswordChange?: () => void
}

const CreatePasswordPage: React.FC<CreatePasswordPageProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
  onPasswordChange
}) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || 'Invalid password')
      return
    }

    if (password && onSubmit) {
      onSubmit(password)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
      {/* White Card */}
      <div className="w-full max-w-md flex flex-col items-center justify-start gap-6 sm:gap-8 bg-white rounded-xl sm:rounded-2xl shadow-[3px_3px_3px_3px_rgba(10,10,10,0.04)] p-6 sm:p-8 transform hover:scale-105 transition-transform duration-300">
        {/* Logo */}
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-lg">
          <img 
            src={logoImage} 
            alt="Logo" 
            className="h-full w-full object-cover"
          />
        </div>

        {/* Title */}
        <div className="flex w-full flex-col items-center justify-start gap-2">
          <h1 className="text-xl sm:text-2xl font-semibold leading-7 sm:leading-8 text-[#181D27] text-center">
            Create new password
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col items-start justify-start gap-4 sm:gap-5">
          {/* Password Input */}
          <div className="flex w-full flex-col items-start justify-start gap-1.5 self-stretch">
            <label className="text-xs sm:text-sm font-medium leading-4 sm:leading-5 text-[#414651]">
              New Password
            </label>
            <div 
              className={`inline-flex w-full items-center justify-start gap-2 self-stretch rounded-lg bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] hover:shadow-md outline outline-1 ${passwordError ? 'outline-red-500' : 'outline-[#D5D7DA]'} -outline-offset-1 relative`}
            >
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (passwordError) setPasswordError(null)
                  // Clear error when user starts typing
                  if (onPasswordChange && e.target.value) {
                    onPasswordChange()
                  }
                }}
                placeholder="Enter password"
                className="flex-1 bg-transparent text-sm sm:text-base font-normal leading-5 sm:leading-6 text-[#181D27] placeholder:text-[#717680] outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 flex items-center justify-center text-[#717680] hover:text-[#414651] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">
                {passwordError}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex w-full items-center justify-start self-stretch">
              <p className="text-xs sm:text-sm font-normal leading-4 sm:leading-5 text-red-500">
                {error}
              </p>
            </div>
          )}

          {/* Continue Button */}
          <button
            type="submit"
            disabled={!password || isLoading}
            className="inline-flex w-full mt-2 items-center justify-center self-stretch overflow-hidden rounded-lg px-4 py-2.5 sm:py-3 touch-manipulation bg-[#6938EF] shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5925DC] transition-colors"
          >
            <span className="break-words text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-white">
              {isLoading ? 'Creating...' : 'Continue'}
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePasswordPage

