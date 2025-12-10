import React from 'react'
import clsx from 'clsx'
import { ArrowNarrowLeft } from '@untitled-ui/icons-react'

interface PageSidebarProps {
  pages: Array<{ id: string; name: string }>
  currentPage: string
  currentPageName: string
  onPageSelect: (pageId: string) => void
  onAddPage: () => void
  onManagePages: () => void
  onShowComponentSidebar?: () => void
  onBackClick?: () => void
}

const PageSidebar: React.FC<PageSidebarProps> = ({
  pages,
  currentPage,
  currentPageName,
  onPageSelect,
  onShowComponentSidebar,
  onBackClick
}) => {
  // Debug log
  React.useEffect(() => {
    console.log('📋 PageSidebar rendered - onBackClick:', typeof onBackClick, onBackClick ? 'provided' : 'missing')
  }, [onBackClick])

  return (
  <aside className="flex h-full w-[280px] min-w-[280px] flex-shrink-0 flex-col border-r border-slate-200 bg-white">
    <header className="px-4 pb-3 pt-2">
      {/* First row: Left arrow */}
      <div className="flex items-center mb-2">
        <div className="flex items-center gap-2">
          {onBackClick && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('🔙 Back button clicked in PageSidebar')
                  onBackClick()
                }}
                className="flex h-6 w-6 items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                aria-label="Go back"
              >
                <ArrowNarrowLeft className="h-5 w-5" />
              </button>
              <div className="h-4 w-px bg-slate-300" />
            </>
          )}
          {onShowComponentSidebar && (
            <button
              type="button"
              onClick={onShowComponentSidebar}
              className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
              aria-label="Show component sidebar"
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {/* Second row: Website Pages title */}
      <h2 className="text-[13px] font-bold uppercase tracking-[0.05em] text-slate-700 mt-4">
        Website Pages
      </h2>
    </header>

    <div className="flex-1 overflow-y-auto px-3">
      {[...pages]
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
        .map((page) => {
          const isActive = page.id === currentPage || page.name === currentPageName
          return (
            <button
              key={page.id}
              type="button"
              onClick={() => onPageSelect(page.id)}
              className={clsx(
                'mb-1 flex w-full items-center rounded-md px-3 py-2 text-sm relative overflow-hidden',
                'transition-all duration-300 ease-in-out',
                'transform',
                isActive
                  ? 'bg-[#6938EF]/10 font-semibold text-[#6938EF] shadow-sm scale-[1.02]'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-normal hover:scale-[1.01]'
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6938EF] rounded-r-full transition-all duration-300 ease-in-out" />
              )}
              <span className={clsx(
                'truncate relative z-10 transition-all duration-300',
                isActive ? 'ml-1' : 'ml-0'
              )}>
                {page.name}
              </span>
            </button>
          )
        })}
    </div>
  </aside>
  )
}

export default PageSidebar

