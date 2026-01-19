import React, { useState, useMemo, useEffect } from 'react'
import DashboardSidebar from './DashboardSidebar'
import DashboardNavbar from './DashboardNavbar'
import DashboardContent from './DashboardContent'
import NewEventForm, { type EventFormData } from './NewEventForm'
import TemplateSelectionPage from './TemplateSelectionPage'
import EventWebsitePage from '../eventhub/EventWebsitePage'
import WebsitePreviewPage from '../eventhub/WebsitePreviewPage'
import { defaultEvents, type Event } from './EventsTable'
import type { DateRange } from '../ui/untitled'
import { fetchEvents, type EventData } from '../../services/eventService'

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
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showNewEventForm, setShowNewEventForm] = useState(false)
  const [showTemplatePage, setShowTemplatePage] = useState(false)
  const [showEventWebsitePage, setShowEventWebsitePage] = useState(false)
  const [showPreviewPage, setShowPreviewPage] = useState(false)
  const [previewPageId, setPreviewPageId] = useState<string>('')

  // Check if we should show template page or event website page based on URL
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname
      // Don't handle editor routes here - they're handled by App.tsx
      if (path.startsWith('/event/website/editor/')) {
        return
      }
      
      if (path === '/event/create/template') {
        setShowTemplatePage(true)
        setShowNewEventForm(false)
        setShowEventWebsitePage(false)
        setShowPreviewPage(false)
      } else if (path.startsWith('/event/website/preview/')) {
        // Extract pageId from path: /event/website/preview/:pageId
        const pageIdMatch = path.match(/\/event\/website\/preview\/(.+)/)
        const pageId = pageIdMatch ? pageIdMatch[1] : 'welcome'
        setPreviewPageId(pageId)
        setShowPreviewPage(true)
        setShowEventWebsitePage(false)
        setShowTemplatePage(false)
        setShowNewEventForm(false)
      } else if (path === '/event/website') {
        setShowEventWebsitePage(true)
        setShowTemplatePage(false)
        setShowNewEventForm(false)
        setShowPreviewPage(false)
      } else {
        setShowTemplatePage(false)
        setShowEventWebsitePage(false)
        setShowPreviewPage(false)
      }
    }

    // Check on mount
    checkRoute()

    // Listen for navigation events
    const handleLocationChange = () => {
      checkRoute()
    }

    // Listen for custom event to open form
    const handleOpenForm = () => {
      setShowTemplatePage(false)
      setShowEventWebsitePage(false)
      setShowNewEventForm(true)
    }

    // Check route periodically (in case of programmatic navigation)
    const interval = setInterval(checkRoute, 100)

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('open-event-form', handleOpenForm)

    return () => {
      clearInterval(interval)
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('open-event-form', handleOpenForm)
    }
  }, [])
  
  // Events data - fetched from API
  const [events, setEvents] = useState<Event[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true)
  const [eventsError, setEventsError] = useState<string | null>(null)

  // Fetch events on mount
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingEvents(true)
      setEventsError(null)
      
      try {
        console.log('🔄 [DashboardLayout] Fetching events...')
        const eventDataList = await fetchEvents()
        console.log('✅ [DashboardLayout] Events fetched:', eventDataList.length, 'events')
        console.log('📋 [DashboardLayout] Event data list:', JSON.stringify(eventDataList, null, 2))
        
        // Map API response to Event interface format
        const mappedEvents: Event[] = eventDataList.map((eventData: EventData) => {
          // Map eventExperience to attendanceType
          const attendanceTypeMap: Record<string, 'Online' | 'Offline' | 'Hybrid'> = {
            'virtual': 'Online',
            'in-person': 'Offline',
            'hybrid': 'Hybrid',
          }
          
          // Map status to Live/Draft
          const statusMap: Record<string, 'Live' | 'Draft'> = {
            'Live': 'Live',
            'live': 'Live',
            'Published': 'Live',
            'published': 'Live',
            'Draft': 'Draft',
            'draft': 'Draft',
          }
          
          // Format date
          const formatDate = (dateString?: string): string => {
            if (!dateString) return 'TBD'
            try {
              const date = new Date(dateString)
              if (isNaN(date.getTime())) return 'TBD'
              return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })
            } catch {
              return 'TBD'
            }
          }
          
          // Get createdBy from user info or default
          const createdBy = eventData.createdBy || 
                           eventData.created_by || 
                           localStorage.getItem('userEmail')?.split('@')[0] || 
                           'Unknown'
          
          return {
            id: eventData.uuid,
            name: eventData.eventName,
            status: statusMap[eventData.status || ''] || 'Draft',
            attendanceType: attendanceTypeMap[eventData.eventExperience || ''] || 'Online',
            registrations: eventData.registrations || 0,
            eventDate: formatDate(eventData.startDate),
            createdBy: createdBy,
          }
        })
        
        console.log('✅ [DashboardLayout] Mapped events:', mappedEvents.length, 'events')
        console.log('📋 [DashboardLayout] Mapped events data:', JSON.stringify(mappedEvents, null, 2))
        setEvents(mappedEvents)
      } catch (error) {
        console.error('Failed to fetch events:', error)
        setEventsError(error instanceof Error ? error.message : 'Failed to load events')
        // Fallback to empty array or default events on error
        setEvents([])
      } finally {
        setIsLoadingEvents(false)
      }
    }
    
    loadEvents()
  }, [])

  // Helper function to parse event date from format "Jan 13, 2025" to Date object
  const parseEventDate = (dateString: string): Date | null => {
    try {
      const parsed = new Date(dateString)
      if (isNaN(parsed.getTime())) {
        return null
      }
      return parsed
    } catch {
      return null
    }
  }

  // Calculate summary statistics from all events
  const summaryStats = useMemo(() => {
    const totalEvents = events.length
    const liveEvents = events.filter(event => event.status === 'Live').length
    const eventDrafts = events.filter(event => event.status === 'Draft').length
    
    return {
      totalEvents,
      liveEvents,
      eventDrafts
    }
  }, [events])

  // Filter events based on search query and date range
  const filteredEvents = useMemo(() => {
    let filtered = events

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((event) => {
        const eventDate = parseEventDate(event.eventDate)
        if (!eventDate) return false
        
        // Set time to start of day for accurate comparison
        const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
        const startDateOnly = new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), dateRange.start.getDate())
        const endDateOnly = new Date(dateRange.end.getFullYear(), dateRange.end.getMonth(), dateRange.end.getDate())
        
        return eventDateOnly >= startDateOnly && eventDateOnly <= endDateOnly
      })
    }

    // Apply search filter
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim()
      
      filtered = filtered.filter((event) => {
        // Search across multiple fields: name, status, attendanceType, createdBy, eventDate, registrations
        const matchesName = event.name.toLowerCase().includes(searchLower)
        const matchesStatus = event.status.toLowerCase().includes(searchLower)
        const matchesAttendanceType = event.attendanceType.toLowerCase().includes(searchLower)
        const matchesCreatedBy = event.createdBy.toLowerCase().includes(searchLower)
        const matchesEventDate = event.eventDate.toLowerCase().includes(searchLower)
        const matchesRegistrations = event.registrations.toString().includes(searchLower)
        
        return (
          matchesName ||
          matchesStatus ||
          matchesAttendanceType ||
          matchesCreatedBy ||
          matchesEventDate ||
          matchesRegistrations
        )
      })
    }

    return filtered
  }, [events, searchValue, dateRange])

  const handleSidebarItemClick = (itemId: string) => {
    setActiveItemId(itemId)
    onSidebarItemClick?.(itemId)
    // Close sidebar on mobile when item is clicked
    setIsSidebarOpen(false)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleNewEventClick = () => {
    setShowNewEventForm(true)
    onNewEventClick?.()
  }

  const handleFormClose = () => {
    setShowNewEventForm(false)
  }

  const handleFormSubmit = (data: EventFormData) => {
    console.log('Event form submitted:', data)
    // TODO: Handle form submission (e.g., API call)
    setShowNewEventForm(false)
    onNewEventClick?.()
  }

  // Show preview page
  if (showPreviewPage) {
    return (
      <WebsitePreviewPage
        pageId={previewPageId}
        onBackClick={() => {
          window.history.pushState({}, '', '/event/website')
          window.dispatchEvent(new PopStateEvent('popstate'))
        }}
        userAvatarUrl={userAvatarUrl}
      />
    )
  }

  // Show event website page
  if (showEventWebsitePage) {
    return (
      <EventWebsitePage
        onBackClick={() => {
          window.history.pushState({}, '', '/dashboard')
          window.dispatchEvent(new PopStateEvent('popstate'))
        }}
        userAvatarUrl={userAvatarUrl}
      />
    )
  }

  // Show template selection page
  if (showTemplatePage) {
    return <TemplateSelectionPage />
  }

  // Show form overlay if form is open
  if (showNewEventForm) {
    return (
      <NewEventForm
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    )
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
        onNewEventClick={handleNewEventClick}
        userAvatarUrl={userAvatarUrl}
        userEmail={userEmail}
        onMenuClick={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />


      {/* Main Content */}
      <main className="lg:ml-[250px] mt-16 p-4 sm:p-6">
        {isLoadingEvents ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6938EF] mb-4"></div>
              <p className="text-slate-600">Loading events...</p>
            </div>
          </div>
        ) : eventsError ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading events</p>
              <p className="text-slate-600 text-sm">{eventsError}</p>
            </div>
          </div>
        ) : (
          <DashboardContent
            title={title}
            onNewEventClick={handleNewEventClick}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onEditEvent={onEditEvent}
            onSortEvents={onSortEvents}
            events={filteredEvents}
            totalEvents={summaryStats.totalEvents}
            liveEvents={summaryStats.liveEvents}
            eventDrafts={summaryStats.eventDrafts}
          />
        )}
      </main>
    </div>
  )
}

export default DashboardLayout

