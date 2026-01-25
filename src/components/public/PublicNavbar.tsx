import React from 'react'

export interface PublicNavbarItem {
  label: string
  path: string
}

interface PublicNavbarProps {
  eventName?: string
  logoUrl?: string | null
  items: PublicNavbarItem[]
  activePath?: string
  onNavigate: (path: string) => void
}

const PublicNavbar: React.FC<PublicNavbarProps> = ({
  eventName,
  logoUrl,
  items,
  activePath,
  onNavigate
}) => {
  return (
    <header className="fixed top-0 left-0 z-[1000] w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate(items[0]?.path ?? '/')}
          className="flex min-w-0 items-center gap-3 text-left"
          aria-label="Go to home"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Event logo"
              className="h-9 w-9 rounded-md object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="h-9 w-9 rounded-md bg-slate-100 ring-1 ring-slate-200" />
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900">
              {eventName || 'Event'}
            </div>
           
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {items.map((item) => {
            const isActive = activePath === item.path
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={[
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                ].join(' ')}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Mobile: simple menu as horizontal scroll */}
        <nav className="flex flex-1 items-center justify-end gap-2 overflow-x-auto md:hidden">
          {items.map((item) => {
            const isActive = activePath === item.path
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={[
                  'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700'
                ].join(' ')}
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default PublicNavbar

