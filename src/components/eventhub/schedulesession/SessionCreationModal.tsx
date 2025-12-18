import React, { useState } from 'react'
import Modal from '../../ui/Modal'
import Button from '../../ui/untitled/Button'
import { XClose } from '@untitled-ui/icons-react'

export type SessionCreationType = 'template' | 'scratch'

interface SessionCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: SessionCreationType) => void
}

const SessionCreationModal: React.FC<SessionCreationModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [selectedType, setSelectedType] = useState<SessionCreationType>('template')

  const handleSelect = () => {
    onSelect(selectedType)
    onClose()
  }

  return (
    <Modal
      isVisible={isOpen}
      onClose={onClose}
      title=""
      showCloseButton={false}
      customHeader={
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-slate-700">
              How do you want to create a session?
            </h2>
            <p className="text-sm text-slate-500">Choose a template or create from scratch</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 -mt-1 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <XClose className="h-5 w-5" />
          </button>
        </div>
      }
      width={500}
      padding={{ top: 24, right: 24, bottom: 24, left: 24 }}
      footer={
        <div className="flex items-center justify-between mb-2">
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors "
            onClick={(e) => {
              e.preventDefault()
              // Handle help link click
            }}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-xs text-slate-600">
              ?
            </span>
            <span>Need help?</span>
          </a>
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
              onClick={handleSelect}
            >
              Select
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-4">
        <div className="grid grid-cols-2 gap-4 mb-2 -mt-1">
          {/* Template Option */}
          <button
            type="button"
            onClick={() => setSelectedType('template')}
            className={`flex items-center justify-between rounded-lg border-2 p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              selectedType === 'template'
                ? 'border-primary bg-white'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="text-sm font-medium text-slate-900">Template</span>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 flex-shrink-0 ${
                selectedType === 'template'
                  ? 'border-primary bg-primary'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selectedType === 'template' && (
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              )}
            </span>
          </button>

          {/* Create from scratch Option */}
          <button
            type="button"
            onClick={() => setSelectedType('scratch')}
            className={`flex items-center justify-between rounded-lg border-2 p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              selectedType === 'scratch'
                ? 'border-primary bg-white'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="text-sm font-medium text-slate-900">Create from scratch</span>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 flex-shrink-0 ${
                selectedType === 'scratch'
                  ? 'border-primary bg-primary'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selectedType === 'scratch' && (
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              )}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default SessionCreationModal

