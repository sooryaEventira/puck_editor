import React, { useState } from 'react'
import { Modal } from '../../ui'
import { Button } from '../../ui/untitled'
import { Folder } from '@untitled-ui/icons-react'

interface MediaFolder {
  id: string
  name: string
}

interface MoveToFolderModalProps {
  isVisible: boolean
  onClose: () => void
  onMove: (folderId: string | null) => void
  folders: MediaFolder[]
  currentFolderId?: string
  fileName: string
}

const MoveToFolderModal: React.FC<MoveToFolderModalProps> = ({
  isVisible,
  onClose,
  onMove,
  folders,
  currentFolderId,
  fileName
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  const handleMove = () => {
    onMove(selectedFolderId)
    onClose()
  }

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title="Move to folder"
      subtitle={`Move "${fileName}" to a folder`}
      width={400}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleMove}>
            Move
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select folder
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedFolderId(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                selectedFolderId === null
                  ? 'bg-primary/10 border border-primary'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Folder className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-700">All media (root)</span>
            </button>
            {folders
              .filter((folder) => folder.id !== currentFolderId)
              .map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                    selectedFolderId === folder.id
                      ? 'bg-primary/10 border border-primary'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Folder className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700">{folder.name}</span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default MoveToFolderModal

