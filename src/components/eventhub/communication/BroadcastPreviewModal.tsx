import React from 'react'
import { Modal } from '../../ui'

interface BroadcastPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: () => void
  subject: string
  message: string
}

const BroadcastPreviewModal: React.FC<BroadcastPreviewModalProps> = ({
  isOpen,
  onClose,
  onSend,
  subject,
  message
}) => {
  return (
    <Modal
      isVisible={isOpen}
      onClose={onClose}
      title="Preview "
      
      width={600}
      maxWidth={800}
      borderRadius={16}
      padding={{ top: 24, right: 24, bottom: 24, left: 24 }}
    >
      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-slate-200 p-4 space-y-4">
          <div>
            <span className="font-bold text-slate-900">Subject: </span>
            <span className="text-slate-700">{subject}</span>
          </div>
          <div className="border-t border-slate-200 pt-4">
             <div
              className="broadcast-editor-content text-slate-600"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSend}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Send
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BroadcastPreviewModal
