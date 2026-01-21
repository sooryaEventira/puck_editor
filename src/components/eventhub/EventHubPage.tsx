import React, { useState, useMemo, useCallback } from 'react'
import { useEventForm } from '../../contexts/EventFormContext'
import EventHubNavbar from './EventHubNavbar'
import EventHubSidebar from './EventHubSidebar'
import EventHubContent, { defaultCards, ContentCard } from './EventHubContent'
import CommunicationPage from './communication/CommunicationPage'
import ResourceManagementPage from './resourcemanagement/ResourceManagementPage'
import SchedulePage from './schedulesession/SchedulePage'
import EventWebsitePage from './EventWebsitePage'
import AttendeeManagementPage from './attendeemanagement/AttendeeManagementPage'
import SpeakerManagementPage from './speakermanagement/SpeakerManagementPage'
import WebsiteSettingsPage from './websitesettings/WebsiteSettingsPage'
import { InfoCircle, CodeBrowser, Globe01 } from '@untitled-ui/icons-react'

interface EventHubPageProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  userAvatarUrl?: string
  onCardClick?: (cardId: string) => void
}

const EventHubPage: React.FC<EventHubPageProps> = ({
  eventName: propEventName,
  isDraft: propIsDraft,
  onBackClick,
  userAvatarUrl
}) => {
  // Get eventData and createdEvent from context to maintain consistency across all pages
  const { eventData, createdEvent } = useEventForm()
  
  // Prioritize createdEvent data from API (set when clicking event from dashboard), 
  // fallback to eventData from form, then props
  const eventName = createdEvent?.eventName || eventData?.eventName || propEventName || 'Highly important conference of 2025'
  const isDraft = propIsDraft !== undefined ? propIsDraft : true
  const [activeSection, setActiveSection] = useState('event-website')

  // Read section from URL only on initial mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const section = urlParams.get('section')
    if (section) {
      console.log('📍 Reading section from URL on mount:', section)
      setActiveSection(section)
    } else {
      // If no section in URL, default to event-website instead of empty event-hub page
      setActiveSection('event-website')
    }
  }, []) // Only run on mount

  // Debug: Log when activeSection changes
  React.useEffect(() => {
    console.log('🔄 activeSection changed to:', activeSection)
  }, [activeSection])

  const handleSearchClick = () => {
    console.log('Search clicked')
    // TODO: Implement search functionality
  }

  const handleNotificationClick = () => {
    console.log('Notification clicked')
    // TODO: Implement notification functionality
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
    // TODO: Implement profile functionality
  }

  // Convert cards to sidebar sub-items
  const sidebarItems = useMemo(() => {
    const eventHubSubItems = defaultCards.map((card: ContentCard) => ({
      id: card.id,
      label: card.title,
      icon: card.icon
    }))

    return [
      { id: 'overview', label: 'Overview', icon: <InfoCircle className="h-5 w-5" /> },
      { id: 'event-website', label: 'Event website', icon: <CodeBrowser className="h-5 w-5" /> },
      {
        id: 'event-hub',
        label: 'Event Hub',
        icon: <Globe01 className="h-5 w-5" />,
        subItems: eventHubSubItems
      }
    ]
  }, [])

  const handleBackClick = useCallback(() => {
    // Always go directly to dashboard when clicking back from Event Hub or any sub-section
    onBackClick?.()
  }, [onBackClick])

  const handleSidebarItemClick = useCallback((itemId: string) => {
    console.log('📍 EventHubPage - Sidebar item clicked:', itemId)
    
    // Handle top-level menu items
    if (itemId === 'event-hub' || itemId === 'event-website' || itemId === 'overview') {
      console.log('📍 Setting activeSection to:', itemId)
      setActiveSection(itemId)
      // Update URL to reflect the change
      const newUrl = itemId === 'event-hub' ? '/event/hub' : `/event/hub?section=${itemId}`
      window.history.pushState({ section: itemId }, '', newUrl)
      return
    }
    
    // Check if this is a card ID and set it as active section
    const isCardId = defaultCards.some((card) => card.id === itemId)
    if (isCardId) {
      console.log('📍 Card ID detected, setting active section to:', itemId)
      setActiveSection(itemId)
      // Update URL to reflect the change
      window.history.pushState({ section: itemId }, '', `/event/hub?section=${itemId}`)
    } else {
      console.log('⚠️ Not a card ID, ignoring:', itemId)
    }
  }, [])

  const renderContent = () => {
    console.log('🎨 renderContent called with activeSection:', activeSection)
    switch (activeSection) {
      case 'communications':
        return (
          <CommunicationPage
            eventName={eventName}
            isDraft={isDraft}
            onBackClick={onBackClick}
            userAvatarUrl={userAvatarUrl}
            hideNavbarAndSidebar={true}
          />
        )
      case 'resource-management':
        return (
          <ResourceManagementPage
            eventName={eventName}
            isDraft={isDraft}
            onBackClick={onBackClick}
            userAvatarUrl={userAvatarUrl}
            hideNavbarAndSidebar={true}
          />
        )
      case 'schedule-session':
        return (
          <SchedulePage
            eventName={eventName}
            isDraft={isDraft}
            onBackClick={onBackClick}
            userAvatarUrl={userAvatarUrl}
            scheduleName="Schedule 1"
            hideNavbarAndSidebar={true}
          />
        )
      case 'event-website':
        return (
          <EventWebsitePage
            onBackClick={onBackClick}
            userAvatarUrl={userAvatarUrl}
            hideNavbarAndSidebar={true}
          />
        )
      case 'attendee-management':
        return (
          <AttendeeManagementPage
            eventName={eventName}
            isDraft={isDraft}
            onBackClick={onBackClick}
            userAvatarUrl={userAvatarUrl}
            hideNavbarAndSidebar={true}
          />
        )
      case 'speaker-management':
        return (
          <SpeakerManagementPage
            eventName={eventName}
            isDraft={isDraft}
            onBackClick={onBackClick}
            userAvatarUrl={userAvatarUrl}
            hideNavbarAndSidebar={true}
          />
        )
      case 'analytics':
        // Placeholder for pages that haven't been implemented yet
        return (
          <div className="min-h-screen flex items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-700 mb-4">
                {defaultCards.find(card => card.id === activeSection)?.title || 'Coming Soon'}
              </h2>
              <p className="text-slate-500">
                This feature is coming soon.
              </p>
            </div>
          </div>
        )
      case 'website-settings':
        return (
          <WebsiteSettingsPage
            hideNavbarAndSidebar={true}
          />
        )
      case 'event-hub':
      default:
        // Redirect to event-website instead of showing empty Event Hub page
        return (
          <EventWebsitePage
            onBackClick={onBackClick}
            userAvatarUrl={userAvatarUrl}
            hideNavbarAndSidebar={true}
          />
        )
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-white">
      {/* Navbar - Uses eventData from context for consistency */}
      <EventHubNavbar
        eventName={eventName}
        isDraft={isDraft}
        onBackClick={handleBackClick}
        onSearchClick={handleSearchClick}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        userAvatarUrl={userAvatarUrl}
      />

      {/* Sidebar */}
      <EventHubSidebar
        items={sidebarItems}
        activeItemId={activeSection}
        onItemClick={handleSidebarItemClick}
      />

      {/* Content Area */}
      <div key={activeSection} className="md:pl-[250px] pt-16 h-[calc(100vh-64px)] overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  )
}

export default EventHubPage

