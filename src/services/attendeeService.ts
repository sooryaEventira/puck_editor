import { API_ENDPOINTS } from '../config/env'
import { showToast } from '../utils/toast'
import type { ApiResponse } from './authService'

export interface UploadUserResponseData {
  message?: string
  data?: any
  [key: string]: any
}

export interface AttendeeData {
  id?: string
  uuid?: string
  name?: string
  first_name?: string
  last_name?: string
  email: string
  avatar_url?: string
  banner_url?: string
  status?: string
  invite_code?: string
  groups?: Array<{
    id: string
    name: string
    variant?: 'primary' | 'info' | 'muted'
  }>
  institute?: string
  post?: string
  email_verified?: boolean
  email_verified_date?: string
  feedback_incomplete?: boolean
  [key: string]: any
}

/**
 * Upload user file (XLSX) for attendee management
 */
export const uploadUserFile = async (file: File, eventUuid?: string): Promise<ApiResponse<UploadUserResponseData>> => {
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

    // Get event UUID - try from parameter, then from localStorage, then from created event
    let event_uuid = eventUuid
    if (!event_uuid) {
      // Try to get from localStorage (stored created event)
      const storedEvent = localStorage.getItem('created-event')
      if (storedEvent) {
        try {
          const parsedEvent = JSON.parse(storedEvent)
          event_uuid = parsedEvent.uuid
        } catch {
          // Ignore parse errors
        }
      }
    }

    if (!event_uuid) {
      const errorMessage = 'Event UUID is required. Please select an event first.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Prepare FormData for file upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('event_uuid', event_uuid)

    const response = await fetch(API_ENDPOINTS.USER_MANAGEMENT.UPLOAD_USER, {
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

    // Parse successful response
    let data: ApiResponse<UploadUserResponseData>
    try {
      data = await response.json()
    } catch (parseError) {
      const errorMessage = 'Invalid response from server. Please try again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Check if response has error status
    if (data.status === 'error') {
      const errorMessage = data.message || 'Failed to upload user file'
      const errors = data.errors || []
      const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
      showToast.error(errorText)
      throw new Error(errorText)
    }

    // Success response
    if (data.status === 'success') {
      showToast.success(data.message || 'Users uploaded successfully')
    }

    return data
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check if the server is running.'
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

    const errorMessage = error instanceof Error ? error.message : 'Failed to upload user file. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Fetch attendees for an event
 */
export const fetchAttendees = async (eventUuid: string): Promise<AttendeeData[]> => {
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

    if (!eventUuid) {
      const errorMessage = 'Event UUID is required.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    const response = await fetch(API_ENDPOINTS.USER_MANAGEMENT.LIST(eventUuid), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
      credentials: 'include',
    })

    // Check for network/CORS errors before parsing response
    if (!response || !response.ok) {
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

    // Parse successful response
    let data: ApiResponse<AttendeeData[]>
    try {
      data = await response.json()
    } catch (parseError) {
      const errorMessage = 'Invalid response from server. Please try again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Check if response has error status
    if (data.status === 'error') {
      const errorMessage = data.message || 'Failed to fetch attendees'
      const errors = data.errors || []
      const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
      showToast.error(errorText)
      throw new Error(errorText)
    }

    // Extract attendees from response
    let responseData: any = data.data
    
    if (!responseData) {
      return []
    }

    // Handle array response
    let attendees: AttendeeData[]
    if (Array.isArray(responseData)) {
      attendees = responseData
    } else if (typeof responseData === 'object' && responseData.data && Array.isArray(responseData.data)) {
      attendees = responseData.data
    } else {
      return []
    }

    return attendees
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check if the server is running.'
      showToast.error('Connection error. Please check if the server is running.')
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response') ||
        error.message.startsWith('Authentication required') ||
        error.message.startsWith('Organization UUID') ||
        error.message.startsWith('Event UUID')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch attendees. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}
