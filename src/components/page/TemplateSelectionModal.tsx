import React, { useState } from 'react'
import clsx from 'clsx'
import { HelpCircle } from '@untitled-ui/icons-react'
import { Modal } from '../ui'

interface TemplateSelectionModalProps {
  isVisible: boolean
  onClose: () => void
  onSelect: (templateType: string) => void
}

type TemplateType = 'schedule' | 'sponsor' | 'floor-plan' | 'lists'

const templateNames: Record<TemplateType, string> = {
  schedule: 'Schedule',
  sponsor: 'Sponsor',
  'floor-plan': 'Floor plan',
  lists: 'Lists'
}

const templates: { id: TemplateType; title: string; description: string }[] = [
  { id: 'schedule', title: 'Schedule', description: 'Program schedule.' },
  { id: 'sponsor', title: 'Sponsor', description: 'Sponsor page.' },
  { id: 'floor-plan', title: 'Floor plan', description: 'pdf, jpeg.' },
  { id: 'lists', title: 'Lists', description: 'List view.' }
]

const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  isVisible,
  onClose,
  onSelect
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('schedule')

  const handleSelect = () => {
    const template = selectedTemplate
    onClose()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onSelect(template)
      })
    })
  }

  const footer = (
    <div className="flex w-full items-center justify-between px-6 pb-6 pt-4">
      <button
        type="button"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
      >
        <HelpCircle className="h-4 w-4" aria-hidden="true" />
        Need help?
      </button>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="min-w-[80px] rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSelect}
          data-modal-select-button="true"
          className="min-w-[80px] rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          Select
        </button>
      </div>
    </div>
  )

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title="Select a page"
      subtitle="Select from below templates."
      width={560}
      height={330}
      maxWidth={560}
      borderRadius={16}
      padding={{ top: 24, right: 16, bottom: 24, left: 16 }}
      footer={footer}
      zIndex={10001}
      contentStyle={{ padding: 0 }}
    >
      <div className="grid place-items-center gap-4 px-6 py-5 sm:grid-cols-2">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplate(template.id)}
              className={clsx(
                'relative flex h-16 w-[240px] max-w-[240px] flex-col gap-1 rounded-lg border bg-white p-3 text-left transition hover:border-primary/40 hover:bg-primary/5 focus:outline-none',
                isSelected ? 'border-2 border-primary bg-primary/5' : 'border-slate-200'
              )}
            >
              <div className="flex flex-1 flex-col gap-1 pr-9">
                <span className="truncate text-[15px] font-semibold text-slate-900">
                  {template.title}
                </span>
                <span className="line-clamp-2 text-[13px] text-slate-500">
                  {template.description}
                </span>
              </div>
              <span
                className={clsx(
                  'absolute right-3 top-3 h-5 w-5 rounded-full border transition',
                  isSelected ? 'border-[6px] border-primary' : 'border-2 border-slate-300'
                )}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>
    </Modal>
  )
}

export default TemplateSelectionModal

