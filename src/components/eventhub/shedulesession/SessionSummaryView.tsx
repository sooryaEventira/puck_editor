import React from 'react'
import { SessionDraft } from './sessionTypes'

interface SessionSummaryViewProps {
  session: SessionDraft
}

const formatTime = (time: string, period: 'AM' | 'PM') => {
  if (!time) return ''

  const [hourPart, minutePart = '00'] = time.split(':')
  const hourValue = Number.parseInt(hourPart, 10)

  if (Number.isNaN(hourValue)) {
    return `${time} ${period}`
  }

  const normalizedHour = ((hourValue % 12) + 12) % 12 || 12
  const formattedMinutes = minutePart.padStart(2, '0')

  return `${normalizedHour}:${formattedMinutes} ${period}`
}

const SessionSummaryView: React.FC<SessionSummaryViewProps> = ({ session }) => {
  const startLabel = formatTime(session.startTime, session.startPeriod)
  const endLabel = formatTime(session.endTime, session.endPeriod)
  const timeRange =
    startLabel && endLabel ? `${startLabel} - ${endLabel}` : startLabel || endLabel

  const metadataChips = [
    timeRange && {
      id: 'time-range',
      label: timeRange
    },
    session.location && {
      id: 'location',
      label: session.location
    },
    session.sessionType && {
      id: 'type',
      label: session.sessionType
    },
    ...session.tags.map((tag) => ({
      id: `tag-${tag}`,
      label: tag,
      intent: 'tag'
    }))
  ].filter(Boolean) as Array<{ id: string; label: string; intent?: 'tag' }>

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {session.title || 'Session title'}
        </h2>

        {metadataChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadataChips.map((chip) => (
              <span
                key={chip.id}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  chip.intent === 'tag'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {chip.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {session.sections.length > 0 ? (
          session.sections.map((section) => (
            <section key={section.id} className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {section.type === 'text' ? 'Description' : section.title}
              </p>
              <p className="text-sm leading-6 text-slate-600">
                {section.description || 'No additional details for this section yet.'}
              </p>
            </section>
          ))
        ) : (
          <p className="text-sm text-slate-500">No sections have been added yet.</p>
        )}
      </div>
    </div>
  )
}

export default SessionSummaryView

