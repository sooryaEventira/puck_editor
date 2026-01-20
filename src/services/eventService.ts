import { API_ENDPOINTS } from '../config/env'
import { showToast } from '../utils/toast'
import type { ApiResponse } from './authService'

export interface CreateEventRequest {
  eventName: string
  startDate: string
  startDateTimeISO: string
  startTime: string
  endDate: string
  endDateTimeISO: string
  endTime: string
  timezoneId: string
  location: string
  attendees: number
  eventExperience: 'in-person' | 'virtual' | 'hybrid'
  logo: File | null
  banner: File | null
  fixTimezoneForAttendees: boolean
}

export interface CreateEventResponseData {
  uuid: string
  eventName: string
  startDate?: string
  endDate?: string
  location?: string
  attendees?: number
  eventExperience?: 'in-person' | 'virtual' | 'hybrid'
  banner?: string // Banner URL from API response
  logo?: string // Logo URL from API response
  [key: string]: any // Allow additional fields
}

/**
 * Event data structure from API
 */
export interface EventData {
  uuid: string
  eventName: string
  startDate?: string
  endDate?: string
  location?: string
  attendees?: number
  eventExperience?: 'in-person' | 'virtual' | 'hybrid'
  status?: 'Live' | 'Draft' | 'Published' | 'draft' | 'live' | 'published'
  registrations?: number
  createdBy?: string
  createdAt?: string
  [key: string]: any // Allow additional fields
}

/**
 * Create a new event
 */
