import React, { useMemo, useState, useCallback } from 'react'
import { Plus, Pencil01, Trash03, Upload01 } from '@untitled-ui/icons-react'
import {
  Badge,
  DividerLineTable,
  type DividerLineTableColumn,
  type DividerLineTableSortDescriptor
} from '../../ui/untitled'
import { SavedSchedule } from './sessionTypes'
import { SelectAllCheckbox, useTableHeader, TablePagination } from '../../ui'
import NewTagModal from './NewTagModal'

type TableTab = 'schedules' | 'tags'

type TableRowData = {
  schedule: SavedSchedule
  index: number
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
  const [currentPage, setCurrentPage] = useState(1)
  const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false)
  const itemsPerPage = 10
  const [sortDescriptors, setSortDescriptors] = useState<
    Record<TableTab, DividerLineTableSortDescriptor | undefined>
  >({
    schedules: { column: 'name', direction: 'ascending' },
    tags: { column: 'title', direction: 'ascending' }
  })
  const searchPlaceholder =
    activeTab === 'tags' ? 'Search tags' : 'Search schedules'

  const tableHeader = useTableHeader({
    tabs: [
      { id: 'schedules', label: 'Schedules' },
      { id: 'tags', label: 'Tags & Location' }
    ],
    activeTabId: activeTab,
    searchQuery,
    searchPlaceholder,
    onTabChange: (tabId) => setActiveTab(tabId as TableTab),
    onSearchChange: setSearchQuery,
    onFilterClick: () => setSearchQuery(''),
    showFilter: true,
    filterLabel: 'Filter schedules'
  })

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

  const paginatedSchedules = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredSchedules.slice(startIndex, endIndex)
  }, [filteredSchedules, currentPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredSchedules.length / itemsPerPage)
  }, [filteredSchedules.length])

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
    () => paginatedSchedules.map((schedule, index) => ({ schedule, index })),
    [paginatedSchedules]
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


  const handleSortChange = useCallback(
    (descriptor: DividerLineTableSortDescriptor) => {
      setSortDescriptors((previous) => ({
        ...previous,
        [activeTab]: descriptor
      }))
    },
    [activeTab]
  )

  // Reset page when switching tabs
  React.useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  const handleSaveTag = (tagName: string, color: string) => {
    console.log('Saving tag:', { tagName, color })
    // TODO: Implement tag saving logic
    setIsNewTagModalOpen(false)
  }

  return (
    <div className="space-y-8 px-4 pb-12 pt-28 md:px-10 lg:px-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[26px] font-semibold text-primary-dark">Schedules/Sessions</h1>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          {activeTab === 'schedules' ? (
            <>
              <button
                type="button"
                onClick={onCreateSchedule}
                className="inline-flex items-center justify-center gap-2 rounded-md  px-4 py-2 text-sm font-semibold text-black border border-slate-200 shadow-sm transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Plus className="h-4 w-4 text-slate-500 " /> <span className="whitespace-nowrap">Create schedule</span>
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#5A1684]">
                <Upload01 className="h-4 w-4" />
                Upload
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsNewTagModalOpen(true)}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white border border-slate-200 shadow-md bg-primary
               transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
            <Plus className="h-4 w-4 text-white " /> New tags
            </button>
          )}
        </div>
      </div>

      <DividerLineTable
        headerLeading={tableHeader.leading}
        headerActions={tableHeader.actions}
        data={tableRows}
        columns={currentColumns}
        getRowKey={({ schedule }) => schedule.id}
        emptyState={emptyState}
        sortDescriptor={sortDescriptors[activeTab]}
        onSortChange={handleSortChange}
        footer={
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        }
      />

      <NewTagModal
        isOpen={isNewTagModalOpen}
        onClose={() => setIsNewTagModalOpen(false)}
        onSave={handleSaveTag}
      />
    </div>
  )
}

export default SavedSchedulesTable

