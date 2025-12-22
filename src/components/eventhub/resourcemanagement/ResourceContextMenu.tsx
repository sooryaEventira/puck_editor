import React, { useEffect, useRef } from 'react'

interface ContextMenuOption {
  label: string
  action: () => void
  variant?: 'default' | 'destructive'
}

interface ResourceContextMenuProps {
  isOpen: boolean
  onClose: () => void
  options: ContextMenuOption[]
  position: { x: number; y: number }
}

const ResourceContextMenu: React.FC<ResourceContextMenuProps> = ({
  isOpen,
  onClose,
  options,
  position
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="fixed z-50 rounded-lg border border-slate-200 bg-white shadow-lg py-1"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: 'max-content'
      }}
    >
      {options.map((option, index) => (
        <button
          key={index}
          type="button"
          onClick={() => {
            option.action()
            onClose()
          }}
          className={`block w-full px-2.5 py-1.5 text-left text-sm transition-colors whitespace-nowrap ${
            option.variant === 'destructive'
              ? 'text-rose-600 hover:bg-rose-50'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default ResourceContextMenu

