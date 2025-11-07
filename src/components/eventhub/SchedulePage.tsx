import React from 'react'
import EventHubNavbar from './EventHubNavbar'
import EventHubSidebar from './EventHubSidebar'
import ScheduleContent from './ScheduleContent'

interface SchedulePageProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  userAvatarUrl?: string
  scheduleName?: string
}

const SchedulePage: React.FC<SchedulePageProps> = ({
  eventName,
  isDraft,
  onBackClick,
  userAvatarUrl,
  scheduleName
}) => {
  const handleSearchClick = () => {
    console.log('Search clicked')
  }

  const handleNotificationClick = () => {
    console.log('Notification clicked')
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
  }

  const handleSidebarItemClick = (itemId: string) => {
    console.log('Sidebar item clicked:', itemId)
    // TODO: Implement navigation between sections
  }

  const handleUpload = () => {
    console.log('Upload clicked')
    // TODO: Implement upload functionality
  }

  const handleAddSession = () => {
    console.log('Add session clicked')
    // TODO: Implement add session functionality
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
        activeItemId="event-hub"
        onItemClick={handleSidebarItemClick}
      />

      {/* Schedule Content */}
      <ScheduleContent
        scheduleName={scheduleName}
        onUpload={handleUpload}
        onAddSession={handleAddSession}
      />
    </div>
  )
}

export default SchedulePage

