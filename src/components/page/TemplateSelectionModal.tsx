import React, { useState } from 'react'
import { HelpCircle } from '@untitled-ui/icons-react'
import { Modal } from '../ui'

interface TemplateSelectionModalProps {
  isVisible: boolean
  onClose: () => void
  onSelect: (templateType: string) => void
}

type TemplateType = 'schedule' | 'sponsor' | 'floor-plan' | 'lists'

const templateNames: Record<TemplateType, string> = {
  'schedule': 'Schedule',
  'sponsor': 'Sponsor',
  'floor-plan': 'Floor plan',
  'lists': 'Lists'
}

const templates: { id: TemplateType; title: string; description: string }[] = [
  { id: 'schedule', title: 'Schedule', description: 'Program schedule.' },
  { id: 'sponsor', title: 'Sponsor', description: 'Sponsor page.' },
  { id: 'floor-plan', title: 'Floor plan', description: 'pdf, jpeg.' },
  { id: 'lists', title: 'Lists', description: 'List view.' },
]

const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  isVisible,
  onClose,
  onSelect,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('schedule')

  const handleSelect = () => {
    // Get the selected template before closing
    const template = selectedTemplate
    // Close the modal first
    onClose()
    // Then call onSelect after a brief delay to ensure modal closes first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onSelect(template)
      })
    })
  }

  // Spacing values based on design system
  const spacing3xl = 24 // padding-top and padding-bottom
  const spacingXl = 16 // padding-left and padding-right
  const radius2xl = 16 // border-radius

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

      <div
        style={{
          display: 'flex',
          gap: '12px',
        }}
      >
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
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title="Select a page"
      subtitle="Select from below templates."
      width={560}
      height={330}
      maxWidth={560}
      borderRadius={radius2xl}
      padding={{
        top: spacing3xl,
        right: spacingXl,
        bottom: spacing3xl,
        left: spacingXl,
      }}
      footer={footer}
      zIndex={10001}
      contentStyle={{
        padding: 0,
      }}
    >
      {/* Template Options Grid - 2 columns, 2 rows */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 240px)',
          gap: '16px',
          flex: 1,
          overflow: 'auto',
          justifyContent: 'center',
        }}
      >
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id
          return (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '12px',
                border: isSelected ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: 'white',
                transition: 'all 0.15s ease',
                width: '240px',
                height: '64px',
                maxWidth: '240px',
                opacity: 1,
                position: 'relative',
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
                gap: '4px',
                overflow: 'hidden',
                minWidth: 0
              }}>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#111827',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {template.title}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    wordWrap: 'break-word',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {template.description}
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isSelected ? '6px solid #7c3aed' : '2px solid #d1d5db',
                    backgroundColor: 'white',
                    transition: 'all 0.15s ease',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

export default TemplateSelectionModal

