import { API_ENDPOINTS } from '../config/env'
import type { ApiResponse } from './authService'

export interface TimezoneData {
  uuid: string
  label: string
  name: string
  utc_offset: string
}

export const fetchTimezones = async (): Promise<TimezoneData[]> => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const organizationUuid = localStorage.getItem('organizationUuid')

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    if (organizationUuid) {
      headers['X-Organization'] = organizationUuid
    }

    const response = await fetch(API_ENDPOINTS.TIMEZONE.LIST, {
      method: 'GET',
      headers,
      credentials: 'include',
    })

    if (!response || !response.ok) {
      if (!response) {
        const errorMessage = 'Cannot connect to the server. Please make sure the backend server is running.'
        throw new Error(errorMessage)
      }

      try {
        const responseText = await response.text()
        let errorData: any = null
        
        try {
          errorData = responseText ? JSON.parse(responseText) : null
        } catch (jsonError) {
          if (responseText && responseText.trim()) {
            throw new Error(responseText.trim())
          }
        }
        
        if (errorData) {
          let errorMessage = errorData.message || errorData.detail || errorData.error || null
          const errors = errorData.errors || []
          
          if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
            errorMessage = errorData.non_field_errors.join(', ')
          } else if (!errorMessage && typeof errorData === 'object') {
            const errorKeys = Object.keys(errorData)
            if (errorKeys.length > 0) {
              const firstError = errorData[errorKeys[0]]
              errorMessage = Array.isArray(firstError) ? firstError.join(', ') : String(firstError)
            }
          }
          
          const errorText = errors.length > 0 ? errors.join(', ') : (errorMessage || 'An error occurred')
          throw new Error(errorText)
        }
        
        const errorMessage = response.status === 500 
          ? 'Internal server error. Please try again later.'
          : 'An error occurred. Please try again.'
        throw new Error(errorMessage)
      } catch (parseError) {
        if (parseError instanceof Error && !parseError.message.includes('Server error:')) {
          throw parseError
        }
        const errorMessage = response.status === 500
          ? 'Internal server error. Please try again later.'
          : 'An error occurred. Please try again.'
        throw new Error(errorMessage)
      }
    }

    let data: TimezoneData[]
    try {
      const apiResponse: ApiResponse<TimezoneData[]> = await response.json()
      
      if (!apiResponse || typeof apiResponse !== 'object') {
        throw new Error('Invalid response format from server: response is not an object')
      }
      
      if (apiResponse.status === 'error') {
        const errorMessage = apiResponse.message || 'Failed to fetch timezones'
        const errors = apiResponse.errors || []
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        throw new Error(errorText)
      }
      
      if (apiResponse.status !== 'success') {
        const errorMessage = `Unexpected response status: ${apiResponse.status}. Expected 'success'.`
        throw new Error(errorMessage)
      }
      
      let responseData: any = apiResponse.data
      
      if (!responseData) {
        return []
      }
      
      if (Array.isArray(responseData)) {
        data = responseData.map((tz: any) => ({
          uuid: String(tz.uuid),
          label: String(tz.label || tz.name || ''),
          name: String(tz.name || ''),
          utc_offset: String(tz.utc_offset || '+00:00'),
        }))
      } else if (typeof responseData === 'object') {
        if (responseData.data && Array.isArray(responseData.data)) {
          data = responseData.data.map((tz: any) => ({
            uuid: String(tz.uuid),
            label: String(tz.label || tz.name || ''),
            name: String(tz.name || ''),
            utc_offset: String(tz.utc_offset || '+00:00'),
          }))
        } else {
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
      
      data = data.filter(tz => tz.uuid && tz.name)
    } catch (parseError) {
      if (parseError instanceof Error && parseError.message.includes('Invalid response format')) {
        throw parseError
      }
      
      const errorMessage = 'Invalid response from server. Please try again.'
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check if the server is running.'
      throw new Error(errorMessage)
    }

    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch timezones. Please try again.'
    throw new Error(errorMessage)
  }
}
