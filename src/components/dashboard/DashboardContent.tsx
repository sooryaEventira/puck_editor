import React from 'react'
import SummaryCards from './SummaryCards'
import SearchAndFilterBar from './SearchAndFilterBar'
import EventsTable from './EventsTable'
import type { Event } from './EventsTable'
import type { DateRange } from '../ui/untitled'

interface DashboardContentProps {
  title?: string
  onNewEventClick?: () => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange) => void
  onFilterClick?: () => void
  onEditEvent?: (eventId: string) => void
  onDeleteEvent?: (eventId: string) => void | Promise<void>
  onEventRowClick?: (event: Event) => void
  onSortEvents?: (column: string) => void
  totalEvents?: number
  liveEvents?: number
  eventDrafts?: number
  events?: Event[]
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  title = 'Web Submit Events',
  onNewEventClick,
  searchValue,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onFilterClick,
  onEditEvent,
  onDeleteEvent,
  onEventRowClick,
  onSortEvents,
  totalEvents,
  liveEvents,
  eventDrafts,
  events
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-primary-dark">
          {title}
        </h1>
        <button
          type="button"
          onClick={onNewEventClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
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
        onDateRangeChange={onDateRangeChange}
        onFilterClick={onFilterClick}
      />

      {/* Events Table */}
      <EventsTable
        events={events}
        onEditClick={onEditEvent}
        onDeleteClick={onDeleteEvent}
        onRowClick={onEventRowClick}
        onSort={onSortEvents}
        searchValue={searchValue}
      />
    </div>
  )
}

export default DashboardContent

