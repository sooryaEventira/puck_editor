import React, { useState } from 'react'
import { HelpCircle } from '@untitled-ui/icons-react'
import { Modal } from '../ui'

interface PageCreationModalProps {
  isVisible: boolean
  onClose: () => void
  onSelect: (mode: 'scratch' | 'template' | 'html', blockType?: string) => void
}

const PageCreationModal: React.FC<PageCreationModalProps> = ({ 
  isVisible, 
  onClose, 
  onSelect 
}) => {
  const [selectedMode, setSelectedMode] = useState<'scratch' | 'template' | 'html'>('scratch')

  const handleSelect = () => {
    // For all modes, close this modal and call onSelect
    // The parent component will handle showing the template selection modal
    const mode = selectedMode
    // Close the modal first - this will trigger state update
    onClose()
    // Use requestAnimationFrame to ensure modal closes before calling onSelect
    // This ensures the DOM update happens before the next handler runs
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onSelect(mode)
      })
    })
  }

  const handleModeChange = (mode: 'scratch' | 'template' | 'html') => {
    setSelectedMode(mode)
  }

  const footer = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '16px',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingBottom: '24px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: '#6b7280',
          fontSize: '14px',
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: '6px',
          fontFamily: 'inherit'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <HelpCircle style={{ width: '16px', height: '16px' }} />
        Need help?
      </button>

      <div style={{
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: 'white',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontFamily: 'inherit',
            minWidth: '80px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb'
            e.currentTarget.style.borderColor = '#9ca3af'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSelect}
          data-modal-select-button="true"
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#7c3aed',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            width: 'auto',
            height: 'auto',
            fontFamily: 'inherit',
            minWidth: '80px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#6d28d9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#7c3aed'
          }}
        >
          Select
        </button>
      </div>
    </div>
  )

  return (
    <>
      <Modal
        isVisible={isVisible}
        onClose={onClose}
        title="Select from below"
        subtitle="Choose how you want to build your page."
        width={548}
        height={350}
        maxWidth={548}
        maxHeight="90vh"
        borderRadius={16}
        footer={footer}
        zIndex={10000}
        padding={{
          top: 24,
          right: 24,
          bottom: 0,
          left: 24,
        }}
        contentStyle={{
          padding: 0,
        }}
      >
        {/* Options - Grid Layout */}
        <div style={{
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 240px)',
          gap: '12px',
          overflow: 'visible',
          justifyContent: 'center'
        }}>
          {/* Create from scratch */}
          <div
            onClick={() => handleModeChange('scratch')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px',
              border: selectedMode === 'scratch' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: 'white',
              transition: 'all 0.15s ease',
              position: 'relative',
              width: '240px',
              height: '68px',
              maxWidth: '240px',
              opacity: 1,
              overflow: 'visible',
              boxSizing: 'border-box',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            <div style={{ 
              flex: 1,
              paddingRight: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              overflow: 'hidden',
              minWidth: 0,
              justifyContent: 'center'
            }}>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                lineHeight: '1.2'
              }}>
                Create from scratch
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                lineHeight: '1.2',
                wordWrap: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical'
              }}>
                Create a custom page from scratch.
              </div>
            </div>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: selectedMode === 'scratch' ? '6px solid #7c3aed' : '2px solid #d1d5db',
                backgroundColor: 'white',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}></div>
            </div>
          </div>

          {/* Templates */}
          <div
            onClick={() => handleModeChange('template')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px',
              border: selectedMode === 'template' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: 'white',
              transition: 'all 0.15s ease',
              position: 'relative',
              width: '240px',
              height: '68px',
              maxWidth: '240px',
              opacity: 1,
              overflow: 'visible',
              boxSizing: 'border-box',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            <div style={{ 
              flex: 1,
              paddingRight: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              overflow: 'hidden',
              minWidth: 0,
              justifyContent: 'center'
            }}>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                lineHeight: '1.2'
              }}>
                Templates
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                lineHeight: '1.2',
                wordWrap: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical'
              }}>
                Choose from pre-designed layouts.
              </div>
            </div>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: selectedMode === 'template' ? '6px solid #7c3aed' : '2px solid #d1d5db',
                backgroundColor: 'white',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}></div>
            </div>
          </div>

          {/* HTML Code - Centered */}
          <div
            onClick={() => handleModeChange('html')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px',
              border: selectedMode === 'html' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: 'white',
              transition: 'all 0.15s ease',
              position: 'relative',
              gridColumn: '1 / 3',
              width: '240px',
              height: '68px',
              maxWidth: '240px',
              opacity: 1,
              justifySelf: 'center',
              overflow: 'visible',
              boxSizing: 'border-box',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            <div style={{ 
              flex: 1,
              paddingRight: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              overflow: 'hidden',
              minWidth: 0,
              justifyContent: 'center'
            }}>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                lineHeight: '1.2'
              }}>
                HTML Code
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                lineHeight: '1.2',
                wordWrap: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical'
              }}>
                Paste html code to create custom pages.
              </div>
            </div>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: selectedMode === 'html' ? '6px solid #7c3aed' : '2px solid #d1d5db',
                backgroundColor: 'white',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}></div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default PageCreationModal
