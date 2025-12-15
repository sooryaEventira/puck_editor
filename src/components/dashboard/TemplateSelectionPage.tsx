import React, { useState, useEffect } from 'react'
import { useEventForm } from '../../contexts/EventFormContext'
import HeroSection from '../advanced/HeroSection'
import AboutSection from '../advanced/AboutSection'
import SpeakersSection from '../advanced/SpeakersSection'
import RegistrationCTA from '../advanced/RegistrationCTA'
import Sponsors from '../advanced/Sponsors'
import FAQAccordion from '../advanced/FAQAccordion'
import ContactFooter from '../advanced/ContactFooter'

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
      <main className="pt-20 pb-24 w-full overflow-x-hidden bg-white">
        {/* Hero Section */}
        <div className="w-full">
          <HeroSection
            title={eventData?.eventName || 'HIC 2025'}
            subtitle={`${eventData?.location || 'New York, NY'} | ${formatEventDate()}`}
            buttons={[
              {
                text: 'Register Now',
                link: '#register',
                color: '#6938EF',
                textColor: 'white',
                size: 'large'
              }
            ]}
            backgroundColor="#1a1a1a"
            textColor="#FFFFFF"
            backgroundImage={bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'}
            height="500px"
            alignment="center"
            overlayOpacity={0.4}
          />
        </div>

        {/* About Section */}
        <div className="w-full">
          <AboutSection
            leftTitle="About Event"
            leftText="We are dedicated to providing innovative solutions that help our clients achieve their goals and drive success in their respective industries."
          />
        </div>

        {/* Speakers Section */}
        <div className="w-full">
          <SpeakersSection 
            speakers={defaultSpeakers}
            title="Speakers"
            showTitle={true}
            containerMaxWidth="max-w-7xl"
            containerPadding="px-4 sm:px-6 lg:px-8 py-8"
          />
        </div>

        {/* Registration CTA */}
        <div className="w-full">
          <RegistrationCTA />
        </div>

        {/* Sponsors Section */}
        <div className="w-full">
          <Sponsors />
        </div>

        {/* FAQ Accordion */}
        <div className="w-full">
          <FAQAccordion
            title="Frequently Asked Questions"
            description="Everything you need to know about the product and billing. Can't find the answer you're looking for? Please chat to our friendly team"
            containerMaxWidth="max-w-7xl"
            containerPadding="px-4 sm:px-6 lg:px-8 py-8"
          />
        </div>

        {/* Contact Footer */}
        <div className="w-full">
          <ContactFooter />
        </div>
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
