import React from 'react'
import Modal from '../../ui/Modal'
import Button from '../../ui/untitled/Button'
import { SectionOption } from './sessionTypes'

interface SectionPickerModalProps {
  isOpen: boolean
  selectedSectionId: string
  onClose: () => void
  onSelect: (sectionId: string) => void
  onConfirm: () => void
  options: SectionOption[]
}

const SectionPickerModal: React.FC<SectionPickerModalProps> = ({
  isOpen,
  selectedSectionId,
  onClose,
  onSelect,
  onConfirm,
  options
}) => {
  if (!isOpen) return null

  return (
    <Modal
      title=""
      isVisible={isOpen}
      onClose={onClose}
      showCloseButton={false}
      customHeader={
        <div className="flex items-start justify-between px-[24px] pt-[38px]">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-slate-900">Add a new section</h3>
            <p className="text-sm text-slate-500">Sections for sessions</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Close add section modal"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
      footer={null}
      width={689}
      height={571}
      padding={{ top: 0, right: 24, bottom: 48, left: 24 }}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="grid flex-1 gap-4 overflow-y-auto pr-1 md:grid-cols-2">
          {options.map((option) => {
            const isSelected = option.id === selectedSectionId

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                className={`flex h-[56.833px] w-full md:w-[300.5px] items-center justify-between rounded-lg border px-4 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  isSelected ? 'border-primary/60 ring-2 ring-primary/20 bg-primary/5' : 'border-slate-200 bg-white hover:border-primary/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* <span className="inline-flex h-10 w-16 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {option.label.slice(0, 2)}
                  </span> */}
                  <span className="text-sm font-medium text-slate-600">{option.label}</span>
                </div>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    isSelected ? 'border-primary bg-primary' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40" />
            Need help?
          </label>

          <div className="flex items-center gap-3">
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
              onClick={onConfirm}
            >
              Select
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SectionPickerModal
