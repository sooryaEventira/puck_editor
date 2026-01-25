import React, { useEffect, useMemo, useState } from 'react'
import PublicNavbar, { type PublicNavbarItem } from './PublicNavbar'
import { fetchPublicEvent, type PublicEventData } from '../../services/publicEventService'
import { fetchPublicWebpages, type PublicWebpageData } from '../../services/publicWebpageService'
import PublicWebpageRenderer from './PublicWebpageRenderer'

type PublicSection =
  | 'webpage'
  | 'speakers'
  | 'speaker'
  | 'attendees'
  | 'attendee'
  | 'schedule'
  | 'sessions'
  | 'organizations'
  | 'organization'

interface PublicEventWebsiteShellProps {
  eventUuid: string
}

const getSectionFromPath = (
  eventUuid: string,
  pathname: string
): {
  section: PublicSection
  webpageUuid?: string
  organizationId?: string
  speakerId?: string
  attendeeId?: string
} => {
  const base = `/events/${eventUuid}`
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : pathname

  const webpageMatch = rest.match(/^\/webpages\/([^/]+)\/?$/)
  if (webpageMatch) {
    return { section: 'webpage', webpageUuid: webpageMatch[1] }
  }

  const speakerDetailMatch = rest.match(/^\/speakers\/([^/]+)\/?$/)
  if (speakerDetailMatch) {
    return { section: 'speaker', speakerId: speakerDetailMatch[1] }
  }

  const attendeeDetailMatch = rest.match(/^\/attendees\/([^/]+)\/?$/)
  if (attendeeDetailMatch) {
    return { section: 'attendee', attendeeId: attendeeDetailMatch[1] }
  }

  const orgDetailMatch = rest.match(/^\/organizations\/([^/]+)\/?$/)
  if (orgDetailMatch) {
    return { section: 'organization', organizationId: orgDetailMatch[1] }
  }

  if (rest.startsWith('/organizations')) return { section: 'organizations' }
  if (rest.startsWith('/speakers')) return { section: 'speakers' }
  if (rest.startsWith('/attendees')) return { section: 'attendees' }
  if (rest.startsWith('/schedule')) return { section: 'schedule' }
  if (rest.startsWith('/sessions')) return { section: 'sessions' }

  // Default: if no explicit section, treat it as "webpage" and show first available page
  return { section: 'webpage' }
}

const OrganizationsListPage = React.lazy(() => import('./organizations/OrganizationsListPage'))
const OrganizationDetailPage = React.lazy(() => import('./organizations/OrganizationDetailPage'))
const SpeakersListPage = React.lazy(() => import('./speakers/SpeakersListPage'))
const SpeakerDetailPage = React.lazy(() => import('./speakers/SpeakerDetailPage'))
const AttendeesListPage = React.lazy(() => import('./attendees/AttendeesListPage'))
const AttendeeDetailPage = React.lazy(() => import('./attendees/AttendeeDetailPage'))

const PublicEventWebsiteShell: React.FC<PublicEventWebsiteShellProps> = ({ eventUuid }) => {
  const [event, setEvent] = useState<PublicEventData | null>(null)
  const [webpages, setWebpages] = useState<PublicWebpageData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [activePath, setActivePath] = useState<string>(window.location.pathname)

  const refresh = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const [evt, pages] = await Promise.all([
        fetchPublicEvent(eventUuid),
        fetchPublicWebpages(eventUuid)
      ])
      setEvent(evt)
      setWebpages(Array.isArray(pages) ? pages : [])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load website.'
      setLoadError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // Keep active path in sync with navigation
    const onPop = () => setActivePath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventUuid])

  const navbarItems: PublicNavbarItem[] = useMemo(() => {
    const SYSTEM_PAGES: PublicNavbarItem[] = [
      { label: 'Organizations', path: `/events/${eventUuid}/organizations` },
      { label: 'Speakers', path: `/events/${eventUuid}/speakers` },
      { label: 'Attendees', path: `/events/${eventUuid}/attendees` },
      { label: 'Schedule', path: `/events/${eventUuid}/schedule` },
      { label: 'Sessions', path: `/events/${eventUuid}/sessions` },
    ]

    const dynamic: PublicNavbarItem[] = webpages.map((p) => ({
      label: p.name,
      path: `/events/${eventUuid}/webpages/${p.uuid}`
    }))

    return [...SYSTEM_PAGES, ...dynamic]
  }, [eventUuid, webpages])

  const current = useMemo(() => getSectionFromPath(eventUuid, activePath), [eventUuid, activePath])
  const fallbackWebpageUuid = webpages[0]?.uuid
  const webpageUuid = current.webpageUuid ?? fallbackWebpageUuid

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar
        eventName={event?.eventName}
        logoUrl={event?.logo ?? null}
        items={navbarItems}
        activePath={activePath}
        onNavigate={handleNavigate}
      />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-sm font-medium text-slate-600">Loading website…</div>
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
            <div className="text-lg font-semibold text-rose-900">Unable to load this event</div>
            <div className="mt-1 text-sm text-rose-800">{loadError}</div>
          </div>
        ) : current.section === 'organizations' ? (
          <React.Suspense fallback={<div className="py-10 text-sm text-slate-600">Loading…</div>}>
            <OrganizationsListPage
              eventUuid={eventUuid}
              onNavigate={handleNavigate}
            />
          </React.Suspense>
        ) : current.section === 'speakers' ? (
          <React.Suspense fallback={<div className="py-10 text-sm text-slate-600">Loading…</div>}>
            <SpeakersListPage eventUuid={eventUuid} onNavigate={handleNavigate} />
          </React.Suspense>
        ) : current.section === 'speaker' ? (
          <React.Suspense fallback={<div className="py-10 text-sm text-slate-600">Loading…</div>}>
            <SpeakerDetailPage
              eventUuid={eventUuid}
              speakerId={current.speakerId || ''}
              onNavigate={handleNavigate}
            />
          </React.Suspense>
        ) : current.section === 'attendees' ? (
          <React.Suspense fallback={<div className="py-10 text-sm text-slate-600">Loading…</div>}>
            <AttendeesListPage eventUuid={eventUuid} onNavigate={handleNavigate} />
          </React.Suspense>
        ) : current.section === 'attendee' ? (
          <React.Suspense fallback={<div className="py-10 text-sm text-slate-600">Loading…</div>}>
            <AttendeeDetailPage
              eventUuid={eventUuid}
              attendeeId={current.attendeeId || ''}
              onNavigate={handleNavigate}
            />
          </React.Suspense>
        ) : current.section === 'organization' ? (
          <React.Suspense fallback={<div className="py-10 text-sm text-slate-600">Loading…</div>}>
            <OrganizationDetailPage
              eventUuid={eventUuid}
              organizationId={current.organizationId || ''}
              onNavigate={handleNavigate}
            />
          </React.Suspense>
        ) : current.section === 'webpage' ? (
          webpageUuid ? (
            <PublicWebpageRenderer eventUuid={eventUuid} webpageUuid={webpageUuid} />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="text-lg font-semibold text-slate-900">No pages yet</div>
              <div className="mt-1 text-sm text-slate-600">
                This event doesn’t have any published webpages.
              </div>
            </div>
          )
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-lg font-semibold text-slate-900">Coming soon</div>
            <div className="mt-1 text-sm text-slate-600">
              This section will be connected once the public endpoints are provided.
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PublicEventWebsiteShell

