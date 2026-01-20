import { API_ENDPOINTS } from '../config/env'
import { showToast } from '../utils/toast'
import type { ApiResponse } from './authService'

export interface CreateWebpageRequest {
  event_uuid: string // Event UUID
  name: string // Page name (e.g., "welcome")
  content: {
    [key: string]: {
      title: string
      slug: string
      data: {
        [slug: string]: {
          root: {
            props: any
          }
          content: any[]
          zones: any
        }
      }
    }
  }
}

export interface CreateWebpageResponseData {
  uuid: string
  event: string
  name: string
  slug: string
  content: any
  created_by: number
  updated_by: number
  created_date: string
  updated_date: string
}

/**
 * Create a new webpage for an event
 */
export const createWebpage = async (request: CreateWebpageRequest): Promise<CreateWebpageResponseData> => {
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

    const response = await fetch(API_ENDPOINTS.WEBPAGE.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
      credentials: 'include',
      body: JSON.stringify(request),
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
    let data: ApiResponse<CreateWebpageResponseData>
    try {
      data = await response.json()
    } catch (parseError) {
      const errorMessage = 'Invalid response from server. Please try again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Check if response has error status
    if (data.status === 'error') {
      const errorMessage = data.message || 'Failed to create webpage'
      const errors = data.errors || []
      const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
      showToast.error(errorText)
      throw new Error(errorText)
    }

    // Success response
    if (data.status === 'success') {
      showToast.success(data.message || 'Webpage created successfully')
    }

    // Extract and return the webpage data
    if (!data.data) {
      throw new Error('No data returned from server')
    }

    return data.data
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
        error.message.startsWith('No data returned')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to create webpage. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}
