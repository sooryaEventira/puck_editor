import React, { useMemo } from 'react'
import { readEventStoreJSON } from '../../../utils/eventLocalStore'

type PublicAttendee = {
  id: string
  name: string
  post?: string
  institute?: string
  avatarUrl?: string
}

interface AttendeeDetailPageProps {
  eventUuid: string
  attendeeId: string
  onNavigate: (path: string) => void
}

const AttendeeDetailPage: React.FC<AttendeeDetailPageProps> = ({ eventUuid, attendeeId, onNavigate }) => {
  const attendee = useMemo(() => {
    const all = readEventStoreJSON<PublicAttendee[]>(eventUuid, 'attendees', [])
    return all.find((a) => String(a.id) === String(attendeeId)) || null
  }, [eventUuid, attendeeId])

  if (!attendee) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <button
          type="button"
          onClick={() => onNavigate(`/events/${eventUuid}/attendees`)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          ← Back
        </button>
        <div className="text-base font-semibold text-slate-900">Attendee not found</div>
        <div className="mt-1 text-sm text-slate-600">
          This attendee doesn’t exist or hasn’t been published to this browser.
        </div>
      </div>
    )
  }

  const subtitle = [attendee.post, attendee.institute].filter(Boolean).join(' • ')

  return (
    <div className="space-y-10">
      <button
        type="button"
        onClick={() => onNavigate(`/events/${eventUuid}/attendees`)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
        aria-label="Back to attendees"
      >
        ← Back
      </button>

      <div className="flex flex-col items-center text-center">
        {attendee.avatarUrl ? (
          <img
            src={attendee.avatarUrl}
            alt={attendee.name}
            className="h-32 w-32 rounded-xl object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200 text-xl font-semibold text-slate-500">
            {(attendee.name || 'A')
              .split(' ')
              .filter(Boolean)
              .map((p) => p[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
        )}

        <h1 className="mt-6 text-2xl font-semibold text-slate-900">{attendee.name}</h1>
        {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
      </div>
    </div>
  )
}

export default AttendeeDetailPage

