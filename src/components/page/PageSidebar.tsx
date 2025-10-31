import React from 'react'
import { Settings01 } from '@untitled-ui/icons-react'

interface PageSidebarProps {
  pages: Array<{ id: string; name: string }>
  currentPage: string
  currentPageName: string
  onPageSelect: (pageId: string) => void
  onAddPage: () => void
  onManagePages: () => void
}

const PageSidebar: React.FC<PageSidebarProps> = ({
  pages,
  currentPage,
  currentPageName,
  onPageSelect,
  onAddPage,
  onManagePages
}) => {
  return (
    <div style={{
      width: '280px',
      minWidth: '280px',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flexShrink: 0
    }}>
      {/* Layout Icons */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        gap: '8px'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          backgroundColor: '#f9fafb',
          cursor: 'pointer'
        }}></div>
        <div style={{
          width: '24px',
          height: '24px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}></div>
      </div>

      {/* Header with Title and Add Button */}
      <div style={{
        padding: '8px 16px 12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h2 style={{
          fontSize: '13px',
          fontWeight: '700',
          color: '#374151',
          letterSpacing: '0.05em',
          margin: 0
        }}>
          WEBSITE PAGES
        </h2>
        <button
          onClick={onAddPage}
          style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Current Page Display */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 12px'
      }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: '#f3f4f6',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
        >
          <span style={{
            fontSize: '14px',
            color: '#374151',
            fontWeight: '500'
          }}>
            {currentPageName}
          </span>
          <Settings01
            style={{ 
              width: '16px', 
              height: '16px', 
              color: '#9ca3af',
              cursor: 'pointer' 
            }}
          />
        </div>
      </div>

      {/* Manage Pages Button */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #f3f4f6'
      }}>
        <button
          onClick={onManagePages}
          style={{
            width: '100%',
            padding: '8px 16px',
            backgroundColor: 'white',
            color: '#6b7280',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.borderColor = '#e5e7eb'
          }}
        >
          Manage pages
        </button>
      </div>
    </div>
  )
}

export default PageSidebar

