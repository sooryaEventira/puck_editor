import React, { useMemo, useState } from 'react'
import { SearchLg, FilterLines } from '@untitled-ui/icons-react'
import { readEventStoreJSON } from '../../../utils/eventLocalStore'

type PublicSpeaker = {
  id: string
  name: string
  title?: string
  organization?: string
  avatarUrl?: string
  bio?: string
}

interface SpeakersListPageProps {
  eventUuid: string
  onNavigate: (path: string) => void
}

const SpeakerRow = ({ speaker }: { speaker: PublicSpeaker }) => {
  const subtitle = [speaker.title, speaker.organization].filter(Boolean).join(' • ')
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {speaker.avatarUrl ? (
        <img
          src={speaker.avatarUrl}
          alt={speaker.name}
          className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 ring-1 ring-slate-200 text-xs font-semibold text-slate-500">
          {(speaker.name || 'S')
            .split(' ')
            .filter(Boolean)
            .map((p) => p[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </div>
      )}
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900">{speaker.name}</div>
        {subtitle ? <div className="truncate text-xs text-slate-500">{subtitle}</div> : null}
      </div>
    </div>
  )
}

const SpeakersListPage: React.FC<SpeakersListPageProps> = ({ eventUuid, onNavigate }) => {
  const [query, setQuery] = useState('')

  const speakers = useMemo(() => {
    return readEventStoreJSON<PublicSpeaker[]>(eventUuid, 'speakers', [])
  }, [eventUuid])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return speakers
    return speakers.filter((s) => {
      const haystack = [s.name, s.title, s.organization, s.bio].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [query, speakers])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Speakers</h1>

        <div className="flex items-center gap-2">
          <div className="flex w-[280px] items-center overflow-hidden rounded-md border border-slate-200 bg-white">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search speakers"
              className="w-full px-3 py-2 text-sm text-slate-600 focus:outline-none"
              aria-label="Search speakers"
            />
            <button
              type="button"
              className="inline-flex items-center justify-center bg-primary px-3 py-2.5 text-white transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Search"
            >
              <SearchLg className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Filter speakers"
            onClick={() => console.log('Speaker filter clicked')}
          >
            <FilterLines className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-base font-semibold text-slate-900">No speakers found</div>
          <div className="mt-1 text-sm text-slate-600">
            Add speakers in Speaker Management to see them here.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <button
              key={s.id}
              type="button"
              className="w-full text-left"
              onClick={() => onNavigate(`/events/${eventUuid}/speakers/${s.id}`)}
            >
              <SpeakerRow speaker={s} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SpeakersListPage

