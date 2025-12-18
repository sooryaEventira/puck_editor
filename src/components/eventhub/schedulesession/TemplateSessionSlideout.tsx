import React, { useState } from 'react'
import Slideout from '../../ui/untitled/Slideout'
import Input from '../../ui/untitled/Input'
import Select from '../../ui/untitled/Select'
import Button from '../../ui/untitled/Button'
import { XClose, Plus, ChevronDown, ChevronUp, Upload01 } from '@untitled-ui/icons-react'

interface TemplateSessionData {
  title: string
  startTime: string
  endTime: string
  location: string
  sessionType: string
  tags: string
  videoUrl?: string
  speakers: Array<{ id: string; name: string; role: string }>
  description: string
  resources: string
  liveChatEnabled: boolean
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
    tags: '',
    speakers: [],
    description: '',
    resources: '',
    liveChatEnabled: false
  })
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false)

  const handleRemoveSpeaker = (speakerId: string) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter(s => s.id !== speakerId)
    }))
  }

  const handleAddSpeaker = () => {
    // This would typically open a user picker modal
    // For now, adding a placeholder speaker
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

  const handleSave = () => {
    if (onSave) {
      onSave(formData)
    }
    onClose()
  }

  const footerContent = (
    <>
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
      >
        Save
      </Button>
    </>
  )

  return (
    <Slideout
      isOpen={isOpen}
      onClose={onClose}
      title="Session Template"
      topOffset={topOffset}
      panelWidthRatio={panelWidthRatio}
      footer={footerContent}
    >
      <div className="flex flex-col h-full">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* A. Title Section */}
          <div className="space-y-4">
            <Input
              label="Title *"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter session title"
            />

            {/* Inline fields - all in one row */}
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
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                options={[
                  { value: '', label: 'Select tags' },
                  ...availableTags.map(tag => ({ value: tag, label: tag }))
                ]}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* B. Video Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">Video</label>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Remove video section"
              >
                <XClose className="h-4 w-4" />
              </button>
            </div>
            <div className="w-full h-64 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-slate-400 text-sm">Video placeholder</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* C. Speakers Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">Speakers</label>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Remove speakers section"
              >
                <XClose className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.speakers.map((speaker) => (
                <div
                  key={speaker.id}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm"
                >
                  <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-xs text-slate-600">{speaker.name.charAt(0)}</span>
                  </div>
                  <span className="text-slate-700">{speaker.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpeaker(speaker.id)}
                    className="ml-1 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={`Remove ${speaker.name}`}
                  >
                    <XClose className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={handleAddSpeaker}
              iconLeading={<Plus className="h-4 w-4" />}
              className="text-primary hover:text-primary/80"
            >
              Add user
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* D. Text Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">Text</label>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Remove text section"
              >
                <XClose className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description..."
              rows={6}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* E. Resources Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">Resources</label>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Remove resources section"
              >
                <XClose className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={formData.resources}
              onChange={(e) => setFormData(prev => ({ ...prev, resources: e.target.value }))}
              placeholder="Add resources..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <Button
              type="button"
              variant="primary"
              size="md"
              className="w-full"
              iconLeading={<Upload01 className="h-4 w-4" />}
            >
              Upload doc
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* G. Live Chat Section */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsLiveChatOpen(!isLiveChatOpen)}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center justify-between w-full">
                <label className="text-sm font-semibold text-slate-900">Live Chat</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle remove
                    }}
                    aria-label="Remove live chat section"
                  >
                    <XClose className="h-4 w-4" />
                  </button>
                  {isLiveChatOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>
            </button>
            {isLiveChatOpen && (
              <textarea
                value={formData.liveChatEnabled ? 'Live chat will appear here' : ''}
                readOnly
                placeholder="Live chat will appear here"
                rows={4}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500 resize-none"
              />
            )}
          </div>
        </div>
      </div>
    </Slideout>
  )
}

export default TemplateSessionSlideout

