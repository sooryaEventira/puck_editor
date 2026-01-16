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
  [key: string]: any // Allow additional fields
}

export interface TimezoneData {
  uuid: string
  label: string
  name: string
  utc_offset: string
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
        
        let errorData: any
        try {
          errorData = JSON.parse(responseText)
        } catch (jsonError) {
          // Response is not JSON
          const errorMessage = response.status === 500 
            ? 'Internal server error. The server encountered an unexpected error. Please check the backend logs or try again later.'
            : `Server error: ${response.status} ${response.statusText}`
          showToast.error(errorMessage)
          throw new Error(errorMessage)
        }
        
        // Handle different error response formats
        let errorMessage = errorData.message || errorData.detail || errorData.error || `Server error (${response.status})`
        const errors = errorData.errors || []
        
        // Check for common error formats
        if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors.join(', ')
        } else if (typeof errorData === 'object' && !errorData.message && !errorData.detail) {
          const errorKeys = Object.keys(errorData)
          if (errorKeys.length > 0) {
            const firstError = errorData[errorKeys[0]]
            errorMessage = Array.isArray(firstError) ? firstError.join(', ') : String(firstError)
          }
        }
        
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        showToast.error(errorText)
        throw new Error(errorText)
      } catch (parseError) {
        // Failed to parse error response
        const errorMessage = response.status === 500
          ? 'Internal server error. The server encountered an unexpected error. Please check the backend logs or try again later.'
          : `Server error: ${response.status} ${response.statusText}`
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
        showToast.error('Server error: Unexpected response status.')
        throw new Error(errorMessage)
      }
      
      // Extract event data from the wrapped response
      let responseData: any = apiResponse.data
      
      // Check if data field is an empty string (backend issue)
      if (typeof responseData === 'string' && responseData === '') {
        const errorMessage = 'Backend returned empty event data. The API response has status "success" but the "data" field is an empty string.'
        showToast.error('Server error: Event data not returned. Please try again or contact support.')
        throw new Error(errorMessage)
      }
      
      // Validate that data field exists and is an object
      if (!responseData || typeof responseData !== 'object') {
        const errorMessage = `Invalid response format: event data should be an object, but received ${typeof responseData}. Value: ${JSON.stringify(responseData)}`
        showToast.error('Server error: Invalid event data format.')
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
 * Fetch list of available timezones
 */
export const fetchTimezones = async (): Promise<TimezoneData[]> => {
  try {
    // Get access token from localStorage (optional for timezones, but include if available)
    const accessToken = localStorage.getItem('accessToken')
    
    // Get organization UUID from localStorage (optional for timezones, but include if available)
    const organizationUuid = localStorage.getItem('organizationUuid')

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Add authorization if available
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    // Add organization header if available
    if (organizationUuid) {
      headers['X-Organization'] = organizationUuid
    }

    const response = await fetch(API_ENDPOINTS.TIMEZONE.LIST, {
      method: 'GET',
      headers,
      credentials: 'include',
    })

    // Check for network/CORS errors before parsing response
    if (!response || !response.ok) {
      // Network error or CORS error - response might not exist
      if (!response) {
        const errorMessage = 'Cannot connect to the server. Please make sure the backend server is running.'
        throw new Error(errorMessage)
      }

      // HTTP error - try to parse error response
      try {
        const responseText = await response.text()
        
        let errorData: any
        try {
          errorData = JSON.parse(responseText)
        } catch (jsonError) {
          // Response is not JSON
          const errorMessage = response.status === 500 
            ? 'Internal server error. The server encountered an unexpected error. Please check the backend logs or try again later.'
            : `Server error: ${response.status} ${response.statusText}`
          throw new Error(errorMessage)
        }
        
        // Handle different error response formats
        let errorMessage = errorData.message || errorData.detail || errorData.error || `Server error (${response.status})`
        const errors = errorData.errors || []
        
        // Check for common error formats
        if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors.join(', ')
        } else if (typeof errorData === 'object' && !errorData.message && !errorData.detail) {
          const errorKeys = Object.keys(errorData)
          if (errorKeys.length > 0) {
            const firstError = errorData[errorKeys[0]]
            errorMessage = Array.isArray(firstError) ? firstError.join(', ') : String(firstError)
          }
        }
        
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        throw new Error(errorText)
      } catch (parseError) {
        // Failed to parse error response
        const errorMessage = response.status === 500
          ? 'Internal server error. The server encountered an unexpected error. Please check the backend logs or try again later.'
          : `Server error: ${response.status} ${response.statusText}`
        throw new Error(errorMessage)
      }
    }

    // Parse successful response
    let data: TimezoneData[]
    try {
      const apiResponse: ApiResponse<TimezoneData[]> = await response.json()
      
      // Validate response structure
      if (!apiResponse || typeof apiResponse !== 'object') {
        throw new Error('Invalid response format from server: response is not an object')
      }
      
      // Check if response has error status
      if (apiResponse.status === 'error') {
        const errorMessage = apiResponse.message || 'Failed to fetch timezones'
        const errors = apiResponse.errors || []
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        throw new Error(errorText)
      }
      
      // Ensure status is 'success'
      if (apiResponse.status !== 'success') {
        const errorMessage = `Unexpected response status: ${apiResponse.status}. Expected 'success'.`
        throw new Error(errorMessage)
      }
      
      // Extract timezone data from the wrapped response
      let responseData: any = apiResponse.data
      
      // Check if data field is an empty string or null
      if (!responseData) {
        return []
      }
      
      // Handle case where data might be an array directly
      if (Array.isArray(responseData)) {
        data = responseData.map((tz: any) => ({
          uuid: String(tz.uuid),
          label: String(tz.label || tz.name || ''),
          name: String(tz.name || ''),
          utc_offset: String(tz.utc_offset || '+00:00'),
        }))
      } else if (typeof responseData === 'object') {
        // Handle nested data structure
        if (responseData.data && Array.isArray(responseData.data)) {
          data = responseData.data.map((tz: any) => ({
            uuid: String(tz.uuid),
            label: String(tz.label || tz.name || ''),
            name: String(tz.name || ''),
            utc_offset: String(tz.utc_offset || '+00:00'),
          }))
        } else {
          // Single timezone object (unlikely but handle it)
          data = [{
            uuid: String(responseData.uuid),
            label: String(responseData.label || responseData.name || ''),
            name: String(responseData.name || ''),
            utc_offset: String(responseData.utc_offset || '+00:00'),
          }]
        }
      } else {
        throw new Error('Invalid response format: timezone data should be an array')
      }
      
      // Validate that we have valid timezone data
      data = data.filter(tz => tz.uuid && tz.name)
    } catch (parseError) {
      // Check if it's our custom validation error - re-throw it
      if (parseError instanceof Error && parseError.message.includes('Invalid response format')) {
        throw parseError
      }
      
      // JSON parsing or other error
      const errorMessage = 'Invalid response from server. Please try again.'
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    // Handle network errors (CORS, connection refused, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check:\n1. Backend server is running\n2. CORS is properly configured\n3. No firewall is blocking the connection'
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response')
    )) {
      throw error
    }

    // Generic error fallback
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch timezones. Please try again.'
    throw new Error(errorMessage)
  }
}
