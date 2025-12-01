import React, { useMemo, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Plus, ChevronUp, ChevronDown, Calendar, Attachment01, User01 } from '@untitled-ui/icons-react'
import { SavedSession } from './sessionTypes'

interface ScheduleGridProps {
  sessions: SavedSession[]
  selectedDate: Date
  onAddParallelSession?: (parentSessionId?: string) => void
}

// SessionContainer component that manages time column and session cards
interface SessionContainerProps {
  session: SavedSession
  parallelSessions: SavedSession[]
  isExpanded: boolean
  onToggleExpand: () => void
  onAddParallelSession?: (parentSessionId: string) => void
  formatTime: (time: string, period: string) => string
  formatTimeRange: (session: SavedSession) => string
  getLocationLabel: (location: string) => string
  getSessionTypeLabel: (type: string) => string
  isTimeValid: (parallelSession: SavedSession, parentSession: SavedSession) => boolean
}

const SessionContainer: React.FC<SessionContainerProps> = ({
  session,
  parallelSessions,
  isExpanded,
  onToggleExpand,
  onAddParallelSession,
  formatTime,
  formatTimeRange,
  getLocationLabel,
  getSessionTypeLabel,
  isTimeValid
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const timeColumnRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const mutationObserverRef = useRef<MutationObserver | null>(null)
  const [containerHeight, setContainerHeight] = useState<number | null>(null)
  const hasParallelSessions = parallelSessions.length > 0
  const showAddButton = !hasParallelSessions && onAddParallelSession
  const showExpandButton = hasParallelSessions

  // Measure container height and sync time column
  const measureHeight = React.useCallback(() => {
    if (containerRef.current) {
      // Force a reflow to ensure accurate measurement
      const height = containerRef.current.offsetHeight
      setContainerHeight(height)
    }
  }, [])

  // Use useLayoutEffect to measure immediately when expand/collapse state changes
  // This runs synchronously after DOM mutations but before paint
  useLayoutEffect(() => {
    // When collapsing, we need to wait for React to remove the elements
    // When expanding, we need to wait for React to add the elements
    const measureAfterUpdate = () => {
      if (containerRef.current) {
        // Use offsetHeight which forces a reflow and gives accurate height
        const height = containerRef.current.offsetHeight
        setContainerHeight(height)
      }
    }

    // Measure immediately
    measureAfterUpdate()
    
    // Use setTimeout to ensure it runs after React's DOM updates complete
    const timeoutId = setTimeout(() => {
      measureAfterUpdate()
    }, 0)
    
    // Measure after multiple animation frames to ensure DOM has fully updated
    let rafId1: number
    let rafId2: number
    let rafId3: number
    
    rafId1 = requestAnimationFrame(() => {
      measureAfterUpdate()
      rafId2 = requestAnimationFrame(() => {
        measureAfterUpdate()
        rafId3 = requestAnimationFrame(() => {
          measureAfterUpdate()
        })
      })
    })

    return () => {
      clearTimeout(timeoutId)
      if (rafId1) cancelAnimationFrame(rafId1)
      if (rafId2) cancelAnimationFrame(rafId2)
      if (rafId3) cancelAnimationFrame(rafId3)
    }
  }, [isExpanded, parallelSessions.length])

  // Set up ResizeObserver and MutationObserver to track all changes
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    // Clean up previous observers
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
      resizeObserverRef.current = null
    }
    if (mutationObserverRef.current) {
      mutationObserverRef.current.disconnect()
      mutationObserverRef.current = null
    }

    // Create ResizeObserver to watch for size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === element || element.contains(entry.target)) {
          // Use offsetHeight for more accurate measurement
          const height = element.offsetHeight
          setContainerHeight(height)
          break
        }
      }
    })

    resizeObserverRef.current = resizeObserver
    resizeObserver.observe(element)

    // Also use MutationObserver to detect when children are added/removed
    const mutationObserver = new MutationObserver((mutations) => {
      // Check if any nodes were added or removed
      const hasChanges = mutations.some(mutation => 
        mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0
      )
      
      if (hasChanges) {
        // Multiple measurements to catch DOM updates
        requestAnimationFrame(() => {
          measureHeight()
          requestAnimationFrame(() => {
            measureHeight()
          })
        })
      }
    })

    mutationObserverRef.current = mutationObserver
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: false
    })

    // Initial measurement with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      measureHeight()
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect()
        mutationObserverRef.current = null
      }
    }
  }, [measureHeight, isExpanded, parallelSessions.length])

  return (
    <div className="flex gap-6">
      {/* Time Column - Height matches container */}
      <div className="flex-shrink-0 w-24">
        <div 
          ref={timeColumnRef}
          className="border border-slate-200 rounded-lg bg-white shadow-sm flex flex-col justify-between"
          style={{ 
            height: containerHeight !== null && containerHeight > 0 ? `${containerHeight}px` : 'auto'
          }}
        >
          <div className="text-center pt-3 flex-shrink-0">
            <div className="text-sm font-semibold text-slate-900">
              {formatTime(session.startTime, session.startPeriod || 'AM')}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-0">
            {/* Vertical line indicator */}
            <div className="w-px h-full bg-slate-200"></div>
          </div>
          <div className="text-center pb-3 flex-shrink-0">
            <div className="text-sm font-semibold text-slate-900">
              {formatTime(session.endTime, session.endPeriod || 'AM')}
            </div>
          </div>
        </div>
      </div>

      {/* Session Cards Column */}
      <div className="flex-1" ref={containerRef}>
        {/* Parent Session Card */}
        <div className="border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
                />
                <div className="flex items-center gap-2 flex-1">
                  <div className="cursor-move text-slate-400 hover:text-slate-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base">{session.title}</h3>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  aria-label="More options"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Metadata Row - Time, Location, Session Type */}
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Time Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatTimeRange(session)}
                </span>
                
                {/* Location Badge */}
                {session.location && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {getLocationLabel(session.location)}
                  </span>
                )}
                
                {/* Session Type Badge */}
                {session.sessionType && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {session.sessionType === 'keynote' ? (
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <User01 className="h-3.5 w-3.5" />
                    )}
                    {getSessionTypeLabel(session.sessionType)}
                  </span>
                )}
              </div>

              {/* + Button - Only show if no parallel sessions exist */}
              {showAddButton && (
                <button
                  type="button"
                  onClick={() => onAddParallelSession?.(session.id)}
                  className="p-1.5 text-slate-400 hover:text-primary rounded border border-slate-300 flex-shrink-0 transition-colors"
                  aria-label="Add parallel session"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Description */}
            {session.sections && session.sections.length > 0 && session.sections[0].description && (
              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                {session.sections[0].description}
              </p>
            )}

            {/* Footer - Attachment Badge and Expand/Collapse Arrow */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <Attachment01 className="h-3.5 w-3.5" />
                {session.attachments?.length || 0}
              </span>
              {showExpandButton && (
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Parallel Sessions - Compact, nested design */}
        {hasParallelSessions && isExpanded && (
          <div className="mt-2 space-y-2" key="parallel-sessions">
            {parallelSessions.map((parallelSession) => {
              const isValid = isTimeValid(parallelSession, session)
              if (!isValid) {
                console.warn(`Parallel session ${parallelSession.id} time is not within parent session time`)
              }
              
              return (
                <div key={parallelSession.id} className="relative">
                  {/* Short vertical guideline */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-300 ml-4"></div>
                  
                  {/* Parallel Session Card - Compact */}
                  <div className="ml-6 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-3">
                      {/* Header - Compact */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <div className="cursor-move text-slate-400 hover:text-slate-600">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M7 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                              </svg>
                            </div>
                            <h3 className="font-semibold text-slate-900 text-sm">{parallelSession.title}</h3>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            aria-label="More options"
                          >
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Metadata Row - Compact */}
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Time Badge */}
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            <Calendar className="h-3 w-3" />
                            {formatTimeRange(parallelSession)}
                          </span>
                          
                          {/* Location Badge */}
                          {parallelSession.location && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {getLocationLabel(parallelSession.location)}
                            </span>
                          )}
                          
                          {/* Session Type Badge */}
                          {parallelSession.sessionType && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                              {parallelSession.sessionType === 'keynote' ? (
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              ) : (
                                <User01 className="h-3 w-3" />
                              )}
                              {getSessionTypeLabel(parallelSession.sessionType)}
                            </span>
                          )}
                        </div>

                        {/* + Button - Always show for parallel sessions */}
                        {onAddParallelSession && (
                          <button
                            type="button"
                            onClick={() => onAddParallelSession?.(session.id)}
                            className="p-1 text-slate-400 hover:text-primary rounded border border-slate-300 flex-shrink-0 transition-colors"
                            aria-label="Add parallel session"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Description - Compact */}
                      {parallelSession.sections && parallelSession.sections.length > 0 && parallelSession.sections[0].description && (
                        <p className="text-xs text-slate-600 mb-2 leading-relaxed line-clamp-2">
                          {parallelSession.sections[0].description}
                        </p>
                      )}

                      {/* Footer - Attachment Badge */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          <Attachment01 className="h-3 w-3" />
                          {parallelSession.attachments?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  sessions,
  selectedDate,
  onAddParallelSession
}) => {
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set())

  // Filter sessions for selected date
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      if (!session.date) return true
      const sessionDate = new Date(session.date)
      const selected = new Date(selectedDate)
      
      const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate())
      const selectedDateOnly = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate())
      
      return sessionDateOnly.getTime() === selectedDateOnly.getTime()
    })
  }, [sessions, selectedDate])

  // Separate parent sessions from parallel sessions
  const { parentSessions, parallelSessionsMap } = useMemo(() => {
    const parents: SavedSession[] = []
    const parallelMap: { [parentId: string]: SavedSession[] } = {}
    
    filteredSessions.forEach(session => {
      if (session.parentId) {
        if (!parallelMap[session.parentId]) {
          parallelMap[session.parentId] = []
        }
        parallelMap[session.parentId].push(session)
      } else {
        parents.push(session)
      }
    })

    return { parentSessions: parents, parallelSessionsMap: parallelMap }
  }, [filteredSessions])

  // Auto-expand parent sessions that have parallel sessions
  useEffect(() => {
    const parentsWithParallel = Object.keys(parallelSessionsMap)
    if (parentsWithParallel.length > 0) {
      setExpandedSessions(prev => {
        const newSet = new Set(prev)
        parentsWithParallel.forEach(parentId => {
          newSet.add(parentId)
        })
        return newSet
      })
    }
  }, [parallelSessionsMap])

  // Group parent sessions by start time
  const groupedSessions = useMemo(() => {
    const groups: { [key: string]: SavedSession[] } = {}
    
    parentSessions.forEach(session => {
      const timeKey = `${session.startTime} ${session.startPeriod || 'AM'}`
      if (!groups[timeKey]) {
        groups[timeKey] = []
      }
      groups[timeKey].push(session)
    })

    // Sort by time
    return Object.keys(groups)
      .sort((a, b) => {
        const [timeA, periodA] = a.split(' ')
        const [timeB, periodB] = b.split(' ')
        const [hoursA, minsA] = timeA.split(':').map(Number)
        const [hoursB, minsB] = timeB.split(':').map(Number)
        
        let totalA = hoursA * 60 + minsA
        let totalB = hoursB * 60 + minsB
        
        if (periodA === 'PM' && hoursA !== 12) totalA += 12 * 60
        if (periodB === 'PM' && hoursB !== 12) totalB += 12 * 60
        if (periodA === 'AM' && hoursA === 12) totalA = minsA
        if (periodB === 'AM' && hoursB === 12) totalB = minsB
        
        return totalA - totalB
      })
      .map(key => ({ time: key, sessions: groups[key] }))
  }, [parentSessions])

  const toggleExpand = (sessionId: string) => {
    setExpandedSessions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId)
      } else {
        newSet.add(sessionId)
      }
      return newSet
    })
  }

  // Helper function to convert time to minutes for comparison
  const timeToMinutes = (time: string, period: 'AM' | 'PM'): number => {
    const [hours, mins] = time.split(':').map(Number)
    let total = hours * 60 + mins
    if (period === 'PM' && hours !== 12) total += 12 * 60
    if (period === 'AM' && hours === 12) total = mins
    return total
  }

  // Validate parallel session time is within parent session time
  const isTimeValid = (parallelSession: SavedSession, parentSession: SavedSession): boolean => {
    const parentStart = timeToMinutes(parentSession.startTime, parentSession.startPeriod || 'AM')
    const parentEnd = timeToMinutes(parentSession.endTime, parentSession.endPeriod || 'AM')
    const parallelStart = timeToMinutes(parallelSession.startTime, parallelSession.startPeriod || 'AM')
    const parallelEnd = timeToMinutes(parallelSession.endTime, parallelSession.endPeriod || 'AM')
    
    return parallelStart >= parentStart && parallelEnd <= parentEnd
  }

  const formatTime = (time: string, period: string) => {
    return `${time} ${period}`
  }

  const formatTimeRange = (session: SavedSession) => {
    return `${formatTime(session.startTime, session.startPeriod || 'AM')} - ${formatTime(session.endTime, session.endPeriod || 'AM')}`
  }

  const getLocationLabel = (location: string) => {
    const locationMap: Record<string, string> = {
      'cafeteria': 'Cafeteria',
      'room1': 'Room 1',
      'room2': 'Room 2',
    }
    return locationMap[location] || location
  }

  const getSessionTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'keynote': 'Online',
      'workshop': 'In-Person',
    }
    return typeMap[type] || type
  }

  if (groupedSessions.length === 0) {
    return <div className="text-sm text-slate-500 text-center py-4">No sessions for this date</div>
  }

  return (
    <div className="mt-4 space-y-4">
      {groupedSessions.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          {group.sessions.map((session) => {
            const parallelSessions = parallelSessionsMap[session.id] || []
            const isExpanded = expandedSessions.has(session.id)
            
            return (
              <SessionContainer
                key={session.id}
                session={session}
                parallelSessions={parallelSessions}
                isExpanded={isExpanded}
                onToggleExpand={() => toggleExpand(session.id)}
                onAddParallelSession={onAddParallelSession}
                formatTime={formatTime}
                formatTimeRange={formatTimeRange}
                getLocationLabel={getLocationLabel}
                getSessionTypeLabel={getSessionTypeLabel}
                isTimeValid={isTimeValid}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default ScheduleGrid
