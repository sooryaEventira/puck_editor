import React, { useEffect, useState } from 'react'
import { usePuckData } from '../shared/EditorView'

interface SessionSelectFieldProps {
  value?: string
  onChange?: (value: string) => void
  name?: string
  field?: any
  data?: any
}

const SessionSelectField: React.FC<SessionSelectFieldProps> = ({
  value = '',
  onChange
}) => {
  const [availableSessions, setAvailableSessions] = useState<any[]>([])
  const context = usePuckData()
  const contextData = context?.data

  useEffect(() => {
    // Get sessions from ScheduleContent component in the same page (via Puck data)
    const findSessionsInPage = () => {
      if (!contextData || !contextData.content) {
        return
      }

      // Find ScheduleContent component with sessions
      const scheduleContent = contextData.content.find(
        (item: any) => item.type === 'ScheduleContent' && item.props?.sessions
      )
      
      if (scheduleContent?.props?.sessions) {
        setAvailableSessions(scheduleContent.props.sessions)
        return
      }

      // Also check root props for sessions
      if (contextData.root?.props?.sessions) {
        setAvailableSessions(contextData.root.props.sessions)
      }
    }

    findSessionsInPage()
  }, [contextData])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event.target.value)
    }
  }

  const getSessionLabel = (session: any) => {
    const type = session.sessionType || 'session'
    const title = session.title || 'Untitled Session'
    return `${title} (${type})`
  }

  return (
    <div style={{ width: '100%' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: 500,
          color: '#374151'
        }}
      >
        Select Session
      </label>
      <select
        value={value}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '14px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          color: '#111827',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#6366f1'
          e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d1d5db'
          e.target.style.boxShadow = 'none'
        }}
      >
        <option value="">-- Select a session</option>
        {availableSessions.map((session) => (
          <option key={session.id} value={session.id}>
            {getSessionLabel(session)}
          </option>
        ))}
      </select>
      {availableSessions.length === 0 && (
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          No sessions available. Add a ScheduleContent component with sessions first.
        </p>
      )}
    </div>
  )
}

export default SessionSelectField

