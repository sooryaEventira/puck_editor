import { API_ENDPOINTS } from '../config/env'
import { showToast } from '../utils/toast'
import type { ApiResponse } from './authService'

export interface TimezoneData {
  uuid: string
  label: string
  name: string
  utc_offset: string
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
        let errorData: any = null
        
        // Try to parse as JSON
        try {
          errorData = responseText ? JSON.parse(responseText) : null
        } catch (jsonError) {
          // Response is not JSON, use text as error message if available
          if (responseText && responseText.trim()) {
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
          throw new Error(errorText)
        }
        
        // If we couldn't parse or extract error, show generic message only as last resort
        const errorMessage = response.status === 500 
          ? 'Internal server error. Please try again later.'
          : 'An error occurred. Please try again.'
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
