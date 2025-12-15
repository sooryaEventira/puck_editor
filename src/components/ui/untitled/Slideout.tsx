import React, { useEffect, useRef } from 'react'
import { XClose } from '@untitled-ui/icons-react'

export interface SlideoutProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  topOffset?: number
  panelWidthRatio?: number
  maxWidth?: number | string
  side?: 'left' | 'right'
  width?: number | string
}

const Slideout: React.FC<SlideoutProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  topOffset = 64,
  panelWidthRatio = 0.4,
  maxWidth = '600px',
  side = 'right',
  width
}) => {
  const slideoutRef = useRef<HTMLElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement
      // Focus the slideout when it opens
      setTimeout(() => {
        slideoutRef.current?.focus()
      }, 100)
    } else {
      document.body.classList.remove('overflow-hidden')
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const slideout = slideoutRef.current
    if (!slideout) return

    const focusableElements = slideout.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    slideout.addEventListener('keydown', handleTabKey)
    return () => {
      slideout.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen])

  const containerStyle: React.CSSProperties = {
    top: `${topOffset}px`,
    right: 0,
    left: 0,
    bottom: 0
  }

  const panelStyle: React.CSSProperties = {
    height: `calc(100vh - ${topOffset}px)`,
    width: width
      ? typeof width === 'number'
        ? `${width}px`
        : width
      : `${Math.min(Math.max(panelWidthRatio, 0.3), 1) * 100}%`,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[1200] transition ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
      style={containerStyle}
    >
      <div
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        ref={slideoutRef}
        tabIndex={-1}
        className={`absolute ${side === 'right' ? 'right-0' : 'left-0'} top-0 flex transform flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen
            ? 'translate-x-0'
            : side === 'right'
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'slideout-title' : undefined}
        style={panelStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 id="slideout-title" className="text-lg font-semibold text-slate-900">{title}</h2>
            <button
              type="button"
              className="ml-auto rounded-full p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              onClick={onClose}
              aria-label="Close"
            >
              <XClose className="h-5 w-5" />
            </button>
          </header>
        )}

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && (
          <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
            {footer}
          </footer>
        )}
      </aside>
    </div>
  )
}

export default Slideout

