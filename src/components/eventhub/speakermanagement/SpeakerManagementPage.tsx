import React, { useMemo, useState, useEffect } from 'react'
import { useEventForm } from '../../../contexts/EventFormContext'
import { uploadSpeakerFile, fetchSpeakers, type SpeakerData } from '../../../services/speakerService'
import { fetchTags } from '../../../services/attendeeService'
import EventHubNavbar from '../EventHubNavbar'
import EventHubSidebar from '../EventHubSidebar'
import SpeakersTable from './SpeakersTable'
import SpeakerGroupsTable from './SpeakerGroupsTable'
import CreateSpeakerModal from './CreateSpeakerModal'
import CreateGroupModal from '../attendeemanagement/CreateGroupModal'
import CreateCustomFieldModal from '../attendeemanagement/CreateCustomFieldModal'
import UploadModal from '../../ui/UploadModal'
import SpeakerDetailsSlideout from './SpeakerDetailsSlideout'
import { Speaker, SpeakerTab, Group, CustomField } from './speakerTypes'
import { defaultCards, ContentCard } from '../EventHubContent'
import { InfoCircle, CodeBrowser, Globe01 } from '@untitled-ui/icons-react'
import attendeeSpeakerTemplate from '../../../assets/excel/Attendee Speaker template.xlsx?url'

interface SpeakerManagementPageProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  userAvatarUrl?: string
  onCardClick?: (cardId: string) => void
  hideNavbarAndSidebar?: boolean
}

