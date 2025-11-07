import React, { useState } from 'react'
import { Upload01 } from '@untitled-ui/icons-react'

interface ScheduleContentProps {
  scheduleName?: string
  onUpload?: () => void
  onAddSession?: () => void
}

const ScheduleContent: React.FC<ScheduleContentProps> = ({
  scheduleName = 'Schedule 1',
  onUpload,
  onAddSession
}) => {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  return (
    <main style={{
      width: '1184px',
      height: '896px',
      marginLeft: '250px', // Account for sidebar width (EventHubSidebar is 250px)
      marginTop: '64px', // Account for navbar height
      padding: 0,
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      opacity: 1,
      position: 'relative'
    }}>
      <style>{`
        button[data-schedule-upload] svg,
        button[data-schedule-upload] svg * {
          stroke: #FFFFFF !important;
          fill: none !important;
        }
      `}</style>
      {/* Header with Title and Upload Button */}
      <div style={{
        width: '1184px',
        height: '96px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '32px',
        paddingBottom: '24px',
        paddingLeft: '32px',
        paddingRight: '32px',
        gap: '24px',
        opacity: 1,
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontFamily: 'Manrope, "Helvetica Neue", Arial, sans-serif',
          fontSize: '32px',
          lineHeight: '40px',
          fontWeight: 700,
          fontStyle: 'normal',
          letterSpacing: '0',
          color: '#3E1C96',
          margin: 0
        }}>
          {scheduleName}
        </h1>
        <button
          data-schedule-upload="true"
          onClick={onUpload}
          style={{
            width: '105px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            backgroundColor: '#6938EF',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5a2dd4'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6938EF'
          }}
        >
          <Upload01
            width={16}
            height={16}
            strokeWidth={2}
            style={{ flexShrink: 0, color: '#FFFFFF' }}
          />
          <span
            style={{
              color: '#FFFFFF',
              WebkitTextFillColor: '#FFFFFF',
              fontWeight: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit'
            }}
          >
            Upload
          </span>
        </button>
      </div>

      {/* Bordered Content Area */}
      <div style={{
        width: '1120px',
        height: '819px',
        marginLeft: '32px',
        border: '1px solid #e5e7eb',
        borderRadius: '0',
        paddingTop: '4px',
        paddingRight: '32px',
        paddingBottom: '4px',
        paddingLeft: '32px',
        backgroundColor: '#ffffff',
        opacity: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflow: 'hidden'
      }}>
        {/* Date Selection Fields */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '24px'
        }}>
        <div style={{ flex: 1, position: 'relative' }}>

          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px 10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#374151',
                backgroundColor: '#ffffff'
              }}
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>

          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px 10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#374151',
                backgroundColor: '#ffffff'
              }}
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>
      </div>

        {/* Add Session Button */}
        <div>
          <button
            onClick={onAddSession}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: '#6938EF',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5a2dd4'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6938EF'
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add session
          </button>
        </div>

        {/* Placeholder Content */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          color: '#9ca3af',
          fontSize: '16px',
          textAlign: 'center'
        }}>
          Upload your schedule or create custom sessions!
        </div>
      </div>
    </main>
  )
}

export default ScheduleContent

