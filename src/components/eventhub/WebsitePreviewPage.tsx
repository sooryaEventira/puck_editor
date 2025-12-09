import React, { useState, useEffect } from 'react'
import { useEventForm } from '../../contexts/EventFormContext'
import EventHubNavbar from './EventHubNavbar'
import PageSidebar from '../page/PageSidebar'
import TwoColumnContent from '../advanced/TwoColumnContent'
import SpeakersSection from '../advanced/SpeakersSection'
import PricingPlans from '../advanced/PricingPlans'
import { Edit05, User01 } from '@untitled-ui/icons-react'
import Input from '../ui/untitled/Input'
import Select from '../ui/untitled/Select'
import PageCreationModal, { type PageType } from '../page/PageCreationModal'

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
  const { eventData } = useEventForm()
  const [bannerUrl, setBannerUrl] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview')
  const [pages] = useState([
    { id: 'welcome', name: 'Welcome' }
  ])
  const [currentPage, setCurrentPage] = useState(pageId || 'welcome')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
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
      const storedBanner = localStorage.getItem('event-form-banner')
      if (storedBanner) {
        setBannerUrl(storedBanner)
      }
    }
  }, [eventData])

  // Update current page when pageId changes
  useEffect(() => {
    if (pageId) {
      setCurrentPage(pageId)
    }
  }, [pageId])

  const handleSearchClick = () => {
    console.log('Search clicked')
  }

  const handleNotificationClick = () => {
    console.log('Notification clicked')
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
  }

  const handleBack = () => {
    // Navigate back to Event Website management page
    window.history.pushState({}, '', '/event/website')
    window.dispatchEvent(new PopStateEvent('popstate'))
    if (onBackClick) {
      onBackClick()
    }
  }

  const handleEdit = () => {
    // Navigate to editor for this page
    window.history.pushState({}, '', `/event/website/editor/${currentPage}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handlePageSelect = (pageId: string) => {
    setCurrentPage(pageId)
    // Update URL without navigation
    window.history.pushState({}, '', `/event/website/preview/${pageId}`)
  }

  const handleAddPage = () => {
    console.log('Add page clicked')
    // TODO: Implement add page functionality
  }

  const handleNewPage = () => {
    setIsPageModalOpen(true)
  }

  const handlePageTypeSelect = (pageType: PageType) => {
    console.log('Selected page type:', pageType)
    // TODO: Implement page creation based on selected type
    setIsPageModalOpen(false)
  }

  const handleManagePages = () => {
    // Navigate back to Event Website management page
    handleBack()
  }

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
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

  // Get current page name for PageSidebar
  const currentPageName = pages.find(p => p.id === currentPage)?.name || 'Welcome'

  return (
    <div className="h-screen overflow-hidden bg-white flex flex-col">
      {/* Navbar */}
      <EventHubNavbar
        eventName={eventData?.eventName || 'Highly important conference of 2025'}
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
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        
        {/* Toggle button when sidebar is collapsed */}
        {isSidebarCollapsed && (
          <button
            onClick={handleToggleSidebar}
            className="fixed left-0 top-20 z-40 flex h-8 w-8 items-center justify-center rounded-r-md border-r border-y border-slate-200 bg-white text-slate-500 shadow-md transition hover:bg-slate-100"
            aria-label="Expand sidebar"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="M15 12l3-3-3-3" />
            </svg>
          </button>
        )}

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
              <div className="w-full">
                {/* Banner Section - Fixed Dimensions */}
                <div className="w-full relative px-4 sm:px-6 lg:px-8 pt-4">
                  {bannerUrl ? (
                    <img
                      src={bannerUrl}
                      alt="Event banner"
                      className="w-full h-[500px] object-cover rounded-[12px]"
                      onError={(e) => {
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
                <div className="pb-8">
                  <PricingPlans />
                </div>
              </div>
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

