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
      style={{ 
        // backgroundColor,
        padding,
        width: '100%',
        minHeight: '400px'
      }}
    >
      {/* Main Container */}
      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '2rem',
          position: 'relative'
        }}
      >
        {/* Time Indicator */}
        <div 
          style={{
            position: 'absolute',
            left: '-80px',
            top: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div 
            style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <input 
              type="checkbox" 
              style={{ margin: 0 }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {sessions[0]?.time?.split(' - ')[0] || '08:00 AM'}
            </span>
          </div>
          <div 
            style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}
          >
            {sessions.length} parallel session{sessions.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Sessions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: gap }}>
          {sessions.map((session, index) => {
            // Show first 2 sessions by default, rest only when expanded
            const shouldShow = index < 2 || isScheduleExpanded
            if (!shouldShow) return null
            
            return (
            <div 
              key={index}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                paddingLeft: '8rem',
                paddingRight: '8rem',
                position: 'relative',
                backgroundColor: '#ffffff'
              }}
            >
              {/* Session Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#111827',
                      margin: 0,
                      marginBottom: '0.5rem'
                    }}
                    data-puck-field={`sessions[${index}].title`}
                    contentEditable
                    suppressContentEditableWarning={true}
                  >
                    {session.title}
                  </h3>
                  
                  {/* Session Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      <span>🕐</span>
                      <span 
                        data-puck-field={`sessions[${index}].time`}
                        contentEditable
                        suppressContentEditableWarning={true}
                      >
                        {session.time}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      <span>📍</span>
                      <span 
                        data-puck-field={`sessions[${index}].room`}
                        contentEditable
                        suppressContentEditableWarning={true}
                      >
                        {session.room}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  {/* Recording Badge */}
                  {/* <div 
                    style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <span>📹</span>
                    <span>{index + 1}</span>
                  </div> */}

                  {/* Session Icon */}
                  {/* <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#f97316',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}
                    data-puck-field={`sessions[${index}].icon`}
                    contentEditable
                    suppressContentEditableWarning={true}
                  >
                    {session.icon}
                  </div> */}

                  {/* Menu Icons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <button 
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        color: '#6b7280'
                      }}
                    >
                      ⋯
                    </button>
                    <button 
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        color: '#6b7280'
                      }}
                    >
                      ➕
                    </button>
                  </div>
                </div>
              </div>

              {/* Session Description */}
              <div style={{ marginBottom: '1rem' }}>
                <p 
                  style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    margin: 0,
                    lineHeight: '1.5'
                  }}
                  data-puck-field={`sessions[${index}].description`}
                  contentEditable
                  suppressContentEditableWarning={true}
                >
                  {expandedSessions.has(index) ? session.description : `${session.description.substring(0, 50)}...`}
                </p>
                
                {session.description.length > 50 && (
                  <button
                    onClick={() => toggleSession(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#3b82f6',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem',
                      textDecoration: 'underline'
                    }}
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
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={toggleSchedule}
            style={{
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '300px'
            }}
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
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6b7280',
          fontSize: '1.125rem'
        }}>
          No sessions added yet. Add sessions using the properties panel.
        </div>
      )}
    </section>
  )
}

export default ScheduleSection
