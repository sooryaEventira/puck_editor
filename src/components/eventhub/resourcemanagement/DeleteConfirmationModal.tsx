import React from 'react'
import { Modal } from '../../ui'
import { Button } from '../../ui/untitled'
import { XClose } from '@untitled-ui/icons-react'

interface DeleteConfirmationModalProps {
  isVisible: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  itemType: 'folder' | 'file'
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  itemName,
  itemType
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
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
              Delete {itemType === 'folder' ? 'folder' : 'file'}
            </h2>
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
      footer={
        <div className="flex justify-end gap-3 py-4 -mt-2 bg-white">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </div>
      }
    >
      <div className="pt-0 pb-2">
        <p className="text-md text-slate-600 leading-relaxed">
          Are you sure you want to delete "{itemName}"? This action cannot be undone.
        </p>
      </div>
    </Modal>
  )
}

export default DeleteConfirmationModal
