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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSidebarItemClick = (itemId: string) => {
    setActiveItemId(itemId)
    onSidebarItemClick?.(itemId)
    // Close sidebar on mobile when item is clicked
    setIsSidebarOpen(false)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <DashboardSidebar
        organizationName={organizationName}
        activeItemId={activeItemId}
        onItemClick={handleSidebarItemClick}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
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
        onMenuClick={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />


      {/* Main Content */}
      <main className="lg:ml-[250px] mt-16 p-4 sm:p-6">
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

