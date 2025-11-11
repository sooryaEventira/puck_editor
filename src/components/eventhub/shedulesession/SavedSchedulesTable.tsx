import React, { useMemo, useState } from 'react'
import { SearchLg, Download01, FilterLines, Pencil01, Trash03, DotsVertical } from '@untitled-ui/icons-react'
import { SavedSchedule } from './sessionTypes'

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

  return (
    <div className="space-y-8 px-4 pb-12 pt-28 md:px-10 lg:px-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[26px] font-semibold text-primary/90">Schedules/Sessions</h1>
        <button
          type="button"
          onClick={onCreateSchedule}
          className="inline-flex items-center justify-center rounded-md  px-4 py-2 text-sm font-semibold text-black border border-slate-200 shadow-sm transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          + Create schedule
        </button>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white shadow-lg">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-base font-semibold text-slate-900">Schedules</div>
          <div className="flex flex-1 flex-col gap-3 sm:flex-initial sm:flex-row sm:items-center sm:gap-4">
            <div className="flex w-full max-w-2xl overflow-hidden rounded-md border border-slate-200 shadow-sm">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search schedules"
                className="w-[350px] px-3 py-2 text-sm text-slate-600 focus:outline-none"
                aria-label="Search schedules"
              />
              <button
                type="button"
                className="inline-flex h-full items-center py-2.5 justify-center bg-primary px-3 text-white transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Search"
              >
                <SearchLg className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Download schedules"
              >
                <Download01 className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Filter schedules"
              >
                <FilterLines className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="More schedule actions"
              >
                <DotsVertical className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center px-6 py-10 text-sm text-slate-500">
            {schedules.length === 0
              ? 'No schedules have been saved yet.'
              : 'No schedules match your search.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
                        aria-label="Select all schedules"
                      />
                      Schedule name
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredSchedules.map((schedule, index) => {
                    return (
                    <tr key={schedule.id} className="transition hover:bg-primary/5">
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
                            aria-label={`Select ${schedule.name}`}
                          />
                          <span>{schedule.name || `Schedule ${index + 1}`}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
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
                            className="flex h-9 w-9 items-center justify-center  text-slate-500 transition hover:border-rose-400 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60"
                            aria-label={`Delete ${schedule.name}`}
                          >
                            <Trash03 className="h-4 w-4" strokeWidth={1.8} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedSchedulesTable

