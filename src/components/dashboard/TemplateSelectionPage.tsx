import React, { useState, useEffect } from 'react'
import { useEventForm } from '../../contexts/EventFormContext'
import { env } from '../../config/env'
import HeroSection from '../advanced/HeroSection'
import AboutSection from '../advanced/AboutSection'
import SpeakersSection from '../advanced/SpeakersSection'
import RegistrationCTA from '../advanced/RegistrationCTA'
import Sponsors from '../advanced/Sponsors'
import FAQAccordion from '../advanced/FAQAccordion'
import ContactFooter from '../advanced/ContactFooter'

const TemplateSelectionPage: React.FC = () => {
  const { eventData, createdEvent } = useEventForm()
  const [bannerUrl, setBannerUrl] = useState<string>('')
  const [isLoadingBanner, setIsLoadingBanner] = useState<boolean>(true)

  // Prioritize createdEvent data from API, fallback to eventData from form
  const displayEventName = createdEvent?.eventName || eventData?.eventName
  const displayStartDate = createdEvent?.startDate || eventData?.startDate
  const displayLocation = createdEvent?.location || eventData?.location

  // Load banner: Priority 1 = localStorage (most reliable), Priority 2 = backend, Priority 3 = eventData
  useEffect(() => {
    // Priority 1: Check localStorage first (where banner is stored during event creation)
    const storedBanner = localStorage.getItem('event-form-banner')
    if (storedBanner) {
      console.log('✅ TemplateSelectionPage: Banner loaded from localStorage')
      setBannerUrl(storedBanner)
      setIsLoadingBanner(false)
      return
    }

    // Priority 2: Try to get banner URL from createdEvent (backend response)
    const loadBannerFromBackend = async () => {
      if (createdEvent) {
        // Check for various possible banner URL field names
        const bannerUrlFromBackend = (createdEvent as any).banner || 
                                     (createdEvent as any).bannerUrl || 
                                     (createdEvent as any).banner_url ||
                                     (createdEvent as any).bannerImage ||
                                     (createdEvent as any).banner_image
        
        if (bannerUrlFromBackend && typeof bannerUrlFromBackend === 'string') {
          let finalBannerUrl = bannerUrlFromBackend
          
          // If it's a full URL (starts with http/https), use it directly
          if (bannerUrlFromBackend.startsWith('http://') || bannerUrlFromBackend.startsWith('https://')) {
            finalBannerUrl = bannerUrlFromBackend
            // Convert HTTP to HTTPS if needed (to avoid redirect issues)
            if (finalBannerUrl.startsWith('http://') && finalBannerUrl.includes('azurewebsites.net')) {
              finalBannerUrl = finalBannerUrl.replace('http://', 'https://')
            }
          }
          // If it's a relative path (starts with /), prepend the API base URL
          else if (bannerUrlFromBackend.startsWith('/')) {
            finalBannerUrl = `${env.AUTH_API_URL}${bannerUrlFromBackend}`
          }
          // If it doesn't start with /, it might be a relative path without leading slash
          else {
            finalBannerUrl = `${env.AUTH_API_URL}/${bannerUrlFromBackend}`
          }
          
          console.log('🌐 TemplateSelectionPage: Attempting to load banner from backend:', finalBannerUrl)
          console.log('📋 CreatedEvent object:', createdEvent)
          
          // Fetch with authentication to avoid CORS issues
          const accessToken = localStorage.getItem('accessToken')
          const organizationUuid = localStorage.getItem('organizationUuid')
          
          const headers: HeadersInit = {}
          if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`
          }
          if (organizationUuid) {
            headers['X-Organization'] = organizationUuid
          }
          
          fetch(finalBannerUrl, {
            method: 'GET',
            headers,
            credentials: 'include',
            redirect: 'follow', // Follow redirects (301, 302, etc.)
          })
            .then(async (response) => {
              if (response.ok) {
                const blob = await response.blob()
                const reader = new FileReader()
                reader.onload = () => {
                  const dataUrl = reader.result as string
                  console.log('✅ TemplateSelectionPage: Banner loaded from backend with authentication')
                  setBannerUrl(dataUrl)
                  setIsLoadingBanner(false)
                }
                reader.onerror = () => {
                  console.error('❌ TemplateSelectionPage: Error converting banner blob to data URL')
                  loadEventDataFallback()
                }
                reader.readAsDataURL(blob)
              } else {
                console.warn('⚠️ TemplateSelectionPage: Failed to fetch banner with auth, status:', response.status, response.statusText)
                loadEventDataFallback()
              }
            })
            .catch((fetchError) => {
              console.warn('⚠️ TemplateSelectionPage: Error fetching banner with auth:', fetchError)
              console.log('Falling back to localStorage or eventData')
              loadEventDataFallback()
            })
          
          return
        }
      }
      
      // If no banner URL in createdEvent, try eventData fallback
      loadEventDataFallback()
    }
    
    const loadEventDataFallback = () => {
      // Priority 3: Try to get banner from eventData (if it's still a File)
      if (eventData?.banner && eventData.banner instanceof File) {
        console.log('📁 TemplateSelectionPage: Reading banner from eventData File')
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          setBannerUrl(dataUrl)
          localStorage.setItem('event-form-banner', dataUrl)
          setIsLoadingBanner(false)
          console.log('✅ TemplateSelectionPage: Banner loaded from eventData File and saved to localStorage')
        }
        reader.onerror = () => {
          console.error('❌ TemplateSelectionPage: Error reading banner file')
        }
        reader.readAsDataURL(eventData.banner)
        return
      }

      console.log('⚠️ TemplateSelectionPage: No banner found')
      console.log('📋 Debug info:', {
        hasCreatedEvent: !!createdEvent,
        createdEventKeys: createdEvent ? Object.keys(createdEvent) : [],
        hasEventData: !!eventData,
        eventDataBanner: eventData?.banner,
        localStorageBanner: !!localStorage.getItem('event-form-banner')
      })
      setIsLoadingBanner(false)
    }

    loadBannerFromBackend()
  }, [createdEvent, eventData])

  const handlePrevious = () => {
    // Navigate back to dashboard and reopen form at step 2
    window.history.pushState({}, '', '/dashboard')
    // Store flag to reopen form at step 2
    localStorage.setItem('reopen-event-form-step', '2')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleNext = () => {
    // Clear create-from-scratch flag to indicate default template was selected
    localStorage.removeItem('create-from-scratch')
    // Navigate to Event Website page
    window.history.pushState({}, '', '/event/website')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleCreateFromScratch = () => {
    // Create empty Page1 data structure
    const emptyPage1Data = {
      content: [],
      root: {
        props: {
          title: 'Page 1',
          pageTitle: 'Page 1'
        }
      },
      zones: {}
    }
    
    // Store empty Page1 data in localStorage
    localStorage.setItem('create-from-scratch-page1', JSON.stringify(emptyPage1Data))
    
    // Set flag to indicate we're creating from scratch (this will trigger custom sidebar)
    localStorage.setItem('create-from-scratch', 'true')
    
    // Navigate to editor with Page1 and mode=blank query param
    window.history.pushState({}, '', '/event/website/editor/page1?mode=blank')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  // Format date for display
  const formatEventDate = () => {
    if (!displayStartDate) return 'Jan 13, 2025'
    try {
      const date = new Date(displayStartDate)
      if (isNaN(date.getTime())) return 'Jan 13, 2025'
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return 'Jan 13, 2025'
    }
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
            title={displayEventName || 'HIC 2025'}
            subtitle={`${displayLocation || 'New York, NY'} | ${formatEventDate()}`}
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
            backgroundImage={isLoadingBanner ? '' : (bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')}
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
