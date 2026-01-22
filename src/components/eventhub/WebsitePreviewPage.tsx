import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useEventForm } from '../../contexts/EventFormContext'
import { useWebsitePages } from '../../contexts/WebsitePagesContext'
import { NavigationProvider } from '../../contexts/NavigationContext'
import EventHubNavbar from './EventHubNavbar'
import PageSidebar from '../page/PageSidebar'
import HeroSection from '../advanced/HeroSection'
import AboutSection from '../advanced/AboutSection'
import SpeakersSection from '../advanced/SpeakersSection'
import RegistrationCTA from '../advanced/RegistrationCTA'
import Sponsors from '../advanced/Sponsors'
import FAQAccordion from '../advanced/FAQAccordion'
import ContactFooter from '../advanced/ContactFooter'
import SchedulePage from '../advanced/SchedulePage'
import { Edit05, User01 } from '@untitled-ui/icons-react'
import Input from '../ui/untitled/Input'
import PageCreationModal, { type PageType } from '../page/PageCreationModal'
import { fetchWebpage, type WebpageData } from '../../services/webpageService'
import Preview from '../shared/Preview'
import type { PageData } from '../../types'

interface WebsitePreviewPageProps {
  pageId: string
  onBackClick?: () => void
  userAvatarUrl?: string
}