const SpeakerManagementPage: React.FC<SpeakerManagementPageProps> = ({
  eventName: propEventName,
  isDraft: propIsDraft,
  onBackClick,
  userAvatarUrl,
  onCardClick,
  hideNavbarAndSidebar = false
}) => {
  // Get eventData and createdEvent from context to maintain consistency with EventHubPage navbar
  const { eventData, createdEvent } = useEventForm()
  
  // Prioritize createdEvent data from API (set when clicking event from dashboard), 
  // fallback to eventData from form, then props
  const eventName = createdEvent?.eventName || eventData?.eventName || propEventName || 'Highly important conference of 2025'
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
    if (itemId !== 'speaker-management') {
      const isCardId = defaultCards.some((card) => card.id === itemId)
      if (isCardId && onCardClick) {
        onCardClick(itemId)
      }
    }
  }

  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [activeTab, setActiveTab] = useState<SpeakerTab>('user')
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false)
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)
  const [isCreateCustomFieldModalOpen, setIsCreateCustomFieldModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isSpeakerSlideoutOpen, setIsSpeakerSlideoutOpen] = useState(false)
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [isLoadingSpeakers, setIsLoadingSpeakers] = useState(false)
  const [isLoadingGroups, setIsLoadingGroups] = useState(false)

  const handleUpload = () => {
    setIsUploadModalOpen(true)
  }

  const handleDownloadTemplate = () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = attendeeSpeakerTemplate
    link.download = 'Attendee Speaker template.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleUploadFiles = async (files: File[]) => {
    // Get event UUID from context
    const eventUuid = createdEvent?.uuid
    
    if (!eventUuid) {
      throw new Error('Event UUID is required. Please select an event first.')
    }

    // Upload each file
    for (const file of files) {
      console.log('📤 SpeakerManagementPage: Uploading file:', file.name)
      try {
        const response = await uploadSpeakerFile(file, eventUuid)
        console.log('✅ SpeakerManagementPage: Upload response:', JSON.stringify(response, null, 2))
      } catch (error) {
        console.error('❌ SpeakerManagementPage: Upload error:', error)
        throw error
      }
    }

    // Refresh speakers list after upload
    await loadSpeakers()
    
    setIsUploadModalOpen(false)
  }

  // Load speakers from API
  const loadSpeakers = async () => {
    const eventUuid = createdEvent?.uuid
    
    if (!eventUuid) {
      console.log('No event UUID available, skipping speaker load')
      return
    }

    setIsLoadingSpeakers(true)
    try {
      const speakersData = await fetchSpeakers(eventUuid)
      
      // Map API response to Speaker interface
      const mappedSpeakers: Speaker[] = speakersData.map((speakerData: SpeakerData) => {
        // Get email from API response
        const email = speakerData.email || ''
        
        // Get name from direct fields
        let name = speakerData.name
        if (!name && (speakerData.first_name || speakerData.last_name)) {
          const firstName = speakerData.first_name || ''
          const lastName = speakerData.last_name || ''
          name = `${firstName} ${lastName}`.trim()
        }
        if (!name) {
          name = 'Unknown'
        }
        
        // Get phone number from direct field
        const phoneNumber = speakerData.phone_number || ''
        
        return {
          id: String(speakerData.id || speakerData.uuid || ''),
          name: name,
          firstName: speakerData.first_name,
          lastName: speakerData.last_name,
          email: email,
          phoneNumber: phoneNumber,
          role: speakerData.role || '',
          avatarUrl: speakerData.avatar_url,
          bannerUrl: undefined,
          status: 'active' as Speaker['status'],
          bio: undefined,
          organization: speakerData.organization,
          title: speakerData.title,
          groups: [],
          sessions: undefined,
          socialLinks: undefined
        }
      })

      console.log('✅ SpeakerManagementPage: Mapped speakers:', mappedSpeakers)
      setSpeakers(mappedSpeakers)
    } catch (error) {
      // Error is already handled in fetchSpeakers with toast, but log for debugging
      console.error('Failed to load speakers:', error)
      // Don't re-throw to prevent unhandled promise rejection
      // The toast notification from the service should inform the user
    } finally {
      setIsLoadingSpeakers(false)
    }
  }

  // Load tags from API
  const loadTags = async () => {
    const eventUuid = createdEvent?.uuid
    
    if (!eventUuid) {
      setGroups([])
      return
    }

    setIsLoadingGroups(true)
    try {
      const tagsData = await fetchTags(eventUuid)
      
      // Map API response to Group interface
      // Only include tags that are active (is_active !== false)
      const mappedGroups: Group[] = tagsData
        .filter((tag) => tag.is_active !== false) // Only include active tags
        .map((tag) => ({
          id: tag.uuid,
          name: tag.name,
          speakerCount: 0 // TODO: Calculate speaker count if available from API
        }))

      setGroups(mappedGroups)
    } catch (error) {
      // If it's a 404, tags endpoint might not exist yet - set empty array
      // Other errors are already handled in fetchTags with toast
      if (error instanceof Error && error.message.includes('not found')) {
        setGroups([])
      } else {
        // For other errors, set empty array to prevent stale data
        setGroups([])
      }
    } finally {
      setIsLoadingGroups(false)
    }
  }

  // Load speakers on mount and when event changes
  useEffect(() => {
    if (createdEvent?.uuid) {
      loadSpeakers()
      loadTags()
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
    title?: string
    bio?: string
    group?: string
    avatarUrl?: string
  }) => {
    const newSpeaker: Speaker = {
      id: Date.now().toString(),
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      avatarUrl: data.avatarUrl,
      status: 'active',
      organization: data.organization,
      title: data.title,
      bio: data.bio,
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
    setSpeakers((prev) => [...prev, newSpeaker])
  }

  const handleEditSpeaker = (speakerId: string) => {
    const speaker = speakers.find((s) => s.id === speakerId)
    if (speaker) {
      setSelectedSpeaker(speaker)
      setIsSpeakerSlideoutOpen(true)
    }
  }

  const handleSaveSpeaker = (updatedSpeaker: Speaker) => {
    setSpeakers((prev) =>
      prev.map((s) => (s.id === updatedSpeaker.id ? updatedSpeaker : s))
    )
    setSelectedSpeaker(null)
  }

  const handleDeleteSpeaker = (speakerId: string) => {
    setSpeakers((prev) => prev.filter((s) => s.id !== speakerId))
  }

  const handleCreateGroup = () => {
    setIsCreateGroupModalOpen(true)
  }

  const handleSaveGroup = async (_groupName?: string) => {
    // Reload tags from API after creation
    await loadTags()
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
            activeItemId="speaker-management"
            onItemClick={handleSidebarItemClick}
            isModalOpen={isCreateProfileModalOpen || isCreateGroupModalOpen || isCreateCustomFieldModalOpen || isUploadModalOpen || isSpeakerSlideoutOpen}
          />
        </>
      )}

      {/* Speaker Management Content */}
      <div className={hideNavbarAndSidebar ? "" : "md:pl-[250px]"}>
        {activeTab === 'groups' ? (
          <SpeakerGroupsTable
            groups={groups}
            onCreateGroup={handleCreateGroup}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
            onFilter={handleFilter}
            onTabChange={setActiveTab}
            isLoading={isLoadingGroups}
          />
        ) : (
          <SpeakersTable
            speakers={speakers}
            isLoading={isLoadingSpeakers}
            customFields={customFields}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onUpload={handleUpload}
            onCreateProfile={handleCreateProfile}
            onCreateField={handleCreateField}
            onEditSpeaker={handleEditSpeaker}
            onDeleteSpeaker={handleDeleteSpeaker}
            onEditCustomField={handleEditCustomField}
            onDeleteCustomField={handleDeleteCustomField}
            onDownload={handleDownload}
            onGridView={handleGridView}
            onFilter={handleFilter}
          />
        )}
      </div>

      {/* Create Profile Modal */}
      <CreateSpeakerModal
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
        title="Upload speakers"
        description="XLSX files only"
        instructions={[
          'Step 1: Download template',
          'Step 2: Fill in the data with the required columns',
          'Step 3: Upload the Excel file'
        ]}
        onDownloadTemplate={handleDownloadTemplate}
      />

      {/* Speaker Details Slideout */}
      <SpeakerDetailsSlideout
        isOpen={isSpeakerSlideoutOpen}
        onClose={() => {
          setIsSpeakerSlideoutOpen(false)
          setSelectedSpeaker(null)
        }}
        speaker={selectedSpeaker}
        onSave={handleSaveSpeaker}
      />
    </div>
  )
}

export default SpeakerManagementPage
