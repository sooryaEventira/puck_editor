import React, { useState } from 'react'
import Slideout from '../../ui/untitled/Slideout'
import Input from '../../ui/untitled/Input'
import Select from '../../ui/untitled/Select'
import Button from '../../ui/untitled/Button'
import SectionPickerModal from './SectionPickerModal'
import { XClose, Plus, Upload01, Settings01, Trash01, Send01 } from '@untitled-ui/icons-react'
import { sectionOptions } from './sessionConfig'

// Drag handle icon component (3x3 grid)
const DragHandleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="4" cy="4" r="1.5" fill="currentColor" />
    <circle cx="8" cy="4" r="1.5" fill="currentColor" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
    <circle cx="4" cy="8" r="1.5" fill="currentColor" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" />
    <circle cx="8" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

interface TemplateSessionData {
  title: string
  startTime: string
  endTime: string
  location: string
  sessionType: string
  tags: string[]
  childSession: boolean
  videoUrl?: string
  speakers: Array<{ id: string; name: string; role: string }>
  description: string
  hyperlinks: string[]
  resources: File[]
  liveChatEnabled: boolean
  comment: string
  submitAnonymous: boolean
}

interface TemplateSessionSlideoutProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (data: TemplateSessionData) => void
  availableTags?: string[]
  availableLocations?: string[]
  topOffset?: number
  panelWidthRatio?: number
}


