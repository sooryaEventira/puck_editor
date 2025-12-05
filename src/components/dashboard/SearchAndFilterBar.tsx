import React from 'react'
import { SearchLg, FilterLines } from '@untitled-ui/icons-react'
import { DateRangePicker, type DateRange } from '../ui/untitled'

interface SearchAndFilterBarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange) => void
  onFilterClick?: () => void
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchValue = '',
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onFilterClick
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
      {/* Search Input */}
      <div className="w-full sm:w-[500px] bg-white overflow-hidden rounded-lg border border-[#D5D7DA] outline outline-1 outline-[#D5D7DA] outline-offset-[-1px] inline-flex items-center justify-start gap-2 shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] px-3 py-2">
        <div className="flex-1 flex items-center justify-start gap-2 min-w-0">
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
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-[#717680] text-[#181D27] leading-6 break-words min-w-0"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
          />
        </div>
      </div>

      {/* Right Side - Date Range Filter and Filter Button */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Date Range Filter */}
        <DateRangePicker
          id="date-range-picker"
          value={dateRange}
          onChange={(range) => onDateRangeChange?.(range)}
          placeholder="Select date range"
        />

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

