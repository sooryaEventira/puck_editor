import React, { useState, useEffect, useRef } from 'react'
import { usePuckData } from './EditorView'
import CustomButtonField from './CustomButtonField'

interface SchedulesSectionFieldProps {
  name: string
  value?: any
  onChange: (value: any) => void
  field?: any
  data?: any
}

const SchedulesSectionField: React.FC<SchedulesSectionFieldProps> = (props: SchedulesSectionFieldProps) => {
  const { onChange: propsOnChange } = props
  const context = usePuckData()
  const contextData = context?.data
  const contextOnChange = context?.onChange
  const onChange = propsOnChange || contextOnChange
  
  const [currentData, setCurrentData] = useState<any>(null)
  const dataRef = useRef<any>(null)
  
  // Try to get data from context
  useEffect(() => {
    if (contextData) {
      setCurrentData(contextData)
      dataRef.current = contextData
    }
  }, [contextData])
  
  // Also try to get from props
  useEffect(() => {
    if (props.data) {
      setCurrentData(props.data)
      dataRef.current = props.data
    }
  }, [props.data])
  
  // Wait a bit for context to be available
  const data = currentData || props.data || contextData
  
  // Debug logging
  console.log('SchedulesSectionField rendered', { 
    data, 
    hasOnChange: !!onChange,
    contextData,
    propsData: props.data,
    currentData,
    hasContext: context !== null,
    context
  })
  
  // If we don't have data yet, show loading state
  if (!data) {
    if (!onChange) {
      return (
        <div style={{ padding: '12px', color: 'red', fontSize: '12px' }}>
          Error: Missing onChange
        </div>
      )
    }
    // Show loading state while waiting for context
    return (
      <div style={{ padding: '12px', fontSize: '12px', color: '#666' }}>
        Loading schedules...
      </div>
    )
  }
  
  if (!onChange) {
    console.warn('SchedulesSectionField: Missing onChange', { data, onChange })
    return (
      <div style={{ padding: '12px', color: 'red', fontSize: '12px' }}>
        Error: Missing onChange
      </div>
    )
  }
  
  // Check if this is a Schedule page
  const pageType = data?.root?.props?.pageType
  const pageTitle = data?.root?.props?.pageTitle || data?.root?.props?.title
  const isSchedulePage = pageType === 'schedule' || pageTitle === 'Schedule'
  
  // Only render if this is a Schedule page
  if (!isSchedulePage) {
    return null
  }
  
  const schedules = data?.root?.props?.schedules || []
  const [selectedSchedule, setSelectedSchedule] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Update currentData when data changes
  useEffect(() => {
    if (data && data !== currentData) {
      setCurrentData(data)
      dataRef.current = data
    }
  }, [data])

  const handleCreateSchedule = () => {
    // Get the latest data
    const latestData = currentData || data
    if (!latestData) {
      console.error('Cannot create schedule: no data available')
      return
    }
    
    const currentSchedules = latestData?.root?.props?.schedules || []
    const newScheduleId = `schedule-${Date.now()}`
    const newSchedule = {
      id: newScheduleId,
      name: `Schedule ${currentSchedules.length + 1}`,
      createdAt: new Date().toISOString()
    }
    
    const updatedSchedules = [...currentSchedules, newSchedule]
    
    const newData = {
      ...latestData,
      root: {
        ...latestData.root,
        props: {
          ...latestData.root.props,
          schedules: updatedSchedules
        }
      }
    }
    
    onChange(newData)
    setCurrentData(newData)
    dataRef.current = newData
    setSelectedSchedule(newScheduleId)
  }

  const handleSelectSchedule = (scheduleId: string) => {
    setSelectedSchedule(scheduleId)
    setIsDropdownOpen(false)
  }

  const selectedScheduleData = schedules.find((s: any) => s.id === selectedSchedule)

  return (
    <div style={{ padding: '12px', width: '100%' }}>
      <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
        Schedules
      </div>
      
      {/* Dropdown - only show if schedules exist */}
      {schedules.length > 0 && (
        <div style={{ marginBottom: '12px', position: 'relative' }}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ color: selectedScheduleData ? '#374151' : '#9ca3af' }}>
              {selectedScheduleData ? selectedScheduleData.name : 'Select schedule'}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          
          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000
              }}
            >
              {schedules.map((schedule: any) => (
                <div
                  key={schedule.id}
                  onClick={() => handleSelectSchedule(schedule.id)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                    backgroundColor: selectedSchedule === schedule.id ? '#f3f4f6' : 'white',
                    borderBottom: '1px solid #f3f4f6'
                  }}
                  onMouseEnter={(e: any) => {
                    if (selectedSchedule !== schedule.id) {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                    }
                  }}
                  onMouseLeave={(e: any) => {
                    if (selectedSchedule !== schedule.id) {
                      e.currentTarget.style.backgroundColor = 'white'
                    }
                  }}
                >
                  {schedule.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Navigate button using CustomButtonField */}
      <div style={{ marginTop: '12px' }}>
        <CustomButtonField
          name="navigateSchedule"
          link={props.field?.link || '/schedules'}
          buttonText={props.field?.buttonText || 'Create schedule'}
        />
      </div>
    </div>
  )
}

export default SchedulesSectionField

