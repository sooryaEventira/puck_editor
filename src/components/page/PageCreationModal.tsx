import React, { useState } from 'react'
import clsx from 'clsx'
import { HelpCircle } from '@untitled-ui/icons-react'
import { Modal } from '../ui'

interface PageCreationModalProps {
  isVisible: boolean
  onClose: () => void
  onSelect: (mode: 'scratch' | 'template' | 'html', blockType?: string) => void
}

const PageCreationModal: React.FC<PageCreationModalProps> = ({
  isVisible,
  onClose,
  onSelect
}) => {
  const [selectedMode, setSelectedMode] = useState<'scratch' | 'template' | 'html'>('scratch')

  const handleSelect = () => {
    const mode = selectedMode
    onClose()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onSelect(mode)
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

  const optionBaseClasses =
    'relative flex w-full cursor-pointer flex-col gap-1 rounded-lg border bg-white p-3 transition hover:border-primary/40 hover:bg-primary/5 focus:outline-none'

  const renderCard = (
    mode: 'scratch' | 'template' | 'html',
    title: string,
    description: string,
    extraClasses?: string
  ) => {
    const isSelected = selectedMode === mode
    return (
      <button
        key={mode}
        type="button"
        onClick={() => setSelectedMode(mode)}
        className={clsx(optionBaseClasses, extraClasses, isSelected ? 'border-2 border-primary bg-primary/5' : 'border-slate-200')}
      >
        <div className="flex flex-1 flex-col gap-1 pr-9 text-left">
          <span className="text-[15px] font-semibold text-slate-900">{title}</span>
          <span className="line-clamp-1 text-[13px] text-slate-500">{description}</span>
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
  }

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title="Select from below"
      width={548}
      height={350}
      maxWidth={548}
      maxHeight="90vh"
      borderRadius={16}
      footer={footer}
      zIndex={10000}
      padding={{ top: 0, right: 0, bottom: 24, left: 0 }}
      customHeader={(
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 self-stretch px-6 pt-1.5">
          <div className="flex w-full flex-col items-start justify-start gap-1">
            <p className="font-['Inter'] text-base font-semibold leading-6 text-slate-900">Select from below</p>
            <p className="font-['Inter'] text-sm font-normal leading-5 text-slate-500">Choose how you want to build your page</p>
          </div>
        </div>
      )}
      contentStyle={{ padding: 0 }}
    >
      <div className="grid gap-3 px-6 py-1.5 sm:grid-cols-2 sm:justify-items-center">
        {renderCard('scratch', 'Create from scratch', 'Create a custom page from scratch.', 'sm:w-[240px]')}
        {renderCard('template', 'Templates', 'Choose from pre-designed layouts.', 'sm:w-[240px]')}
        {renderCard('html', 'HTML Code', 'Paste html code to create custom pages.', 'sm:col-span-2 sm:w-[240px] sm:justify-self-center')}
      </div>
    </Modal>
  )
}

export default PageCreationModal
