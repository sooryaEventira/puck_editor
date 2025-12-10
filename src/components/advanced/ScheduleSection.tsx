import React, { useState } from 'react'

interface Session {
  title: string
  time: string
  room: string
  mode: string
  description: string
  icon: string
}

interface ScheduleSectionProps {
  sessions: Session[]
  buttonText?: string
  backgroundColor?: string
  padding?: string
  gap?: string
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  sessions = [],
  buttonText = "View Full Schedule",
//   backgroundColor = "#f8f9fa",
  padding = "2rem",
  gap = "1rem"
}) => {
  const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set())
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false)

  const toggleSession = (index: number) => {
    const newExpanded = new Set(expandedSessions)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSessions(newExpanded)
  }

  const toggleSchedule = () => {
    setIsScheduleExpanded(!isScheduleExpanded)
  }

  return (
    <section 
      style={{ padding }}
      className="w-full min-h-[400px]"
    >
      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto bg-white rounded-xl shadow-md p-8 relative">
        {/* Time Indicator */}
        <div className="absolute -left-20 top-8 flex flex-col items-center">
          <div className="bg-gray-100 rounded-lg px-4 py-2 mb-2 flex items-center gap-2">
            <input 
              type="checkbox" 
              className="m-0"
            />
            <span className="text-sm font-medium">
              {sessions[0]?.time?.split(' - ')[0] || '08:00 AM'}
            </span>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
            {sessions.length} parallel session{sessions.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex flex-col" style={{ gap }}>
          {sessions.map((session, index) => {
            // Show first 2 sessions by default, rest only when expanded
            const shouldShow = index < 2 || isScheduleExpanded
            if (!shouldShow) return null
            
            return (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg pl-32 pr-32 relative bg-white"
            >
              {/* Session Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 
                    className="text-lg font-semibold text-gray-900 m-0 mb-2"
                    data-puck-field={`sessions[${index}].title`}
                    contentEditable
                    suppressContentEditableWarning={true}
                  >
                    {session.title}
                  </h3>
                  
                  {/* Session Details */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span>🕐</span>
                      <span 
                        data-puck-field={`sessions[${index}].time`}
                        contentEditable
                        suppressContentEditableWarning={true}
                      >
                        {session.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span>📍</span>
                      <span 
                        data-puck-field={`sessions[${index}].room`}
                        contentEditable
                        suppressContentEditableWarning={true}
                      >
                        {session.room}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span>👤</span>
                      <span 
                        data-puck-field={`sessions[${index}].mode`}
                        contentEditable
                        suppressContentEditableWarning={true}
                      >
                        {session.mode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side Icons */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Menu Icons */}
                  <div className="flex flex-col gap-1">
                    <button className="bg-none border-none cursor-pointer p-1 text-gray-500">
                      ⋯
                    </button>
                    <button className="bg-none border-none cursor-pointer p-1 text-gray-500">
                      ➕
                    </button>
                  </div>
                </div>
              </div>

              {/* Session Description */}
              <div className="mb-4">
                <p 
                  className="text-gray-500 text-sm m-0 leading-relaxed"
                  data-puck-field={`sessions[${index}].description`}
                  contentEditable
                  suppressContentEditableWarning={true}
                >
                  {expandedSessions.has(index) ? session.description : `${session.description.substring(0, 50)}...`}
                </p>
                
                {session.description.length > 50 && (
                  <button
                    onClick={() => toggleSession(index)}
                    className="bg-none border-none text-blue-500 cursor-pointer text-sm mt-2 underline"
                  >
                    {expandedSessions.has(index) ? 'See less' : 'See more'}
                  </button>
                )}
              </div>
            </div>
            )
          })}
        </div>

        {/* View Full Schedule Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={toggleSchedule}
            className="bg-purple-600 text-white border-none rounded-lg py-3 px-8 text-base font-semibold cursor-pointer w-full max-w-[300px] hover:bg-purple-700 transition-colors"
            data-puck-field="buttonText"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {isScheduleExpanded ? 'Show Less' : 'View full schedule'}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {sessions.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-lg">
          No sessions added yet. Add sessions using the properties panel.
        </div>
      )}
    </section>
  )
}

export default ScheduleSection
