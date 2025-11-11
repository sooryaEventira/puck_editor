import React, { useEffect, useMemo, useState } from 'react'
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
}

const SessionSlideout: React.FC<SessionSlideoutProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDraft,
  startInEditMode = true,
  topOffset = 64,
  panelWidthRatio = 0.8
}) => {
  const [draft, setDraft] = useState<SessionDraft>(defaultSessionDraft)
  const [tagsInput, setTagsInput] = useState('')
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sectionOptions[0]?.id ?? 'slides')
  const [isEditing, setIsEditing] = useState(startInEditMode)

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
    handleChange('tags', tagTokens)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagTokens.join(',')])

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

  const containerStyle: React.CSSProperties = {
    top: topOffset,
    right: 0,
    left: 0,
    bottom: 0
  }

  const panelStyle: React.CSSProperties = {
    height: `calc(100vh - ${topOffset}px)`,
    width: `${Math.min(Math.max(panelWidthRatio, 0.4), 1) * 100}%`,
    maxWidth: '960px'
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
        <header className="flex items-center justify-end border-slate-200 px-6 py-2">
          <button
            type="button"
            className="ml-auto rounded-full p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isEditing ? (
            <SessionDetailsForm
              draft={draft}
              tagsInput={tagsInput}
              onFieldChange={handleChange}
              onTagsInputChange={setTagsInput}
              onAddSectionClick={handleAddSection}
            />
          ) : (
            <SessionSummaryView session={draft} />
          )}
        </div>

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

        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
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
        </footer>
      </aside>
    </div>
  )
}

export default SessionSlideout


