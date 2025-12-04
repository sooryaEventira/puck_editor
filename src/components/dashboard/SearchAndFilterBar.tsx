import React from 'react'
import { SearchLg, Calendar, FilterLines } from '@untitled-ui/icons-react'

interface SearchAndFilterBarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  dateRange?: string
  onDateRangeClick?: () => void
  onFilterClick?: () => void
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchValue = '',
  onSearchChange,
  dateRange = 'Jan 10, 2025 – Jan 16, 2025',
  onDateRangeClick,
  onFilterClick
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      {/* Search Input */}
      <div className="bg-white overflow-hidden rounded-lg border border-[#D5D7DA] inline-flex items-center justify-start gap-2 shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] px-3 py-2" style={{ outline: '1px #D5D7DA solid', outlineOffset: '-1px', width: '400px' }}>
        <div className="flex-1 flex items-center justify-start gap-2">
          {/* Icon Container */}
          <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center flex-shrink-0">
            <SearchLg className="w-[15px] h-[15px] text-[#A4A7AE]" strokeWidth={1.67} />
          </div>

          {/* Input */}
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search events"
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-[#717680] text-[#181D27] leading-6 break-words"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
          />
        </div>
      </div>

      {/* Right Side - Date Range Filter and Filter Button */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Date Range Filter */}
        <button
          type="button"
          onClick={onDateRangeClick}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D5D7DA] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          <Calendar className="h-4 w-4 text-slate-500" />
          <span>{dateRange}</span>
        </button>

        {/* Filter Button */}
        <button
          type="button"
          onClick={onFilterClick}
          className="inline-flex items-center justify-center rounded-lg border border-[#D5D7DA] bg-white p-2 hover:bg-slate-50 transition-colors flex-shrink-0"
          aria-label="Filter"
        >
          <FilterLines className="h-5 w-5 text-slate-500" />
        </button>
      </div>
    </div>
  )
}

export default SearchAndFilterBar

