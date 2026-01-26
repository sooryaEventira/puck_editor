import React, { useMemo, useState } from 'react'
import { SearchLg } from '@untitled-ui/icons-react'
import { readEventStoreJSON } from '../../../utils/eventLocalStore'
import { buildSearchIndex, normalizeSearchText } from '../../../utils/indexedSearch'

type PublicOrganization = {
  id: string
  name: string
  logoLink?: string
}

interface OrganizationsListPageProps {
  eventUuid: string
  onNavigate: (path: string) => void
}

const OrganizationCard = ({ name, logoLink }: { name: string; logoLink?: string }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {logoLink ? (
        <img
          src={logoLink}
          alt={name}
          className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
        />
      ) : (
        <div className="h-12 w-12 rounded-full bg-slate-100 ring-1 ring-slate-200" />
      )}
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900">{name}</div>
      </div>
    </div>
  )
}

const OrganizationsListPage: React.FC<OrganizationsListPageProps> = ({ eventUuid, onNavigate }) => {
  const [queryInput, setQueryInput] = useState('')

  const organizations = useMemo(() => {
    return readEventStoreJSON<PublicOrganization[]>(eventUuid, 'organizations', [])
  }, [eventUuid])

  // Normalize IDs (localStorage can contain missing/duplicate ids, which breaks React list rendering)
  const normalizedOrganizations = useMemo(() => {
    const seen = new Set<string>()
    return organizations.map((o, idx) => {
      const baseId = String((o as any)?.id ?? '').trim()
      const nameKey = normalizeSearchText((o as any)?.name).replace(/\s+/g, '-') || 'org'
      let id = baseId || `${nameKey}-${idx}`
      while (seen.has(id)) id = `${id}-${idx}`
      seen.add(id)
      return { ...o, id }
    })
  }, [organizations])

  const orgIndex = useMemo(() => {
    // Search by organization name only
    return buildSearchIndex(normalizedOrganizations, (o) => o.name)
  }, [normalizedOrganizations])

  const filtered = useMemo(() => {
    const q = normalizeSearchText(queryInput)
    if (!q) return normalizedOrganizations
    const tokens = q.split(' ').filter(Boolean)
    return orgIndex.filter((e) => tokens.every((t) => e.text.includes(t))).map((e) => e.item)
  }, [normalizedOrganizations, orgIndex, queryInput])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-black">Organizations</h1>

        {/* Search (match attendees design) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <input
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Search organizations"
              className="w-[240px] px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="button"
              className="flex h-9 w-10 items-center justify-center bg-primary text-white"
              aria-label="Search"
            >
              <SearchLg className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
        <span className="font-semibold text-slate-700">{normalizedOrganizations.length}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-base font-semibold text-slate-900">
            {organizations.length === 0 ? 'No organizations yet' : 'No organizations found'}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Add organizations in EventHub → Organization Management to see them here.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((org, idx) => (
            <button
              key={`${org.id}-${idx}`}
              type="button"
              onClick={() => onNavigate(`/events/${eventUuid}/organizations/${org.id}`)}
              className="w-full text-left"
            >
              <OrganizationCard name={org.name} logoLink={org.logoLink} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrganizationsListPage

