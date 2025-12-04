import React, { useState } from 'react'
import DashboardSidebar from './DashboardSidebar'
import DashboardNavbar from './DashboardNavbar'
import DashboardContent from './DashboardContent'

interface DashboardLayoutProps {
  organizationName?: string
  title?: string
  userAvatarUrl?: string
  userEmail?: string
  onSidebarItemClick?: (itemId: string) => void
  onSearchClick?: () => void
  onNotificationClick?: () => void
  onProfileClick?: () => void
  onLogout?: () => void
  onNewEventClick?: () => void
  onEditEvent?: (eventId: string) => void
  onSortEvents?: (column: string) => void
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  organizationName,
  title = 'Web Submit Events',
  userAvatarUrl,
  userEmail,
  onSidebarItemClick,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  onLogout,
  onNewEventClick,
  onEditEvent,
  onSortEvents
}) => {
  const [activeItemId, setActiveItemId] = useState('events')
  const [searchValue, setSearchValue] = useState('')

  const handleSidebarItemClick = (itemId: string) => {
    setActiveItemId(itemId)
    onSidebarItemClick?.(itemId)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <DashboardSidebar
        organizationName={organizationName}
        activeItemId={activeItemId}
        onItemClick={handleSidebarItemClick}
      />

      {/* Navbar */}
      <DashboardNavbar
        title={title}
        onSearchClick={onSearchClick}
        onNotificationClick={onNotificationClick}
        onProfileClick={onProfileClick}
        onLogout={onLogout}
        onNewEventClick={onNewEventClick}
        userAvatarUrl={userAvatarUrl}
        userEmail={userEmail}
      />

      {/* Main Content */}
      <main className="ml-[250px] mt-16 p-6">
        <DashboardContent
          title={title}
          onNewEventClick={onNewEventClick}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onEditEvent={onEditEvent}
          onSortEvents={onSortEvents}
        />
      </main>
    </div>
  )
}

export default DashboardLayout

