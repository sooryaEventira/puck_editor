import React, { useState } from 'react'
import logoImage from '../assets/images/Logo.png'

interface EventspaceSetupPageProps {
  onSubmit?: (eventspaceName: string) => void
  isLoading?: boolean
  error?: string | null
  onNameChange?: () => void
}

const EventspaceSetupPage: React.FC<EventspaceSetupPageProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
  onNameChange
}) => {
  const [eventspaceName, setEventspaceName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (eventspaceName.trim() && onSubmit) {
      onSubmit(eventspaceName.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
      {/* White Card */}
      <div className="w-full max-w-md flex flex-col items-center justify-start gap-6 sm:gap-8 bg-white rounded-xl 
      sm:rounded-2xl shadow-[3px_3px_3px_3px_rgba(10,12.67,18,0.04)] p-6 sm:p-8 transform hover:scale-105 transition-transform duration-300">
        {/* Logo */}
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-lg">
          <img 
            src={logoImage} 
            alt="Logo" 
            className="h-full w-full object-cover"
          />
        </div>

        {/* Description Text */}
        <div className="flex w-full flex-col items-center justify-start gap-2">
          <p className="text-sm sm:text-base font-normal leading-5 sm:leading-6 text-[#414651] text-center max-w-md">
            Create events, build templates, manage your team, and more, all from one place.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col items-start justify-start gap-4 sm:gap-5">
          {/* Eventspace Name Input */}
          <div className="flex w-full flex-col items-start justify-start gap-1.5 self-stretch">
            <label className="text-xs sm:text-sm font-medium leading-4 sm:leading-5 text-[#414651]">
              Organization Name
            </label>
            <div 
              className="inline-flex w-full items-center justify-start gap-2 self-stretch rounded-lg bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 hover:shadow-md outline outline-1 outline-[#D5D7DA] -outline-offset-1"
            >
              <div className="flex flex-1 items-center justify-start gap-2">
                <input
                  id="eventspaceName"
                  type="text"
                  value={eventspaceName}
                  onChange={(e) => {
                    setEventspaceName(e.target.value)
                    // Clear error when user starts typing
                    if (onNameChange && e.target.value) {
                      onNameChange()
                    }
                  }}
                  placeholder="Enter organization name"
                  className="flex-1 bg-transparent text-sm sm:text-base font-normal leading-5 sm:leading-6 text-[#181D27] placeholder:text-[#717680] outline-none "
                  required
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex w-full items-center justify-start self-stretch">
              <p className="text-xs sm:text-sm font-normal leading-4 sm:leading-5 text-red-500">
                {error}
              </p>
            </div>
          )}

          {/* Complete Setup Button */}
          <button
            type="submit"
            disabled={!eventspaceName.trim() || isLoading}
            className="inline-flex w-full mt-2 items-center justify-center self-stretch overflow-hidden rounded-lg px-4 py-2.5 sm:py-3 touch-manipulation bg-[#6938EF] shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5925DC] transition-colors"
          >
            <span className="break-words text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-white">
              {isLoading ? 'Creating...' : 'Complete setup'}
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default EventspaceSetupPage

