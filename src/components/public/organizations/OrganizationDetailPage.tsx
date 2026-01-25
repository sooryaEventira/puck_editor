import React, { useMemo } from 'react'
import { readEventStoreJSON } from '../../../utils/eventLocalStore'

type PublicOrganization = {
  id: string
  name: string
  website?: string
  linkedin?: string
  description?: string
  logoLink?: string
  stallNumber?: string
}

interface OrganizationDetailPageProps {
  eventUuid: string
  organizationId: string
  onNavigate: (path: string) => void
}

const ExternalLinkButton = ({ href, label }: { href: string; label: string }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      onClick={(e) => e.stopPropagation()}
    >
      {label}
    </a>
  )
}

const OrganizationDetailPage: React.FC<OrganizationDetailPageProps> = ({
  eventUuid,
  organizationId,
  onNavigate
}) => {
  const org = useMemo(() => {
    const all = readEventStoreJSON<PublicOrganization[]>(eventUuid, 'organizations', [])
    return all.find((o) => String(o.id) === String(organizationId)) || null
  }, [eventUuid, organizationId])

  if (!org) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <button
          type="button"
          onClick={() => onNavigate(`/events/${eventUuid}/organizations`)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          ← Back
        </button>
        <div className="text-base font-semibold text-slate-900">Organization not found</div>
        <div className="mt-1 text-sm text-slate-600">
          This organization doesn’t exist or hasn’t been published to this browser.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={() => onNavigate(`/events/${eventUuid}/organizations`)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
        aria-label="Back to organizations"
      >
        ← Back
      </button>

      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{org.name}</h1>
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <p>{org.description || ''}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-700">
            <div className="font-medium">Stall number</div>
            <div>{org.stallNumber || '-'}</div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {org.website ? <ExternalLinkButton href={org.website} label="Website" /> : null}
            {org.linkedin ? <ExternalLinkButton href={org.linkedin} label="LinkedIn" /> : null}
          </div>
        </div>

        <div className="flex items-start justify-center md:justify-end">
          {org.logoLink ? (
            <img
              src={org.logoLink}
              alt={`${org.name} logo`}
              className="h-40 w-40 rounded-xl object-cover ring-1 ring-slate-200 bg-white"
            />
          ) : (
            <div className="h-40 w-40 rounded-xl bg-slate-100 ring-1 ring-slate-200" />
          )}
        </div>
      </div>
    </div>
  )
}

export default OrganizationDetailPage

