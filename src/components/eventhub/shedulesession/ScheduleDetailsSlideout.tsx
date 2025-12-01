import React, { useEffect, useState, useRef } from 'react'
import { XClose, ChevronDown, Plus } from '@untitled-ui/icons-react'
import NewTagModal from './NewTagModal'

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
}

const ScheduleDetailsSlideout: React.FC<ScheduleDetailsSlideoutProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDetails,
  topOffset = 64,
  panelWidthRatio = 0.5
}) => {
  const [details, setDetails] = useState<ScheduleDetails>({
    title: '',
    tags: [],
    location: [],
    description: ''
  })
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false)
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'tag' | 'location'>('tag')
  const tagsDropdownRef = useRef<HTMLDivElement>(null)
  const locationDropdownRef = useRef<HTMLDivElement>(null)

  const [tagOptions, setTagOptions] = useState([
    { value: 'selectall', label: 'Select All' },
    { value: 'speaker', label: 'Speaker' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'student', label: 'Student' },
  ])

  const [locationOptions, setLocationOptions] = useState([
    { value: 'selectall', label: 'Select All' },
    { value: 'cafeteria', label: 'Cafeteria' },
    { value: 'room1', label: 'Room 1' },
    { value: 'room2', label: 'Room 2' },
  ])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setDetails({
        title: '',
        tags: [],
        location: [],
        description: ''
      })
      setIsTagsDropdownOpen(false)
      setIsLocationDropdownOpen(false)
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target as Node)) {
        setIsTagsDropdownOpen(false)
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false)
      }
    }

    if (isTagsDropdownOpen || isLocationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isTagsDropdownOpen, isLocationDropdownOpen])

  const handleFieldChange = (field: keyof ScheduleDetails, value: string | string[]) => {
    setDetails((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTagToggle = (tagValue: string) => {
    setDetails((prev) => {
      const currentTags = prev.tags || []
      const isSelected = currentTags.includes(tagValue)
      
      if (isSelected) {
        return {
          ...prev,
          tags: currentTags.filter((tag) => tag !== tagValue)
        }
      } else {
        return {
          ...prev,
          tags: [...currentTags, tagValue]
        }
      }
    })
  }

  const handleLocationToggle = (locationValue: string) => {
    setDetails((prev) => {
      const currentLocations = prev.location || []
      const isSelected = currentLocations.includes(locationValue)
      
      if (isSelected) {
        return {
          ...prev,
          location: currentLocations.filter((loc) => loc !== locationValue)
        }
      } else {
        return {
          ...prev,
          location: [...currentLocations, locationValue]
        }
      }
    })
  }

  const handleSave = () => {
    if (onSave) {
      onSave(details)
    }
    onClose()
  }

  const handleOpenModal = (type: 'tag' | 'location') => {
    setModalType(type)
    setIsModalOpen(true)
    // Close the dropdown when opening modal
    if (type === 'tag') {
      setIsTagsDropdownOpen(false)
    } else {
      setIsLocationDropdownOpen(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSaveNewTag = (tagName: string, _color: string) => {
    // Create a new tag option
    const newTagValue = tagName.toLowerCase().replace(/\s+/g, '')
    const newTag = { value: newTagValue, label: tagName }
    
    // Add to tag options if it doesn't exist
    if (!tagOptions.find(opt => opt.value === newTagValue)) {
      setTagOptions(prev => [...prev, newTag])
    }
    
    // Automatically select the new tag
    setDetails(prev => ({
      ...prev,
      tags: [...prev.tags, newTagValue]
    }))
    
    handleCloseModal()
  }

  const handleSaveNewLocation = (locationName: string, _color: string) => {
    // Create a new location option
    const newLocationValue = locationName.toLowerCase().replace(/\s+/g, '')
    const newLocation = { value: newLocationValue, label: locationName }
    
    // Add to location options if it doesn't exist
    if (!locationOptions.find(opt => opt.value === newLocationValue)) {
      setLocationOptions(prev => [...prev, newLocation])
    }
    
    // Automatically select the new location
    setDetails(prev => ({
      ...prev,
      location: [...prev.location, newLocationValue]
    }))
    
    handleCloseModal()
  }

  const containerStyle: React.CSSProperties = {
    top: topOffset,
    right: 0,
    left: 0,
    bottom: 0
  }

  const panelStyle: React.CSSProperties = {
    height: `calc(100vh - ${topOffset}px)`,
    width: `${Math.min(Math.max(panelWidthRatio, 0.3), 1) * 100}%`,
    maxWidth: '800px'
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[1200] transition ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
      style={containerStyle}
    >
      <div
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`absolute right-0 top-0 flex transform flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        style={panelStyle}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Schedule details</h2>
          <button
            type="button"
            className="ml-auto rounded-full p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            onClick={onClose}
            aria-label="Close"
          >
            <XClose className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={details.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Enter schedule title"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 relative" ref={tagsDropdownRef}>
                <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">
                  Tags
                </label>
                <button
                  type="button"
                  onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <span className={`truncate ${details.tags.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                    {details.tags.length > 0 
                      ? details.tags
                          .map(tagValue => {
                            const tag = tagOptions.find(opt => opt.value === tagValue)
                            return tag ? tag.label : tagValue
                          })
                          .filter(label => label !== 'Select All')
                          .join(', ')
                      : 'Select tag'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform flex-shrink-0 ml-2 ${isTagsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isTagsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {tagOptions.map((option) => {
                      const isSelected = details.tags.includes(option.value)
                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleTagToggle(option.value)}
                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
                          />
                          <span className="text-sm text-slate-700">{option.label}</span>
                        </label>
                      )
                    })}
                    <div className="border-t border-slate-200"></div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenModal('tag')
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-sm text-primary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New tag</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 relative" ref={locationDropdownRef}>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
                  Location
                </label>
                <button
                  type="button"
                  onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <span className={`truncate ${details.location.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                    {details.location.length > 0 
                      ? details.location
                          .map(locationValue => {
                            const location = locationOptions.find(opt => opt.value === locationValue)
                            return location ? location.label : locationValue
                          })
                          .filter(label => label !== 'Select All')
                          .join(', ')
                      : 'Select location'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform flex-shrink-0 ml-2 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLocationDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {locationOptions.map((option) => {
                      const isSelected = details.location.includes(option.value)
                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleLocationToggle(option.value)}
                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
                          />
                          <span className="text-sm text-slate-700">{option.label}</span>
                        </label>
                      )
                    })}
                    <div className="border-t border-slate-200"></div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenModal('location')
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-sm text-primary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New location</span>
                    </button>
                  </div>
                )}
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

        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
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
        </footer>
      </aside>

      {/* New Tag/Location Modal */}
      <NewTagModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={modalType === 'tag' ? handleSaveNewTag : handleSaveNewLocation}
        type={modalType}
      />
    </div>
  )
}

export default ScheduleDetailsSlideout

