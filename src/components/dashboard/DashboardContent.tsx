import React from 'react'
import SummaryCards from './SummaryCards'
import SearchAndFilterBar from './SearchAndFilterBar'
import EventsTable from './EventsTable'

interface DashboardContentProps {
  title?: string
  onNewEventClick?: () => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  dateRange?: string
  onDateRangeClick?: () => void
  onFilterClick?: () => void
  onEditEvent?: (eventId: string) => void
  onSortEvents?: (column: string) => void
  totalEvents?: number
  liveEvents?: number
  eventDrafts?: number
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  title = 'Web Submit Events',
  onNewEventClick,
  searchValue,
  onSearchChange,
  dateRange,
  onDateRangeClick,
  onFilterClick,
  onEditEvent,
  onSortEvents,
  totalEvents,
  liveEvents,
  eventDrafts
}) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary-dark">
          {title}
        </h1>
        <button
          type="button"
          onClick={onNewEventClick}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          <span>+</span>
          <span>New event</span>
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        totalEvents={totalEvents}
        liveEvents={liveEvents}
        eventDrafts={eventDrafts}
      />

      {/* Search and Filter Bar */}
      <SearchAndFilterBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        dateRange={dateRange}
        onDateRangeClick={onDateRangeClick}
        onFilterClick={onFilterClick}
      />

      {/* Events Table */}
      <EventsTable
        onEditClick={onEditEvent}
        onSort={onSortEvents}
      />
    </div>
  )
}

export default DashboardContent

