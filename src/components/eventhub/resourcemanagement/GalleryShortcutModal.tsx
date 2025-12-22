import React, { useState } from 'react'
import { Modal } from '../../ui'
import { Button } from '../../ui/untitled'
import { Input } from '../../ui/untitled'
import { XClose, ChevronDown } from '@untitled-ui/icons-react'

interface GalleryShortcutModalProps {
  isVisible: boolean
  onClose: () => void
  onSave: (shortcutName: string, displayType: string) => void
  fileName?: string
}

const GalleryShortcutModal: React.FC<GalleryShortcutModalProps> = ({
  isVisible,
  onClose,
  onSave,
  fileName
}) => {
  const [shortcutName, setShortcutName] = useState('')
  const [displayType, setDisplayType] = useState('')

  const handleSave = () => {
    if (shortcutName.trim() && displayType) {
      onSave(shortcutName.trim(), displayType)
      handleClose()
    }
  }

  const handleClose = () => {
    setShortcutName('')
    setDisplayType('')
    onClose()
  }

  const displayTypeOptions = [
    { value: 'file', label: 'File' },
    { value: 'folder', label: 'Folder' }
  ]

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleClose}
      title={``}
      subtitle={``}
      width={400}
      padding={{ top: 24, right: 24, bottom: 0, left: 24 }}
      showCloseButton={false}
      showHeaderBorder={false}
      customHeader={
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">
              Gallery/Shortcut
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Create gallery or shortcut to display in your website
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-9 w-9 -mt-1 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <XClose className="h-5 w-5" />
          </button>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3 py-4 -mt-2 bg-white">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={!shortcutName.trim() || !displayType}
          >
            Save shortcut
          </Button>
        </div>
      }
    >
      <div className="pt-4 pb-2 space-y-4">
        {/* Shortcut Name Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Shortcut name
          </label>
          <Input
            type="text"
            value={shortcutName}
            onChange={(e) => setShortcutName(e.target.value)}
            placeholder="eg.Photo gallery"
            className="w-full"
          />
        </div>

        {/* Display Type Select */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Display type (File/Folder)
          </label>
          <div className="relative">
            <select
              value={displayType}
              onChange={(e) => setDisplayType(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select type</option>
              {displayTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default GalleryShortcutModal

