import React, { useState } from 'react'
import clsx from 'clsx'
import { HelpCircle } from '@untitled-ui/icons-react'
import { Modal } from '../ui'

interface BlockTypeSelectionModalProps {
  isVisible: boolean
  onClose: () => void
  onSelect: (blockType: string) => void
}

type BlockType = 'empty' | 'lists' | 'hero' | 'speakers' | 'gallery' | 'location'

const blockTypes: { id: BlockType; title: string; description: string }[] = [
  { id: 'empty', title: 'Empty block', description: 'Create custom block.' },
  { id: 'lists', title: 'Lists', description: 'List.' },
  { id: 'hero', title: 'Hero', description: 'Hero block.' },
  { id: 'speakers', title: 'Speakers', description: 'List of speakers.' },
  { id: 'gallery', title: 'Gallery', description: 'Photo gallery.' },
  { id: 'location', title: 'Location', description: 'Venue/ location.' },
]

const BlockTypeSelectionModal: React.FC<BlockTypeSelectionModalProps> = ({
  isVisible,
  onClose,
  onSelect,
}) => {
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType>('empty')

  const handleSelect = () => {
    const blockType = selectedBlockType
    onClose()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onSelect(blockType)
      })
    })
  }

  const footer = (
    <div className="flex w-full items-center justify-between px-6 pb-6 pt-4">
      <button
        type="button"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
      >
        <HelpCircle className="h-4 w-4" aria-hidden="true" />
        Need help?
      </button>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="min-w-[80px] rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSelect}
          data-modal-select-button="true"
          className="min-w-[80px] rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          Select
        </button>
      </div>
    </div>
  )

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title="Select block type"
      subtitle="Select a style for your block."
      width={560}
      height={414}
      maxWidth={560}
      borderRadius={16}
      padding={{ top: 24, right: 16, bottom: 24, left: 16 }}
      footer={footer}
      zIndex={10000}
      contentStyle={{ padding: 0 }}
    >
      <div className="grid place-items-center gap-4 px-6 py-5 sm:grid-cols-2">
        {blockTypes.map((blockType) => {
          const isSelected = selectedBlockType === blockType.id

          return (
            <button
              key={blockType.id}
              type="button"
              onClick={() => setSelectedBlockType(blockType.id)}
              className={clsx(
                'relative flex h-16 w-[240px] max-w-[240px] flex-col gap-1 rounded-lg border bg-white p-3 text-left transition hover:border-primary/40 hover:bg-primary/5 focus:outline-none',
                isSelected ? 'border-2 border-primary bg-primary/5' : 'border-slate-200'
              )}
            >
              <div className="flex flex-1 flex-col gap-1 pr-9">
                <span className="truncate text-[15px] font-semibold text-slate-900">
                  {blockType.title}
                </span>
                <span className="line-clamp-2 text-[13px] text-slate-500">
                  {blockType.description}
                </span>
              </div>
              <span
                className={clsx(
                  'absolute right-3 top-3 h-5 w-5 rounded-full border transition',
                  isSelected ? 'border-[6px] border-primary' : 'border-2 border-slate-300'
                )}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>
    </Modal>
  )
}

export default BlockTypeSelectionModal
