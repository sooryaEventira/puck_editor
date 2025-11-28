import React, { useMemo } from 'react'
import EventHubNavbar from '../EventHubNavbar'
import EventHubSidebar from '../EventHubSidebar'
import ScheduleContent from './ScheduleContent'
import SessionSlideout from './SessionSlideout'
import ScheduleDetailsSlideout from './ScheduleDetailsSlideout'
import SavedSchedulesTable from './SavedSchedulesTable'
import { SavedSchedule, SessionDraft } from './sessionTypes'
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
}

const SchedulePage: React.FC<SchedulePageProps> = ({
  eventName,
  isDraft,
  onBackClick,
  userAvatarUrl,
  scheduleName,
  onCardClick
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
  const [currentScheduleName, setCurrentScheduleName] = React.useState('Schedule 1')
  const [isSessionSlideoutOpen, setIsSessionSlideoutOpen] = React.useState(false)
  const [isScheduleDetailsSlideoutOpen, setIsScheduleDetailsSlideoutOpen] = React.useState(false)
  const [activeScheduleId, setActiveScheduleId] = React.useState<string | null>(null)
  const [activeDraft, setActiveDraft] = React.useState<SessionDraft | null>(null)
  const [startInEditMode, setStartInEditMode] = React.useState(true)
  const [currentView, setCurrentView] = React.useState<'table' | 'content'>('table')

  const handleAddSessionClick = () => {
    setActiveScheduleId(null)
    setActiveDraft({
      ...defaultSessionDraft,
      tags: [...defaultSessionDraft.tags],
      sections: [...defaultSessionDraft.sections]
    })
    setStartInEditMode(true)
    setIsSessionSlideoutOpen(true)
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
        return previous.map((item) =>
          item.id === activeScheduleId ? { ...item, session: normalizedSession } : item
        )
      }

      const newSchedule: SavedSchedule = {
        id: `schedule-${Date.now()}`,
        name: currentScheduleName,
        session: normalizedSession
      }

      return [...previous, newSchedule]
    })

    setActiveDraft(null)
    setStartInEditMode(false)
    setIsSessionSlideoutOpen(false)
  }

  const handleCreateScheduleFromList = () => {
    setIsScheduleDetailsSlideoutOpen(true)
  }

  const handleCloseScheduleDetailsSlideout = () => {
    setIsScheduleDetailsSlideoutOpen(false)
  }

  const handleSaveScheduleDetails = (details: { title: string; tags: string[]; location: string[]; description: string }) => {
    const newSchedule: SavedSchedule = {
      id: `schedule-${Date.now()}`,
      name: details.title || `Schedule ${savedSchedules.length + 1}`,
      session: {
        ...defaultSessionDraft,
        title: details.title,
        location: details.location.join(', '),
        tags: details.tags || [],
        sections: details.description ? [{
          id: `section-${Date.now()}`,
          type: 'text',
          title: 'Description',
          description: details.description
        }] : []
      }
    }

    setSavedSchedules((previous) => [...previous, newSchedule])
    setIsScheduleDetailsSlideoutOpen(false)
  }

  const handleManageSession = (scheduleId: string) => {
    const target = savedSchedules.find((item) => item.id === scheduleId)
    if (!target) return
    setActiveScheduleId(scheduleId)
    setCurrentScheduleName(target.name)
    setCurrentView('content')
  }

  const handleBackToTable = () => {
    setCurrentView('table')
    setActiveScheduleId(null)
  }

  return (
    <div  className="min-h-screen overflow-x-hidden bg-white">
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

      {/* Schedule Content */}
      <div className="md:pl-[250px]">
        {currentView === 'table' ? (
          <SavedSchedulesTable
            schedules={savedSchedules}
            onCreateSchedule={handleCreateScheduleFromList}
            onUpload={handleUpload}
            onManageSession={handleManageSession}
            onEditSchedule={(scheduleId) => {
              const target = savedSchedules.find((item) => item.id === scheduleId)
              if (!target) return
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
        panelWidthRatio={0.8}
      />

      <ScheduleDetailsSlideout
        isOpen={isScheduleDetailsSlideoutOpen}
        onClose={handleCloseScheduleDetailsSlideout}
        onSave={handleSaveScheduleDetails}
        topOffset={64}
        panelWidthRatio={0.5}
      />
    </div>
  )
}

export default SchedulePage

