import { SavedSchedule, SavedSession } from '../components/eventhub/schedulesession/sessionTypes'

/**
 * Puck editor data structure
 */
export interface PuckScheduleData {
  content: Array<{
    type: string
    props: any
    id: string
  }>
  root: {
    props: {
      title: string
      pageTitle: string
      pageType: string
    }
  }
  zones: {}
}

/**
 * Convert SavedSchedule to Puck editor format
 * This creates a JSON structure that Puck can render
 * 
 * @param schedule - The schedule to convert
 * @param selectedDate - The currently selected date
 * @returns Puck-formatted data structure
 */
export const convertScheduleToPuckFormat = (
  schedule: SavedSchedule,
  selectedDate: Date
): PuckScheduleData => {
  // Convert SavedSession[] to serializable format
  // Dates must be converted to ISO strings for JSON
  // Note: When loading from Puck, dates will be strings, so we need to handle both Date objects and strings
  const sessions = (schedule.sessions || []).map((session: SavedSession) => {
    // Handle date conversion - can be Date object or ISO string
    let sessionDate: string
    if (session.date instanceof Date) {
      sessionDate = session.date.toISOString()
    } else if (typeof session.date === 'string') {
      sessionDate = session.date
    } else {
      sessionDate = selectedDate.toISOString()
    }

    return {
      id: session.id,
      title: session.title,
      startTime: session.startTime,
      startPeriod: session.startPeriod || 'AM',
      endTime: session.endTime,
      endPeriod: session.endPeriod || 'AM',
      location: session.location,
      sessionType: session.sessionType,
      tags: session.tags || [],
      sections: (session.sections || []).map(section => ({
        id: section.id,
        type: section.type,
        title: section.title,
        description: section.description || ''
      })),
      date: sessionDate,
      parentId: session.parentId || undefined
    }
  })

  return {
    content: [
      {
        type: 'ScheduleContent',
        props: {
          scheduleName: schedule.name,
          sessions: sessions,
          selectedDate: selectedDate.toISOString()
        },
        id: `schedule-content-${schedule.id}`
      }
    ],
    root: {
      props: {
        title: schedule.name,
        pageTitle: schedule.name,
        pageType: 'schedule'
      }
    },
    zones: {}
  }
}

/**
 * Save schedule to backend in Puck format
 * 
 * @param schedule - The schedule to save
 * @param selectedDate - The currently selected date
 * @param apiUrl - Optional API endpoint (defaults to SAVE_PAGE)
 * @returns Promise with save result
 */
export const saveScheduleToPuck = async (
  schedule: SavedSchedule,
  selectedDate: Date,
  apiUrl?: string
): Promise<any> => {
  try {
    // Convert to Puck format
    const puckData = convertScheduleToPuckFormat(schedule, selectedDate)
    
    // Generate filename
    const pageId = `schedule-${schedule.id}`
    const filename = `${pageId}.json`
    
    // Use provided API URL or default
    const endpoint = apiUrl || (await import('../config/env')).API_ENDPOINTS.SAVE_PAGE || '/api/save-page'
    
    // Send to backend
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: puckData,
        filename: filename
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to save schedule: ${response.status} ${errorText}`)
    }
    
    const result = await response.json()
    console.log('✅ Schedule saved to Puck:', result)
    return result
  } catch (error) {
    console.error('❌ Error saving schedule to Puck:', error)
    throw error
  }
}

