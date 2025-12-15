import { useMemo } from 'react'
import { SearchLg, FilterLines } from '@untitled-ui/icons-react'

export interface TableTab {
  id: string
  label: string
}

interface TableHeaderProps {
  tabs: TableTab[]
  activeTabId: string
  searchQuery: string
  searchPlaceholder?: string
  onTabChange: (tabId: string) => void
  onSearchChange: (query: string) => void
  onFilterClick?: () => void
  showFilter?: boolean
  filterLabel?: string
  customActions?: React.ReactNode
}

export const useTableHeader = ({
  tabs,
  activeTabId,
  searchQuery,
  searchPlaceholder = 'Search...',
  onTabChange,
  onSearchChange,
  onFilterClick,
  showFilter = true,
  filterLabel = 'Filter',
  customActions
}: TableHeaderProps) => {
  return useMemo(
    () => {
      const tableHeaderLeading = (
        <div className="flex gap-6 border-b border-slate-200 -mb-6 -ml-6">
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`pb-3 px-1 text-[15px] font-medium font-semibold transition-colors relative whitespace-nowrap ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      )

      const tableHeaderActions = (
        <div className="flex w-full flex-row items-center gap-2 md:w-auto md:gap-4 md:-mb-4 md:-mr-6 -mt-6">
          <div className="flex flex-1 md:flex-none w-full md:w-auto max-w-2xl border border-slate-200 rounded-md overflow-hidden">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full md:w-[350px] px-3 py-2 text-sm text-slate-600 focus:outline-none min-w-0"
              aria-label={searchPlaceholder}
            />
            <button
              type="button"
              className="inline-flex h-full -mr-1 items-center justify-center bg-primary px-3 py-2.5 text-white transition 
              hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Search"
            >
              <SearchLg className="h-4 w-4 " strokeWidth={2} />
            </button>
          </div>
          {customActions}
          {showFilter && (
            <button
              type="button"
              onClick={onFilterClick}
              className="inline-flex shrink-0 h-10 w-10 items-center justify-center rounded-md border border-slate-200 
                bg-white text-slate-500 transition hover:border-primary/40 hover:text-primary focus:outline-none 
                focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={filterLabel}
            >
              <FilterLines className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>
      )

      return {
        leading: tableHeaderLeading,
        actions: tableHeaderActions
      }
    },
    [tabs, activeTabId, searchQuery, searchPlaceholder, onTabChange, onSearchChange, onFilterClick, showFilter, filterLabel, customActions]
  )
}

