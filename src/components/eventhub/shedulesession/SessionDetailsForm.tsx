import React, { useState, useRef, useEffect } from 'react'
import { Eye, Pencil01, ChevronDown } from '@untitled-ui/icons-react'
import { Input, Select } from '../../ui/untitled'
import { SessionDraft } from './sessionTypes'

interface SessionDetailsFormProps {
  draft: SessionDraft
  tagsInput: string
  onFieldChange: <K extends keyof SessionDraft>(key: K, value: SessionDraft[K]) => void
  onTagsInputChange: (value: string) => void
  onAddSectionClick: () => void
  availableTags?: string[]
  availableLocations?: string[]
}

const SessionDetailsForm: React.FC<SessionDetailsFormProps> = ({
  draft,
  tagsInput,
  onFieldChange,
  onTagsInputChange,
  onAddSectionClick,
  availableTags = [],
  availableLocations = []
}) => {
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false)
  const tagsDropdownRef = useRef<HTMLDivElement>(null)

  // Tag and location option mappings (same as ScheduleDetailsSlideout)
  const tagOptionsMap: Record<string, string> = {
    'speaker': 'Speaker',
    'volunteer': 'Volunteer',
    'student': 'Student',
  }

  const locationOptionsMap: Record<string, string> = {
    'cafeteria': 'Cafeteria',
    'room1': 'Room 1',
    'room2': 'Room 2',
  }

  // Create options from available tags and locations
  const tagOptions = availableTags.map(value => ({
    value,
    label: tagOptionsMap[value] || value
  }))

  const locationOptions = availableLocations.map(value => ({
    value,
    label: locationOptionsMap[value] || value
  }))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target as Node)) {
        setIsTagsDropdownOpen(false)
      }
    }

    if (isTagsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isTagsDropdownOpen])

  const handleTagToggle = (tagValue: string) => {
    const currentTags = draft.tags || []
    const isSelected = currentTags.includes(tagValue)
    
    if (isSelected) {
      onFieldChange('tags', currentTags.filter((tag) => tag !== tagValue))
    } else {
      onFieldChange('tags', [...currentTags, tagValue])
    }
  }


  const addSectionButtonClassName =
    'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'

  const renderTimeField = (
    label: string,
    timeKey: 'startTime' | 'endTime'
  ) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type="time"
        value={draft[timeKey] || ''}
        onChange={(event) => onFieldChange(timeKey, event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-600 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-md font-semibold text-slate-600">SESSION TITLE</p>
        <Input
          placeholder="Enter session title"
          value={draft.title || ''}
          onChange={(event) => onFieldChange('title', event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:gap-3">
        {renderTimeField('Start time', 'startTime')}
        {renderTimeField('End time', 'endTime')}

        {/* Location Select */}
        {availableLocations.length > 0 ? (
          <div className="flex-1">
            <Select
              label="Location"
              value={draft.location}
              onChange={(event) => onFieldChange('location', event.target.value)}
              options={[
                { value: '', label: 'Select location' },
                ...locationOptions
              ]}
              className="h-10"
            />
          </div>
        ) : (
          <Input
            label="Location"
            placeholder="Select location"
            value={draft.location}
            onChange={(event) => onFieldChange('location', event.target.value)}
          />
        )}

        <div className="flex-1">
          <Select
            label="Session type"
            value={draft.sessionType}
            onChange={(event) => onFieldChange('sessionType', event.target.value)}
            options={[
              { value: '', label: 'Select session type' },
              { value: 'keynote', label: 'Online' },
              { value: 'workshop', label: 'In person' }
            ]}
            className="h-10"
          />
        </div>

        {/* Tags Dropdown */}
        {availableTags.length > 0 ? (
          <div className="flex flex-1 flex-col gap-1 relative" ref={tagsDropdownRef}>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Tags</span>
            <button
              type="button"
              onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
              className="h-10 w-full flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <span className={`truncate ${draft.tags.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                {draft.tags.length > 0 
                  ? draft.tags
                      .map(tagValue => {
                        const tag = tagOptions.find(opt => opt.value === tagValue)
                        return tag ? tag.label : tagValue
                      })
                      .join(', ')
                  : 'Select tags'}
              </span>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform flex-shrink-0 ml-2 ${isTagsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isTagsDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto top-full">
                {tagOptions.map((option) => {
                  const isSelected = draft.tags.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleTagToggle(option.value)}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm transition-colors ${
                        isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <Input
            label="Tags"
            placeholder="Select tags"
            value={tagsInput}
            onChange={(event) => onTagsInputChange(event.target.value)}
          />
        )}
      </div>

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
