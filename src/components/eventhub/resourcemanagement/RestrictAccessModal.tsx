import React, { useState } from 'react'
import { Modal } from '../../ui'
import { Button } from '../../ui/untitled'
import { Input } from '../../ui/untitled'
import { XClose, ChevronDown } from '@untitled-ui/icons-react'

interface RestrictAccessModalProps {
  isVisible: boolean
  onClose: () => void
  onSave: (visibility: string, groups: string[], applyToSubFolders: boolean) => void
  itemName?: string
  itemType?: 'folder' | 'file'
}

const RestrictAccessModal: React.FC<RestrictAccessModalProps> = ({
  isVisible,
  onClose,
  onSave,
  itemName,
  itemType = 'folder'
}) => {
  const [visibility, setVisibility] = useState('')
  const [groups, setGroups] = useState<string[]>([])
  const [applyToSubFolders, setApplyToSubFolders] = useState(false)

  const handleSave = () => {
    onSave(visibility, groups, applyToSubFolders)
    handleClose()
  }

  const handleClose = () => {
    setVisibility('')
    setGroups([])
    setApplyToSubFolders(false)
    onClose()
  }

  const visibilityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'restricted', label: 'Restricted' }
  ]

  const groupOptions = [
    { value: 'group1', label: 'Group 1' },
    { value: 'group2', label: 'Group 2' },
    { value: 'group3', label: 'Group 3' }
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
              Restrict
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Control who can view this {itemType}'s content
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
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      }
    >
      <div className="pt-4 pb-2 space-y-4">
        {/* Visibility Select */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Visibility
          </label>
          <div className="relative">
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">eg.Photo gallery</option>
              {visibilityOptions.map((option) => (
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

        {/* Allow Access by Group Select */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Allow access by group
          </label>
          <div className="relative">
            <select
              value={groups.join(',')}
              onChange={(e) => {
                const selectedValues = e.target.value ? e.target.value.split(',') : []
                setGroups(selectedValues)
              }}
              multiple={false}
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select groups</option>
              {groupOptions.map((option) => (
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

        {/* Apply to Sub-folders Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="applyToSubFolders"
            checked={applyToSubFolders}
            onChange={(e) => setApplyToSubFolders(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
          />
          <label htmlFor="applyToSubFolders" className="text-sm text-slate-700 cursor-pointer">
            Apply restriction to all sub-folders
          </label>
        </div>
      </div>
    </Modal>
  )
}

export default RestrictAccessModal

