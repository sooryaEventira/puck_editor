import React, { useState } from 'react'
import clsx from 'clsx'
import { HelpCircle } from '@untitled-ui/icons-react'
import { Modal } from '../ui'

export type PageCreationType = 'scratch' | 'template' | 'html'

interface PageCreationOption {
  id: PageCreationType
  title: string
  description: string
}

const pageCreationOptions: PageCreationOption[] = [
  { id: 'scratch', title: 'Create from scratch', description: 'Create a custom page from scratch.' },
  { id: 'template', title: 'Templates', description: 'Choose from pre-designed layouts.' },
  { id: 'html', title: 'HTML Code', description: 'Paste html code to create custom pages.' }
]

interface NewPageCreationModalProps {
  isVisible: boolean
  onClose: () => void
  onSelect: (pageType: PageCreationType) => void
}

const NewPageCreationModal: React.FC<NewPageCreationModalProps> = ({
  isVisible,
  onClose,
  onSelect
}) => {
  const [selectedType, setSelectedType] = useState<PageCreationType>('scratch')

  const handleSelect = () => {
    onClose()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onSelect(selectedType)
      })
    })
  }

  const footer = (
    <div className="flex w-full items-center justify-between px-6 pb-6 pt-1.5">
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
          className="min-w-[80px] rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSelect}
          data-modal-select-button="true"
          className="min-w-[80px] rounded-md bg-[#6938EF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5925DC]"
        >
          Select
        </button>
      </div>
    </div>
  )

  const renderOption = (option: PageCreationOption) => {
    const isSelected = selectedType === option.id
    return (
      <label
        key={option.id}
        className="flex items-center cursor-pointer h-full"
      >
        <input
          type="radio"
          name="pageCreationType"
          value={option.id}
          checked={isSelected}
          onChange={() => setSelectedType(option.id)}
          className="sr-only"
        />
        <div className={clsx(
          'flex items-start gap-3 w-full h-full rounded-lg border-2 p-3 transition-all cursor-pointer',
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-slate-300 bg-white hover:border-slate-400'
        )}>
          <div className={clsx(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition',
            isSelected
              ? 'border-primary bg-primary'
              : 'border-slate-400 bg-white'
          )}>
            {isSelected && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <span className={clsx(
              'text-sm font-semibold',
              isSelected ? 'text-primary' : 'text-slate-900'
            )}>
              {option.title}
            </span>
            <span className="text-xs text-slate-500 leading-snug">
              {option.description}
            </span>
          </div>
        </div>
      </label>
    )
  }

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title="Create new page"
      subtitle="Choose how you want to build your page."
      width={640}
      maxWidth={640}
      borderRadius={16}
      footer={footer}
      zIndex={10000}
      showCloseButton={true}
    >
      <div className="grid grid-cols-2 gap-4 px-6 py-6" style={{ gridAutoRows: '1fr' }}>
        {pageCreationOptions.map((option) => renderOption(option))}
      </div>
    </Modal>
  )
}

export default NewPageCreationModal

