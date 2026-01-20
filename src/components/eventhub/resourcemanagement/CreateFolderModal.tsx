import React, { useState, useEffect, useRef } from 'react'
import { Modal } from '../../ui'
import { Button } from '../../ui/untitled'

interface CreateFolderModalProps {
  isVisible: boolean
  onClose: () => void
  onCreate: (folderName: string) => void
  initialName?: string
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isVisible,
  onClose,
  onCreate,
  initialName = ''
}) => {
  const [folderName, setFolderName] = useState(initialName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isVisible) {
      setFolderName(initialName)
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 100)
    }
  }, [isVisible, initialName])

  const handleSubmit = () => {
    if (folderName.trim()) {
      onCreate(folderName.trim())
      setFolderName('')
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title={initialName ? 'Rename folder' : 'Create folder'}
      subtitle={initialName ? 'Enter a new name for this folder' : 'Enter a name for the new folder'}
      width={400}
      showHeaderBorder={false}
      footer={
        <div className="flex justify-end gap-3 mb-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!folderName.trim()}>
            {initialName ? 'Rename' : 'Create'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Folder name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Enter folder name"
            autoFocus
          />
        </div>
      </div>
    </Modal>
  )
}

export default CreateFolderModal