export const createEvent = async (request: CreateEventRequest): Promise<CreateEventResponseData> => {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please login again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Get organization UUID from localStorage
    const organizationUuid = localStorage.getItem('organizationUuid')
    
    if (!organizationUuid) {
      const errorMessage = 'Organization UUID is missing. Please create or select an organization first.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Prepare FormData for file uploads
    const formData = new FormData()
    
    // Add text fields
    formData.append('eventName', request.eventName)
    formData.append('startDate', request.startDate)
    formData.append('startDateTimeISO', request.startDateTimeISO)
    formData.append('startTime', request.startTime)
    formData.append('endDate', request.endDate)
    formData.append('endDateTimeISO', request.endDateTimeISO)
    formData.append('endTime', request.endTime)
    formData.append('timezoneId', request.timezoneId)
    formData.append('location', request.location)
    formData.append('attendees', request.attendees.toString())
    formData.append('eventExperience', request.eventExperience)
    formData.append('fixTimezoneForAttendees', request.fixTimezoneForAttendees.toString())

    // Add files if present
    if (request.logo) {
      formData.append('logo', request.logo)
    }
    if (request.banner) {
      formData.append('banner', request.banner)
    }

    const response = await fetch(API_ENDPOINTS.EVENT.CREATE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
      credentials: 'include',
      body: formData,
    })

    // Check for network/CORS errors before parsing response
    if (!response || !response.ok) {
      // Network error or CORS error - response might not exist
      if (!response) {
        const errorMessage = 'Cannot connect to the server. Please make sure the backend server is running.'
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }

      // HTTP error - try to parse error response
      try {
        const responseText = await response.text()
        let errorData: any = null
        
        // Try to parse as JSON
        try {
          errorData = responseText ? JSON.parse(responseText) : null
        } catch (jsonError) {
          // Response is not JSON, use text as error message if available
          if (responseText && responseText.trim()) {
            showToast.error(responseText.trim())
            throw new Error(responseText.trim())
          }
        }
        
        if (errorData) {
          // Extract error message from various possible formats
          let errorMessage = errorData.message || errorData.detail || errorData.error || null
          const errors = errorData.errors || []
          
          // Check for common error formats
          if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
            errorMessage = errorData.non_field_errors.join(', ')
          } else if (!errorMessage && typeof errorData === 'object') {
            // Try to extract from first error field
            const errorKeys = Object.keys(errorData)
            if (errorKeys.length > 0) {
              const firstError = errorData[errorKeys[0]]
              errorMessage = Array.isArray(firstError) ? firstError.join(', ') : String(firstError)
            }
          }
          
          // Use errors array if available, otherwise use extracted message
          const errorText = errors.length > 0 ? errors.join(', ') : (errorMessage || 'An error occurred')
          showToast.error(errorText)
          throw new Error(errorText)
        }
        
        // If we couldn't parse or extract error, show generic message only as last resort
        const errorMessage = response.status === 500 
          ? 'Internal server error. Please try again later.'
          : 'An error occurred. Please try again.'
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      } catch (parseError) {
        // If it's already our custom error, re-throw it
        if (parseError instanceof Error && !parseError.message.includes('Server error:')) {
          throw parseError
        }
        // Last resort: only show generic message if we truly can't extract anything
        const errorMessage = response.status === 500
          ? 'Internal server error. Please try again later.'
          : 'An error occurred. Please try again.'
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }
    }

    // Parse successful response
    let data: CreateEventResponseData
    try {
      const apiResponse: ApiResponse<CreateEventResponseData> = await response.json()
      
      // Validate response structure
      if (!apiResponse || typeof apiResponse !== 'object') {
        throw new Error('Invalid response format from server: response is not an object')
      }
      
      // Check if response has error status
      if (apiResponse.status === 'error') {
        const errorMessage = apiResponse.message || 'Failed to create event'
        const errors = apiResponse.errors || []
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        showToast.error(errorText)
        throw new Error(errorText)
      }
      
      // Ensure status is 'success'
      if (apiResponse.status !== 'success') {
        const errorMessage = `Unexpected response status: ${apiResponse.status}. Expected 'success'.`
        showToast.error('An error occurred while processing the response. Please try again.')
        throw new Error(errorMessage)
      }
      
      // Extract event data from the wrapped response
      let responseData: any = apiResponse.data
      
      // Check if data field is an empty string (backend issue)
      if (typeof responseData === 'string' && responseData === '') {
        const errorMessage = 'Backend returned empty event data. The API response has status "success" but the "data" field is an empty string.'
        showToast.error('Event data not returned. Please try again or contact support.')
        throw new Error(errorMessage)
      }
      
      // Validate that data field exists and is an object
      if (!responseData || typeof responseData !== 'object') {
        const errorMessage = `Invalid response format: event data should be an object, but received ${typeof responseData}. Value: ${JSON.stringify(responseData)}`
        showToast.error('Invalid response format. Please try again.')
        throw new Error(errorMessage)
      }
      
      // Handle nested data structure: if responseData has a 'data' property with uuid, use that instead
      if (responseData.data && typeof responseData.data === 'object' && responseData.data.uuid) {
        responseData = responseData.data
      }
      
      // Validate required fields (uuid and eventName)
      if (!responseData.uuid) {
        throw new Error('Invalid response format from server: missing uuid in event data')
      }
      
      if (!responseData.eventName) {
        throw new Error('Invalid response format from server: missing eventName in event data')
      }
      
      // Map the response to CreateEventResponseData interface
      data = {
        uuid: String(responseData.uuid),
        eventName: String(responseData.eventName),
        startDate: responseData.startDate || undefined,
        endDate: responseData.endDate || undefined,
        location: responseData.location || undefined,
        attendees: responseData.attendees || undefined,
        eventExperience: responseData.eventExperience || undefined,
        ...responseData,
      }
    } catch (parseError) {
      // Check if it's our custom validation error - re-throw it
      if (parseError instanceof Error && parseError.message.includes('Invalid response format')) {
        showToast.error(parseError.message)
        throw parseError
      }
      
      // JSON parsing or other error
      const errorMessage = 'Invalid response from server. Please try again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Success - show toast notification
    showToast.success('Event created successfully')

    return data
  } catch (error) {
    // Handle network errors (CORS, connection refused, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check:\n1. Backend server is running\n2. CORS is properly configured\n3. No firewall is blocking the connection'
      showToast.error('Connection error. Please check if the server is running.')
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response') ||
        error.message.startsWith('Authentication required') ||
        error.message.startsWith('Organization UUID')
    )) {
      throw error
    }

    // Generic error fallback
    const errorMessage = error instanceof Error ? error.message : 'Failed to create event. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Fetch all events created by the authenticated user
 */
