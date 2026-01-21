import React, { useState, useMemo, useEffect, useRef } from 'react'
import DashboardSidebar from './DashboardSidebar'
import DashboardNavbar from './DashboardNavbar'
import DashboardContent from './DashboardContent'
import NewEventForm, { type EventFormData } from './NewEventForm'
import TemplateSelectionPage from './TemplateSelectionPage'
import EventWebsitePage from '../eventhub/EventWebsitePage'
import WebsitePreviewPage from '../eventhub/WebsitePreviewPage'
import { type Event } from './EventsTable'
import type { DateRange } from '../ui/untitled'
import { fetchEvents, fetchEvent, type EventData, type CreateEventResponseData } from '../../services/eventService'
import { useEventForm } from '../../contexts/EventFormContext'

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
  const { setCreatedEvent } = useEventForm()
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
        const wasShowingOtherPages = showTemplatePage || showEventWebsitePage || showPreviewPage
        setShowTemplatePage(false)
        setShowEventWebsitePage(false)
        setShowPreviewPage(false)
        // If navigating back to dashboard from other pages, refresh events
        if ((path === '/dashboard' || path === '/') && wasShowingOtherPages) {
          loadEvents()
        }
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

  // Fetch events function
  const loadEvents = async () => {
    setIsLoadingEvents(true)
    setEventsError(null)
    
    try {
      console.log('🔄 [DashboardLayout] Fetching events...')
      const eventDataList = await fetchEvents()
      console.log('✅ [DashboardLayout] Events fetched:', eventDataList.length, 'events')
      
      // Debug: Log first event to see available fields
      if (eventDataList.length > 0) {
        const sampleEvent = eventDataList[0] as any
        console.log('🔍 [DashboardLayout] Sample event fields:', Object.keys(sampleEvent))
        console.log('🔍 [DashboardLayout] Sample event - created_at:', sampleEvent.created_at, 'createdAt:', sampleEvent.createdAt, 'created_date:', sampleEvent.created_date, 'event_date:', sampleEvent.event_date)
      }
      
      // Sort events by createdAt in descending order (newest first)
      const sortedEventDataList = [...eventDataList].sort((a, b) => {
        // Get creation date from various possible fields
        const getCreationDate = (event: EventData | any): number => {
          // Priority 1: Try created_at (snake_case from API - most common)
          if ((event as any).created_at) {
            const date = new Date((event as any).created_at)
            if (!isNaN(date.getTime())) {
              return date.getTime()
            }
          }
          // Priority 2: Try createdAt (camelCase)
          if (event.createdAt) {
            const date = new Date(event.createdAt)
            if (!isNaN(date.getTime())) {
              return date.getTime()
            }
          }
          // Priority 3: Try created_date
          if ((event as any).created_date) {
            const date = new Date((event as any).created_date)
            if (!isNaN(date.getTime())) {
              return date.getTime()
            }
          }
          // Fallback: Use event_date or startDate if no creation date available
          if ((event as any).event_date) {
            const date = new Date((event as any).event_date)
            if (!isNaN(date.getTime())) {
              return date.getTime()
            }
          }
          if (event.startDate) {
            const date = new Date(event.startDate)
            if (!isNaN(date.getTime())) {
              return date.getTime()
            }
          }
          // If no date found, put at the end (oldest)
          return 0
        }
        
        const dateA = getCreationDate(a)
        const dateB = getCreationDate(b)
        // Descending order: newest first (larger date value comes first)
        return dateB - dateA
      })
      
      console.log('📊 [DashboardLayout] Events sorted by createdAt (newest first)')
      
      // Map API response to Event interface format (already sorted)
      const mappedEvents: Event[] = sortedEventDataList.map((eventData: EventData) => {
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
                         (eventData as any).created_by || 
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
          createdAt: eventData.createdAt || (eventData as any).created_at || (eventData as any).created_date,
        }
      })
      
      // Ensure events are still sorted by createdAt after mapping (newest first)
      mappedEvents.sort((a, b) => {
        const getDate = (event: Event): number => {
          if (event.createdAt) {
            const date = new Date(event.createdAt)
            if (!isNaN(date.getTime())) {
              return date.getTime()
            }
          }
          return 0
        }
        const dateA = getDate(a)
        const dateB = getDate(b)
        return dateB - dateA // Descending order (newest first)
      })
      
      console.log('✅ [DashboardLayout] Mapped and sorted events by createdAt (newest first):', mappedEvents.length, 'events')
      if (mappedEvents.length > 0) {
        console.log('📊 [DashboardLayout] First event (newest):', mappedEvents[0].name, 'createdAt:', mappedEvents[0].createdAt)
        if (mappedEvents.length > 1) {
          console.log('📊 [DashboardLayout] Last event (oldest):', mappedEvents[mappedEvents.length - 1].name, 'createdAt:', mappedEvents[mappedEvents.length - 1].createdAt)
        }
      }
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

  // Fetch events on mount
  useEffect(() => {
    loadEvents()
  }, [])

  // Track previous path to detect navigation back to dashboard
  const prevPathRef = useRef<string>(window.location.pathname)

  // Refresh events when navigating back to dashboard
  useEffect(() => {
    const checkAndRefresh = () => {
      const currentPath = window.location.pathname
      const prevPath = prevPathRef.current

      // Check if we're navigating back to dashboard from event creation flow
      const isNavigatingToDashboard = (currentPath === '/dashboard' || currentPath === '/') && 
                                       (prevPath.startsWith('/event/create') || prevPath.startsWith('/event/website'))
      
      // Check if we're on dashboard and not showing other pages
      const isOnDashboard = (currentPath === '/dashboard' || currentPath === '/') && 
                            !showTemplatePage && !showEventWebsitePage && !showPreviewPage && !showNewEventForm

      if (isNavigatingToDashboard || (isOnDashboard && prevPath !== currentPath)) {
        loadEvents()
      }

      prevPathRef.current = currentPath
    }

    checkAndRefresh()

    // Listen for navigation events
    const handleLocationChange = () => {
      checkAndRefresh()
    }

    window.addEventListener('popstate', handleLocationChange)
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTemplatePage, showEventWebsitePage, showPreviewPage, showNewEventForm])

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
        const startDate = dateRange.start!
        const endDate = dateRange.end!
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
        
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

  const handleEventRowClick = async (event: Event) => {
    try {
      // Fetch event details by UUID (assuming event.id is the UUID)
      const eventData = await fetchEvent(event.id)
      
      // Convert EventData to CreateEventResponseData format for context
      // EventData already contains all required fields, so we can cast it directly
      const createdEventData: CreateEventResponseData = {
        ...eventData
      }
        
      // Set event in context
      setCreatedEvent(createdEventData)
      
      // Navigate to event website page
      window.history.pushState({}, '', '/event/website')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (error) {
      console.error('Failed to load event:', error)
      // Error is already handled in fetchEvent with toast
    }
  }

  // Show preview page
  if (showPreviewPage) {
    return (
      <WebsitePreviewPage
        pageId={previewPageId}
        onBackClick={() => {
          window.history.pushState({ section: 'event-website' }, '', '/event/hub?section=event-website')
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
            onEventRowClick={handleEventRowClick}
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

