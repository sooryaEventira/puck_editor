import React, { useMemo } from 'react'
import { useEventForm } from '../../../contexts/EventFormContext'
import EventHubNavbar from '../EventHubNavbar'
import EventHubSidebar from '../EventHubSidebar'
import ScheduleContent from './ScheduleContent'
import SessionSlideout from './SessionSlideout'
import TemplateSessionSlideout from './TemplateSessionSlideout'
import ScheduleDetailsSlideout from './ScheduleDetailsSlideout'
import SavedSchedulesTable from './SavedSchedulesTable'
import { SavedSchedule, SavedSession, SessionDraft } from './sessionTypes'
import { defaultSessionDraft } from './sessionConfig'
import { defaultCards, ContentCard } from '../EventHubContent'
import { InfoCircle, CodeBrowser, Globe01 } from '@untitled-ui/icons-react'

interface SchedulePageProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  userAvatarUrl?: string
  scheduleName?: string
  onCardClick?: (cardId: string) => void
  hideNavbarAndSidebar?: boolean
}

const SchedulePage: React.FC<SchedulePageProps> = ({
  eventName: propEventName,
  isDraft: propIsDraft,
  onBackClick,
  userAvatarUrl,
  scheduleName,
  onCardClick,
  hideNavbarAndSidebar = false
}) => {
  // Get eventData and createdEvent from context to maintain consistency with EventHubPage navbar
  const { eventData, createdEvent } = useEventForm()
  
  // Prioritize createdEvent data from API (set when clicking event from dashboard), 
  // fallback to eventData from form, then props
  const eventName = createdEvent?.eventName || eventData?.eventName || propEventName || 'Highly important conference of 2025'
  const isDraft = propIsDraft !== undefined ? propIsDraft : true
  const handleSearchClick = () => {
    console.log('Search clicked')
  }

  const handleNotificationClick = () => {
    console.log('Notification clicked')
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
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

  const handleSidebarItemClick = (itemId: string) => {
    console.log('Sidebar item clicked:', itemId)
    
    // If clicking on event-hub, navigate back to event hub page
    if (itemId === 'event-hub' && onBackClick) {
      onBackClick()
      return
    }
    
    // If clicking on a different card, navigate to it
    if (itemId !== 'schedule-session') {
      const isCardId = defaultCards.some((card) => card.id === itemId)
      if (isCardId && onCardClick) {
        onCardClick(itemId)
      }
    }
  }

  const handleUpload = () => {
    console.log('Upload clicked')
    // TODO: Implement upload functionality
  }

  const [savedSchedules, setSavedSchedules] = React.useState<SavedSchedule[]>([])
  const [currentScheduleName, setCurrentScheduleName] = React.useState(scheduleName || 'Schedule 1')
  const [isSessionSlideoutOpen, setIsSessionSlideoutOpen] = React.useState(false)
  const [isTemplateSessionSlideoutOpen, setIsTemplateSessionSlideoutOpen] = React.useState(false)
  const [isScheduleDetailsSlideoutOpen, setIsScheduleDetailsSlideoutOpen] = React.useState(false)
  const [activeScheduleId, setActiveScheduleId] = React.useState<string | null>(null)
  const [activeDraft, setActiveDraft] = React.useState<SessionDraft | null>(null)
  const [startInEditMode, setStartInEditMode] = React.useState(true)
  const [currentView, setCurrentView] = React.useState<'table' | 'content'>('table')
  const [availableTags, setAvailableTags] = React.useState<string[]>([])
  const [availableLocations, setAvailableLocations] = React.useState<string[]>([])
  const [selectedDate, setSelectedDate] = React.useState<Date>(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })
  const [parentSessionId, setParentSessionId] = React.useState<string | undefined>(undefined)

  const handleAddSessionClick = (parentId?: string, creationType?: 'template' | 'scratch') => {
    // Collect all tags and locations from all schedules (same as ScheduleDetailsSlideout)
    const allTags = new Set<string>()
    const allLocations = new Set<string>()
    
    savedSchedules.forEach(schedule => {
      if (schedule.availableTags) {
        schedule.availableTags.forEach(tag => allTags.add(tag))
      }
      if (schedule.availableLocations) {
        schedule.availableLocations.forEach(location => allLocations.add(location))
      }
    })
    
    // Set available tags and locations from all schedules
    setAvailableTags(Array.from(allTags))
    setAvailableLocations(Array.from(allLocations))
    
    // Store parent session ID for parallel sessions
    setParentSessionId(parentId)
    
    if (creationType === 'template') {
      // Open TemplateSessionSlideout for "Template"
      setIsTemplateSessionSlideoutOpen(true)
    } else if (creationType === 'scratch') {
      // Open SessionSlideout for "Create from scratch"
      setActiveDraft({
        ...defaultSessionDraft,
        tags: [...defaultSessionDraft.tags],
        sections: [...defaultSessionDraft.sections]
      })
      setStartInEditMode(true)
      setIsSessionSlideoutOpen(true)
    }
  }

  const handleCloseSlideout = () => {
    setIsSessionSlideoutOpen(false)
    setActiveScheduleId(null)
    setActiveDraft(null)
    setStartInEditMode(true)
  }

  const handleSaveSession = (session: SessionDraft) => {
    setSavedSchedules((previous) => {
      const normalizedSession: SessionDraft = {
        ...defaultSessionDraft,
        ...session,
        title: session.title?.trim() || currentScheduleName,
        tags: session.tags ? [...session.tags] : [],
        sections: session.sections ? session.sections.map((section) => ({ ...section })) : []
      }

      if (activeScheduleId) {
        // Add session to existing schedule
        const existingSchedule = previous.find((item) => item.id === activeScheduleId)
        if (existingSchedule) {
          // Normalize date to start of day for consistent comparison
          const sessionDate = new Date(selectedDate)
          sessionDate.setHours(0, 0, 0, 0)
          
          const newSession: SavedSession = {
            ...normalizedSession,
            id: `session-${Date.now()}`,
            date: sessionDate,
            parentId: parentSessionId
          }
          const existingSessions = existingSchedule.sessions || []
          return previous.map((item) =>
            item.id === activeScheduleId 
              ? { 
                  ...item, 
                  sessions: [...existingSessions, newSession],
                  availableTags: existingSchedule?.availableTags,
                  availableLocations: existingSchedule?.availableLocations
                } 
              : item
          )
        }
      }

      // If no active schedule, create new one (shouldn't happen in content view)
      const sessionDate = new Date(selectedDate)
      sessionDate.setHours(0, 0, 0, 0)
      
      const newSchedule: SavedSchedule = {
        id: `schedule-${Date.now()}`,
        name: currentScheduleName,
        sessions: [{
          ...normalizedSession,
          id: `session-${Date.now()}`,
          date: sessionDate
        }],
        availableTags: availableTags,
        availableLocations: availableLocations
      }

      return [...previous, newSchedule]
    })

    setActiveDraft(null)
    setStartInEditMode(false)
    setParentSessionId(undefined)
    setIsSessionSlideoutOpen(false)
  }

  const handleCreateScheduleFromList = () => {
    setIsScheduleDetailsSlideoutOpen(true)
  }

  const handleCloseScheduleDetailsSlideout = () => {
    setIsScheduleDetailsSlideoutOpen(false)
  }

  const handleSaveScheduleDetails = (details: { title: string; tags: string[]; location: string[]; description: string }) => {
    // Filter out "selectall" and store only the selected tags and locations
    const selectedTags = (details.tags || []).filter(tag => tag !== 'selectall')
    const selectedLocations = (details.location || []).filter(loc => loc !== 'selectall')
    
    // Create a new schedule and save it to the table
    const newSchedule: SavedSchedule = {
      id: `schedule-${Date.now()}`,
      name: details.title || `Schedule ${savedSchedules.length + 1}`,
      session: {
        ...defaultSessionDraft,
        title: details.title,
        location: selectedLocations.length > 0 ? selectedLocations[0] : '',
        tags: selectedTags,
        sections: details.description ? [{
          id: `section-${Date.now()}`,
          type: 'text',
          title: 'Description',
          description: details.description
        }] : []
      },
      availableTags: selectedTags,
      availableLocations: selectedLocations
    }

    setSavedSchedules((previous) => [...previous, newSchedule])
    setIsScheduleDetailsSlideoutOpen(false)
  }

  const handleManageSession = (scheduleId: string) => {
    const target = savedSchedules.find((item) => item.id === scheduleId)
    if (!target) return
    setActiveScheduleId(scheduleId)
    setCurrentScheduleName(target.name)
    // Set available tags and locations for this schedule
    setAvailableTags(target.availableTags || [])
    setAvailableLocations(target.availableLocations || [])
    setCurrentView('content')
  }

  const handleBackToTable = () => {
    setCurrentView('table')
    setActiveScheduleId(null)
  }

  return (
    <div  className="min-h-screen overflow-x-hidden bg-white">
      {!hideNavbarAndSidebar && (
        <>
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
            items={sidebarItems}
            activeItemId="schedule-session"
            onItemClick={handleSidebarItemClick}
          />
        </>
      )}

      {/* Schedule Content */}
      <div className={hideNavbarAndSidebar ? "" : "md:pl-[250px]"}>
        {currentView === 'table' ? (
          <SavedSchedulesTable
            schedules={savedSchedules}
            onCreateSchedule={handleCreateScheduleFromList}
            onUpload={handleUpload}
            onManageSession={handleManageSession}
            onEditSchedule={(scheduleId) => {
              const target = savedSchedules.find((item) => item.id === scheduleId)
              if (!target || !target.session) return
              setActiveScheduleId(scheduleId)
              setCurrentScheduleName(target.name)
              setActiveDraft({
                ...defaultSessionDraft,
                ...target.session,
                tags: [...(target.session.tags ?? [])],
                sections: target.session.sections?.map((section) => ({ ...section })) ?? []
              })
              setStartInEditMode(false)
              setIsSessionSlideoutOpen(true)
            }}
          />
        ) : (
          <ScheduleContent
            scheduleName={currentScheduleName}
            onUpload={handleUpload}
            onAddSession={handleAddSessionClick}
            onBack={handleBackToTable}
            sessions={activeScheduleId ? savedSchedules.find(s => s.id === activeScheduleId)?.sessions || [] : []}
            onDateChange={(date) => {
              const normalizedDate = new Date(date)
              normalizedDate.setHours(0, 0, 0, 0)
              setSelectedDate(normalizedDate)
            }}
          />
        )}
      </div>

      <SessionSlideout
        isOpen={isSessionSlideoutOpen}
        onClose={handleCloseSlideout}
        onSave={handleSaveSession}
        initialDraft={activeDraft}
        startInEditMode={startInEditMode}
        topOffset={64}
        panelWidthRatio={0.5}
        availableTags={availableTags}
        availableLocations={availableLocations}
      />

      <TemplateSessionSlideout
        isOpen={isTemplateSessionSlideoutOpen}
        onClose={() => setIsTemplateSessionSlideoutOpen(false)}
        onSave={(data) => {
          // Convert template data to SessionDraft format if needed
          console.log('Template session data:', data)
          setIsTemplateSessionSlideoutOpen(false)
        }}
        availableTags={availableTags}
        availableLocations={availableLocations}
        topOffset={64}
        panelWidthRatio={0.8}
      />

      <ScheduleDetailsSlideout
        isOpen={isScheduleDetailsSlideoutOpen}
        onClose={handleCloseScheduleDetailsSlideout}
        onSave={handleSaveScheduleDetails}
        topOffset={64}
        panelWidthRatio={0.5}
        availableTags={useMemo(() => {
          const allTags = new Set<string>()
          savedSchedules.forEach(schedule => {
            if (schedule.availableTags) {
              schedule.availableTags.forEach(tag => allTags.add(tag))
            }
          })
          return Array.from(allTags)
        }, [savedSchedules])}
        availableLocations={useMemo(() => {
          const allLocations = new Set<string>()
          savedSchedules.forEach(schedule => {
            if (schedule.availableLocations) {
              schedule.availableLocations.forEach(location => allLocations.add(location))
            }
          })
          return Array.from(allLocations)
        }, [savedSchedules])}
      />
    </div>
  )
}

export default SchedulePage

