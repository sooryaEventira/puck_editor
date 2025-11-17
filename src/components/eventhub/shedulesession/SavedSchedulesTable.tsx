import React, { useMemo, useState, useCallback } from 'react'
import { SearchLg, Download01, FilterLines, Pencil01, Trash03, DotsVertical ,Upload01} from '@untitled-ui/icons-react'
import {
  Badge,
  DividerLineTable,
  type DividerLineTableColumn,
  type DividerLineTableSortDescriptor
} from '../../ui/untitled'
import { SavedSchedule } from './sessionTypes'

type TableTab = 'schedules' | 'tags'

type TableRowData = {
  schedule: SavedSchedule
  index: number
}

interface SelectAllCheckboxProps {
  checked: boolean
  indeterminate: boolean
  onChange: (checked: boolean) => void
  ariaLabel: string
}

const SelectAllCheckbox: React.FC<SelectAllCheckboxProps> = ({
  checked,
  indeterminate,
  onChange,
  ariaLabel
}) => {
  const checkboxRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
      aria-label={ariaLabel}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  )
}

interface SavedSchedulesTableProps {
  schedules: SavedSchedule[]
  onCreateSchedule: () => void
  onEditSchedule?: (scheduleId: string) => void
}

const SavedSchedulesTable: React.FC<SavedSchedulesTableProps> = ({
  schedules,
  onCreateSchedule,
  onEditSchedule
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TableTab>('schedules')
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<Set<string>>(new Set())
  const [sortDescriptors, setSortDescriptors] = useState<
    Record<TableTab, DividerLineTableSortDescriptor | undefined>
  >({
    schedules: { column: 'name', direction: 'ascending' },
    tags: { column: 'title', direction: 'ascending' }
  })
  const searchPlaceholder =
    activeTab === 'tags' ? 'Search tags' : 'Search schedules'

  const filteredSchedules = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return schedules

    return schedules.filter((schedule) => {
      const { session } = schedule
      const haystack = [
        schedule.name,
        session.location,
        session.sessionType,
        session.title,
        ...session.tags
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [searchQuery, schedules])

  const visibleScheduleIds = useMemo(
    () => filteredSchedules.map((schedule) => schedule.id),
    [filteredSchedules]
  )

  const allVisibleSelected =
    visibleScheduleIds.length > 0 &&
    visibleScheduleIds.every((id) => selectedScheduleIds.has(id))

  const partiallySelected =
    !allVisibleSelected &&
    visibleScheduleIds.some((id) => selectedScheduleIds.has(id))

  const handleToggleAllVisible = useCallback(
    (checked: boolean) => {
      setSelectedScheduleIds((previous) => {
        const next = new Set(previous)

        visibleScheduleIds.forEach((id) => {
          if (checked) {
            next.add(id)
          } else {
            next.delete(id)
          }
        })

        return next
      })
    },
    [visibleScheduleIds]
  )

  const handleToggleRow = useCallback((scheduleId: string, checked: boolean) => {
    setSelectedScheduleIds((previous) => {
      const next = new Set(previous)
      if (checked) {
        next.add(scheduleId)
      } else {
        next.delete(scheduleId)
      }
      return next
    })
  }, [])

  const tableRows = useMemo<TableRowData[]>(
    () => filteredSchedules.map((schedule, index) => ({ schedule, index })),
    [filteredSchedules]
  )

  const formatScheduleName = useCallback(
    (schedule: SavedSchedule, index: number) => schedule.name || `Schedule ${index + 1}`,
    []
  )

  const scheduleColumns = useMemo<DividerLineTableColumn<TableRowData>[]>(() => {
    return [
      {
        id: 'name',
        header: (
          <div className="flex items-center gap-2">
            <SelectAllCheckbox
              checked={allVisibleSelected}
              indeterminate={partiallySelected}
              onChange={handleToggleAllVisible}
              ariaLabel="Select all schedules"
            />
            <span>Schedule name</span>
          </div>
        ),
        sortable: true,
        sortAccessor: ({ schedule, index }) => schedule.name ?? `Schedule ${index + 1}`,
        render: ({ schedule, index }) => (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
              aria-label={`Select ${formatScheduleName(schedule, index)}`}
              checked={selectedScheduleIds.has(schedule.id)}
              onChange={(event) => handleToggleRow(schedule.id, event.target.checked)}
            />
            <span>{formatScheduleName(schedule, index)}</span>
          </div>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        align: 'right',
        render: ({ schedule }) => (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onEditSchedule?.(schedule.id)}
              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={`Edit ${schedule.name}`}
            >
              <Pencil01 className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:border-rose-400 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60"
              aria-label={`Delete ${schedule.name}`}
            >
              <Trash03 className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        )
      }
    ]
  }, [
    allVisibleSelected,
    formatScheduleName,
    handleToggleAllVisible,
    handleToggleRow,
    onEditSchedule,
    partiallySelected,
    selectedScheduleIds
  ])

  const tagsColumns = useMemo<DividerLineTableColumn<TableRowData>[]>(() => {
    return [
      {
        id: 'tags',
        header: (
          <div className="flex items-center gap-2">
            <SelectAllCheckbox
              checked={allVisibleSelected}
              indeterminate={partiallySelected}
              onChange={handleToggleAllVisible}
              ariaLabel="Select all tags"
            />
            <span>Tags &amp; Location</span>
          </div>
        ),
        sortable: true,
        sortAccessor: ({ schedule }) => {
          const tags = schedule.session.tags ?? []
          if (tags.length > 0) {
            return tags[0]
          }
          return schedule.session.location ?? ''
        },
        render: ({ schedule }) => {
          const tags = schedule.session.tags ?? []
          const location = schedule.session.location?.trim()

          return (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
                aria-label={`Select tags for ${schedule.name}`}
                checked={selectedScheduleIds.has(schedule.id)}
                onChange={(event) => handleToggleRow(schedule.id, event.target.checked)}
              />
              <div className="flex flex-wrap items-center gap-2">
                {tags.length > 0 ? (
                  tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="primary">
                      {tag}
                    </Badge>
                  ))
                ) : location ? (
                  <Badge variant="warning">{location}</Badge>
                ) : (
                  <Badge variant="muted">Untitled</Badge>
                )}
              </div>
            </div>
          )
        }
      },
      {
        id: 'title',
        header: 'Schedule title',
        sortable: true,
        sortAccessor: ({ schedule, index }) => schedule.name ?? `Schedule ${index + 1}`,
        render: ({ schedule, index }) => (
          <span className="text-sm text-slate-600">
            {formatScheduleName(schedule, index)}
          </span>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        align: 'right',
        render: ({ schedule }) => (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onEditSchedule?.(schedule.id)}
              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={`Edit tags for ${schedule.name}`}
            >
              <Pencil01 className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:border-rose-400 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60"
              aria-label={`Delete tags for ${schedule.name}`}
            >
              <Trash03 className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        )
      }
    ]
  }, [
    allVisibleSelected,
    formatScheduleName,
    handleToggleAllVisible,
    handleToggleRow,
    onEditSchedule,
    partiallySelected,
    selectedScheduleIds
  ])

  const currentColumns = activeTab === 'schedules' ? scheduleColumns : tagsColumns

  const emptyState = (
    <div className="flex min-h-[280px] items-center justify-center px-6 py-10 text-sm text-slate-500">
      {schedules.length === 0
        ? 'No schedules have been saved yet.'
        : 'No schedules match your search.'}
    </div>
  )

  const tableHeaderLeading = (
    <div className="inline-flex items-center overflow-hidden rounded-t-xl border border-slate-200 bg-white -mb-6 -ml-6">
      {(['schedules', 'tags'] as const).map((tab) => {
        const isActive = activeTab === tab
        const label = tab === 'schedules' ? 'Schedules' : 'Tags & Location'

        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border px-4 py-2 text-sm font-semibold transition h-10 ${
              isActive
                ? 'border-primary bg-white text-primary '
                : 'border-transparent bg-slate-100 text-slate-500 hover:text-primary'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )

  const tableHeaderActions = (
    <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-4 -mb-4 -mr-6 ">
      <div className="flex w-full max-w-2xl border border-slate-200 rounded-md overflow-hidden">
        <input
          type="search" 
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-[350px] px-3 py-2 text-sm text-slate-600 focus:outline-none"
          aria-label={searchPlaceholder}
        />
        <button
          type="button"
          className="inline-flex h-full items-center justify-center bg-primary px-3 py-2.5 text-white transition 
          hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Search"
        >
          <SearchLg className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="flex items-center justify-end gap-1 md:justify-start">
        {/* <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Download schedules"
        >
          <Download01 className="h-4 w-4" strokeWidth={2} />
        </button> */}
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 
          bg-white text-slate-500 transition hover:border-primary/40 hover:text-primary focus:outline-none 
          focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Filter schedules"
        >
          <FilterLines className="h-4 w-4" strokeWidth={2} />
        </button>
        {/* <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="More schedule actions"
        >
          <DotsVertical className="h-4 w-4" strokeWidth={2} />
        </button> */}
      </div>
    </div>
  )

  const handleSortChange = useCallback(
    (descriptor: DividerLineTableSortDescriptor) => {
      setSortDescriptors((previous) => ({
        ...previous,
        [activeTab]: descriptor
      }))
    },
    [activeTab]
  )

  return (
    <div className="space-y-8 px-4 pb-12 pt-28 md:px-10 lg:px-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[26px] font-semibold text-primary-dark">Schedules/Sessions</h1>
        <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCreateSchedule}
          className="inline-flex items-center justify-center rounded-md  px-4 py-2 text-sm font-semibold text-black border border-slate-200 shadow-sm transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          + Create schedule
        </button>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#5A1684]">
            <Upload01 className="h-4 w-4" />
            Upload
          </button>
          </div>
      </div>

      <DividerLineTable
        headerLeading={tableHeaderLeading}
        headerActions={tableHeaderActions}
        data={tableRows}
        columns={currentColumns}
        getRowKey={({ schedule }) => schedule.id}
        emptyState={emptyState}
        sortDescriptor={sortDescriptors[activeTab]}
        onSortChange={handleSortChange}
      />
    </div>
  )
}

export default SavedSchedulesTable

