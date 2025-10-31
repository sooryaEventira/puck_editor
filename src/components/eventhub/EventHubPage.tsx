import React, { useState } from 'react'
import EventHubNavbar from './EventHubNavbar'
import EventHubSidebar from './EventHubSidebar'
import EventHubContent from './EventHubContent'

interface EventHubPageProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  userAvatarUrl?: string
}

const EventHubPage: React.FC<EventHubPageProps> = ({
  eventName,
  isDraft,
  onBackClick,
  userAvatarUrl
}) => {
  const [activeSection, setActiveSection] = useState('event-hub')

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

  const handleSidebarItemClick = (itemId: string) => {
    console.log('Sidebar item clicked:', itemId)
    setActiveSection(itemId)
    // TODO: Implement navigation between sections
  }

  return (
    <div style={{ 
      height: '100vh', 
      overflow: 'hidden',
      backgroundColor: '#ffffff'
    }}>
      {/* Navbar */}
      <EventHubNavbar
        eventName={eventName}
        isDraft={isDraft}
        onBackClick={onBackClick}
        onSearchClick={handleSearchClick}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        userAvatarUrl={userAvatarUrl}
      />

      {/* Sidebar */}
      <EventHubSidebar
        activeItemId={activeSection}
        onItemClick={handleSidebarItemClick}
      />

      {/* Content */}
      <EventHubContent />
    </div>
  )
}

export default EventHubPage

