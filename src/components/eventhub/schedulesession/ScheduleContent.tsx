import React, { useState, useEffect, useMemo } from 'react'
import { Upload01, Plus, ArrowNarrowLeft } from '@untitled-ui/icons-react'
import { Button } from '../../ui/untitled'
import WeekDateSelector from './WeekDateSelector'
import UploadModal from '../../ui/UploadModal'
import ScheduleGrid from './ScheduleGrid'
import SessionCreationModal from './SessionCreationModal'
import { SavedSession } from './sessionTypes'
import sessionTemplate from '../../../assets/excel/Session templates.xlsx?url'

interface ScheduleContentProps {
  scheduleName?: string
  onUpload?: () => void
  onAddSession?: (parentSessionId?: string, creationType?: 'template' | 'scratch') => void
  onBack?: () => void
  sessions?: SavedSession[] | any[] // Allow any[] for Puck compatibility
  onDateChange?: (date: Date) => void
  selectedDate?: Date | string // Allow string for Puck (ISO string)
}

const ScheduleContent: React.FC<ScheduleContentProps> = ({
  scheduleName = 'Schedule 1',
  onUpload,
  onAddSession,
  onBack,
  sessions = [],
  onDateChange,
  selectedDate: propSelectedDate
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isSessionCreationModalOpen, setIsSessionCreationModalOpen] = useState(false)
  
  // Handle date from props (can be Date or ISO string from Puck)
  const getInitialDate = (): Date => {
    if (propSelectedDate) {
      if (propSelectedDate instanceof Date) {
        const date = new Date(propSelectedDate)
        date.setHours(0, 0, 0, 0)
        return date
      } else if (typeof propSelectedDate === 'string') {
        const date = new Date(propSelectedDate)
        date.setHours(0, 0, 0, 0)
        return date
      }
    }
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }
  
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate)

  useEffect(() => {
    // Initialize date when component mounts or prop changes
    const initialDate = getInitialDate()
    setSelectedDate(initialDate)
    onDateChange?.(initialDate)
  }, [propSelectedDate])
  
  // Normalize sessions - convert date strings to Date objects if needed
  const normalizedSessions = useMemo(() => {
    return (sessions || []).map((session: any) => {
      if (session.date && typeof session.date === 'string') {
        return {
          ...session,
          date: new Date(session.date)
        }
      }
      return session
    })
  }, [sessions])

  const handleDateChange = (date: Date) => {
    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0) // Normalize to start of day
    setSelectedDate(normalizedDate)
    onDateChange?.(normalizedDate)
  }

  const handleUploadClick = () => {
    setIsUploadModalOpen(true)
    onUpload?.()
  }

  const handleCloseModal = () => {
    setIsUploadModalOpen(false)
  }

  const handleAttachFiles = (files: File[]) => {
    console.log('Files attached:', files)
    // Handle file upload logic here
    setIsUploadModalOpen(false)
  }

  const handleDownloadTemplate = () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = sessionTemplate
    link.download = 'Session template.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="relative w-full bg-white px-4 pb-10 pt-8 md:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={onBack}
              className="p-2"
              iconLeading={<ArrowNarrowLeft className="h-5 w-5" />}
              aria-label="Back to schedule list"
            />
          )}
          <h1 className="font-manrope text-[26px] font-semibold leading-10 text-primary-dark md:text-[32px] md:leading-10">
            {scheduleName}
          </h1>
        </div>
        <Button
          type="button"
          data-schedule-upload="true"
          variant="primary"
          size="md"
          onClick={handleUploadClick}
          iconLeading={<Upload01 className="h-4 w-4" />}
          style={{ fontFamily: 'Inter' }}
        >
          Upload
        </Button>
      </div>

      <div className="mt-6 flex min-h-[22rem] flex-col gap-6 overflow-hidden rounded border border-slate-200 bg-white px-4 py-6 shadow-sm md:min-h-[819px] md:px-8">
        {/* Date Selector */}
        <WeekDateSelector 
          initialDate={selectedDate} 
          onDateChange={(date) => {
            handleDateChange(date)
          }} 
        />

        <div>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setIsSessionCreationModalOpen(true)}
            iconLeading={<Plus className="h-4 w-4" />}
            style={{ fontFamily: 'Inter' }}
          >
            Add session
          </Button>
        </div>

        {normalizedSessions && normalizedSessions.length > 0 ? (
          <ScheduleGrid 
            sessions={normalizedSessions} 
            selectedDate={selectedDate} 
            onAddParallelSession={(parentId) => onAddSession?.(parentId)} 
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-center text-base text-slate-500">
            Upload your schedule or create custom sessions!
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseModal}
        onAttachFiles={handleAttachFiles}
        onDownloadTemplate={handleDownloadTemplate}
        showTemplate={true}
        templateLabel="Session Template"
      />

      {/* Session Creation Modal */}
      <SessionCreationModal
        isOpen={isSessionCreationModalOpen}
        onClose={() => setIsSessionCreationModalOpen(false)}
        onSelect={(type) => {
          setIsSessionCreationModalOpen(false)
          // Call onAddSession with the selected type
          // If template is selected, it will open the SessionSlideout
          onAddSession?.(undefined, type)
        }}
      />
    </main>
  )
}

export default ScheduleContent

