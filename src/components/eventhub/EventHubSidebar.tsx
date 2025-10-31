import React, { useState } from 'react'

interface SidebarItem {
  id: string
  label: string
  icon?: string
}

interface EventHubSidebarProps {
  items?: SidebarItem[]
  activeItemId?: string
  onItemClick?: (itemId: string) => void
}

const defaultItems: SidebarItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'event-website', label: 'Event website' },
  { id: 'event-hub', label: 'Event Hub' }
]

const EventHubSidebar: React.FC<EventHubSidebarProps> = ({
  items = defaultItems,
  activeItemId = 'event-hub',
  onItemClick
}) => {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)

  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId)
    }
  }

  return (
    <aside style={{
      width: '250px',
      backgroundColor: '#f3f4f6', // Light gray
      height: '100vh',
      paddingTop: '80px', // Account for fixed navbar
      borderRight: '1px solid #e5e7eb',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 999
    }}>
      <div style={{ padding: '20px 0' }}>
        {items.map((item) => {
          const isActive = item.id === activeItemId
          const isHovered = item.id === hoveredItemId

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
              style={{
                padding: '14px 24px',
                cursor: 'pointer',
                backgroundColor: isActive ? '#e5e7eb' : isHovered ? '#e5e7eb' : 'transparent',
                borderLeft: isActive ? '4px solid #a78bfa' : '4px solid transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {item.icon && (
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
              )}
              <span style={{
                fontSize: '15px',
                fontWeight: isActive ? '600' : '400',
                color: '#374151'
              }}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default EventHubSidebar