const WebsitePreviewPage: React.FC<WebsitePreviewPageProps> = ({
  pageId,
  onBackClick,
  userAvatarUrl
}) => {
  const { eventData, createdEvent } = useEventForm()
  const { pages: websitePages } = useWebsitePages()
  const [bannerUrl, setBannerUrl] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview')
  const [webpageData, setWebpageData] = useState<WebpageData | null>(null)
  const [isLoadingWebpage, setIsLoadingWebpage] = useState(false)
  const [webpageError, setWebpageError] = useState<string | null>(null)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const isFetchingRef = React.useRef(false)

  // Prioritize createdEvent data from API, fallback to eventData from form
  // Use useMemo to ensure we always get the latest value and prevent stale reads
  const displayEventName = useMemo(() => {
    const name = createdEvent?.eventName || eventData?.eventName
    return name
  }, [createdEvent?.eventName, createdEvent?.uuid, eventData?.eventName])
  const displayStartDate = createdEvent?.startDate || eventData?.startDate
  const displayLocation = createdEvent?.location || eventData?.location
  
  // Convert WebsitePage format to PageSidebar format
  const pages = websitePages.map(page => ({
    id: page.id,
    name: page.name
  }))
  
  const [currentPage, setCurrentPage] = useState(pageId || (pages.length > 0 ? pages[0].id : 'welcome'))
  const [isPageModalOpen, setIsPageModalOpen] = useState(false)
  
  // Settings form state
  const [settings, setSettings] = useState({
    title: 'Welcome',
    icon: 'user',
    desktopMaxWidth: '700',
    desktopMaxWidthUnit: 'px',
    browser: 'app' as 'app' | 'browser',
    featurePermission: 'everyone' as 'everyone' | 'logged-in' | 'guests' | 'groups',
    visibility: 'show' as 'show' | 'show-no-access' | 'hide',
    hideOnMobile: false,
    showFeatureInMenu: false,
    setAsDesktopHome: true,
    setAsMobileHome: false
  })

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
        // Error reading banner file
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

  // Update current page when pageId changes or when pages are loaded
  useEffect(() => {
    if (pageId) {
      setCurrentPage(pageId)
    } else if (pages.length > 0 && !currentPage) {
      setCurrentPage(pages[0].id)
    }
  }, [pageId, pages])

  // Fetch webpage data when pageId is provided and event UUID is available
  useEffect(() => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const loadWebpage = async () => {
      // Prevent duplicate calls
      if (isFetchingRef.current) {
        return
      }

      if (!pageId || !createdEvent?.uuid) {
        setWebpageData(null)
        setWebpageError(null)
        return
      }

      // Check if pageId looks like a UUID (webpage UUID from API)
      // If it's a simple string like 'welcome', it's likely a local page ID, not a webpage UUID
      const isWebpageUuid = pageId.includes('-') && pageId.length > 20
      
      if (!isWebpageUuid) {
        setWebpageData(null)
        setWebpageError(null)
        return
      }

      // Create new abort controller for this request
      const abortController = new AbortController()
      abortControllerRef.current = abortController
      isFetchingRef.current = true

      setIsLoadingWebpage(true)
      setWebpageError(null)
      
      try {
        const fetchedWebpage = await fetchWebpage(pageId, createdEvent.uuid)
        
        // Check if request was aborted
        if (abortController.signal.aborted) {
          return
        }
        
        // Validate that the webpage belongs to the current event
        if (fetchedWebpage.event && fetchedWebpage.event !== createdEvent.uuid) {
          const errorMessage = `This webpage belongs to a different event. Please select the correct event to view this webpage.`
          setWebpageError(errorMessage)
          setWebpageData(null)
          // Redirect back to event website page after a short delay
          setTimeout(() => {
            window.history.pushState({}, '', '/event/website')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }, 2000)
          return
        }
        
        setWebpageData(fetchedWebpage)
      } catch (error) {
        // Don't handle errors if request was aborted
        if (abortController.signal.aborted) {
          return
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to load webpage'
        setWebpageError(errorMessage)
        setWebpageData(null)
        
        // If it's a 404 error, redirect back to event website page after a delay
        if (error instanceof Error && error.message.includes('not found')) {
          setTimeout(() => {
            window.history.pushState({}, '', '/event/website')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }, 3000)
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingWebpage(false)
        }
        isFetchingRef.current = false
        abortControllerRef.current = null
      }
    }

    loadWebpage()

    // Cleanup: abort request if component unmounts or dependencies change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      isFetchingRef.current = false
    }
  }, [pageId, createdEvent?.uuid])

  const handleSearchClick = () => {
    // TODO: Implement search functionality
  }

  const handleNotificationClick = () => {
    // TODO: Implement notification functionality
  }

  const handleProfileClick = () => {
    // TODO: Implement profile functionality
  }

  const handleBack = () => {
    // Navigate back to Event Website management page (event-hub with event-website section)
    window.history.pushState({ section: 'event-website' }, '', '/event/hub?section=event-website')
    window.dispatchEvent(new PopStateEvent('popstate'))
    if (onBackClick) {
      onBackClick()
    }
  }

  // Memoize handleEdit to prevent re-renders
  const handleEdit = useCallback(() => {
    // Navigate to editor for this page
    window.history.pushState({}, '', `/event/website/editor/${currentPage}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [currentPage])

  const handlePageSelect = (pageId: string) => {
    setCurrentPage(pageId)
    // Update URL without navigation
    window.history.pushState({}, '', `/event/website/preview/${pageId}`)
  }

  const handleAddPage = () => {
    // TODO: Implement add page functionality
  }

  const handleNewPage = () => {
    setIsPageModalOpen(true)
  }

  const handlePageTypeSelect = (pageType: PageType) => {
    // TODO: Implement page creation based on selected type
    setIsPageModalOpen(false)
  }

  const handleManagePages = () => {
    // Navigate back to Event Website management page
    handleBack()
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


  // Get current page data
  const currentPageData = websitePages.find(p => p.id === currentPage)
  const currentPageName = currentPageData?.name || 'Welcome'
  const pageType = currentPageData?.type
  const pageComponent = currentPageData?.component

  // Render default template components
  const defaultTemplateJSX = useMemo(() => (
    <div className="w-full bg-white">
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
    </div>
  ), [eventData, bannerUrl, defaultSpeakers])

  // Extract page data from webpage content structure
  const extractPageData = useCallback((webpageContent: any): PageData | null => {
    if (!webpageContent || typeof webpageContent !== 'object') {
      return null
    }

    // The content structure is: { "pageName": { "data": { "/": { "root": {...}, "content": [...], "zones": {} } } } }
    // We need to extract the actual page data from this nested structure
    const pageKeys = Object.keys(webpageContent)
    if (pageKeys.length === 0) {
      return null
    }

    // Get the first page key (usually the page name like "welcome")
    const pageKey = pageKeys[0]
    const pageData = webpageContent[pageKey]

    if (!pageData || !pageData.data) {
      return null
    }

    // Get the data for the root path "/"
    const rootPathData = pageData.data['/']
    if (!rootPathData) {
      return null
    }

    // Extract and return the PageData structure
    return {
      content: rootPathData.content || [],
      root: rootPathData.root || {},
      zones: rootPathData.zones || {}
    }
  }, [])

  // Convert webpage data to PageData format
  const webpagePageData = useMemo(() => {
    if (!webpageData || !webpageData.content) {
      return null
    }
    return extractPageData(webpageData.content)
  }, [webpageData, extractPageData])

  // Dynamic component renderer based on page type
  const renderPageComponent = useMemo(() => {
    // If page type is 'schedule' and component is 'SchedulePage', render SchedulePage
    if (pageType === 'schedule' && pageComponent === 'SchedulePage') {
      return (
        <NavigationProvider onNavigateToEditor={handleEdit}>
          <SchedulePage key={currentPage} />
        </NavigationProvider>
      )
    }
    
    // Default: render template components
    return defaultTemplateJSX
  }, [pageType, pageComponent, currentPage, handleEdit, defaultTemplateJSX])

  return (
    <div className="h-screen overflow-hidden bg-white flex flex-col">
      {/* Navbar */}
      <EventHubNavbar
        key={createdEvent?.uuid || 'no-event'} // Force re-render when event changes
        eventName={displayEventName || 'Highly important conference of 2025'}
        isDraft={true}
        onBackClick={handleBack}
        onSearchClick={handleSearchClick}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        userAvatarUrl={userAvatarUrl}
      />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden mt-16">
        {/* PageSidebar */}
        <PageSidebar
          pages={pages}
          currentPage={currentPage}
          currentPageName={currentPageName}
          onPageSelect={handlePageSelect}
          onAddPage={handleAddPage}
          onManagePages={handleManagePages}
          onBackClick={handleBack}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary">Event Website</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <Edit05 className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleNewPage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#6938EF] hover:bg-[#5925DC] transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New page
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('preview')}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'text-[#6938EF] border-b-2 border-[#6938EF]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-[#6938EF] border-b-2 border-[#6938EF]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Content based on active tab */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'preview' && (
              <>
                {isLoadingWebpage ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                      <p className="text-slate-600">Loading webpage...</p>
                    </div>
                  </div>
                ) : webpageError ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <p className="text-red-600 mb-2">Error loading webpage</p>
                      <p className="text-sm text-slate-600">{webpageError}</p>
                    </div>
                  </div>
                ) : webpageData ? (
                  <div className="w-full">
                    {/* Render webpage content from API */}
                    {webpageData.content && typeof webpageData.content === 'string' ? (
                      // If content is HTML string, render it
                      <div 
                        dangerouslySetInnerHTML={{ __html: webpageData.content }}
                        className="w-full"
                      />
                    ) : webpagePageData ? (
                      // If we have valid PageData, render it using Preview component
                      <Preview 
                        data={webpagePageData} 
                        isInteractive={false}
                      />
                    ) : (
                      // Fallback to default template
                      renderPageComponent
                    )}
                  </div>
                ) : (
                  // No webpage data, render default template
                  renderPageComponent
                )}
              </>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-3xl space-y-6">
                {/* Title */}
                <div>
                  <Input
                    label="Title"
                    value={settings.title}
                    onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                    className="w-full"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="flex w-full flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Icon</span>
                    <div className="relative">
                      <select
                        value={settings.icon}
                        onChange={(e) => setSettings({ ...settings, icon: e.target.value })}
                        className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pl-10 text-sm text-slate-700 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="user">Change icon</option>
                        <option value="home">Home</option>
                        <option value="calendar">Calendar</option>
                        <option value="users">Users</option>
                        <option value="settings">Settings</option>
                      </select>
                      <User01 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <svg
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </label>
                </div>

                {/* Desktop container max width */}
                <div>
                  <label className="flex w-full flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Desktop container max width</span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={settings.desktopMaxWidth}
                        onChange={(e) => setSettings({ ...settings, desktopMaxWidth: e.target.value })}
                        className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <select
                        value={settings.desktopMaxWidthUnit}
                        onChange={(e) => setSettings({ ...settings, desktopMaxWidthUnit: e.target.value })}
                        className="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="px">px</option>
                        <option value="%">%</option>
                        <option value="rem">rem</option>
                      </select>
                    </div>
                  </label>
                </div>

                {/* Browser */}
                <div>
                  <label className="flex w-full flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Browser</span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="browser"
                          value="app"
                          checked={settings.browser === 'app'}
                          onChange={(e) => setSettings({ ...settings, browser: e.target.value as 'app' | 'browser' })}
                          className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Open website in app</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="browser"
                          value="browser"
                          checked={settings.browser === 'browser'}
                          onChange={(e) => setSettings({ ...settings, browser: e.target.value as 'app' | 'browser' })}
                          className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Open website in browser</span>
                      </label>
                    </div>
                  </label>
                </div>

                {/* Feature permission */}
                <div>
                  <label className="flex w-full flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Feature permission (Who has access)</span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="featurePermission"
                          value="everyone"
                          checked={settings.featurePermission === 'everyone'}
                          onChange={(e) => setSettings({ ...settings, featurePermission: e.target.value as any })}
                          className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Everyone</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="featurePermission"
                          value="logged-in"
                          checked={settings.featurePermission === 'logged-in'}
                          onChange={(e) => setSettings({ ...settings, featurePermission: e.target.value as any })}
                          className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Logged in users</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="featurePermission"
                          value="guests"
                          checked={settings.featurePermission === 'guests'}
                          onChange={(e) => setSettings({ ...settings, featurePermission: e.target.value as any })}
                          className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Guests (Non-logged in users)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="featurePermission"
                          value="groups"
                          checked={settings.featurePermission === 'groups'}
                          onChange={(e) => setSettings({ ...settings, featurePermission: e.target.value as any })}
                          className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Users in certain groups</span>
                      </label>
                    </div>
                  </label>
                </div>

                {/* Visibility */}
                <div>
                  <label className="flex w-full flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Visibility</span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          value="show"
                          checked={settings.visibility === 'show'}
                          onChange={(e) => setSettings({ ...settings, visibility: e.target.value as any })}
                          className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Show feature in menu</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          value="show-no-access"
                          checked={settings.visibility === 'show-no-access'}
                          onChange={(e) => setSettings({ ...settings, visibility: e.target.value as any })}
                          className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Show feature in menu, even if user has not access</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          value="hide"
                          checked={settings.visibility === 'hide'}
                          onChange={(e) => setSettings({ ...settings, visibility: e.target.value as any })}
                          className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Hide feature for now</span>
                      </label>
                    </div>
                  </label>
                </div>

                {/* Platform */}
                <div>
                  <label className="flex w-full flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Platform</span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.hideOnMobile}
                          onChange={(e) => setSettings({ ...settings, hideOnMobile: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Hide on mobile</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.showFeatureInMenu}
                          onChange={(e) => setSettings({ ...settings, showFeatureInMenu: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Show feature in menu, even if user has not access</span>
                      </label>
                    </div>
                  </label>
                </div>

                {/* Home page */}
                <div>
                  <label className="flex w-full flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Home page</span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.setAsDesktopHome}
                          onChange={(e) => setSettings({ ...settings, setAsDesktopHome: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Set as desktop home page</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.setAsMobileHome}
                          onChange={(e) => setSettings({ ...settings, setAsMobileHome: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-slate-700">Set as mobile home page</span>
                      </label>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Creation Modal */}
      <PageCreationModal
        isVisible={isPageModalOpen}
        onClose={() => setIsPageModalOpen(false)}
        onSelect={handlePageTypeSelect}
      />
    </div>
  )
}

export default WebsitePreviewPage

