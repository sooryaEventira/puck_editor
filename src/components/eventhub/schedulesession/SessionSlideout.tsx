import React, { useEffect, useMemo, useState } from 'react'
import Slideout from '../../ui/untitled/Slideout'
import SessionDetailsForm from './SessionDetailsForm'
import SectionPickerModal from './SectionPickerModal'
import SessionSummaryView from './SessionSummaryView'
import { defaultSessionDraft, sectionOptions } from './sessionConfig'
import { SessionDraft } from './sessionTypes'

interface SessionSlideoutProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (session: SessionDraft) => void
  initialDraft?: SessionDraft | null
  startInEditMode?: boolean
  topOffset?: number
  panelWidthRatio?: number
  availableTags?: string[]
  availableLocations?: string[]
}

const SessionSlideout: React.FC<SessionSlideoutProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDraft,
  startInEditMode = true,
  topOffset = 64,
  panelWidthRatio = 0.5,
  availableTags = [],
  availableLocations = []
}) => {
  const [draft, setDraft] = useState<SessionDraft>(defaultSessionDraft)
  const [tagsInput, setTagsInput] = useState('')
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sectionOptions[0]?.id ?? 'slides')
  const [isEditing, setIsEditing] = useState(startInEditMode)


  useEffect(() => {
    if (!isOpen) {
      setDraft(defaultSessionDraft)
      setTagsInput('')
      setIsSectionModalOpen(false)
      setSelectedSectionId(sectionOptions[0]?.id ?? 'slides')
      setIsEditing(true)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const sourceDraft = initialDraft
      ? {
          ...defaultSessionDraft,
          ...initialDraft,
          tags: [...(initialDraft.tags ?? [])],
          sections: initialDraft.sections?.map((section) => ({ ...section })) ?? []
        }
      : defaultSessionDraft

    setDraft(sourceDraft)
    setTagsInput(sourceDraft.tags.join(', '))
    setIsSectionModalOpen(false)
    setSelectedSectionId(sectionOptions[0]?.id ?? 'slides')
    setIsEditing(startInEditMode || !initialDraft)
  }, [initialDraft, isOpen, startInEditMode])

  const handleChange = <K extends keyof SessionDraft>(key: K, value: SessionDraft[K]) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const handleAddSection = () => {
    if (!isEditing) {
      return
    }
    setIsSectionModalOpen(true)
    setSelectedSectionId(sectionOptions[0]?.id ?? 'slides')
  }

  const handleConfirmSection = () => {
    const section = sectionOptions.find((item) => item.id === selectedSectionId) ?? sectionOptions[0]
    if (!section) {
      setIsSectionModalOpen(false)
      return
    }

    const sectionDescription =
      section.id === 'text'
        ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio dictumst tempus magna elit cras posuere cursus pulvinar id. Facilisis at eu amet ornare enim arcu malesuada rutrum a.'
        : undefined

    setDraft((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: `section-${Date.now()}`,
          type: section.id,
          title: section.label,
          description: sectionDescription
        }
      ]
    }))

    setIsSectionModalOpen(false)
  }

  const handleCloseSectionModal = () => {
    setIsSectionModalOpen(false)
  }

  const tagTokens = useMemo(
    () =>
      tagsInput
        .split(',')
        .map((token) => token.trim())
        .filter(Boolean),
    [tagsInput]
  )

  useEffect(() => {
    // Only sync tags from tagsInput if we're using the Input field (no availableTags)
    if (availableTags.length === 0) {
      handleChange('tags', tagTokens)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagTokens.join(','), availableTags.length])

  // Sync tagsInput with draft.tags when using dropdowns
  useEffect(() => {
    if (availableTags.length > 0 && draft.tags) {
      setTagsInput(draft.tags.join(', '))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.tags.join(','), availableTags.length])

  const handleSave = () => {
    if (onSave) {
      onSave(draft)
    }
    setIsEditing(false)
    setIsSectionModalOpen(false)
    setTagsInput(draft.tags.join(', '))
  }

  const handleBeginEdit = () => {
    setTagsInput(draft.tags.join(', '))
    setIsEditing(true)
  }

  const footerContent = (
    <>
      {isEditing ? (
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
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Save
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={handleBeginEdit}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Edit
        </button>
      )}
    </>
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
        <div className="px-6 py-4">
          {isEditing ? (
            <SessionDetailsForm
              draft={draft}
              tagsInput={tagsInput}
              onFieldChange={handleChange}
              onTagsInputChange={setTagsInput}
              onAddSectionClick={handleAddSection}
              availableTags={availableTags}
              availableLocations={availableLocations}
            />
          ) : (
            <SessionSummaryView session={draft} />
          )}
        </div>
      </Slideout>

      {isEditing && (
        <SectionPickerModal
          isOpen={isSectionModalOpen}
          selectedSectionId={selectedSectionId}
          onClose={handleCloseSectionModal}
          onSelect={(sectionId) => setSelectedSectionId(sectionId)}
          onConfirm={handleConfirmSection}
          options={sectionOptions}
        />
      )}
    </>
  )
}

export default SessionSlideout


