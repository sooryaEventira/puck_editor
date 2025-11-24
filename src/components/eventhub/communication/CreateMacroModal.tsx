import React, { useState } from 'react'
import { Modal } from '../../ui'

interface CreateMacroModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: { name: string; source: string }) => void
}

const CreateMacroModal: React.FC<CreateMacroModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [name, setName] = useState('')
  const [source, setSource] = useState('')

  const handleConfirm = () => {
    if (name && source) {
      onConfirm({ name, source })
      setName('')
      setSource('')
    }
  }

  const handleClose = () => {
    setName('')
    setSource('')
    onClose()
  }

  return (
    <Modal
      isVisible={isOpen}
      onClose={handleClose}
      title="Create new macro"
      width={480}
      maxWidth={400}
      borderRadius={16}
      padding={{ top: 24, right: 24, bottom: 24, left: 24 }}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="macro-name" className="text-sm font-medium text-slate-700">
              Macro name <span className="text-primary">*</span>
            </label>
            <input
              id="macro-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter macro name"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="data-source" className="text-sm font-medium text-slate-700">
              Select data source <span className="text-primary">*</span>
            </label>
            <select
              id="data-source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>
                Select source
              </option>
              <option value="attendees">Attendees</option>
              <option value="speakers">Speakers</option>
              <option value="sponsors">Sponsors</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!name || !source}
            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default CreateMacroModal
