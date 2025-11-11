import React from 'react'
import EventHubNavbar from '../EventHubNavbar'
import EventHubSidebar from '../EventHubSidebar'
import ScheduleContent from './ScheduleContent'
import SessionSlideout from './SessionSlideout'
import SavedSchedulesTable from './SavedSchedulesTable'
import { SavedSchedule, SessionDraft } from './sessionTypes'
import { defaultSessionDraft } from './sessionConfig'

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

  const [savedSchedules, setSavedSchedules] = React.useState<SavedSchedule[]>([])
  const [view, setView] = React.useState<'create' | 'list'>('create')
  const [currentScheduleName, setCurrentScheduleName] = React.useState('Schedule 1')
  const [isSessionSlideoutOpen, setIsSessionSlideoutOpen] = React.useState(false)
  const [activeScheduleId, setActiveScheduleId] = React.useState<string | null>(null)
  const [activeDraft, setActiveDraft] = React.useState<SessionDraft | null>(null)
  const [startInEditMode, setStartInEditMode] = React.useState(true)

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
    setView('list')
  }

  const handleCreateScheduleFromList = () => {
    const nextIndex = savedSchedules.length + 1
    setCurrentScheduleName(`Schedule ${nextIndex}`)
    setStartInEditMode(true)
    setActiveScheduleId(null)
    setActiveDraft(null)
    setView('create')
  }

  React.useEffect(() => {
    if (savedSchedules.length === 0) {
      setView('create')
      setCurrentScheduleName('Schedule 1')
      setActiveScheduleId(null)
      setActiveDraft(null)
    }
  }, [savedSchedules.length])

  React.useEffect(() => {
    if (view === 'create' && savedSchedules.length > 0) {
      const nextIndex = savedSchedules.length + 1
      setCurrentScheduleName(`Schedule ${nextIndex}`)
    }
  }, [view, savedSchedules.length])

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
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
      <div className="md:pl-[250px]">
        {view === 'create' ? (
          <ScheduleContent
            key={currentScheduleName}
            scheduleName={scheduleName ?? currentScheduleName}
            onUpload={handleUpload}
            onAddSession={handleAddSessionClick}
          />
        ) : (
          <SavedSchedulesTable
            schedules={savedSchedules}
            onCreateSchedule={handleCreateScheduleFromList}
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
    </div>
  )
}

export default SchedulePage

