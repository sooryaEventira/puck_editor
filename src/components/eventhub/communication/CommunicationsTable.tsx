import React, { useMemo, useState, useCallback } from 'react'
import { SearchLg, FilterLines, Pencil01, Trash03, Mail01, Bell01, HelpCircle } from '@untitled-ui/icons-react'
import {
  Badge,
  DividerLineTable,
  type DividerLineTableColumn,
  type DividerLineTableSortDescriptor
} from '../../ui/untitled'
import { Communication } from './communicationTypes'

type TableTab = 'list' | 'macros'

type TableRowData = {
  communication: Communication
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

interface CommunicationsTableProps {
  communications: Communication[]
  onCreateBroadcast: () => void
  onEditCommunication?: (communicationId: string) => void
}

const CommunicationsTable: React.FC<CommunicationsTableProps> = ({
  communications,
  onCreateBroadcast,
  onEditCommunication
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TableTab>('list')
  const [selectedCommunicationIds, setSelectedCommunicationIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [sortDescriptors, setSortDescriptors] = useState<
    Record<TableTab, DividerLineTableSortDescriptor | undefined>
  >({
    list: { column: 'title', direction: 'ascending' },
    macros: { column: 'title', direction: 'ascending' }
  })

  const filteredCommunications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return communications

    return communications.filter((comm) => {
      const haystack = [
        comm.title,
        ...comm.userGroups.map((g) => g.name),
        comm.status,
        comm.type
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [searchQuery, communications])

  const visibleCommunicationIds = useMemo(
    () => filteredCommunications.map((comm) => comm.id),
    [filteredCommunications]
  )

  const paginatedCommunications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredCommunications.slice(startIndex, endIndex)
  }, [filteredCommunications, currentPage])

  const totalPages = Math.ceil(filteredCommunications.length / itemsPerPage)

  const allVisibleSelected =
    visibleCommunicationIds.length > 0 &&
    visibleCommunicationIds.every((id) => selectedCommunicationIds.has(id))

  const partiallySelected =
    !allVisibleSelected &&
    visibleCommunicationIds.some((id) => selectedCommunicationIds.has(id))

  const handleToggleAllVisible = useCallback(
    (checked: boolean) => {
      setSelectedCommunicationIds((previous) => {
        const next = new Set(previous)

        visibleCommunicationIds.forEach((id) => {
          if (checked) {
            next.add(id)
          } else {
            next.delete(id)
          }
        })

        return next
      })
    },
    [visibleCommunicationIds]
  )

  const handleToggleRow = useCallback((communicationId: string, checked: boolean) => {
    setSelectedCommunicationIds((previous) => {
      const next = new Set(previous)
      if (checked) {
        next.add(communicationId)
      } else {
        next.delete(communicationId)
      }
      return next
    })
  }, [])

  const tableRows = useMemo<TableRowData[]>(
    () => paginatedCommunications.map((comm, index) => ({ communication: comm, index })),
    [paginatedCommunications]
  )

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent':
        return 'success' as const
      case 'scheduled':
        return 'primary' as const
      case 'draft':
        return 'warning' as const
      default:
        return 'neutral' as const
    }
  }

  const getUserGroupVariant = (variant?: string): 'primary' | 'info' | 'muted' => {
    if (variant === 'primary') return 'primary'
    if (variant === 'secondary') return 'info'
    return 'muted'
  }

  const listColumns = useMemo<DividerLineTableColumn<TableRowData>[]>(() => {
    return [
      {
        id: 'title',
        header: (
          <div className="flex items-center gap-2">
            <SelectAllCheckbox
              checked={allVisibleSelected}
              indeterminate={partiallySelected}
              onChange={handleToggleAllVisible}
              ariaLabel="Select all communications"
            />
            <span>Title</span>
          </div>
        ),
        sortable: true,
        sortAccessor: ({ communication }) => communication.title,
        render: ({ communication }) => (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
              aria-label={`Select ${communication.title}`}
              checked={selectedCommunicationIds.has(communication.id)}
              onChange={(event) => handleToggleRow(communication.id, event.target.checked)}
            />
            <span className="text-sm font-medium text-slate-900">{communication.title}</span>
          </div>
        )
      },
      {
        id: 'userGroups',
        header: 'User Groups',
        sortable: true,
        sortAccessor: ({ communication }) => communication.userGroups.map((g) => g.name).join(' '),
        render: ({ communication }) => (
          <div className="flex flex-wrap items-center gap-2">
            {communication.userGroups.slice(0, 3).map((group, idx) => (
              <Badge key={idx} variant={getUserGroupVariant(group.variant)}>
                {group.name}
              </Badge>
            ))}
            {communication.userGroups.length > 3 && (
              <Badge variant="muted">+{communication.userGroups.length - 3}</Badge>
            )}
          </div>
        )
      },
      {
        id: 'status',
        header: 'Status',
        sortable: true,
        sortAccessor: ({ communication }) => communication.status,
        render: ({ communication }) => (
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(communication.status)}>
              {communication.status.charAt(0).toUpperCase() + communication.status.slice(1)}
            </Badge>
            {communication.status === 'scheduled' && communication.scheduledDate && (
              <div className="group relative">
                <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                <div className="absolute left-0 top-6 z-10 hidden w-48 rounded-md bg-slate-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                  {new Date(communication.scheduledDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            )}
          </div>
        )
      },
      {
        id: 'type',
        header: 'Type',
        sortable: true,
        sortAccessor: ({ communication }) => communication.type,
        render: ({ communication }) => (
          <div className="flex items-center">
            {communication.type === 'email' ? (
              <Mail01 className="h-5 w-5 text-slate-500" />
            ) : (
              <Bell01 className="h-5 w-5 text-slate-500" />
            )}
          </div>
        )
      },
      {
        id: 'recipients',
        header: 'Recipients',
        sortable: true,
        sortAccessor: ({ communication }) => communication.recipients.sent,
        render: ({ communication }) => (
          <span className="text-sm text-slate-600">
            {communication.recipients.sent}/{communication.recipients.total}
          </span>
        )
      },
      {
        id: 'actions',
        header: '',
        align: 'right',
        render: ({ communication }) => (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onEditCommunication?.(communication.id)}
              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={`Edit ${communication.title}`}
            >
              <Pencil01 className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:border-rose-400 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60"
              aria-label={`Delete ${communication.title}`}
            >
              <Trash03 className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        )
      }
    ]
  }, [
    allVisibleSelected,
    handleToggleAllVisible,
    handleToggleRow,
    onEditCommunication,
    partiallySelected,
    selectedCommunicationIds
  ])

  const emptyState = (
    <div className="flex min-h-[280px] items-center justify-center px-6 py-10 text-sm text-slate-500">
      {communications.length === 0
        ? 'No emails/notifications created!'
        : 'No communications match your search.'}
    </div>
  )

  const tableHeaderLeading = (
    <div className="inline-flex items-center overflow-hidden rounded-t-xl border border-slate-200 bg-white -mb-6 -ml-6">
      {(['list', 'macros'] as const).map((tab) => {
        const isActive = activeTab === tab
        const label = tab === 'list' ? 'List' : 'Macros'

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
    <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-4 -mb-4 -mr-6">        
      <div className="flex w-full max-w-2xl border border-slate-200 rounded-md overflow-hidden">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search communication"
          className="w-[350px] px-3 py-2 text-sm text-slate-600 focus:outline-none"
          aria-label="Search communication"
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
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 
          bg-white text-slate-500 transition hover:border-primary/40 hover:text-primary focus:outline-none 
          focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Filter"
        >
          <FilterLines className="h-4 w-4" strokeWidth={2} />
        </button>
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

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pageNumbers: (number | string)[] = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) pageNumbers.push(i)
        pageNumbers.push('...')
        pageNumbers.push(totalPages - 1)
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push(2)
        pageNumbers.push('...')
        for (let i = totalPages - 2; i <= totalPages; i++) pageNumbers.push(i)
      } else {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i)
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      }
    }

    return (
      <div className="flex items-center justify-center gap-2 border-t border-slate-200 px-6 py-4">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Previous
        </button>
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-sm text-slate-500">
                  ...
                </span>
              )
            }
            const pageNum = page as number
            const isActive = currentPage === pageNum
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4 pb-12 pt-28 md:px-10 lg:px-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[26px] font-semibold text-primary-dark">Communication</h1>
        <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCreateBroadcast}
          className="inline-flex items-center justify-center rounded-md  px-4 py-2 text-sm font-semibold text-white border border-slate-200 bg-primary shadow-sm transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          + New broadcast
        </button>
          </div>
      </div>

      <DividerLineTable
        headerLeading={tableHeaderLeading}
        headerActions={tableHeaderActions}
        data={tableRows}
        columns={listColumns}
        getRowKey={({ communication }) => communication.id}
        emptyState={emptyState}
        sortDescriptor={sortDescriptors[activeTab]}
        onSortChange={handleSortChange}
        footer={renderPagination()}
      />
    </div>
  )
}

export default CommunicationsTable

