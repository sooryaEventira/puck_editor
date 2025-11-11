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
  
  const data = currentData || props.data || contextData
  
  // Provide a safe fallback dataset so the UI can render even before data arrives
  const hasResolvedData = Boolean(data && data.root)
  const resolvedData = hasResolvedData
    ? data
    : {
        content: [],
        root: { props: {} },
        zones: {}
      }
  
  // Debug logging
  console.log('SchedulesSectionField rendered', { 
    data: resolvedData, 
    hasOnChange: !!onChange,
    contextData,
    propsData: props.data,
    currentData,
    hasContext: context !== null,
    context
  })
  
  if (!onChange) {
    console.warn('SchedulesSectionField: Missing onChange', { data: resolvedData, onChange })
    return (
      <div className="rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
        Error: Missing onChange
      </div>
    )
  }
  
  // Check if this is a Schedule page
  const pageType = resolvedData?.root?.props?.pageType
  const pageTitle = resolvedData?.root?.props?.pageTitle || resolvedData?.root?.props?.title
  const isSchedulePage = pageType === 'schedule' || pageTitle === 'Schedule'
  
  // Only render if this is a Schedule page
  if (!isSchedulePage) {
    return null
  }
  
  const schedules = resolvedData?.root?.props?.schedules || []
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
    const latestData = currentData || resolvedData
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
  const showLoadingNotice = !hasResolvedData
  
  return (
    <div className="w-full rounded-lg bg-white p-3 text-sm">
      {showLoadingNotice && (
        <div className="mb-3 rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Loading schedules...
        </div>
      )}
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Schedules
      </div>
      
      {/* Dropdown - only show if schedules exist */}
      {schedules.length > 0 && (
        <div className="relative mb-3">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-600 shadow-sm transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span className={selectedScheduleData ? 'text-slate-700' : 'text-slate-400'}>
              {selectedScheduleData ? selectedScheduleData.name : 'Select schedule'}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 z-50 mt-1 max-h-52 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
              {schedules.map((schedule: any) => {
                const isActive = selectedSchedule === schedule.id
                return (
                  <button
                    key={schedule.id}
                    type="button"
                    onClick={() => handleSelectSchedule(schedule.id)}
                    className={`w-full px-3 py-2 text-left text-sm transition ${
                      isActive
                        ? 'bg-slate-100 font-medium text-slate-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {schedule.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
      
      {/* Navigate button using CustomButtonField */}
      <div className="mt-3">
        <CustomButtonField
          name="navigateSchedule"
          link={props.field?.link || '/schedules'}
          buttonText={props.field?.buttonText || 'Create schedule'}
          onClick={() => {
            handleCreateSchedule()
            // Dispatch custom event to navigate to schedule page
            window.dispatchEvent(new CustomEvent('navigate-to-schedule'))
          }}
        />
      </div>
    </div>
  )
}

export default SchedulesSectionField

