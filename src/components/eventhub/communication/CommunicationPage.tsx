import React, { useMemo } from 'react'
import EventHubNavbar from '../EventHubNavbar'
import EventHubSidebar from '../EventHubSidebar'
import CommunicationsTable from './CommunicationsTable'
import BroadcastTypeModal from './BroadcastTypeModal'
import BroadcastComposer from './BroadcastComposer'
import CreateMacroModal from './CreateMacroModal'
import { Communication, Macro } from './communicationTypes'
import type { BroadcastType } from './BroadcastTypeModal'
import { defaultCards, ContentCard } from '../EventHubContent'
import { InfoCircle, CodeBrowser, Globe01 } from '@untitled-ui/icons-react'

interface CommunicationPageProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  userAvatarUrl?: string
  onCardClick?: (cardId: string) => void
}

const CommunicationPage: React.FC<CommunicationPageProps> = ({
  eventName,
  isDraft,
  onBackClick,
  userAvatarUrl,
  onCardClick
}) => {
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
    if (itemId !== 'communications') {
      const isCardId = defaultCards.some((card) => card.id === itemId)
      if (isCardId && onCardClick) {
        onCardClick(itemId)
      }
    }
  }

  // Sample data - in a real app, this would come from an API or state management
  const [communications] = React.useState<Communication[]>([
    {
      id: '1',
      title: 'Attendee Invitation',
      userGroups: [{ id: '1', name: 'Attendees', variant: 'primary' }],
      status: 'sent',
      type: 'email',
      recipients: { sent: 120, total: 122 }
    },
    {
      id: '2',
      title: 'Permissions',
      userGroups: [
        { id: '2', name: 'Speakers', variant: 'primary' },
        { id: '3', name: 'Group 2', variant: 'secondary' }
      ],
      status: 'sent',
      type: 'notification',
      recipients: { sent: 120, total: 122 }
    },
    {
      id: '3',
      title: 'Register reminder 1',
      userGroups: [
        { id: '1', name: 'Speakers', variant: 'primary' },
        { id: '2', name: 'Attendees', variant: 'primary' },
        { id: '3', name: 'Sponsors', variant: 'primary' }
      ],
      status: 'scheduled',
      type: 'email',
      recipients: { sent: 120, total: 122 },
      scheduledDate: '2025-10-24T08:00:00'
    },
    {
      id: '4',
      title: 'Register reminder 2',
      userGroups: [
        { id: '1', name: 'Attendees', variant: 'primary' },
        { id: '2', name: 'not', variant: 'secondary' },
        { id: '3', name: 'Loggedin', variant: 'secondary' }
      ],
      status: 'draft',
      type: 'email',
      recipients: { sent: 120, total: 122 }
    },
    {
      id: '5',
      title: 'Complete profile',
      userGroups: [
        { id: '1', name: 'Attendees', variant: 'primary' },
        { id: '2', name: 'not', variant: 'secondary' },
        { id: '3', name: 'LoggedIn', variant: 'secondary' }
      ],
      status: 'scheduled',
      type: 'notification',
      recipients: { sent: 120, total: 122 },
      scheduledDate: '2025-10-25T10:00:00'
    },
    {
      id: '6',
      title: 'Session reminder',
      userGroups: [
        { id: '1', name: 'Attendees', variant: 'primary' },
        { id: '2', name: 'Speakers', variant: 'primary' },
        { id: '3', name: 'Session 1', variant: 'secondary' }
      ],
      status: 'draft',
      type: 'notification',
      recipients: { sent: 120, total: 122 }
    },
    {
      id: '7',
      title: 'Changes update',
      userGroups: [{ id: '1', name: 'All', variant: 'secondary' }],
      status: 'sent',
      type: 'notification',
      recipients: { sent: 120, total: 122 }
    },
    {
      id: '8',
      title: 'Template test',
      userGroups: [{ id: '1', name: 'User 2', variant: 'primary' }],
      status: 'draft',
      type: 'email',
      recipients: { sent: 120, total: 122 }
    }
  ])

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = React.useState(false)
  const [isCreateMacroModalOpen, setIsCreateMacroModalOpen] = React.useState(false)
  const [showComposer, setShowComposer] = React.useState(false)
  const [selectedBroadcastType, setSelectedBroadcastType] = React.useState<BroadcastType | null>(null)

  // Sample macro data - in a real app, this would come from props or API
  const [macros] = React.useState<Macro[]>([
    { id: '1', macro: '{{firstname}}', column: 'Firstname' },
    { id: '2', macro: '{{lastname}}', column: 'Lastname' },
    { id: '3', macro: '{{firstname_sponsors}}', column: 'Firstname' },
    { id: '4', macro: '{{eventname}}', column: 'Eventname' },
    { id: '5', macro: '{{lastname_sponsor}}', column: 'Lastname' }
  ])

  const handleCreateBroadcast = () => {
    setIsBroadcastModalOpen(true)
  }

  const handleCreateMacro = () => {
    setIsCreateMacroModalOpen(true)
  }

  const handleCreateMacroConfirm = (data: { name: string; source: string }) => {
    console.log('Creating macro:', data)
    // TODO: Implement create macro functionality
    setIsCreateMacroModalOpen(false)
  }

  const handleBroadcastTypeSelect = (type: BroadcastType) => {
    setSelectedBroadcastType(type)
    setIsBroadcastModalOpen(false)
    setShowComposer(true)
  }

  const handleComposerCancel = () => {
    setShowComposer(false)
    setSelectedBroadcastType(null)
  }

  const handleComposerSave = (data: { subject: string; message: string; templateType?: string }) => {
    console.log('Saving broadcast:', { ...data, type: selectedBroadcastType })
    // TODO: Implement save functionality
    // Don't close the composer here, let it switch to view mode
    // setShowComposer(false)
    // setSelectedBroadcastType(null)
  }

  const handleEditCommunication = (communicationId: string) => {
    console.log('Edit communication:', communicationId)
    // TODO: Implement edit communication functionality
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
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
        activeItemId="communications"
        onItemClick={handleSidebarItemClick}
      />

      {/* Communication Content */}
      <div className="md:pl-[250px]">
        {showComposer ? (
          <BroadcastComposer
            onCancel={handleComposerCancel}
            onSave={handleComposerSave}
            onSend={(data) => {
                console.log('Sending broadcast:', data)
                // TODO: Implement send functionality
                setShowComposer(false)
                setSelectedBroadcastType(null)
            }}
            macros={macros}
            templateType="late-message"
          />
        ) : (
          <CommunicationsTable
            communications={communications}
            onCreateBroadcast={handleCreateBroadcast}
            onCreateMacro={handleCreateMacro}
            onEditCommunication={handleEditCommunication}
          />
        )}
      </div>

      {/* Broadcast Type Modal */}
      <BroadcastTypeModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onSelect={handleBroadcastTypeSelect}
      />

      <CreateMacroModal
        isOpen={isCreateMacroModalOpen}
        onClose={() => setIsCreateMacroModalOpen(false)}
        onConfirm={handleCreateMacroConfirm}
      />
    </div>
  )
}

export default CommunicationPage

