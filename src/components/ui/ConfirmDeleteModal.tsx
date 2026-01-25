import React, { useEffect, useMemo, useState } from 'react'
import { XClose } from '@untitled-ui/icons-react'
import Modal from './Modal'
import { Button } from './untitled'

export interface ConfirmDeleteModalProps {
  isVisible: boolean
  onClose: () => void
  /** Called when user confirms deletion. Throw/reject to keep modal open. */
  onConfirm: () => void | Promise<void>
  /** What is being deleted (used in copy). */
  itemLabel?: string
  /** Modal title override. */
  title?: string
  /** Modal description override. */
  description?: string
  confirmText?: string
  cancelText?: string
  /** Optional external loading state. If omitted, internal loading is used. */
  isLoading?: boolean
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  itemLabel,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading: externalLoading
}) => {
  const [internalLoading, setInternalLoading] = useState(false)
  const isLoading = externalLoading ?? internalLoading

  useEffect(() => {
    if (!isVisible) setInternalLoading(false)
  }, [isVisible])

  const resolvedTitle = title ?? 'Delete'
  const resolvedDescription = useMemo(() => {
    if (description) return description
    if (itemLabel) {
      return `Are you sure you want to delete "${itemLabel}"? This action cannot be undone.`
    }
    return 'Are you sure you want to delete this item? This action cannot be undone.'
  }, [description, itemLabel])

  const handleConfirm = async () => {
    if (isLoading) return
    setInternalLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (e) {
      // Keep modal open on error (caller should show toast)
    } finally {
      setInternalLoading(false)
    }
  }

  return (
    <Modal
      isVisible={isVisible}
      onClose={() => {
        if (!isLoading) onClose()
      }}
      title={``}
      subtitle={``}
      width={420}
      padding={{ top: 24, right: 24, bottom: 0, left: 24 }}
      showCloseButton={false}
      showHeaderBorder={false}
      customHeader={
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">{resolvedTitle}</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isLoading) onClose()
            }}
            className="inline-flex h-9 w-9 -mt-1 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Close"
          >
            <XClose className="h-5 w-5" />
          </button>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3 py-4 -mt-2 bg-white">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : confirmText}
          </Button>
        </div>
      }
    >
      <div className="pt-0 pb-2">
        <p className="text-md text-slate-600 leading-relaxed">{resolvedDescription}</p>
      </div>
    </Modal>
  )
}

export default ConfirmDeleteModal

