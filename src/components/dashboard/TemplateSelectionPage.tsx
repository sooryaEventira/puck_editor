import React, { useState, useEffect } from 'react'
import { useEventForm } from '../../contexts/EventFormContext'
import TwoColumnContent from '../advanced/TwoColumnContent'
import SpeakersSection from '../advanced/SpeakersSection'
import PricingPlans from '../advanced/PricingPlans'

const TemplateSelectionPage: React.FC = () => {
  const { eventData } = useEventForm()
  const [bannerUrl, setBannerUrl] = useState<string>('')

  // Load banner from localStorage or eventData
  useEffect(() => {
    // First, try to get banner from eventData (if it's still a File)
    if (eventData?.banner && eventData.banner instanceof File) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setBannerUrl(dataUrl)
        localStorage.setItem('event-form-banner', dataUrl)
      }
      reader.onerror = () => {
        console.error('Error reading banner file')
      }
      reader.readAsDataURL(eventData.banner)
    } else {
      // Otherwise, try to load from localStorage
      const storedBanner = localStorage.getItem('event-form-banner')
      if (storedBanner) {
        setBannerUrl(storedBanner)
      }
    }
  }, [eventData])

  const handlePrevious = () => {
    // Navigate back to dashboard and reopen form at step 2
    window.history.pushState({}, '', '/dashboard')
    // Store flag to reopen form at step 2
    localStorage.setItem('reopen-event-form-step', '2')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleNext = () => {
    // Navigate to Event Website page
    window.history.pushState({}, '', '/event/website')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleCreateFromScratch = () => {
    // TODO: Handle create from scratch
    console.log('Create from scratch - to be implemented')
  }

  // Format date for display
  const formatEventDate = () => {
    if (!eventData?.startDate) return 'Jan 13, 2025'
    const date = new Date(eventData.startDate)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Default speakers data
  const defaultSpeakers = [
    {
      name: 'Speaker Name',
      title: 'Speaker Title',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    },
    {
      name: 'Speaker Name',
      title: 'Speaker Title',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    },
    {
      name: 'Speaker Name',
      title: 'Speaker Title',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    }
  ]

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header with Create from scratch button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold text-slate-900">
          Customize your design.
        </div>
        <button
          onClick={handleCreateFromScratch}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#6938EF] hover:bg-[#5925DC] transition-colors"
        >
          + Create from scratch
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 w-full overflow-x-hidden">
        {/* Banner Section - Fixed Dimensions */}
        <div className="w-full relative px-4 sm:px-6 lg:px-8">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Event banner"
              className="w-full h-[500px] object-cover rounded-[12px]"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600'
              }}
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600"
              alt="Default banner"
              className="w-full h-[500px] object-cover rounded-[12px]"
            />
          )}
          
          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
            {/* Title and Subtitle */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center px-4 drop-shadow-lg">
              {eventData?.eventName || 'HIC 2025'}
            </h1>
            <p className="text-lg md:text-xl mb-6 text-center px-4 drop-shadow-md">
              {eventData?.location || 'New York, NY'} | {formatEventDate()}
            </p>
            
            {/* Register Button */}
            <button className="px-8 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold rounded-lg transition-colors shadow-lg">
              Register Now
            </button>
          </div>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 rounded-[12px] z-0" />
        </div>

        {/* Two Column Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TwoColumnContent
            leftTitle="About the event"
            leftContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            rightTitle="Sponsor"
            rightContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            showRightIcon={true}
          />
        </div>

        {/* Speakers Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Speakers</h2>
          </div>
          <SpeakersSection speakers={defaultSpeakers} />
        </div>

        {/* Pricing Plans */}
        <PricingPlans />
      </main>

      {/* Footer with Previous and Next buttons */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#6938EF] hover:bg-[#5925DC] transition-colors"
        >
          Next
        </button>
      </footer>
    </div>
  )
}

export default TemplateSelectionPage
