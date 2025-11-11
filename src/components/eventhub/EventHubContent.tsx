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
  onCardClick?: (cardId: string) => void
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
  cards = defaultCards,
  onCardClick
}) => {
  return (
    <main className="mt-16 min-h-[calc(100vh-4rem)] w-full overflow-auto bg-white px-4 pb-10 pt-8 md:ml-[250px] md:px-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-800 md:text-[32px]">{title}</h1>
      <div className="mx-auto grid w-full max-w-[1400px] gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onCardClick?.(card.id)}
            className="group flex h-full w-full flex-col rounded-xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <div className="mb-4 flex items-center gap-3">
              {card.icon && (
                <span className="text-2xl" aria-hidden="true">{card.icon}</span>
              )}
              <h3 className="text-lg font-semibold text-slate-700">{card.title}</h3>
            </div>
            <div className="flex flex-col gap-2">
              {card.items.map((item, index) => (
                <span key={index} className="text-sm text-slate-500">
                  {item.label}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </main>
  )
}

export default EventHubContent

