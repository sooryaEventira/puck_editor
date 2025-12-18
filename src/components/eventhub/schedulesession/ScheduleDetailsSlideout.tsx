import React, { useEffect, useState, useMemo } from 'react'
import { MultiValue, ActionMeta } from 'react-select'
import Slideout from '../../ui/untitled/Slideout'
import Input from '../../ui/untitled/Input'
import CreatableMultiSelect, { CreatableMultiSelectOption } from '../../ui/untitled/CreatableMultiSelect'

interface ScheduleDetails {
  title: string
  tags: string[]
  location: string[]
  description: string
}

interface ScheduleDetailsSlideoutProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (details: ScheduleDetails) => void
  initialDetails?: ScheduleDetails | null
  topOffset?: number
  panelWidthRatio?: number
  availableTags?: string[]
  availableLocations?: string[]
}

const ScheduleDetailsSlideout: React.FC<ScheduleDetailsSlideoutProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDetails,
  topOffset = 64,
  panelWidthRatio = 0.4,
  availableTags = [],
  availableLocations = []
}) => {
  const [details, setDetails] = useState<ScheduleDetails>({
    title: '',
    tags: [],
    location: [],
    description: ''
  })
  const [tagOptions, setTagOptions] = useState<CreatableMultiSelectOption[]>([])
  const [locationOptions, setLocationOptions] = useState<CreatableMultiSelectOption[]>([])

  // Convert available tags/locations to options format
  useEffect(() => {
    const tagsFromSchedules = availableTags.map(tag => ({
      value: tag.toLowerCase().replace(/\s+/g, '-'),
      label: tag
    }))
    setTagOptions(tagsFromSchedules)

    const locationsFromSchedules = availableLocations.map(location => ({
      value: location.toLowerCase().replace(/\s+/g, '-'),
      label: location
    }))
    setLocationOptions(locationsFromSchedules)
  }, [availableTags, availableLocations])


  useEffect(() => {
    if (!isOpen) {
      setDetails({
        title: '',
        tags: [],
        location: [],
        description: ''
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && initialDetails) {
      setDetails(initialDetails)
    } else if (isOpen) {
      setDetails({
        title: '',
        tags: [],
        location: [],
        description: ''
      })
    }
  }, [initialDetails, isOpen])


  const handleFieldChange = (field: keyof ScheduleDetails, value: string | string[]) => {
    setDetails((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  // Convert tags from string[] to CreatableMultiSelectOption[]
  const selectedTags = useMemo(() => {
    return details.tags.map(tag => {
      // Try to find existing option
      const existingOption = tagOptions.find(opt => opt.value === tag || opt.label === tag)
      if (existingOption) {
        return existingOption
      }
      // If not found, create new option
      return {
        value: tag.toLowerCase().replace(/\s+/g, '-'),
        label: tag
      }
    })
  }, [details.tags, tagOptions])

  // Convert locations from string[] to CreatableMultiSelectOption[]
  const selectedLocations = useMemo(() => {
    return details.location.map(location => {
      // Try to find existing option
      const existingOption = locationOptions.find(opt => opt.value === location || opt.label === location)
      if (existingOption) {
        return existingOption
      }
      // If not found, create new option
      return {
        value: location.toLowerCase().replace(/\s+/g, '-'),
        label: location
      }
    })
  }, [details.location, locationOptions])

  const handleTagsChange = (newValue: MultiValue<CreatableMultiSelectOption>, _actionMeta: ActionMeta<CreatableMultiSelectOption>) => {
    const tagValues = Array.from(newValue).map(option => option.label)
    handleFieldChange('tags', tagValues)
  }

  const handleLocationsChange = (newValue: MultiValue<CreatableMultiSelectOption>, _actionMeta: ActionMeta<CreatableMultiSelectOption>) => {
    const locationValues = Array.from(newValue).map(option => option.label)
    handleFieldChange('location', locationValues)
  }

  const handleCreateTag = (inputValue: string) => {
    const newTag: CreatableMultiSelectOption = {
      value: inputValue.toLowerCase().replace(/\s+/g, '-'),
      label: inputValue
    }
    // Add to options if not already present
    setTagOptions(prev => {
      const exists = prev.some(opt => opt.value === newTag.value || opt.label === newTag.label)
      if (exists) return prev
      return [...prev, newTag]
    })
  }

  const handleCreateLocation = (inputValue: string) => {
    const newLocation: CreatableMultiSelectOption = {
      value: inputValue.toLowerCase().replace(/\s+/g, '-'),
      label: inputValue
    }
    // Add to options if not already present
    setLocationOptions(prev => {
      const exists = prev.some(opt => opt.value === newLocation.value || opt.label === newLocation.label)
      if (exists) return prev
      return [...prev, newLocation]
    })
  }

  const handleSave = () => {
    if (onSave) {
      onSave(details)
    }
    onClose()
  }

  const footerContent = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/60"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSave}
        disabled={!details.title.trim()}
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create schedule
      </button>
    </>
  )

  return (
    <Slideout
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule details"
      topOffset={topOffset}
      panelWidthRatio={panelWidthRatio}
      footer={footerContent}
    >
      <div className="px-6 py-6">
        <div className="space-y-6">
          <Input
            label="Title *"
            type="text"
            value={details.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="Enter schedule title"
            autoFocus
          />

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <CreatableMultiSelect
                label="Tags"
                placeholder="Select or create tags"
                options={tagOptions}
                value={selectedTags}
                onChange={handleTagsChange}
                onCreateOption={handleCreateTag}
              />
            </div>

            <div className="flex-1">
              <CreatableMultiSelect
                label="Location"
                placeholder="Select or create location"
                options={locationOptions}
                value={selectedLocations}
                onChange={handleLocationsChange}
                onCreateOption={handleCreateLocation}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={details.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="e.g. I joined Stripe's Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints."
              rows={6}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
        </div>
      </div>
    </Slideout>
  )
}

export default ScheduleDetailsSlideout