const TemplateSessionSlideout: React.FC<TemplateSessionSlideoutProps> = ({
  isOpen,
  onClose,
  onSave,
  availableTags = [],
  availableLocations = [],
  topOffset = 64,
  panelWidthRatio = 0.8
}) => {
  const [formData, setFormData] = useState<TemplateSessionData>({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    sessionType: '',
    tags: [],
    childSession: false,
    speakers: [],
    description: '',
    hyperlinks: [],
    resources: [],
    liveChatEnabled: false,
    comment: '',
    submitAnonymous: false
  })

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sectionOptions[0]?.id ?? 'slides')


  const handleRemoveSpeaker = (speakerId: string) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter(s => s.id !== speakerId)
    }))
  }

  const handleAddSpeaker = () => {
    const newSpeaker = {
      id: `speaker-${Date.now()}`,
      name: 'Speaker Name',
      role: 'Chairman'
    }
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, newSpeaker]
    }))
  }

  const handleAddSection = () => {
    setIsSectionModalOpen(true)
    setSelectedSectionId(sectionOptions[0]?.id ?? 'slides')
  }

  const handleCloseSectionModal = () => {
    setIsSectionModalOpen(false)
  }

  const handleConfirmSection = () => {
    // Handle section selection - you can add logic here to add the section to formData
    // For now, we'll just close the modal
    const selectedSection = sectionOptions.find(opt => opt.id === selectedSectionId)
    if (selectedSection) {
      // TODO: Add the selected section to the form data or sections list
      console.log('Selected section:', selectedSection)
    }
    setIsSectionModalOpen(false)
  }


  const handleSave = () => {
    if (onSave) {
      onSave(formData)
    }
    onClose()
  }

  // Section Component
  const SectionHeader: React.FC<{
    title: string
    onRemove?: () => void
  }> = ({ title, onRemove }) => (
    <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-t-lg border-b border-slate-200">
      <div className="flex items-center gap-3">
        <DragHandleIcon className="h-4 w-4 text-slate-400 cursor-move" />
        <span className="text-sm font-semibold text-slate-900">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Settings"
        >
          <Settings01 className="h-4 w-4" />
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
            aria-label={`Remove ${title} section`}
          >
            <Trash01 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )

  const footerContent = (
    <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
      <Button
        type="button"
        variant="secondary"
        size="md"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={handleSave}
        className="bg-primary hover:bg-primary/90"
      >
        Save
      </Button>
    </div>
  )

  return (
    <>
      <Slideout
        isOpen={isOpen}
        onClose={onClose}
        topOffset={topOffset}
        panelWidthRatio={panelWidthRatio}
        footer={footerContent}
      >
      {/* Scrollable Content */}
      <div className="px-6 py-6 space-y-4">
        {/* Title Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <label className="block mb-2">
              <span className="text-sm font-medium text-slate-700">Title <span className="text-red-500">*</span></span>
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter session title"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-7 p-2 text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Close"
          >
            <XClose className="h-5 w-5" />
          </button>
        </div>
          {/* Session Meta Row */}
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_1fr_1.5fr_1.5fr_1.5fr] gap-4">
              <Input
                label="Start time"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
              <Input
                label="End time"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
              <Select
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                options={[
                  { value: '', label: 'Select location' },
                  ...availableLocations.map(loc => ({ value: loc, label: loc }))
                ]}
              />
              <Select
                label="Session type"
                value={formData.sessionType}
                onChange={(e) => setFormData(prev => ({ ...prev, sessionType: e.target.value }))}
                options={[
                  { value: '', label: 'Select session type' },
                  { value: 'online', label: 'Online' },
                  { value: 'in-person', label: 'In person' }
                ]}
              />
              <Select
                label="Tags"
                value={formData.tags[0] || ''}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData(prev => ({
                    ...prev,
                    tags: value ? [value] : []
                  }))
                }}
                options={[
                  { value: '', label: 'Select tags' },
                  ...availableTags.map(tag => ({ value: tag, label: tag }))
                ]}
              />
            </div>

            {/* Child Session Checkbox and Add Section Button */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.childSession}
                  onChange={(e) => setFormData(prev => ({ ...prev, childSession: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-slate-700">Child session</span>
              </label>
              <Button
                type="button"
                variant="primary"
                size="md"
                iconLeading={<Plus className="h-4 w-4" />}
                className="bg-primary hover:bg-primary/90"
                onClick={handleAddSection}
              >
                Add section
              </Button>
            </div>
          </div>

          {/* Section 1: Video */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <SectionHeader
              title="Video"
              onRemove={() => {}}
            />
            <div className="p-4">
              <div className="w-full h-64 bg-slate-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <span className="text-slate-400 text-sm">Video placeholder</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Speakers */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <SectionHeader
              title="Speakers"
              onRemove={() => {}}
            />
            <div className="bg-white p-4 space-y-3">
              {/* Speakers Label */}
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Speakers</span>
              </label>

              {/* Speakers Cards Row */}
              <div className="flex flex-wrap items-start gap-3">
                {formData.speakers.map((speaker) => (
                  <div
                    key={speaker.id}
                    className="flex flex-col rounded-lg border border-slate-200 bg-white p-3 min-w-[160px]"
                  >
                    {/* Top Row: Avatar, Name, Close */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <span className="text-sm font-medium text-amber-700">{speaker.name.charAt(0)}</span>
                      </div>
                      <span className="flex-1 text-sm text-slate-700 font-medium">{speaker.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpeaker(speaker.id)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label={`Remove ${speaker.name}`}
                      >
                        <XClose className="h-4 w-4" />
                      </button>
                    </div>
                    {/* Role Dropdown */}
                    <select
                      value={speaker.role}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          speakers: prev.speakers.map(s =>
                            s.id === speaker.id ? { ...s, role: e.target.value } : s
                          )
                        }))
                      }}
                      className="w-full rounded-md border border-primary/10 bg-primary/5 px-2 py-1 text-xs text-primary font-medium focus:border-primary/10 focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="Chairman">Chairman</option>
                      <option value="Speaker">Speaker</option>
                      <option value="Panelist">Panelist</option>
                      <option value="Moderator">Moderator</option>
                    </select>
                  </div>
                ))}

                {/* Add User Button */}
                <button
                  type="button"
                  onClick={handleAddSpeaker}
                  className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium transition-colors self-center"
                >
                  <Plus className="h-4 w-4" />
                  Add user
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Text */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <SectionHeader
              title="Description"
              onRemove={() => {}}
            />
            <div className="p-4">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description..."
                rows={6}
                className="w-full min-h-[150px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>

          {/* Section 4: Hyperlink */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <SectionHeader
              title="Hyperlink"
              onRemove={() => {}}
            />
            <div className="bg-white p-4">
              <label className="block mb-2">
                <span className="text-sm font-semibold text-slate-900">Links</span>
              </label>
              <Input
                type="text"
                value={formData.hyperlinks[0] || ''}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData(prev => ({
                    ...prev,
                    hyperlinks: value ? [value] : []
                  }))
                }}
                placeholder="Paste link here"
                className="w-full"
              />
            </div>
          </div>

          {/* Section 5: Resources */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <SectionHeader
              title="Resources"
              onRemove={() => {}}
            />
            <div className="p-4">
              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full bg-primary hover:bg-primary/90"
                iconLeading={<Upload01 className="h-4 w-4" />}
              >
                Upload docs
              </Button>
            </div>
          </div>

          {/* Section 6: Live Chat */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <SectionHeader
              title="Live Chat"
              onRemove={() => {}}
            />
            <div className="bg-white p-4 space-y-4">
              {/* Live Chat Label */}
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Live Chat</span>
              </label>

              {/* Chat Messages Area */}
              <div className="w-full min-h-[200px] rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-center">
                <span className="text-slate-500 text-sm">Live chat will appear here</span>
              </div>

              {/* Comment Input Area */}
              <div className="space-y-3">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formData.comment}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Comment"
                    className="flex-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    className="absolute right-2 p-1.5 text-slate-400 hover:text-primary transition-colors"
                    aria-label="Send comment"
                  >
                    <Send01 className="h-5 w-5" />
                  </button>
                </div>

                {/* Anonymous Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.submitAnonymous}
                    onChange={(e) => setFormData(prev => ({ ...prev, submitAnonymous: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-slate-700">Submit as anonymous</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Slideout>

      <SectionPickerModal
        isOpen={isSectionModalOpen}
        selectedSectionId={selectedSectionId}
        onClose={handleCloseSectionModal}
        onSelect={(sectionId) => setSelectedSectionId(sectionId)}
        onConfirm={handleConfirmSection}
        options={sectionOptions}
      />
    </>
  )
}

export default TemplateSessionSlideout
