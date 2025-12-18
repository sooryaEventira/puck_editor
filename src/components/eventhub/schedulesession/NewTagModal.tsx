import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { HelpCircle } from '@untitled-ui/icons-react'
import { Modal } from '../../ui'
import Button from '../../ui/untitled/Button'

interface NewTagModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, color: string) => void
  type?: 'tag' | 'location' // Add type prop to distinguish between tag and location
}

const NewTagModal: React.FC<NewTagModalProps> = ({ isOpen, onClose, onSave, type = 'tag' }) => {
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [showColorDropdown, setShowColorDropdown] = useState(false)
  const colorButtonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null)

  // Predefined color options
  const colorOptions = [
    { value: '#3B82F6', label: 'Blue', color: '#3B82F6' },
    { value: '#10B981', label: 'Green', color: '#10B981' },
    { value: '#F59E0B', label: 'Amber', color: '#F59E0B' },
    { value: '#EF4444', label: 'Red', color: '#EF4444' },
    { value: '#8B5CF6', label: 'Purple', color: '#8B5CF6' },
    { value: '#EC4899', label: 'Pink', color: '#EC4899' },
    { value: '#06B6D4', label: 'Cyan', color: '#06B6D4' },
    { value: '#6366F1', label: 'Indigo', color: '#6366F1' },
    { value: '#14B8A6', label: 'Teal', color: '#14B8A6' },
    { value: '#F97316', label: 'Orange', color: '#F97316' }
  ]

  const handleSave = () => {
    if (name.trim() && selectedColor) {
      onSave(name.trim(), selectedColor)
      // Reset form
      setName('')
      setSelectedColor('')
      setShowColorDropdown(false)
    }
  }

  const handleClose = () => {
    setName('')
    setSelectedColor('')
    setShowColorDropdown(false)
    onClose()
  }

  const selectedColorOption = colorOptions.find((opt) => opt.value === selectedColor)

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (showColorDropdown && colorButtonRef.current) {
      const rect = colorButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      })
    } else {
      setDropdownPosition(null)
    }
  }, [showColorDropdown])

  const footer = (
    <div className="flex items-center justify-between pb-4">
      <a
        href="#"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors"
        onClick={(e) => {
          e.preventDefault()
          // TODO: Implement help functionality
        }}
      >
        <HelpCircle className="h-4 w-4" />
        <span>Need help?</span>
      </a>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={!name.trim() || !selectedColor}
        >
          Save
        </Button>
      </div>
    </div>
  )

  const title = type === 'location' ? 'New location' : 'New tag'
  const inputLabel = type === 'location' ? 'Location name' : 'Tag name'
  const inputId = type === 'location' ? 'location-name' : 'tag-name'
  const inputPlaceholder = type === 'location' ? 'Location name' : 'Tag name'

  return (
    <Modal
      isVisible={isOpen}
      onClose={handleClose}
      title={title}
      footer={footer}
      maxWidth="400px"
      padding={{ top: 24, right: 24, bottom: 24, left: 24 }}
    >
      <div className="space-y-2">
        {/* Name Input */}
        <div>
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">
            {inputLabel} <span className="text-red-500">*</span>
          </label>
          <input
            id={inputId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={inputPlaceholder}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoFocus
          />
        </div>

        {/* Color Select */}
        <div>
          <label htmlFor="tag-color" className="block text-sm font-medium text-slate-700 mb-1">
            Color
          </label>
          <div className="relative">
            <button
              ref={colorButtonRef}
              type="button"
              id="tag-color"
              onClick={() => setShowColorDropdown(!showColorDropdown)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {selectedColorOption ? (
                  <>
                    <div
                      className="h-4 w-4 rounded-full border border-slate-300"
                      style={{ backgroundColor: selectedColorOption.color }}
                    />
                    <span>{selectedColorOption.label}</span>
                  </>
                ) : (
                  <span className="text-slate-400">Choose Color</span>
                )}
              </div>
              <svg
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  showColorDropdown ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showColorDropdown && dropdownPosition && createPortal(
              <>
                <div
                  className="fixed inset-0 z-[10001]"
                  onClick={() => setShowColorDropdown(false)}
                />
                <div
                  className="fixed z-[10002] rounded-md border border-slate-200 bg-white shadow-lg max-h-60 overflow-auto"
                  style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                    width: `${dropdownPosition.width}px`
                  }}
                >
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedColor(option.value)
                        setShowColorDropdown(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className="h-4 w-4 rounded-full border border-slate-300"
                        style={{ backgroundColor: option.color }}
                      />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </>,
              document.body
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default NewTagModal

