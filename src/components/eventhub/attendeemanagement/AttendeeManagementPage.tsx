import React, { useMemo, useState, useEffect } from 'react'
import { useEventForm } from '../../../contexts/EventFormContext'
import { uploadUserFile, fetchAttendees, type AttendeeData } from '../../../services/attendeeService'
import EventHubNavbar from '../EventHubNavbar'
import EventHubSidebar from '../EventHubSidebar'
import AttendeesTable from './AttendeesTable'
import CreateProfileModal from './CreateProfileModal'
import CreateGroupModal from './CreateGroupModal'
import CreateCustomFieldModal from './CreateCustomFieldModal'
import UploadModal from '../../ui/UploadModal'
import AttendeeDetailsSlideout from './AttendeeDetailsSlideout'
import { Attendee, AttendeeTab, Group, CustomField } from './attendeeTypes'
import { defaultCards, ContentCard } from '../EventHubContent'
import { InfoCircle, CodeBrowser, Globe01 } from '@untitled-ui/icons-react'

interface AttendeeManagementPageProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  userAvatarUrl?: string
  onCardClick?: (cardId: string) => void
  hideNavbarAndSidebar?: boolean
}

const AttendeeManagementPage: React.FC<AttendeeManagementPageProps> = ({
  eventName: propEventName,
  isDraft: propIsDraft,
  onBackClick,
  userAvatarUrl,
  onCardClick,
  hideNavbarAndSidebar = false
}) => {
  // Get eventData from context to maintain consistency with EventHubPage navbar
  const { eventData } = useEventForm()
  
  // Use eventData from context, fallback to props if not available
  const eventName = eventData?.eventName || propEventName || 'Highly important conference of 2025'
  const isDraft = propIsDraft !== undefined ? propIsDraft : true
  
  const handleSearchClick = () => {
    console.log('Search clicked')
  }

  const handleNotificationClick = () => {
    console.log('Notification clicked')
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
  }

  // Convert cards to sidebar sub-items
  const sidebarItems = useMemo(() => {
    const eventHubSubItems = defaultCards.map((card: ContentCard) => ({
      id: card.id,
      label: card.title,
      icon: card.icon
    }))

    return [
      { id: 'overview', label: 'Overview', icon: <InfoCircle className="h-5 w-5" /> },
      { id: 'event-website', label: 'Event website', icon: <CodeBrowser className="h-5 w-5" /> },
      {
        id: 'event-hub',
        label: 'Event Hub',
        icon: <Globe01 className="h-5 w-5" />,
        subItems: eventHubSubItems
      }
    ]
  }, [])

  const handleSidebarItemClick = (itemId: string) => {
    console.log('Sidebar item clicked:', itemId)
    
    // If clicking on event-hub, navigate back to event hub page
    if (itemId === 'event-hub' && onBackClick) {
      onBackClick()
      return
    }
    
    // If clicking on a different card, navigate to it
    if (itemId !== 'attendee-management') {
      const isCardId = defaultCards.some((card) => card.id === itemId)
      if (isCardId && onCardClick) {
        onCardClick(itemId)
      }
    }
  }

  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [activeTab, setActiveTab] = useState<AttendeeTab>('user')
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false)
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)
  const [isCreateCustomFieldModalOpen, setIsCreateCustomFieldModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isAttendeeSlideoutOpen, setIsAttendeeSlideoutOpen] = useState(false)
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null)

  const handleUpload = () => {
    setIsUploadModalOpen(true)
  }

  const { createdEvent } = useEventForm()

  const handleUploadFiles = async (files: File[]) => {
    // Get event UUID from context
    const eventUuid = createdEvent?.uuid
    
    if (!eventUuid) {
      throw new Error('Event UUID is required. Please select an event first.')
    }

    // Upload each file
    for (const file of files) {
      await uploadUserFile(file, eventUuid)
    }

    // Refresh attendees list after upload
    await loadAttendees()
  }

  // Load attendees from API
  const loadAttendees = async () => {
    const eventUuid = createdEvent?.uuid
    
    if (!eventUuid) {
      return
    }

    try {
      const attendeesData = await fetchAttendees(eventUuid)
      
      // Map API response to Attendee interface
      const mappedAttendees: Attendee[] = attendeesData.map((attendeeData: AttendeeData) => ({
        id: attendeeData.id || attendeeData.uuid || '',
        name: attendeeData.name || `${attendeeData.first_name || ''} ${attendeeData.last_name || ''}`.trim() || 'Unknown',
        firstName: attendeeData.first_name,
        lastName: attendeeData.last_name,
        email: attendeeData.email,
        avatarUrl: attendeeData.avatar_url,
        bannerUrl: attendeeData.banner_url,
        status: (attendeeData.status as Attendee['status']) || 'sent',
        inviteCode: attendeeData.invite_code,
        groups: attendeeData.groups || [],
        institute: attendeeData.institute,
        post: attendeeData.post,
        emailVerified: attendeeData.email_verified,
        emailVerifiedDate: attendeeData.email_verified_date,
        feedbackIncomplete: attendeeData.feedback_incomplete,
      }))

      setAttendees(mappedAttendees)
    } catch (error) {
      // Error is already handled in fetchAttendees with toast
      console.error('Failed to load attendees:', error)
    }
  }

  // Load attendees on mount and when event changes
  useEffect(() => {
    if (createdEvent?.uuid) {
      loadAttendees()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdEvent?.uuid])

  const handleCreateProfile = () => {
    setIsCreateProfileModalOpen(true)
  }

  const handleSaveProfile = (data: {
    firstName: string
    lastName: string
    email: string
    organization?: string
    role?: string
    group?: string
    description?: string
    avatarUrl?: string
  }) => {
    const newAttendee: Attendee = {
      id: Date.now().toString(),
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      avatarUrl: data.avatarUrl,
      status: 'sent',
      inviteCode: undefined,
      groups: data.group
        ? [
            {
              id: Date.now().toString(),
              name: data.group,
              variant: 'primary'
            }
          ]
        : []
    }
    setAttendees((prev) => [...prev, newAttendee])
  }

  const handleEditAttendee = (attendeeId: string) => {
    const attendee = attendees.find((a) => a.id === attendeeId)
    if (attendee) {
      setSelectedAttendee(attendee)
      setIsAttendeeSlideoutOpen(true)
    }
  }

  const handleSaveAttendee = (updatedAttendee: Attendee) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === updatedAttendee.id ? updatedAttendee : a))
    )
    setSelectedAttendee(null)
  }

  const handleDeleteAttendee = (attendeeId: string) => {
    setAttendees((prev) => prev.filter((a) => a.id !== attendeeId))
  }

  const handleCreateGroup = () => {
    setIsCreateGroupModalOpen(true)
  }

  const handleSaveGroup = (groupName: string) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName,
      attendeeCount: 0
    }
    setGroups((prev) => [...prev, newGroup])
  }

  const handleCreateField = () => {
    setIsCreateCustomFieldModalOpen(true)
  }

  const handleSaveCustomField = (data: {
    fieldName: string
    fieldType: 'Text' | 'Dropdown' | 'PDF'
    visibility: 'Visible to attendees' | 'Invisible'
  }) => {
    const newCustomField: CustomField = {
      id: Date.now().toString(),
      fieldName: data.fieldName,
      fieldType: data.fieldType,
      visibility: data.visibility,
      users: 0
    }
    setCustomFields((prev) => [...prev, newCustomField])
  }

  const handleEditGroup = (groupId: string) => {
    console.log('Edit group:', groupId)
    // TODO: Implement edit group functionality
  }

  const handleDeleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId))
  }

  const handleEditCustomField = (customFieldId: string) => {
    console.log('Edit custom field:', customFieldId)
    // TODO: Implement edit custom field functionality
  }

  const handleDeleteCustomField = (customFieldId: string) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== customFieldId))
  }

  const handleDownload = () => {
    console.log('Download clicked')
    // TODO: Implement download functionality
  }

  const handleGridView = () => {
    console.log('Grid view clicked')
    // TODO: Implement grid view functionality
  }

  const handleFilter = () => {
    console.log('Filter clicked')
    // TODO: Implement filter functionality
  }

  return (
    <div className={hideNavbarAndSidebar ? "" : "min-h-screen overflow-x-hidden bg-white"}>
      {!hideNavbarAndSidebar && (
        <>
          {/* Navbar */}
          <EventHubNavbar
            eventName={eventName}
            isDraft={isDraft}
            onBackClick={onBackClick}
            onSearchClick={handleSearchClick}
            onNotificationClick={handleNotificationClick}
            onProfileClick={handleProfileClick}
            userAvatarUrl={userAvatarUrl}
          />

          {/* Sidebar */}
          <EventHubSidebar
            items={sidebarItems}
            activeItemId="attendee-management"
            onItemClick={handleSidebarItemClick}
            isModalOpen={isCreateProfileModalOpen || isCreateGroupModalOpen || isCreateCustomFieldModalOpen || isUploadModalOpen || isAttendeeSlideoutOpen}
          />
        </>
      )}

      {/* Attendee Management Content */}
      <div className={hideNavbarAndSidebar ? "" : "md:pl-[250px]"}>
        <AttendeesTable
          attendees={attendees}
          groups={groups}
          customFields={customFields}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onUpload={handleUpload}
          onCreateProfile={handleCreateProfile}
          onCreateGroup={handleCreateGroup}
          onCreateField={handleCreateField}
          onEditAttendee={handleEditAttendee}
          onDeleteAttendee={handleDeleteAttendee}
          onEditGroup={handleEditGroup}
          onDeleteGroup={handleDeleteGroup}
          onEditCustomField={handleEditCustomField}
          onDeleteCustomField={handleDeleteCustomField}
          onDownload={handleDownload}
          onGridView={handleGridView}
          onFilter={handleFilter}
        />
      </div>

      {/* Create Profile Modal */}
      <CreateProfileModal
        isOpen={isCreateProfileModalOpen}
        onClose={() => setIsCreateProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onConfirm={handleSaveGroup}
      />

      {/* Create Custom Field Modal */}
      <CreateCustomFieldModal
        isOpen={isCreateCustomFieldModalOpen}
        onClose={() => setIsCreateCustomFieldModalOpen(false)}
        onConfirm={handleSaveCustomField}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadFiles}
        title="Upload attendees"
        description="XLSX files only"
        instructions={[
          'Step 1: Download template',
          'Step 2: Upload attendees'
        ]}
      />

      {/* Attendee Details Slideout */}
      <AttendeeDetailsSlideout
        isOpen={isAttendeeSlideoutOpen}
        onClose={() => {
          setIsAttendeeSlideoutOpen(false)
          setSelectedAttendee(null)
        }}
        attendee={selectedAttendee}
        onSave={handleSaveAttendee}
      />
    </div>
  )
}

export default AttendeeManagementPage