export const fetchEvents = async (): Promise<EventData[]> => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please login again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    const organizationUuid = localStorage.getItem('organizationUuid')
    if (!organizationUuid) {
      const errorMessage = 'Organization UUID is missing. Please create or select an organization first.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-Organization': organizationUuid,
    }

    const response = await fetch(API_ENDPOINTS.EVENT.LIST, {
      method: 'GET',
      headers,
      credentials: 'include',
    })

    if (!response || !response.ok) {
      if (!response) {
        const errorMessage = 'Cannot connect to the server. Please make sure the backend server is running.'
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }

      try {
        const responseText = await response.text()
        let errorData: any = null
        
        // Try to parse as JSON
        try {
          errorData = responseText ? JSON.parse(responseText) : null
        } catch (jsonError) {
          // Response is not JSON, use text as error message if available
          if (responseText && responseText.trim()) {
            showToast.error(responseText.trim())
            throw new Error(responseText.trim())
          }
        }
        
        if (errorData) {
          // Extract error message from various possible formats
          let errorMessage = errorData.message || errorData.detail || errorData.error || null
          const errors = errorData.errors || []
          
          // Check for common error formats
          if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
            errorMessage = errorData.non_field_errors.join(', ')
          } else if (!errorMessage && typeof errorData === 'object') {
            // Try to extract from first error field
            const errorKeys = Object.keys(errorData)
            if (errorKeys.length > 0) {
              const firstError = errorData[errorKeys[0]]
              errorMessage = Array.isArray(firstError) ? firstError.join(', ') : String(firstError)
            }
          }
          
          // Use errors array if available, otherwise use extracted message
          const errorText = errors.length > 0 ? errors.join(', ') : (errorMessage || 'An error occurred')
          showToast.error(errorText)
          throw new Error(errorText)
        }
        
        // If we couldn't parse or extract error, show generic message only as last resort
        const errorMessage = 'An error occurred. Please try again.'
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      } catch (parseError) {
        // If it's already our custom error, re-throw it
        if (parseError instanceof Error && !parseError.message.includes('Server error:')) {
          throw parseError
        }
        // Last resort: only show generic message if we truly can't extract anything
        const errorMessage = 'An error occurred. Please try again.'
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }
    }

    const responseText = await response.text()
    const apiResponse: ApiResponse<EventData[] | EventData> = JSON.parse(responseText)
    
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error('Invalid response format from server')
    }
    
    if (apiResponse.status === 'error') {
      const errorMessage = apiResponse.message || 'Failed to fetch events'
      const errors = apiResponse.errors || []
      const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
      showToast.error(errorText)
      throw new Error(errorText)
    }
    
    if (apiResponse.status !== 'success') {
      const errorMessage = `Unexpected response status: ${apiResponse.status}`
      showToast.error('An error occurred while processing the response. Please try again.')
      throw new Error(errorMessage)
    }
    
    let responseData: any = apiResponse.data
    if (!responseData) {
      return []
    }

    const mapEvent = (event: any): EventData => {
      const createdBy = event.created_by 
        ? (typeof event.created_by === 'object' 
            ? (event.created_by.name || event.created_by.email?.split('@')[0] || 'Unknown')
            : event.created_by)
        : (event.createdBy || undefined)
      
      const attendanceTypeMap: Record<string, string> = {
        'Online': 'virtual',
        'Offline': 'in-person',
        'Hybrid': 'hybrid',
      }
      const attendanceType = event.attendance_type || event.eventExperience
      const mappedEventExperience = attendanceType 
        ? (attendanceTypeMap[attendanceType] || attendanceType.toLowerCase())
        : undefined
      
      return {
        ...event, // Preserve all original fields from API
        uuid: String(event.uuid || ''),
        eventName: String(event.title || event.eventName || ''),
        startDate: event.event_date || event.startDate || undefined,
        endDate: event.end_date || event.endDate || undefined,
        location: event.location || undefined,
        attendees: event.attendees || undefined,
        eventExperience: mappedEventExperience || event.eventExperience || undefined,
        status: event.status || undefined,
        registrations: event.registrations || 0,
        createdBy: createdBy,
        createdAt: event.created_at || event.createdAt || event.created_date || undefined,
        // Preserve original field names for sorting
        created_at: event.created_at,
        created_date: event.created_date,
        event_date: event.event_date,
      }
    }

    let data: EventData[]
    if (Array.isArray(responseData)) {
      data = responseData.map(mapEvent)
    } else if (typeof responseData === 'object') {
      if (responseData.data && Array.isArray(responseData.data)) {
        data = responseData.data.map(mapEvent)
      } else {
        data = [mapEvent(responseData)]
      }
    } else {
      throw new Error('Invalid response format: event data should be an array or object')
    }
    
    data = data
      .filter(event => event.uuid && (event.eventName || event.title))
      .map(event => ({
        ...event,
        eventName: event.eventName || event.title || 'Untitled Event'
      }))

    return data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check if the server is running.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response') ||
        error.message.startsWith('Authentication required') ||
        error.message.startsWith('Organization UUID')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}
