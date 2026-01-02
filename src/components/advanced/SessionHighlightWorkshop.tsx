import React, { useEffect, useState } from 'react'
import { usePuckData } from '../shared/EditorView'

export interface SessionHighlightWorkshopProps {
  sessionId?: string
  sessions?: any[]
  backgroundColor?: string
  textColor?: string
  badgeColor?: string
  badgeTextColor?: string
  buttonColor?: string
  buttonTextColor?: string
  borderColor?: string
  borderRadius?: string
  padding?: string
  data?: any
}

const SessionHighlightWorkshop: React.FC<SessionHighlightWorkshopProps> = ({
  sessionId,
  sessions: propSessions = [],
  data,
  backgroundColor = '#ffffff',
  textColor = '#1f2937',
  badgeColor = '#3b82f6',
  badgeTextColor = '#ffffff',
  buttonColor = '#3b82f6',
  buttonTextColor = '#ffffff',
  borderColor = '#e5e7eb',
  borderRadius = '12px',
  padding = '2rem',
  data: propData
}) => {
  const context = usePuckData()
  const contextData = context?.data
  const [availableSessions, setAvailableSessions] = useState<any[]>(propSessions)

  useEffect(() => {
    if (propSessions && propSessions.length > 0) {
      setAvailableSessions(propSessions)
      return
    }

    const pageData = propData || contextData
    if (!pageData || !pageData.content) {
      return
    }

    const scheduleContent = pageData.content.find(
      (item: any) => item.type === 'ScheduleContent' && item.props?.sessions
    )
    
    if (scheduleContent?.props?.sessions) {
      setAvailableSessions(scheduleContent.props.sessions)
    }
  }, [propSessions, propData, contextData])

  const selectedSession = availableSessions.find((s) => s.id === sessionId)

  const formatTime = (session: any) => {
    if (!session) return ''
    const start = `${session.startTime || ''} ${session.startPeriod || ''}`.trim()
    const end = `${session.endTime || ''} ${session.endPeriod || ''}`.trim()
    if (start && end) {
      return `${start} - ${end}`
    }
    return start || end || ''
  }

  const getDescription = (session: any) => {
    if (!session) return ''
    if (session.sections && session.sections.length > 0) {
      const textSection = session.sections.find(
        (s: any) => s.type === 'text' && s.description
      )
      if (textSection) {
        return textSection.description
      }
    }
    return ''
  }

  const defaultSession = {
    id: 'preview',
    title: 'Mastering Design Systems in React',
    sessionType: 'workshop',
    startTime: '2:00',
    startPeriod: 'PM',
    location: 'Workshop Room A',
    sections: [
      {
        id: 'desc',
        type: 'text',
        description: 'A hands-on deep dive into building scalable UI libraries. Bring your laptop and learn how to structure your components for enterprise-level applications.'
      }
    ]
  }

  const displaySession = selectedSession || defaultSession
  const timeRange = formatTime(displaySession)
  const description = getDescription(displaySession)

  return (
    <div
      className="w-full rounded-lg border"
      style={{
        backgroundColor,
        borderColor,
        borderRadius,
        padding,
      }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Image Placeholder */}
        <div className="flex-shrink-0 md:w-1/3">
          <div
            className="w-full h-64 md:h-full rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              backgroundColor: '#f3f4f6',
              minHeight: '200px',
            }}
          >
            <span style={{ color: '#9ca3af', fontSize: '48px' }}>🖼️</span>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Badge */}
          {displaySession.sessionType && (
            <div
              className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide w-fit"
              style={{
                backgroundColor: badgeColor,
                color: badgeTextColor,
              }}
            >
              {displaySession.sessionType.toUpperCase()}
            </div>
          )}

          {/* Title */}
          {displaySession.title && (
            <h2
              className="text-2xl md:text-3xl font-bold leading-tight"
              style={{ color: textColor }}
            >
              {displaySession.title}
            </h2>
          )}

          {/* Description */}
          {description && (
            <p
              className="text-base leading-relaxed"
              style={{ color: textColor, opacity: 0.8 }}
            >
              {description}
            </p>
          )}

          {/* Time and Location */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {timeRange && (
              <div className="flex items-center gap-2" style={{ color: textColor }}>
                <span>📅</span>
                <span>{timeRange}</span>
              </div>
            )}
            {displaySession.location && (
              <div className="flex items-center gap-2" style={{ color: textColor }}>
                <span>🕐</span>
                <span>{displaySession.location}</span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="mt-auto pt-4">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: buttonColor,
                color: buttonTextColor,
              }}
            >
              Reserve Seat
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionHighlightWorkshop

