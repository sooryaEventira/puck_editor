import React, { useState } from 'react'
import { XClose, HelpCircle } from '@untitled-ui/icons-react'

interface PageCreationModalProps {
  isVisible: boolean
  onClose: () => void
  onSelect: (mode: 'scratch' | 'template' | 'html') => void
}

const PageCreationModal: React.FC<PageCreationModalProps> = ({ 
  isVisible, 
  onClose, 
  onSelect 
}) => {
  const [selectedMode, setSelectedMode] = useState<'scratch' | 'template' | 'html'>('scratch')

  if (!isVisible) return null

  const handleSelect = () => {
    onSelect(selectedMode)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '548px',
        height: '350px',
        maxWidth: '548px',
        opacity: 1,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px 24px',
          borderBottom: '1px solid #e5e7eb',
          position: 'relative',
          flexShrink: 0
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '8px'
          }}>
            Select from below
          </h2>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Choose how you want to build your page.
          </p>
          
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              color: '#6b7280'
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
        </div>

        {/* Options - Grid Layout */}
        <div style={{
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          flex: 1,
          overflow: 'auto'
        }}>
          {/* Create from scratch */}
          <div
            onClick={() => setSelectedMode('scratch')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 16px',
              border: selectedMode === 'scratch' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: 'white',
              transition: 'all 0.15s ease',
              position: 'relative',
              height: '68px',
              minHeight: '68px'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '4px'
              }}>
                Create from scratch
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                lineHeight: '1.3'
              }}>
                Create a custom page from scratch.
              </div>
            </div>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '16px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: selectedMode === 'scratch' ? '6px solid #7c3aed' : '2px solid #d1d5db',
                backgroundColor: 'white',
                transition: 'all 0.15s ease'
              }}></div>
            </div>
          </div>

          {/* Templates */}
          <div
            onClick={() => setSelectedMode('template')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 16px',
              border: selectedMode === 'template' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: 'white',
              transition: 'all 0.15s ease',
              position: 'relative',
              height: '68px',
              minHeight: '68px'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '4px'
              }}>
                Templates
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                lineHeight: '1.3'
              }}>
                Choose from pre-designed layouts.
              </div>
            </div>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '16px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: selectedMode === 'template' ? '6px solid #7c3aed' : '2px solid #d1d5db',
                backgroundColor: 'white',
                transition: 'all 0.15s ease'
              }}></div>
            </div>
          </div>

          {/* HTML Code - Centered */}
          <div
            onClick={() => setSelectedMode('html')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 16px',
              border: selectedMode === 'html' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: 'white',
              transition: 'all 0.15s ease',
              position: 'relative',
              gridColumn: '1 / 3',
              height: '68px',
              minHeight: '68px',
              justifySelf: 'center',
              width: 'calc(60% - 6px)'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '4px'
              }}>
                HTML Code
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                lineHeight: '1.3'
              }}>
                Paste html code to create custom pages.
              </div>
            </div>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '16px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: selectedMode === 'html' ? '6px solid #7c3aed' : '2px solid #d1d5db',
                backgroundColor: 'white',
                transition: 'all 0.15s ease'
              }}></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
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
              borderRadius: '6px'
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
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#7c3aed',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
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
      </div>
    </div>
  )
}

export default PageCreationModal

