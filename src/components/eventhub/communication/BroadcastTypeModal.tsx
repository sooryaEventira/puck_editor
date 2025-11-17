import React, { useState } from 'react'
import { Modal } from '../../ui'

export type BroadcastType = 'email' | 'push-notification'

interface BroadcastTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: BroadcastType) => void
}

const BroadcastTypeModal: React.FC<BroadcastTypeModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [selectedType, setSelectedType] = useState<BroadcastType | null>('push-notification')

  const handleSelect = (type: BroadcastType) => {
    setSelectedType(type)
    onSelect(type)
    onClose()
  }

  const handleClose = () => {
    setSelectedType(null)
    onClose()
  }

  return (
    <Modal
      isVisible={isOpen}
      onClose={handleClose}
      title="Select broadcast type"
      subtitle="Choose how to deliver your message to recipients."
      width={548}
      height={195}
      maxWidth={548}
      borderRadius={16}
      showHeaderBorder={false}
      padding={{
        top: 24,
        right: 24,
        bottom: 24,
        left: 24
      }}
    >
      <div className="flex items-center justify-center gap-3 pb-6">
        {/* Email Card */}
        <button
          type="button"
          onClick={() => handleSelect('email')}
          className={`flex w-[240px] max-w-[240px] h-[84px] flex-col gap-3 rounded-xl border pt-4 pr-8 pb-4 pl-8 text-left transition-all ${
            selectedType === 'email'
              ? 'border-primary bg-primary/5'
              : 'border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-slate-900">Email</span>
              <span className="text-xs text-slate-500">
                Send via email to subscriber inboxes.
              </span>
            </div>
            <div className="flex h-5 w-5 items-center justify-center">
              <input
                type="radio"
                name="broadcast-type"
                checked={selectedType === 'email'}
                onChange={() => handleSelect('email')}
                className="h-4 w-4 border-slate-300 text-primary focus:ring-primary/40 accent-primary"
              />
            </div>
          </div>
        </button>

        {/* Push Notification Card */}
        <button
          type="button"
          onClick={() => handleSelect('push-notification')}
          className={`flex w-[240px] max-w-[240px] h-[84px] flex-col gap-3 rounded-xl border pt-4 pr-8 pb-4 pl-8 text-left transition-all ${
            selectedType === 'push-notification'
              ? 'border-2 border-primary bg-primary/5'
              : 'border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-slate-900">
                Push Notification
              </span>
              <span className="text-xs text-slate-500">
                Send instant mobile/ browser notifications.
              </span>
            </div>
            <div className="flex h-5 w-5 items-center justify-center">
              <input
                type="radio"
                name="broadcast-type"
                checked={selectedType === 'push-notification'}
                onChange={() => handleSelect('push-notification')}
                className="h-4 w-4 border-slate-300 text-primary focus:ring-primary/40 accent-primary"
              />
            </div>
          </div>
        </button>
      </div>
    </Modal>
  )
}

export default BroadcastTypeModal

