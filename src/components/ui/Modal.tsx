import React, { ReactNode } from 'react'
import { XClose } from '@untitled-ui/icons-react'

export interface ModalProps {
  /** Whether the modal is visible */
  isVisible: boolean
  /** Function to call when modal should be closed */
  onClose: () => void
  /** Modal title */
  title: string
  /** Modal subtitle/description */
  subtitle?: string
  /** Content to render inside the modal body */
  children: ReactNode
  /** Footer content (buttons, etc.) */
  footer?: ReactNode
  /** Width of the modal (in pixels or CSS value) */
  width?: number | string
  /** Height of the modal (in pixels or CSS value) */
  height?: number | string
  /** Maximum width of the modal */
  maxWidth?: number | string
  /** Maximum height of the modal */
  maxHeight?: number | string
  /** Z-index of the modal overlay */
  zIndex?: number
  /** Custom padding for modal content */
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  /** Border radius */
  borderRadius?: number
  /** Whether to show the close button */
  showCloseButton?: boolean
  /** Custom header content (overrides title/subtitle) */
  customHeader?: ReactNode
  /** Custom styles for the modal container */
  containerStyle?: React.CSSProperties
  /** Custom styles for the modal content */
  contentStyle?: React.CSSProperties
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width,
  height,
  maxWidth,
  maxHeight,
  zIndex = 10000,
  padding,
  borderRadius = 16,
  showCloseButton = true,
  customHeader,
  containerStyle,
  contentStyle,
}) => {
  if (!isVisible) return null

  // Default padding values
  const paddingTop = padding?.top ?? 24
  const paddingRight = padding?.right ?? 16
  const paddingBottom = padding?.bottom ?? 24
  const paddingLeft = padding?.left ?? 16

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex,
        overflow: 'auto',
        padding: 0,
        margin: 0,
        ...containerStyle,
      }}
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
          width: typeof width === 'number' ? `${width}px` : (width ?? 'auto'),
          height: typeof height === 'number' ? `${height}px` : (height ?? 'auto'),
          maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : (maxWidth ?? '90vw'),
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : (maxHeight ?? '90vh'),
          opacity: 1,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          paddingTop,
          paddingRight: footer ? 0 : paddingRight,
          paddingBottom: footer ? 0 : paddingBottom,
          paddingLeft: footer ? 0 : paddingLeft,
          overflow: 'hidden',
          ...contentStyle,
        }}
      >
        {/* Header */}
        {(customHeader || title) && (
          <div
            style={{
              position: 'relative',
              paddingTop: paddingTop || 24,
              paddingBottom: subtitle || customHeader ? 16 : 0,
              paddingLeft: paddingLeft || 24,
              paddingRight: paddingRight || 24,
              borderBottom: subtitle || customHeader ? '1px solid #e5e7eb' : 'none',
              flexShrink: 0,
            }}
          >
            {customHeader ? (
              customHeader
            ) : (
              <>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: subtitle ? '8px' : 0,
                    paddingRight: showCloseButton ? '32px' : 0,
                  }}
                >
                  {title}
                </h2>
                {subtitle && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#6b7280',
                      paddingRight: showCloseButton ? '32px' : 0,
                    }}
                  >
                    {subtitle}
                  </p>
                )}
              </>
            )}

            {/* Close button */}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: (paddingTop || 24) + (subtitle ? 12 : 4),
                  right: paddingRight || 24,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  color: '#6b7280',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <XClose style={{ width: '20px', height: '20px' }} />
              </button>
            )}
          </div>
        )}

        {/* Content - scrollable area */}
        <div
          style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            paddingLeft: footer ? paddingLeft : 0,
            paddingRight: footer ? paddingRight : 0,
            paddingBottom: footer ? 0 : paddingBottom,
          }}
        >
          {children}
        </div>

        {/* Footer - always visible at bottom */}
        {footer && (
          <div
            style={{
              flexShrink: 0,
              paddingTop: 16,
              paddingBottom: 0,
              marginTop: 0,
              borderTop: '1px solid #e5e7eb',
              backgroundColor: 'white',
              position: 'relative',
              zIndex: 10,
              width: '100%',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal

