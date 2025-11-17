import React, { useState, useMemo } from 'react'
import EventHubNavbar from './EventHubNavbar'
import EventHubSidebar from './EventHubSidebar'
import EventHubContent from './EventHubContent'
import { defaultCards, ContentCard } from './EventHubContent'
import { InfoCircle, CodeBrowser, Globe01 } from '@untitled-ui/icons-react'

interface EventHubPageProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  userAvatarUrl?: string
  onCardClick?: (cardId: string) => void
}

const EventHubPage: React.FC<EventHubPageProps> = ({
  eventName,
  isDraft,
  onBackClick,
  userAvatarUrl,
  onCardClick
}) => {
  const [activeSection, setActiveSection] = useState('event-hub')

  const handleSearchClick = () => {
    console.log('Search clicked')
    // TODO: Implement search functionality
  }

  const handleNotificationClick = () => {
    console.log('Notification clicked')
    // TODO: Implement notification functionality
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
    // TODO: Implement profile functionality
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
    setActiveSection(itemId)
    
    // If clicking on event-hub parent, just stay on the cards grid
    if (itemId === 'event-hub') {
      return
    }
    
    // Check if this is a card ID and trigger onCardClick
    const isCardId = defaultCards.some((card) => card.id === itemId)
    if (isCardId && onCardClick) {
      onCardClick(itemId)
    }
  }

  // Only show EventHubContent (cards grid) when on the main event-hub page
  // Hide it when navigating to any card sub-item
  const showCardsGrid = activeSection === 'event-hub'

  return (
    <div className="h-screen overflow-hidden bg-white">
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
        activeItemId={activeSection}
        onItemClick={handleSidebarItemClick}
      />

      {/* Content - Only show cards grid when on event-hub main page */}
      {showCardsGrid && <EventHubContent onCardClick={onCardClick} />}
    </div>
  )
}

export default EventHubPage

