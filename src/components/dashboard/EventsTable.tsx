import React, { useMemo, useState } from 'react'
import { Edit05 } from '@untitled-ui/icons-react'
import { DividerLineTable, type DividerLineTableColumn, type DividerLineTableSortDescriptor } from '../ui/untitled'

export interface Event {
  id: string
  name: string
  status: 'Live' | 'Draft'
  attendanceType: 'Online' | 'Offline' | 'Hybrid'
  registrations: number
  eventDate: string
  createdBy: string
}

// Default events data
export const defaultEvents: Event[] = [
  {
    id: '1',
    name: 'Global Tech Innovation Summit 2025',
    status: 'Live',
    attendanceType: 'Online',
    registrations: 300,
    eventDate: 'Jan 13, 2025',
    createdBy: 'Olivia Rhye'
  },
  {
    id: '2',
    name: 'Healthcare Leaders Conference...',
    status: 'Live',
    attendanceType: 'Offline',
    registrations: 400,
    eventDate: 'Jan 15, 2025',
    createdBy: 'Phoenix Baker'
  },
  {
    id: '3',
    name: 'Future of Design Expo & Awards',
    status: 'Live',
    attendanceType: 'Hybrid',
    registrations: 200,
    eventDate: 'Jan 20, 2025',
    createdBy: 'Lana Steiner'
  },
  {
    id: '4',
    name: 'Global Tech Innovation Summit 2025',
    status: 'Draft',
    attendanceType: 'Online',
    registrations: 100,
    eventDate: 'Feb 1, 2025',
    createdBy: 'Demi Wilkinson'
  }
]

interface EventsTableProps {
  events?: Event[]
  onEditClick?: (eventId: string) => void
  onSort?: (column: string) => void
  searchValue?: string
}

const StatusBadge: React.FC<{ status: 'Live' | 'Draft' }> = ({ status }) => {
  const styles = {
    Live: 'bg-green-100 text-green-700',
    Draft: 'bg-red-100 text-red-700'
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

const AttendanceTypeBadge: React.FC<{ type: 'Online' | 'Offline' | 'Hybrid' }> = ({ type }) => {
  const styles = {
    Online: 'bg-purple-100 text-purple-700',
    Offline: 'bg-pink-100 text-pink-700',
    Hybrid: 'bg-blue-100 text-blue-700'
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[type]}`}>
      {type}
    </span>
  )
}

const EventsTable: React.FC<EventsTableProps> = ({
  events = defaultEvents,
  onEditClick,
  onSort,
  searchValue = ''
}) => {
  const [sortDescriptor, setSortDescriptor] = useState<DividerLineTableSortDescriptor | undefined>()

  const handleSortChange = (descriptor: DividerLineTableSortDescriptor) => {
    setSortDescriptor(descriptor)
    onSort?.(descriptor.column)
  }

  const columns: Array<DividerLineTableColumn<Event>> = useMemo(
    () => [
      {
        id: 'name',
        header: 'Event name',
        sortable: true,
        sortAccessor: (item) => item.name,
        render: (item) => (
          <div className="font-medium text-slate-900">{item.name}</div>
        )
      },
      {
        id: 'status',
        header: 'Status',
        sortable: true,
        sortAccessor: (item) => item.status,
        render: (item) => <StatusBadge status={item.status} />
      },
      {
        id: 'attendanceType',
        header: 'Attendance type',
        sortable: true,
        sortAccessor: (item) => item.attendanceType,
        render: (item) => <AttendanceTypeBadge type={item.attendanceType} />
      },
      {
        id: 'registrations',
        header: 'Registrations',
        sortable: true,
        sortAccessor: (item) => item.registrations,
        render: (item) => <div>{item.registrations}</div>
      },
      {
        id: 'eventDate',
        header: 'Event date',
        sortable: true,
        sortAccessor: (item) => item.eventDate,
        render: (item) => <div>{item.eventDate}</div>
      },
      {
        id: 'createdBy',
        header: 'Created by',
        sortable: true,
        sortAccessor: (item) => item.createdBy,
        render: (item) => <div>{item.createdBy}</div>
      },
      {
        id: 'actions',
        header: '',
        sortable: false,
        align: 'right',
        render: (item) => (
          <button
            type="button"
            onClick={() => onEditClick?.(item.id)}
            className="text-[#6938EF] hover:text-[#5925DC] transition-colors"
            aria-label={`Edit ${item.name}`}
          >
            <Edit05 className="h-4 w-5 text-[#A4A7AE]" />
          </button>
        )
      }
    ],
    [onEditClick]
  )

  return (
    <DividerLineTable
      data={events}
      columns={columns}
      getRowKey={(item) => item.id}
      sortDescriptor={sortDescriptor}
      onSortChange={handleSortChange}
      size="md"
      emptyState={
        <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-500">
          {searchValue.trim() 
            ? `No events found matching "${searchValue}".` 
            : 'No events available.'}
        </div>
      }
    />
  )
}

export default EventsTable
