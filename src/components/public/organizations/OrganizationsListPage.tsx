import React, { useMemo } from 'react'
import { readEventStoreJSON } from '../../../utils/eventLocalStore'

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
  const organizations = useMemo(() => {
    return readEventStoreJSON<PublicOrganization[]>(eventUuid, 'organizations', [])
  }, [eventUuid])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Organizations</h1>

      {organizations.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-base font-semibold text-slate-900">No organizations yet</div>
          <div className="mt-1 text-sm text-slate-600">
            Add organizations in EventHub → Organization Management to see them here.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {organizations.map((org) => (
            <button
              key={org.id}
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

