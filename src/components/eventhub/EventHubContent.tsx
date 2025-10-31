import React from 'react'

interface CardItem {
  label: string
  value: string
}

interface ContentCard {
  id: string
  title: string
  items: CardItem[]
  icon?: string
}

interface EventHubContentProps {
  title?: string
  cards?: ContentCard[]
}

const defaultCards: ContentCard[] = [
  {
    id: 'communications',
    title: 'Communications',
    items: [
      { label: '3 broadcasts sent this week', value: '3' },
      { label: '2 schedules announcements', value: '2' }
    ]
  },
  {
    id: 'resource-management',
    title: 'Resource Management',
    items: [
      { label: '3 folders', value: '3' },
      { label: '12 files', value: '12' }
    ]
  },
  {
    id: 'attendee-management',
    title: 'Attendee Management',
    items: [
      { label: '152 registered', value: '152' },
      { label: '120 logged in', value: '120' }
    ]
  },
  {
    id: 'attendee-moderators',
    title: 'Attendee Moderators',
    items: [
      { label: '3 blocks', value: '3' }
    ]
  },
  {
    id: 'schedule-session',
    title: 'Schedule/Session',
    items: [
      { label: '24 sessions', value: '24' }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    items: [
      { label: '12% more registered', value: '+12%' }
    ]
  },
  {
    id: 'website-settings',
    title: 'Website Settings',
    items: [
      { label: 'color and font', value: '' }
    ]
  }
]

const EventHubContent: React.FC<EventHubContentProps> = ({
  title = 'Event Hub',
  cards = defaultCards
}) => {
  return (
    <main style={{
      marginLeft: '250px', // Account for fixed sidebar
      marginTop: '64px', // Account for fixed navbar
      padding: '32px',
      backgroundColor: '#ffffff',
      minHeight: 'calc(100vh - 64px)',
      overflow: 'auto'
    }}>
      {/* Title */}
      <h1 style={{
        fontSize: '32px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '32px'
      }}>
        {title}
      </h1>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        maxWidth: '1400px'
      }}>
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              border: '1px solid #e5e7eb'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Card Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              {card.icon && (
                <span style={{ fontSize: '24px' }}>{card.icon}</span>
              )}
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                margin: 0
              }}>
                {card.title}
              </h3>
            </div>

            {/* Card Items */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {card.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: '14px',
                    color: '#6b7280'
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default EventHubContent

