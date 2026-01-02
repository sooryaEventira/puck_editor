import React, { useEffect, useState } from 'react'
import { usePuckData } from '../shared/EditorView'

export interface SessionHighlightProps {
  sessionId?: string
  sessions?: any[] // Array of sessions from scheduler
  // Visual customization
  backgroundStyle?: 'solid' | 'gradient'
  backgroundColor?: string
  gradientFrom?: string
  gradientTo?: string
  titleColor?: string
  descriptionColor?: string
  metaTextColor?: string
  badgeTextColor?: string
  badgeBackgroundColor?: string
  borderRadius?: string
  padding?: string
  contentAlignment?: 'left' | 'center'
  data?: any // Puck data for accessing other components
}

const SessionHighlight: React.FC<SessionHighlightProps> = ({
  sessionId,
  sessions: propSessions = [],
  data,
  backgroundStyle = 'gradient',
  backgroundColor = '#1e3a8a',
  gradientFrom = '#6938EF',
  gradientTo = '#1e3a8a',
  titleColor = '#ffffff',
  descriptionColor = '#ffffff',
  metaTextColor = '#ffffff',
  badgeTextColor = '#ffffff',
  badgeBackgroundColor = 'rgba(255, 255, 255, 0.2)',
  borderRadius = '16px',
  padding = '3rem 2rem',
  contentAlignment = 'left',
  data: propData
}) => {
  const context = usePuckData()
  const contextData = context?.data
  const [availableSessions, setAvailableSessions] = useState<any[]>(propSessions)

  // Auto-detect sessions from ScheduleContent in the page
  useEffect(() => {
    if (propSessions && propSessions.length > 0) {
      setAvailableSessions(propSessions)
      return
    }

    const pageData = propData || contextData
    if (!pageData || !pageData.content) {
      return
    }

    // Find ScheduleContent component with sessions
    const scheduleContent = pageData.content.find(
      (item: any) => item.type === 'ScheduleContent' && item.props?.sessions
    )
    
    if (scheduleContent?.props?.sessions) {
      setAvailableSessions(scheduleContent.props.sessions)
    }
  }, [propSessions, propData, contextData])

  // Find the selected session
  const selectedSession = availableSessions.find((s) => s.id === sessionId)

  // Format time range
  const formatTime = (session: any) => {
    if (!session) return ''
    const start = `${session.startTime || ''} ${session.startPeriod || ''}`.trim()
    const end = `${session.endTime || ''} ${session.endPeriod || ''}`.trim()
    if (start && end) {
      return `${start} - ${end}`
    }
    return start || end || ''
  }

  // Get description from sections
  const getDescription = (session: any) => {
    if (!session) return ''
    // Try to get description from sections
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

  // Format session type for badge - map to display labels
  const formatSessionType = (type: string) => {
    if (!type) return 'SESSION'
    const typeMap: Record<string, string> = {
      'social': 'SOCIAL EVENT',
      'gala': 'GALA',
      'workshop': 'WORKSHOP',
      'keynote': 'KEYNOTE',
      'panel': 'PANEL',
      'networking': 'NETWORKING EVENT'
    }
    const mapped = typeMap[type.toLowerCase()] || type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .toUpperCase()
    return mapped === 'SOCIAL' ? 'SOCIAL EVENT' : mapped
  }

  // Determine access type and display text (from tags or default)
  const getAccessInfo = (session: any) => {
    if (!session) return { type: 'free', label: 'Free', showVipText: false }
    const tags = session.tags || []
    const tagStr = tags.join(' ').toLowerCase()
    if (tagStr.includes('vip')) {
      // If VIP tag exists, show "Free" with "FOR VIP HOLDERS" subtitle
      return { type: 'vip', label: 'Free', showVipText: true }
    }
    if (tagStr.includes('paid')) return { type: 'paid', label: 'Paid', showVipText: false }
    return { type: 'free', label: 'Free', showVipText: false }
  }

  // Background style
  const backgroundStyleObj =
    backgroundStyle === 'gradient'
      ? {
          background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        }
      : {
          backgroundColor,
        }

  const alignmentClass = contentAlignment === 'center' ? 'text-center' : 'text-left'
  const flexAlignment = contentAlignment === 'center' ? 'items-center' : 'items-start'

  // Default/placeholder session for preview when no session is selected
  const defaultSession = {
    id: 'preview',
    title: 'The Sunset Networking Gala',
    sessionType: 'social',
    startTime: '7:00',
    startPeriod: 'PM',
    endTime: '11:00',
    endPeriod: 'PM',
    location: 'Skyline Rooftop Lounge',
    tags: ['vip'],
    sections: [
      {
        id: 'desc',
        type: 'text',
        title: 'Description',
        description: 'Unwind after Day 1. Connect with industry leaders, enjoy signature cocktails, and experience live jazz on the rooftop.'
      }
    ]
  }

  // Use default session if no session is selected (for UI preview)
  const displaySession = selectedSession || defaultSession

  const accessInfo = getAccessInfo(displaySession)
  const timeRange = formatTime(displaySession)
  const description = getDescription(displaySession)

  return (
    <div
      className="w-full rounded-lg"
      style={{
        ...backgroundStyleObj,
      borderRadius,
        padding,
      }}
    >
      <div className={`flex flex-col gap-6 ${flexAlignment}`}>
        {/* Session Type Badge */}
        {displaySession.sessionType && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: '#d4a574', // Light brown/tan color like in the image
              color: '#ffffff',
              alignSelf: contentAlignment === 'center' ? 'center' : 'flex-start',
            }}
          >
            <span style={{ fontSize: '14px' }}>🏛️</span>
            <span>{formatSessionType(displaySession.sessionType)}</span>
          </div>
        )}

        {/* Title */}
        {displaySession.title && (
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            style={{ color: titleColor }}
          >
            {displaySession.title}
          </h2>
        )}

        {/* Description */}
        {description && (
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl"
            style={{ color: descriptionColor, opacity: 0.9 }}
          >
            {description}
          </p>
        )}

        {/* Meta Information and Access Badge - All in same row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 w-full">
          {/* Left side: Time and Location */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            {/* Time */}
            {timeRange && (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <span style={{ color: metaTextColor, fontSize: '18px' }}>🕐</span>
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-xs uppercase tracking-wide font-semibold"
                    style={{ color: metaTextColor, opacity: 0.8 }}
                  >
                    TIME
                  </span>
                  <span
                    className="text-base font-medium"
                    style={{ color: metaTextColor }}
                  >
                    {timeRange}
                  </span>
                </div>
              </div>
            )}

            {/* Location */}
            {displaySession.location && (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <span style={{ color: metaTextColor, fontSize: '18px' }}>📍</span>
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-xs uppercase tracking-wide font-semibold"
                    style={{ color: metaTextColor, opacity: 0.8 }}
                  >
                    LOCATION
                  </span>
                  <span
                    className="text-base font-medium"
                    style={{ color: metaTextColor }}
                  >
                    {displaySession.location}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Access Badge - On the right side (end) of same row */}
          <div
            className="inline-flex flex-col items-center gap-2 px-6 py-4 rounded-lg flex-shrink-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <span
              className="text-2xl font-bold whitespace-nowrap"
              style={{ color: metaTextColor }}
            >
              {accessInfo.label}
            </span>
            {accessInfo.showVipText && (
              <span
                className="text-xs uppercase tracking-wide whitespace-nowrap"
                style={{ color: metaTextColor, opacity: 0.8 }}
              >
                FOR VIP HOLDERS
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionHighlight

