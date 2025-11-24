import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from '@untitled-ui/icons-react'

interface WeekDateSelectorProps {
  initialDate?: Date
  onDateChange?: (date: Date) => void
  className?: string
}

const WeekDateSelector: React.FC<WeekDateSelectorProps> = ({
  initialDate = new Date(),
  onDateChange,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate)

  // Generate week dates
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Monday as start
    startOfWeek.setDate(diff)

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
  }

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate])
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentDate(newDate)
    onDateChange?.(newDate)
  }

  const isCurrentDay = (date: Date) => {
    return date.toDateString() === currentDate.toDateString()
  }

  const selectDate = (date: Date) => {
    setCurrentDate(date)
    onDateChange?.(date)
  }

  return (
    <div className={`shedulebar flex items-center justify-between gap-2 ${className}`}>
      {/* Left Arrow */}
      <button
        type="button"
        onClick={() => navigateWeek('prev')}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-none bg-slate-100 text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-200 hover:-translate-y-0.5 sm:h-12 sm:w-12"
        aria-label="Previous week"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Date Cards - Scrollable on mobile */}
      <div className="flex flex-1 gap-1 overflow-x-auto pb-2 sm:gap-3 sm:overflow-visible sm:pb-0 scrollbar-hide">
        {weekDates.map((date, index) => {
          const isSelected = isCurrentDay(date)
          return (
            <button
              key={index}
              type="button"
              onClick={() => selectDate(date)}
              className={`inline-flex shrink-0 flex-1 flex-col items-center justify-center rounded-[10px] px-1 py-2 text-[10px] transition-all duration-200 sm:px-[20px] sm:py-2.5 sm:text-sm md:min-w-[140px] md:px-[30px] md:py-3 ${
                isSelected
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 outline-none'
                  : 'bg-[#FAFAFA] text-[#414651] shadow-md outline outline-1 outline-[#D5D7DA] hover:bg-slate-50 hover:-translate-y-0.5'
              }`}
            >
              <div
                className={`leading-4 sm:leading-5 ${
                  isSelected ? 'font-bold text-white' : 'font-bold text-[#414651]'
                }`}
                style={{ fontFamily: 'Inter' }}
              >
                {dayNames[index]}
              </div>
              <div
                className={`leading-4 sm:leading-5 ${
                  isSelected ? 'font-medium text-white' : 'font-medium text-[#414651]'
                }`}
                style={{ fontFamily: 'Inter' }}
              >
                {date.getDate()}
              </div>
            </button>
          )
        })}
      </div>

      {/* Right Arrow */}
      <button
        type="button"
        onClick={() => navigateWeek('next')}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none bg-slate-100 text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-200 hover:-translate-y-0.5 sm:h-12 sm:w-12"
        aria-label="Next week"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  )
}

export default WeekDateSelector


