import React from 'react'
import clsx from 'clsx'
import { Settings01 } from '@untitled-ui/icons-react'

interface PageSidebarProps {
  pages: Array<{ id: string; name: string }>
  currentPage: string
  currentPageName: string
  onPageSelect: (pageId: string) => void
  onAddPage: () => void
  onManagePages: () => void
  onShowComponentSidebar?: () => void
}

const PageSidebar: React.FC<PageSidebarProps> = ({
  pages,
  currentPage,
  currentPageName,
  onPageSelect,
  onAddPage,
  onManagePages,
  onShowComponentSidebar
}) => (
  <aside className="flex h-full w-[280px] min-w-[280px] flex-shrink-0 flex-col border-r border-slate-200 bg-white">
    <header className="flex items-center justify-between px-4 pb-3 pt-2">
      <div className="flex items-center gap-2">
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
        <h2 className="text-[13px] font-bold uppercase tracking-[0.05em] text-slate-700">
          Website Pages
        </h2>
      </div>
      <button
        type="button"
        onClick={onAddPage}
        className="flex h-5 w-5 items-center justify-center text-slate-500 transition hover:text-slate-700"
        aria-label="Add page"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
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
                'mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-slate-700 transition',
                isActive
                  ? 'bg-slate-100 font-medium'
                  : 'hover:bg-slate-50'
              )}
            >
              <span className="truncate">{page.name}</span>
              {isActive && (
                <Settings01 className="h-4 w-4 text-slate-400" aria-hidden="true" />
              )}
            </button>
          )
        })}
    </div>

    <div className="border-t border-slate-100 p-4">
      <button
        type="button"
        onClick={onManagePages}
        className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
      >
        Manage pages
      </button>
    </div>
  </aside>
)

export default PageSidebar

