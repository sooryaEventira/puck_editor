import { useMemo } from 'react'
import { Pencil01, Trash03 } from '@untitled-ui/icons-react'
import {
  type DividerLineTableColumn
} from '../../ui/untitled'
import type { GroupTableRowData } from './attendeeTypes'
import { SelectAllCheckbox } from '../../ui'

interface GroupTableColumnsProps {
  allVisibleSelected: boolean
  partiallySelected: boolean
  selectedGroupIds: Set<string>
  onToggleAllVisible: (checked: boolean) => void
  onToggleRow: (id: string, checked: boolean) => void
  onEditGroup?: (groupId: string) => void
  onDeleteGroup?: (groupId: string) => void
}

export const useGroupTableColumns = ({
  allVisibleSelected,
  partiallySelected,
  selectedGroupIds,
  onToggleAllVisible,
  onToggleRow,
  onEditGroup,
  onDeleteGroup
}: GroupTableColumnsProps): DividerLineTableColumn<GroupTableRowData>[] => {
  return useMemo<DividerLineTableColumn<GroupTableRowData>[]>(
    () => [
      {
        id: 'groupName',
        header: (
          <div className="flex items-center gap-2">
            <SelectAllCheckbox
              checked={allVisibleSelected}
              indeterminate={partiallySelected}
              onChange={onToggleAllVisible}
              ariaLabel="Select all groups"
            />
            <span>Group name</span>
          </div>
        ),
        sortable: true,
        sortAccessor: ({ group }) => group?.name || '',
        render: ({ group }) => {
          if (!group) return null
          return (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
                aria-label={`Select ${group.name}`}
                checked={selectedGroupIds.has(group.id)}
                onChange={(event) => onToggleRow(group.id, event.target.checked)}
              />
              <span className="text-sm font-medium text-slate-900">{group.name}</span>
            </div>
          )
        }
      },
      {
        id: 'attendeeCount',
        header: 'Attendee count',
        sortable: true,
        sortAccessor: ({ group }) => group?.attendeeCount || 0,
        render: ({ group }) => {
          if (!group) return null
          return <span className="text-sm text-slate-600">{group.attendeeCount}</span>
        }
      },
      {
        id: 'actions',
        header: '',
        align: 'right',
        render: ({ group }) => {
          if (!group) return null
          return (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onDeleteGroup?.(group.id)}
                className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:border-rose-400 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60"
                aria-label={`Delete ${group.name}`}
              >
                <Trash03 className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={() => onEditGroup?.(group.id)}
                className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label={`Edit ${group.name}`}
              >
                <Pencil01 className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          )
        }
      }
    ],
    [
      allVisibleSelected,
      partiallySelected,
      selectedGroupIds,
      onToggleAllVisible,
      onToggleRow,
      onEditGroup,
      onDeleteGroup
    ]
  )
}

