import React, { useState } from 'react'
import { Upload01 } from '@untitled-ui/icons-react'
import DatePicker from '../../ui/untitled/DatePicker'

interface ScheduleContentProps {
  scheduleName?: string
  onUpload?: () => void
  onAddSession?: () => void
}

const ScheduleContent: React.FC<ScheduleContentProps> = ({
  scheduleName = 'Schedule 1',
  onUpload,
  onAddSession
}) => {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  return (
    <main className="relative mt-16 w-full bg-white px-4 pb-10 pt-8 md:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-manrope text-3xl font-bold leading-10 text-[#3E1C96] md:text-[32px] md:leading-10">
          {scheduleName}
        </h1>
        <button
          type="button"
          data-schedule-upload="true"
          onClick={onUpload}
          className="flex h-10 w-full max-w-[160px] items-center justify-center gap-3 rounded-md bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-[#5a2dd4] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-[150px]"
        >
          <Upload01 className="h-4 w-4 text-white" strokeWidth={2} />
          <span className="justify-start text-Colors-Text-text-white text-sm font-semibold font-['Inter'] leading-5">Upload</span>
        </button>
      </div>

      <div className="mt-6 flex min-h-[22rem] flex-col gap-6 overflow-hidden rounded border border-slate-200 bg-white px-4 py-6 shadow-sm md:min-h-[819px] md:px-8">
        <div className="flex flex-col gap-4 md:flex-row">
          <DatePicker
            id="schedule-date-from"
            value={dateFrom}
            onChange={setDateFrom}
            placeholder="Select date from"
            label="Start date"
          />
          <DatePicker
            id="schedule-date-to"
            value={dateTo}
            onChange={setDateTo}
            placeholder="Select date to"
            label="End date"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={onAddSession}
            className="inline-flex w-full max-w-[200px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5a2dd4] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-auto"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
           <span className="justify-start text-Colors-Text-text-white text-sm font-semibold font-['Inter'] leading-5">Add session</span>
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center text-center text-base text-slate-500">
          Upload your schedule or create custom sessions!
        </div>
      </div>
    </main>
  )
}

export default ScheduleContent

