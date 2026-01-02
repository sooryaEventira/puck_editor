import React, { useEffect, useState } from 'react'
import { usePuckData } from '../shared/EditorView'

export interface SessionHighlightKeynoteProps {
  sessionId?: string
  sessions?: any[]
  backgroundStyle?: 'solid' | 'gradient'
  backgroundColor?: string
  gradientFrom?: string
  gradientTo?: string
  titleColor?: string
  descriptionColor?: string
  metaTextColor?: string
  badgeTextColor?: string
  badgeBackgroundColor?: string
  borderColor?: string
  borderRadius?: string
  padding?: string
  data?: any
}

const SessionHighlightKeynote: React.FC<SessionHighlightKeynoteProps> = ({
  sessionId,
  sessions: propSessions = [],
  data,
  backgroundStyle = 'solid',
  backgroundColor = '#4c1d95',
  gradientFrom = '#6938EF',
  gradientTo = '#4c1d95',
  titleColor = '#ffffff',
  descriptionColor = '#ffffff',
  metaTextColor = '#ffffff',
  badgeTextColor = '#ffffff',
  badgeBackgroundColor = 'rgba(255, 255, 255, 0.2)',
  borderColor = '#7c3aed',
  borderRadius = '16px',
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

  const formatSessionType = (type: string) => {
    if (!type) return 'SESSION'
    const typeMap: Record<string, string> = {
      'keynote': 'OPENING KEYNOTE',
      'workshop': 'WORKSHOP',
      'panel': 'PANEL',
      'social': 'SOCIAL EVENT',
      'gala': 'GALA'
    }
    return typeMap[type.toLowerCase()] || type.toUpperCase()
  }

  const backgroundStyleObj =
    backgroundStyle === 'gradient'
      ? {
          background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        }
      : {
          backgroundColor,
        }

  const defaultSession = {
    id: 'preview',
    title: '"The Architecture of Tomorrow"',
    sessionType: 'keynote',
    startTime: '9:00',
    startPeriod: 'AM',
    location: 'Main Stage',
    sections: [
      {
        id: 'desc',
        type: 'text',
        description: 'Join Dr. Vance as she deconstructs the emerging trends in AI and spatial computing that will redefine how we build digital products in the next decade.'
      }
    ]
  }

  const displaySession = selectedSession || defaultSession
  const timeRange = formatTime(displaySession)
  const description = getDescription(displaySession)

  return (
    <div
      className="w-full rounded-lg border-2"
      style={{
        ...backgroundStyleObj,
        borderColor,
        borderRadius,
        padding,
      }}
    >
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left: Speaker Image (placeholder for now) */}
        <div className="flex-shrink-0">
          <div
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 overflow-hidden"
            style={{
              borderColor: badgeBackgroundColor,
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <span style={{ color: metaTextColor, fontSize: '48px' }}>👤</span>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Category Badge */}
          {displaySession.sessionType && (
            <div
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide w-fit"
              style={{
                backgroundColor: badgeBackgroundColor,
                color: badgeTextColor,
              }}
            >
              {formatSessionType(displaySession.sessionType)}
            </div>
          )}

          {/* Title */}
          {displaySession.title && (
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
              style={{ color: titleColor }}
            >
              {displaySession.title}
            </h2>
          )}

          {/* Description */}
          {description && (
            <p
              className="text-base leading-relaxed"
              style={{ color: descriptionColor, opacity: 0.9 }}
            >
              {description}
            </p>
          )}

          {/* Time and Location Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {timeRange && (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                }}
              >
                <span style={{ color: metaTextColor, fontSize: '16px' }}>📅</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: metaTextColor }}
                >
                  {timeRange}
                </span>
              </div>
            )}

            {displaySession.location && (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                }}
              >
                <span style={{ color: metaTextColor, fontSize: '16px' }}>📍</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: metaTextColor }}
                >
                  {displaySession.location}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionHighlightKeynote

