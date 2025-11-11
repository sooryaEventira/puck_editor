import React from 'react'
import { InfoCircle, CodeBrowser, Globe01 } from '@untitled-ui/icons-react'

interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
}

interface EventHubSidebarProps {
  items?: SidebarItem[]
  activeItemId?: string
  onItemClick?: (itemId: string) => void
}

const defaultItems: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: <InfoCircle className="h-5 w-5" /> },
  { id: 'event-website', label: 'Event website', icon: <CodeBrowser className="h-5 w-5" /> },
  { id: 'event-hub', label: 'Event Hub', icon: <Globe01 className="h-5 w-5" /> }
]

const EventHubSidebar: React.FC<EventHubSidebarProps> = ({
  items = defaultItems,
  activeItemId = 'event-hub',
  onItemClick
}) => {
  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId)
    }
    setIsMobileOpen(false)
  }

  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev)
  }

  return (
    <>
      <button
        type="button"
        onClick={toggleMobileSidebar}
        className="fixed left-4 top-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden"
        aria-label="Toggle navigation"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6H21" />
          <path d="M3 12H21" />
          <path d="M3 18H21" />
        </svg>
      </button>

      <aside
        className={`fixed left-0 top-0 z-[999] h-screen w-[250px] border-r border-slate-200 bg-slate-100 pt-20 transition-transform duration-300 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="py-5">
          {items.map((item) => {
            const isActive = item.id === activeItemId

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`group flex w-full transform items-center gap-3 border-l-4 px-6 py-3.5 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  isActive
                    ? 'border-l-primary bg-white shadow-md translate-x-[2px] font-semibold text-slate-700'
                    : 'border-l-transparent text-slate-600 hover:border-l-slate-300 hover:bg-slate-100 hover:text-slate-700 hover:translate-x-[2px] hover:shadow-md'
                }`}
              >
                {item.icon && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/60 text-slate-500 group-hover:text-primary" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className="justify-start text-base font-semibold font-['Inter'] leading-6 transition-colors duration-200 ease-out group-hover:text-slate-700">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </aside>
    </>
  )
}

export default EventHubSidebar

