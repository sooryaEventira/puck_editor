import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useEventForm } from '../../../contexts/EventFormContext'
import EventHubNavbar from '../EventHubNavbar'
import EventHubSidebar from '../EventHubSidebar'
import { defaultCards, ContentCard } from '../EventHubContent'
import { InfoCircle, CodeBrowser, Globe01 } from '@untitled-ui/icons-react'
import UploadModal from '../../ui/UploadModal'
import { showToast } from '../../../utils/toast'
import type { Organization } from './organizationTypes'
import OrganizationsTable from './OrganizationsTable'
import CreateOrganizationModal from './CreateOrganizationModal'
import { readEventStoreJSON, writeEventStoreJSON } from '../../../utils/eventLocalStore'

interface OrganizationManagementPageProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  userAvatarUrl?: string
  hideNavbarAndSidebar?: boolean
}

const OrganizationManagementPage: React.FC<OrganizationManagementPageProps> = ({
  eventName: propEventName,
  isDraft: propIsDraft,
  onBackClick,
  userAvatarUrl,
  hideNavbarAndSidebar = false
}) => {
  const { eventData, createdEvent } = useEventForm()

  const eventName = useMemo(() => {
    return createdEvent?.eventName || eventData?.eventName || propEventName || 'Highly important conference of 2025'
  }, [createdEvent?.eventName, createdEvent?.uuid, eventData?.eventName, propEventName])

  const isDraft = propIsDraft !== undefined ? propIsDraft : true

  // Sidebar config (only used when not embedded inside EventHubPage)
  const sidebarItems = useMemo(() => {
    const eventHubSubItems = defaultCards.map((card: ContentCard) => ({
      id: card.id,
      label: card.title,
      icon: card.icon
    }))
    return [
      { id: 'overview', label: 'Overview', icon: <InfoCircle className="h-5 w-5" /> },
      { id: 'event-website', label: 'Event website', icon: <CodeBrowser className="h-5 w-5" /> },
      { id: 'event-hub', label: 'Event Hub', icon: <Globe01 className="h-5 w-5" />, subItems: eventHubSubItems }
    ]
  }, [])

  const handleSidebarItemClick = useCallback((itemId: string) => {
    const newUrl = itemId === 'event-hub' ? '/event/hub' : `/event/hub?section=${itemId}`
    window.history.pushState({ section: itemId }, '', newUrl)
    window.location.reload()
  }, [])

  const eventUuidForStore = createdEvent?.uuid || localStorage.getItem('createdEventUuid') || 'unknown-event'
  const [organizations, setOrganizations] = useState<Organization[]>([])

  // Load saved organizations (UI-only persistence)
  useEffect(() => {
    const stored = readEventStoreJSON<Organization[]>(eventUuidForStore, 'organizations', [])
    if (Array.isArray(stored)) setOrganizations(stored)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventUuidForStore])

  // Persist organizations on change
  useEffect(() => {
    writeEventStoreJSON(eventUuidForStore, 'organizations', organizations)
  }, [eventUuidForStore, organizations])

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null)

  const editingOrg = useMemo(() => {
    if (!editingOrgId) return null
    return organizations.find((o) => o.id === editingOrgId) || null
  }, [editingOrgId, organizations])

  const handleUpload = () => {
    setIsUploadModalOpen(true)
  }

  const handleCreate = () => {
    setEditingOrgId(null)
    setIsCreateModalOpen(true)
  }

  const handleEdit = (organizationId: string) => {
    setEditingOrgId(organizationId)
    setIsCreateModalOpen(true)
  }

  const handleDelete = (organizationId: string) => {
    setOrganizations((prev) => prev.filter((o) => o.id !== organizationId))
    showToast.success('Organization deleted')
  }

  const handleSaveOrganization = (data: {
    name: string
    website?: string
    linkedin?: string
    description?: string
    logoLink?: string
    stallNumber?: string
  }) => {
    if (editingOrgId) {
      setOrganizations((prev) =>
        prev.map((o) =>
          o.id === editingOrgId
            ? { ...o, ...data }
            : o
        )
      )
      showToast.success('Organization updated')
    } else {
      const id = `org-${Date.now()}`
      setOrganizations((prev) => [{ id, ...data }, ...prev])
      showToast.success('Organization created')
    }
  }

  const handleUploadFiles = async (files: File[]) => {
    // UI only: just log the files
    console.log('📤 OrganizationManagementPage: Uploaded files (UI only):', files.map((f) => ({ name: f.name, size: f.size, type: f.type })))
    showToast.success('File received (UI only)')
    setIsUploadModalOpen(false)
  }

  return (
    <div className={hideNavbarAndSidebar ? '' : 'min-h-screen overflow-x-hidden bg-white'}>
      {!hideNavbarAndSidebar && (
        <>
          <EventHubNavbar
            eventName={eventName}
            isDraft={isDraft}
            onBackClick={onBackClick}
            onSearchClick={() => {}}
            onNotificationClick={() => {}}
            onProfileClick={() => {}}
            userAvatarUrl={userAvatarUrl}
          />
          <EventHubSidebar
            items={sidebarItems}
            activeItemId="organization-management"
            onItemClick={handleSidebarItemClick}
            isModalOpen={isUploadModalOpen || isCreateModalOpen}
          />
        </>
      )}

      <div className={hideNavbarAndSidebar ? '' : 'md:pl-[250px]'}>
        <OrganizationsTable
          organizations={organizations}
          onUpload={handleUpload}
          onCreateOrganization={handleCreate}
          onEditOrganization={handleEdit}
          onDeleteOrganization={handleDelete}
        />
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadFiles}
        title="Upload organizations"
        description="XLSX files only"
        showTemplate={false}
        instructions={[
          'Step 1: Prepare Excel with columns: Name, Website, Description, Logo link',
          'Step 2: Upload the Excel file'
        ]}
        buttonText="Upload file"
        multiple={false}
      />

      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingOrgId(null)
        }}
        initialValues={
          editingOrg
            ? {
                name: editingOrg.name,
                website: editingOrg.website,
                linkedin: editingOrg.linkedin,
                description: editingOrg.description,
                logoLink: editingOrg.logoLink,
                stallNumber: editingOrg.stallNumber
              }
            : undefined
        }
        onSave={handleSaveOrganization}
      />
    </div>
  )
}

export default OrganizationManagementPage

