import { useMemo } from 'react'
import { Pencil01, Trash03 } from '@untitled-ui/icons-react'
import {
  Badge,
  type DividerLineTableColumn
} from '../../ui/untitled'
import type { SpeakerTableRowData } from './speakerTypes'
import { SelectAllCheckbox } from '../../ui'

interface SpeakerTableColumnsProps {
  allVisibleSelected: boolean
  partiallySelected: boolean
  selectedSpeakerIds: Set<string>
  onToggleAllVisible: (checked: boolean) => void
  onToggleRow: (id: string, checked: boolean) => void
  onEditSpeaker?: (speakerId: string) => void
  onDeleteSpeaker?: (speakerId: string) => void
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'success' as const
    case 'pending':
      return 'warning' as const
    case 'inactive':
      return 'muted' as const
    default:
      return 'neutral' as const
  }
}

const getUserGroupVariant = (variant?: string): 'primary' | 'info' | 'muted' => {
  if (variant === 'primary') return 'primary'
  if (variant === 'info') return 'info'
  return 'muted'
}

export const useSpeakerTableColumns = ({
  allVisibleSelected,
  partiallySelected,
  selectedSpeakerIds,
  onToggleAllVisible,
  onToggleRow,
  onEditSpeaker,
  onDeleteSpeaker
}: SpeakerTableColumnsProps): DividerLineTableColumn<SpeakerTableRowData>[] => {
  return useMemo<DividerLineTableColumn<SpeakerTableRowData>[]>(
    () => [
      // {
      //   id: 'name',
      //   header: (
      //     <div className="flex items-center gap-2">
      //       <SelectAllCheckbox
      //         checked={allVisibleSelected}
      //         indeterminate={partiallySelected}
      //         onChange={onToggleAllVisible}
      //         ariaLabel="Select all speakers"
      //       />
      //       <span>Name</span>
      //     </div>
      //   ),
      //   sortable: true,
      //   sortAccessor: ({ speaker }) => speaker?.name || '',
      //   render: ({ speaker }) => {
      //     if (!speaker) return null
      //     return (
      //       <div className="flex items-center gap-3">
      //         <input
      //           type="checkbox"
      //           className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
      //           aria-label={`Select ${speaker.name}`}
      //           checked={selectedSpeakerIds.has(speaker.id)}
      //           onChange={(event) => {
      //             event.stopPropagation()
      //             onToggleRow(speaker.id, event.target.checked)
      //           }}
      //           onClick={(e) => e.stopPropagation()}
      //         />
      //         {speaker.avatarUrl ? (
      //           <img
      //             src={speaker.avatarUrl}
      //             alt={speaker.name}
      //             className="h-8 w-8 rounded-full object-cover"
      //           />
      //         ) : (
      //           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
      //             {speaker.name
      //               .split(' ')
      //               .map((n) => n[0])
      //               .join('')
      //               .toUpperCase()
      //               .slice(0, 2)}
      //           </div>
      //         )}
      //         <span 
      //           className="text-sm font-medium text-slate-900 cursor-pointer hover:text-primary transition-colors"
      //           onClick={() => onEditSpeaker?.(speaker.id)}
      //         >
      //           {speaker.name || 'Unknown'}
      //         </span>
      //       </div>
      //     )
      //   }
      // },
      {
        id: 'email',
        header: (
          <div className="flex items-center gap-2">
            <SelectAllCheckbox
              checked={allVisibleSelected}
              indeterminate={partiallySelected}
              onChange={onToggleAllVisible}
              ariaLabel="Select all speakers"
            />
            <span>Email address</span>
          </div>
        ),
        sortable: true,
        sortAccessor: ({ speaker }) => speaker?.email || '',
        render: ({ speaker }) => {
          if (!speaker) return null
          return (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
                aria-label={`Select ${speaker.email || 'speaker'}`}
                checked={selectedSpeakerIds.has(speaker.id)}
                onChange={(event) => {
                  event.stopPropagation()
                  onToggleRow(speaker.id, event.target.checked)
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm text-slate-600">
                {speaker.email || '-'}
              </span>
            </div>
          )
        }
      },
      // {
      //   id: 'phoneNumber',
      //   header: 'Phone number',
      //   sortable: true,
      //   sortAccessor: ({ speaker }) => speaker?.phoneNumber || '',
      //   render: ({ speaker }) => {
      //     if (!speaker) return null
      //     return (
      //       <span className="text-sm text-slate-600">
      //         {speaker.phoneNumber || '-'}
      //       </span>
      //     )
      //   }
      // },
      {
        id: 'role',
        header: 'Role',
        sortable: true,
        sortAccessor: ({ speaker }) => speaker?.role || '',
        render: ({ speaker }) => {
          if (!speaker) return null
          return (
            <span className="text-sm text-slate-600">
              {speaker.role || '-'}
            </span>
          )
        }
      },
 
      {
        id: 'actions',
        header: '',
        align: 'right',
        render: ({ speaker }) => {
          if (!speaker) return null
          return (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onDeleteSpeaker?.(speaker.id)}
                className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:border-rose-400 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60"
                aria-label={`Delete ${speaker.name}`}
              >
                <Trash03 className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={() => onEditSpeaker?.(speaker.id)}
                className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label={`Edit ${speaker.name}`}
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
      selectedSpeakerIds,
      onToggleAllVisible,
      onToggleRow,
      onEditSpeaker,
      onDeleteSpeaker
    ]
  )
}
