import React, { useState } from 'react'
import { Upload01, Plus, ArrowNarrowLeft } from '@untitled-ui/icons-react'
import WeekDateSelector from './WeekDateSelector'
import UploadModal from './UploadModal'

interface ScheduleContentProps {
  scheduleName?: string
  onUpload?: () => void
  onAddSession?: () => void
  onBack?: () => void
}

const ScheduleContent: React.FC<ScheduleContentProps> = ({
  scheduleName = 'Schedule 1',
  onUpload,
  onAddSession,
  onBack
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleDateChange = (date: Date) => {
    console.log('Selected date:', date)
    // You can add additional logic here if needed
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

  return (
    <main className="relative mt-16 w-full bg-white px-4 pb-10 pt-8 md:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Back to schedule list"
            >
              <ArrowNarrowLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="font-manrope text-[26px] font-semibold leading-10 text-primary-dark md:text-[32px] md:leading-10">
            {scheduleName}
          </h1>
        </div>
        <button
          type="button"
          data-schedule-upload="true"
          onClick={handleUploadClick}
          className="inline-flex items-center justify-center gap-1 overflow-hidden rounded-lg bg-[#6938EF] px-[14px] py-[6px] text-white transition-colors hover:bg-[#5a2dd4]"
          style={{ fontFamily: 'Inter' }}
        >
          <div className="relative h-5 w-5 overflow-hidden">
            <Upload01 className="absolute left-[2.5px] top-[2.5px] h-[15px] w-[15px] text-white" strokeWidth={1.67} />
          </div>
          <div className="flex items-center justify-center px-0.5">
            <span className="text-sm font-semibold leading-5 text-white">Upload</span>
          </div>
        </button>
      </div>

      <div className="mt-6 flex min-h-[22rem] flex-col gap-6 overflow-hidden rounded border border-slate-200 bg-white px-4 py-6 shadow-sm md:min-h-[819px] md:px-8">
        {/* Date Selector */}
        <WeekDateSelector onDateChange={handleDateChange} />

        <div>
          <button
            type="button"
            onClick={onAddSession}
            className="inline-flex items-center justify-center gap-1 overflow-hidden rounded-lg bg-[#6938EF] px-3 py-1.5 text-white shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] "
            style={{ fontFamily: 'Inter' }}
          >
            <div className="flex items-center justify-center px-0.5">
              <Plus className="h-4 w-4 text-white" strokeWidth={1} />
              <span className="text-sm font-semibold leading-5 text-white"> Add session</span>
            </div>
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center text-center text-base text-slate-500">
          Upload your schedule or create custom sessions!
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseModal}
        onAttachFiles={handleAttachFiles}
      />
    </main>
  )
}

export default ScheduleContent

