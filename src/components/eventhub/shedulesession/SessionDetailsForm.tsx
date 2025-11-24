import React from 'react'
import { Eye, Pencil01 } from '@untitled-ui/icons-react'
import { Input, Select } from '../../ui/untitled'
import { SessionDraft } from './sessionTypes'

interface SessionDetailsFormProps {
  draft: SessionDraft
  tagsInput: string
  onFieldChange: <K extends keyof SessionDraft>(key: K, value: SessionDraft[K]) => void
  onTagsInputChange: (value: string) => void
  onAddSectionClick: () => void
}

const SessionDetailsForm: React.FC<SessionDetailsFormProps> = ({
  draft,
  tagsInput,
  onFieldChange,
  onTagsInputChange,
  onAddSectionClick
}) => {
  const addSectionButtonClassName =
    'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'

  const renderTimeField = (
    label: string,
    periodKey: 'startPeriod' | 'endPeriod',
    timeKey: 'startTime' | 'endTime'
  ) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      <div className="inline-flex h-10 w-[90px] min-w-[90px] items-center overflow-hidden rounded-lg border border-slate-300 bg-white text-sm shadow-sm">
        <select
          value={draft[periodKey]}
          onChange={(event) =>
            onFieldChange(periodKey, event.target.value as SessionDraft['startPeriod'])
          }
          className="h-full w-[32px] appearance-none border-none bg-transparent px-1 text-xs font-semibold uppercase text-slate-400 focus:outline-none focus:ring-0"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
        <span className="h-5 w-px bg-slate-300" aria-hidden="true" />
        <input
      type="time"
      value={draft[timeKey] || ''}
      placeholder="hh:mm"
      onChange={(event) => onFieldChange(timeKey, event.target.value)}
      className="h-full w-[54px] border-none bg-transparent px-2 text-xs text-slate-600 focus:outline-none focus:ring-0"
    />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <p className="text-md font-semibold text-slate-600">SESSION TITLE</p>

      <div className="flex flex-col gap-3 md:flex-row md:gap-3">
        {renderTimeField('Start time', 'startPeriod', 'startTime')}
        {renderTimeField('End time', 'endPeriod', 'endTime')}

        <Input
          label="Location"
          placeholder="Select location"
          value={draft.location}
          onChange={(event) => onFieldChange('location', event.target.value)}
        />

        <Select
          label="Session type"
          value={draft.sessionType}
          onChange={(event) => onFieldChange('sessionType', event.target.value)}
          options={[
            { value: '', label: 'Select session type' },
            { value: 'keynote', label: 'Keynote' },
            { value: 'workshop', label: 'Workshop' },
            { value: 'panel', label: 'Panel' },
            { value: 'networking', label: 'Networking' }
          ]}
        />

        <Input
          label="Tags"
          placeholder="Select tags"
          value={tagsInput}
          onChange={(event) => onTagsInputChange(event.target.value)}
        />
      </div>

      {draft.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {draft.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="px-6 text-center">
        {draft.sections.length === 0 ? (
          <>
            <p className="text-base font-medium text-slate-600">Click to add a section!</p>
            <button
              type="button"
              onClick={onAddSectionClick}
              className={`mt-4 ${addSectionButtonClassName}`}
              aria-label="Add a section"
            >
              + Add section
            </button>
          </>
        ) : (
          <div className="space-y-2 text-left ">
            <div className="flex items-center justify-between  px-2 py-3 margin-left-auto">
              <button
                type="button"
                onClick={onAddSectionClick}
                className={addSectionButtonClassName}
                aria-label="Add another section"
              >
                + Add section
              </button>
            </div>
            <ul className="space-y-3">
              {draft.sections.map((section) => (
                <li
                  key={section.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-1">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold uppercase text-primary">
                        {section.title.slice(0, 1)}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        aria-label={`Edit ${section.title} section`}
                      >
                        <Pencil01 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        aria-label={`Preview ${section.title} section`}
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  <div className="px-4 py-2">
                    {section.description ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Description
                        </p>
                        <p className="text-sm leading-6 text-slate-600">{section.description}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        No additional details have been added for this section yet.
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionDetailsForm
