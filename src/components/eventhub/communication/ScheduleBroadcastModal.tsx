import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from '@untitled-ui/icons-react'

interface ScheduleBroadcastModalProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (date: Date) => void
}

export const ScheduleBroadcastModal: React.FC<ScheduleBroadcastModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date()) // For calendar navigation
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM')

  // Initialize selectedDate to today if not set
  useEffect(() => {
    if (isOpen && !selectedDate) {
      setSelectedDate(new Date())
    }
  }, [isOpen, selectedDate])

  if (!isOpen) return null

  // Calendar Logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const days = daysInMonth(year, month)
  const firstDay = firstDayOfMonth(year, month)

  // Adjust firstDay to start from Monday (0 = Monday, 6 = Sunday) if needed, 
  // but standard JS getDay() is 0=Sunday. The design shows Mo Tu We Th Fr Sa Su.
  // So we need to shift: Sunday(0) -> 6, Monday(1) -> 0, etc.
  const startDayOffset = firstDay === 0 ? 6 : firstDay - 1

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(year, month, day)
    setSelectedDate(newDate)
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    )
  }

  const handleApply = () => {
    if (selectedDate) {
      // Combine date and time
      const [time, period] = selectedTime.split(' ')
      const [hours, minutes] = time.split(':').map(Number)
      
      let finalHours = hours
      if (period === 'PM' && hours !== 12) finalHours += 12
      if (period === 'AM' && hours === 12) finalHours = 0

      const finalDate = new Date(selectedDate)
      finalDate.setHours(finalHours, minutes)
      
      onSchedule(finalDate)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col md:flex-row h-auto md:h-[500px] max-h-[90vh]">
        {/* Sidebar */}
        <div className="border-r-0 md:border-r border-[#E9EAEB] border-b md:border-b-0 bg-white p-2 md:p-3 flex flex-row md:flex-col gap-0.5 w-full md:w-[160px] overflow-x-auto md:overflow-x-visible shrink-0">
          {/* Date Section */}
          <div className="flex flex-col md:flex-col gap-0.5 shrink-0 min-w-[120px] md:min-w-0">
            {/* Date Header */}
            <div className="w-full px-3 py-2 bg-[#FAFAFA] border-b border-[#D5D7DA] flex items-center">
              <div className="text-sm font-semibold text-[#252B37]">Date</div>
            </div>
            
            {/* Today Button */}
            <button
              onClick={() => {
                const today = new Date()
                setSelectedDate(today)
                setCurrentDate(today)
              }}
              className={`w-full px-3 py-2 rounded-md text-sm font-medium text-left transition whitespace-nowrap ${
                selectedDate && 
                selectedDate.toDateString() === new Date().toDateString()
                  ? 'bg-primary/10 text-primary'
                  : 'text-[#414651] hover:bg-slate-50'
              }`}
            >
              Today
            </button>
          </div>

          {/* Time Section */}
          <div className="flex flex-col md:flex-col gap-0.5 shrink-0 min-w-[120px] md:min-w-0">
            {/* Time Header */}
            <div className="w-full px-3 py-2 bg-[#FAFAFA] border-b border-[#D5D7DA] flex items-center">
              <div className="text-sm font-semibold text-[#252B37]">Time</div>
            </div>

            {/* Time Options */}
            {['10:00 AM', '11:00 AM', '12:00 PM'].map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`w-full px-3 py-2 rounded-md text-sm font-medium text-left transition whitespace-nowrap ${
                  selectedTime === time
                    ? 'bg-primary/10 text-primary'
                    : 'text-[#414651] hover:bg-slate-50'
                }`}
              >
                {time}
              </button>
            ))}
            <button
              onClick={() => setSelectedTime('Custom')}
              className={`w-full px-3 py-2 rounded-md text-sm font-medium text-left transition whitespace-nowrap ${
                selectedTime === 'Custom'
                  ? 'bg-primary/10 text-primary'
                  : 'text-[#414651] hover:bg-slate-50'
              }`}
            >
              Custom time
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-3 sm:px-4 md:px-6 py-3 md:py-5 gap-3 overflow-auto">
          {/* Calendar Header */}
          <div className="flex items-center justify-center relative px-6 sm:px-8">
            <button 
              onClick={handlePrevMonth} 
              className="absolute left-0 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-semibold text-[#414651]">
              {monthNames[month]} {year}
            </h2>
            <button 
              onClick={handleNextMonth} 
              className="absolute right-0 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 flex flex-col gap-2 md:gap-3 min-h-0">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                <div key={day} className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                  <div className="text-xs sm:text-sm font-medium text-[#414651]">{day}</div>
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Previous month days (disabled) */}
              {Array.from({ length: startDayOffset }).map((_, i) => {
                const prevMonth = month === 0 ? 11 : month - 1
                const prevYear = month === 0 ? year - 1 : year
                const daysInPrevMonth = daysInMonth(prevYear, prevMonth)
                const day = daysInPrevMonth - startDayOffset + i + 1
                const today = new Date()
                const isTodayInPrevMonth = 
                  today.getDate() === day && 
                  today.getMonth() === prevMonth && 
                  today.getFullYear() === prevYear
                
                return (
                  <div key={`prev-${i}`} className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 relative flex items-center justify-center">
                    <div className="text-xs sm:text-sm font-normal text-[#717680]">{day}</div>
                    {isTodayInPrevMonth && (
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#A4A7AE]" />
                    )}
                  </div>
                )
              })}
              
              {/* Current month days */}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1
                const selected = isSelected(day)
                const today = isToday(day)
                
                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 relative flex items-center justify-center rounded-full text-xs sm:text-sm transition
                      ${selected 
                        ? 'bg-[#6938EF] text-white font-medium' 
                        : today 
                          ? 'bg-[#FAFAFA] text-[#414651] font-medium hover:bg-[#FAFAFA]'
                          : 'text-[#414651] font-normal hover:bg-[#FAFAFA] hover:text-[#252B37] hover:font-medium'
                      }
                    `}
                  >
                    <div>{day}</div>
                    {today && !selected && (
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#6938EF]" />
                    )}
                  </button>
                )
              })}
              
              {/* Next month days (disabled) */}
              {Array.from({ length: Math.max(0, 42 - startDayOffset - days) }).map((_, i) => {
                const day = i + 1
                const nextMonth = month === 11 ? 0 : month + 1
                const nextYear = month === 11 ? year + 1 : year
                const today = new Date()
                const isTodayInNextMonth = 
                  today.getDate() === day && 
                  today.getMonth() === nextMonth && 
                  today.getFullYear() === nextYear
                
                return (
                  <div key={`next-${i}`} className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 relative flex items-center justify-center">
                    <div className="text-xs sm:text-sm font-normal text-[#717680]">{day}</div>
                    {isTodayInNextMonth && (
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#A4A7AE]" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 pb-3 md:pb-4 px-3 md:px-4 border-t border-[#E9EAEB] flex flex-col items-stretch sm:items-end gap-3 shrink-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-1 w-full sm:w-auto">
              <div className="flex-1 sm:w-[136px] px-3 py-2 bg-white rounded-lg border border-[#D5D7DA] shadow-sm">
                <div className="text-sm sm:text-base font-normal text-[#181D27]">
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date'}
                </div>
              </div>
              <div className="flex-1 sm:w-[136px] px-3 py-2 bg-white rounded-lg border border-[#D5D7DA] shadow-sm">
                <div className="text-sm sm:text-base font-normal text-[#181D27] text-center">
                  {selectedTime}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-[14px] py-[10px] bg-white rounded-lg border border-[#D5D7DA] shadow-sm text-sm font-semibold text-[#414651] hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="w-full sm:w-auto px-[14px] py-[10px] bg-[#6938EF] rounded-lg border-2 border-white shadow-sm text-sm font-semibold text-white hover:bg-[#5d2fd4] transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
